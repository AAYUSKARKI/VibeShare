import { asynchandler } from "../utils/asynchandler.js";
import { Apierror } from "../utils/apierror.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Apiresponse } from "../utils/apiresponse.js";
import jwt from "jsonwebtoken";
import { sendEmail } from "../utils/sendEmail.js";

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accesstoken = user.generateAccessToken()
        const refreshtoken = user.generateRefreshToken()

        user.refreshtoken = refreshtoken
        await user.save({ validateBeforeSave: false })

        return { accesstoken, refreshtoken }
    } catch (error) {
        throw new Apierror(500, "something wwnt wrong while genrating refresh anf aveessstoken")
    }
}






const registerUser = asynchandler(async (req, res) => {
    //get user details from frontend
    //validation - not empty
    //check if user already exist :username,email
    //check for image,avatar
    //upload on cloudinary
    //create user object - create entry in db
    //remove password and refresh tokenfield from response
    //check for user creation 
    //return res
    const { email, username, password} = req.body

    if ([ email,username,password].some((field) => field?.trim() === "")) {
        throw new Apierror(400, "All fields are required")
    }

    const existeduser = await User.findOne({
        $or: [
            { username }, { email }
        ]
    })

    if (existeduser) { 
        return res.status(400).json({
            success: false,
            message: 'User with this username or email already exists.'
        });
    }

    const user = await User.create({
        email,
        password,
        username: username.toLowerCase(),
    })
    const verifyToken = user.generateVerificationToken()
    await user.save({ validateBeforeSave: false })
    const createdUser = await User.findById(user._id).select(
        "-password -refreshtoken")

    if (!createdUser) {
        throw new Apierror(500, "something went wrong while registering a user")
    }
    const { accesstoken, refreshtoken } = await generateAccessAndRefreshToken(user._id)
    // const url = `https://wish-me-liard.vercel.app/verify/?verifyToken=${verifyToken}`
    // const text = `Please click the link below to verify your email: ${url}`

    // await sendEmail(email,"Verify your email",text)

    return res.status(201).json(
        new Apiresponse(200, {createdUser,accesstoken,refreshtoken}, "User Registered sucesfully")
    )
})

const resendVerificationmail = asynchandler(async(req,res)=>{
    const {email} = req.body;

    const emailExists = await User.findOne({email});

    if(!emailExists){
        throw new Apierror(400, "Email doesnot exists!try registering with this mail first")
    }

    const verifyToken = emailExists.generateVerificationToken()
    await emailExists.save({ validateBeforeSave: false })

    const url = `https://wish-me-liard.vercel.app/verify/?verifyToken=${verifyToken}`
    const text = `Please click the link below to verify your email: ${url}`

    await sendEmail(email,"Verify your email",text)

    return res.status(201).json(
        new Apiresponse(200, emailExists, "Verification mail sent successfully!check your mail")
    )
})

const loginuser = asynchandler(async (req, res) => {
    // Log the req.body object to inspect the data being sent from the client
    // console.log('Request Body:', req.body);
    // console.log('Request Object:', req);


    //req body bata data lera aaune
    //username or email
    //find the user
    //password check 
    //access and refreshtoken
    //send cookies
    //succesfully login
    const { email,password } = req.body
    // console.log("username ", username);
    // console.log("email ", email);
    // console.log('Request headers:', req.headers);
    if (!email) {
        throw new Apierror(400, "username or email is required")
    }
    const user = await User.findOne({ email })

    if (!user) {
        throw new Apierror(404, "user doesnt exist")
    }

    const verifyToken = user.verifyToken

    // if(!user.isVerified){
    //     const url = `https://wish-me-liard.vercel.app/verify/?verifyToken=${verifyToken}`
    //     const text = `Please click the link below to verify your email: ${url}`

    //     await sendEmail(email,"Verify your email",text)
    //     throw new Apierror(404, "user not verified,please verify your email")
    // }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new Apierror(404, "user password wrong")
    }


    const { accesstoken, refreshtoken } = await generateAccessAndRefreshToken(user._id)

    const loggedinUser = await User.findById(user._id).select("-password,-refreshtoken")

    // await sendEmail(email, "is this you?", `Your account has just logged in!`)

    const options = {
        httpOnly: true,
        secure: true,
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        sameSite: "none",
    }

    return res.status(200).cookie("accessToken", accesstoken, options)
        .cookie("refreshtoken", refreshtoken, options)
        .json(
            new Apiresponse(
                200,
                {
                    user: loggedinUser, accesstoken, refreshtoken
                },
                "Userlogged in successfully"
            )
        )
})


const logoutuser = asynchandler(async (req, res) => {
    const {user} = req.body;

    await User.findByIdAndUpdate(
        user,
        {
            $unset: {
                refreshtoken: 1
            }
        },
        {
            new: true
        }
    )
    const options = {
        httpOnly: true,
        secure: true
    }

    return res.status(200).clearCookie("accesstoken", options).clearCookie("refreshtoken", options).json(new Apiresponse(200, {}, "user logout"))
})


const refreshaccesstoken = asynchandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshtoken || req.body.refreshtoken

    if (!incomingRefreshToken) {
        throw new Apierror(401, "unauthorized access")
    }

    try {
        const decodedtoken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )

        const user = await User.findById(decodedtoken?._id)
        if (!user) {
            throw new Apierror(401, "Invalid refresh token")
        }


        if (incomingRefreshToken !== user?.refreshtoken) {
            throw new Apierror(401, "Refres token is used or expire")
        }

        const options = {
            httpOnly: true,
            secure: true
        }

        const { accesstoken, Newrefreshtoken } = await generateAccessAndRefreshToken(user._id)

        return res.status(200).cookie("accestoken", accesstoken, options)
            .cookie("refreshtoken", Newrefreshtoken, options)
            .json(
                new Apiresponse(201, "acess token refreshed")
            )
    } catch (error) {
        throw new Apierror(401, error?.message || "invalid accesstoken")
    }
})


const forgetpassword = asynchandler(async (req, res) => {
    const { email } = req.body

    if (!email) {
        throw new Apierror(400, "email is required")
    }

    const user = await User.findOne({ email })

    if (!user) {
        throw new Apierror(404, "user not found")
    }

    const resettoken = await user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false })

    const reseturl = `https://wish-me-liard.vercel.app/resetpassword/${resettoken}`

    const text = `
    <h1>You requested for password reset</h1>
    <p>please go to this link to reset your password</p>
    <a href=${reseturl} clicktracking=off>${reseturl}</a>
    or copy paste this link in your browser ${reseturl}
    or simply click on this link ${reseturl}
    `

    try {
        await sendEmail(email,"password recovery",text)
    } catch (error) {
        user.passwordResetToken = undefined
        user.passwordResetExpires = undefined

        await user.save({ validateBeforeSave: false })

        throw new Apierror(500, error.message)
    }


    return res.status(200).json(new Apiresponse(200, {}, "password reset token sent to your email"))

})

const resetpassword = asynchandler(async (req, res) => {
    const { password, confirmpassword } = req.body

    if (!password || !confirmpassword) {
        throw new Apierror(400, "password is required")
    }

    if (password !== confirmpassword) {
        throw new Apierror(400, "password and confirm password should be same")
    }

    const hashedpassword = await bcrypt.hash(password, 10)
    const user = await User.findOne({ passwordResetToken: req.params.token })

    if (!user) {
        throw new Apierror(400, "invalid password reset token")
    }

    user.password = hashedpassword
    user.passwordResetToken = undefined
    user.passwordResetExpires = undefined
    await user.save()

    return res.status(200).json(new Apiresponse(200, {}, "password reset successfully"))

})

const changecurrentpassword = asynchandler(async (req, res) => {
    const { oldpassword, newpassword } = req.body

    const user = await User.findById(req.user?._id)
    const isPasswordCorrect = await user.isPasswordCorrect(oldpassword)

    if (!isPasswordCorrect) {
        throw new Apierror(400, "invalid old password")
    }

    user.password = newpassword
    await user.save({ validateBeforeSave: false })

    return res.status(200).json(new Apiresponse(200, {}, "password Chamge successfully"))
})


const getcurrentuser = asynchandler(async () => {   
    return res.status(200).json(new Apiresponse(200, req.user, "current user fetched successfully"))
})

const updateaccountdetails = asynchandler(async (req, res) => {
    const { username,  email } = req.body

    if (!username || !email) {
        return Apierror(400, "all fields are required ")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                username, // same as fullname:fullname
                email: email // same as email
            }
        },
        { new: true }).select("-password")

    return res.status(200).json(new Apiresponse(200, user, "account details updated successfully"))
})



const updateuseravatar = asynchandler(async (req, res) => {
    const avatarlocalpath = req.file?.path

    if (!avatarlocalpath) {
        throw new Apierror(400, "Avatar file is missing ")
    }

    const avatar = await uploadOnCloudinary(avatarlocalpath)

    if (!avatar.url) {
        throw new Apierror(400, "error while upload on avatar ")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,

        {
            $set: {
                avatar: avatar.url
            }
        },
        { new: true }
    ).select(-"password")

    return res
        .status(200)
        .json(new Apiresponse(200, user, "avatar updated successfully"))
})

const getallusers = asynchandler(async (req, res) => {

    const users = await User.find({})

    return res.status(200).json(new Apiresponse(200, users, "all users fetched successfully"))
})

const getuserbyid = asynchandler(async (req, res) => {
    const user = await User.findById(req.params.id)
    if (!user) {
        throw new Apierror(404, "user not found")
    }
    return res.status(200).json(new Apiresponse(200, user, "user fetched successfully"))
})

const updateuser = asynchandler(async (req, res) => {

    const { username, email , password } = req.body
    const avatarlocalpath = req.files?.avatar[0]?.path
    console.log("Avatar file received:", req.files?.avatar);
    if (!avatarlocalpath) {
        throw new Apierror(400, "Avatar file is required")
    }
    const avatar = await uploadOnCloudinary(avatarlocalpath)
    if (!avatar) {
        throw new Apierror(400, "Avatar file not uploaded")
    }
    
    const user = await User.findByIdAndUpdate(
        req.params.id,
        {
            $set: {
                username,
                email,
                password,
                avatar: avatar.url
            }
        },
        { new: true }
    ).select("-password")

    if (!user) {
        throw new Apierror(404, "user not found")
    }
    return res.status(200).json(new Apiresponse(200, user, "user updated successfully"))
})

const deleteuser = asynchandler(async (req, res) => {
    const user = await User.findByIdAndDelete(req.params.id)
    if (!user) {
        throw new Apierror(404, "user not found")
    }
    return res.status(200).json(new Apiresponse(200, user, "user deleted successfully"))
})

const getallstudents = asynchandler(async (req, res) => {
    const students = await User.find({ role: "student" })
    return res.status(200).json(new Apiresponse(200, students, "all students fetched successfully"))
})

const getallteachers = asynchandler(async (req, res) => {
    const teachers = await User.find({ role: "teacher" })
    return res.status(200).json(new Apiresponse(200, teachers, "all teachers fetched successfully"))
})

const total = asynchandler(async (req, res) => {
    const totalstudents = await User.countDocuments({ role: "student" })
    const totalteachers = await User.countDocuments({ role: "teacher" })
    return res.status(200).json(new Apiresponse(200, { totalstudents, totalteachers }, "total fetched successfully"))
})

const getAllsellercategory = asynchandler(async (req, res) => {
    const sellercategory = await User.distinct("sellerCategory")
    return res.status(200).json(new Apiresponse(200, sellercategory, "seller category fetched successfully"))
})

const deleteallusers = asynchandler(async (req, res) => {
    const users = await User.deleteMany({})
    console.log(users)
    return res.status(200).json(new Apiresponse(200, users, "all users deleted successfully"))
})

const verifyAccount = asynchandler(async (req, res) => {
    const { token } = req.params
    console.log(token)
    const user = await User.findOne({ verifyToken: token })
    if (!user) {
        throw new Apierror(404, "User not found")
    }
    user.isVerified = true
    user.verifyToken = undefined
    await user.save()
    return res.status(200).json(new Apiresponse(200, user, "Account verified successfully"))
})
export {
    registerUser,
    loginuser,
    logoutuser,
    refreshaccesstoken,
    changecurrentpassword,
    getcurrentuser,
    updateaccountdetails,
    updateuseravatar,
    getallusers,
    getuserbyid,
    updateuser,
    deleteuser,
    forgetpassword,
    resetpassword,
    getallstudents,
    getallteachers,
    total,
    getAllsellercategory,
    deleteallusers,
    verifyAccount,
    resendVerificationmail
}