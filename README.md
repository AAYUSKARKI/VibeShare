# VibeShare - AI-Driven Social Media Platform

## Overview
**VibeShare** is a decentralized social media platform designed to foster positive online engagement. By leveraging AI-driven sentiment analysis and blockchain technology, VibeShare rewards users for contributing meaningful, positive interactions. The platform empowers users to connect, share, and engage in a way that encourages community growth while ensuring accountability and transparency.

---

## Features
### User-Focused
- **User Authentication**: Secure sign-up/login with email or blockchain wallet connection.
- **Post Feed**: Dynamic feed displaying user-generated content analyzed for sentiment in real-time.
- **Comments & Reactions**: Interact with posts through comments, replies, and reactions (like/dislike).

### AI-Powered Insights
- **Sentiment Analysis**: AI integration (using Hugging Face) evaluates content for positive, negative, or neutral sentiment and displays a sentiment score.

### Blockchain Integration
- **Blockchain Rewards**: Ethereum-based ERC-20 token rewards users for positive engagement such as upvoting and commenting.
- **Decentralized Architecture**: Users can connect wallets and earn tokens seamlessly.

### Admin Tools
- **Admin Dashboard**: Moderators can manage flagged posts, monitor user activity, and take action against harmful content.

### User Experience
- **Responsive Design**: Mobile-first UI ensuring a seamless experience across all devices.
- **Dark Mode**: Toggle between light and dark themes for better accessibility and personalization.

---

## Tech Stack
### Frontend
- **React** (with TypeScript) for building a modular and scalable user interface.
- **Tailwind CSS** for responsive and modern styling.
- **Socket.IO** for real-time post updates and interactions.
- **Axios** for API communication.

### Backend
- **Node.js** with **Express** for robust server-side logic.
- **MongoDB** (with Mongoose) for a flexible and scalable database.
- **JWT Authentication** for secure user sessions.
- **Web3.js** for blockchain wallet integration and token transactions.

### AI Integration
- **Hugging Face Sentiment Analysis Model** for analyzing post sentiment in real-time.

### Blockchain
- **Ethereum**-based ERC-20 token implementation to reward users for positive interactions.

---

## Setup and Installation

### Prerequisites
- Node.js (v14 or later)
- MongoDB (running locally or through a cloud service like MongoDB Atlas)
- Ethereum wallet (e.g., MetaMask)

### Installation
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-repo/vibeshare.git
   cd vibeshare
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   cd client
   npm install
   ```

3. **Environment Variables**:
   Create a `.env` file in the root directory and configure the following:
   ```env
   MONGO_URI=your_mongo_connection_string
   JWT_SECRET=your_jwt_secret
   ETH_PRIVATE_KEY=your_ethereum_private_key
   INFURA_PROJECT_ID=your_infura_project_id
   ```

4. **Start the Server**:
   ```bash
   npm run dev
   ```

5. **Start the Client**:
   ```bash
   cd client
   npm start
   ```

---

## How It Works
1. **User Sign-Up/Login**:
   - Users can create accounts using their email or connect via their blockchain wallets.
2. **Content Posting and Sentiment Analysis**:
   - Users post content that is analyzed in real-time for sentiment (positive, neutral, negative).
3. **Engagement and Rewards**:
   - Positive interactions (e.g., likes, comments) earn users ERC-20 tokens, which are stored in their connected wallet.
4. **Admin Moderation**:
   - Admins use a dedicated dashboard to oversee flagged content and manage the community.

---

## Future Improvements
- **Advanced AI Models**: Enhance sentiment analysis accuracy with custom-trained models.
- **Gamification**: Introduce badges and leaderboards for top contributors.
- **Decentralized Storage**: Leverage IPFS or similar technologies for storing posts and comments.
- **Multi-Chain Support**: Expand blockchain functionality to support other chains like Polygon or Binance Smart Chain.

---

## Contributing
Contributions are welcome! Please fork the repository and submit a pull request for review.

---

## License
This project is licensed under the MIT License.

---

## Acknowledgments
- [Hugging Face](https://huggingface.co) for sentiment analysis models.
- [Ethereum](https://ethereum.org) for blockchain support.
- Open-source libraries and tools that made this project possible.

