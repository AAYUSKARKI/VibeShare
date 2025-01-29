import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Wallet, Award, BarChart2 } from "lucide-react";
import { VibeTokenAddress, VibeTokenABI } from "../utils/contracts";

declare global {
  interface Window {
    ethereum: any;
  }
}

const ConnectWallet = () => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [tokenBalance, setTokenBalance] = useState<string | null>(null);
  const [totalEarnings, setTotalEarnings] = useState<string>("0.00"); // Placeholder

  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: "eth_accounts" });
        if (accounts.length) {
          setWalletAddress(accounts[0]);
          fetchBalance(accounts[0]);
          fetchEarningsFromEvents(accounts[0]); // Fetch earnings
        }
      }
    };
    checkConnection();
  }, []);

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("MetaMask is required!");
      return;
    }
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    setWalletAddress(accounts[0]);
    fetchBalance(accounts[0]);
    fetchEarningsFromEvents(accounts[0]); // Fetch earnings
  };

  const fetchBalance = async (userAddress: string) => {
    if (!userAddress || !window.ethereum) return;
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(VibeTokenAddress, VibeTokenABI, provider);
      const balanceBN = await contract.balanceOf(userAddress);
      setTokenBalance(ethers.utils.formatEther(balanceBN)); // Convert to readable format
    } catch (error) {
      console.error("Error fetching balance:", error);
    }
  };

  const fetchEarningsFromEvents = async (userAddress: string) => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(VibeTokenAddress, VibeTokenABI, provider);
      
      const transferEvents = await contract.queryFilter("Transfer", 0, "latest");
      let totalEarned = ethers.BigNumber.from(0);

      transferEvents.forEach((event) => {
        if (event.args && event.args.to.toLowerCase() === userAddress.toLowerCase()) {
          totalEarned = totalEarned.add(event.args.value);
        }
      });

      setTotalEarnings(ethers.utils.formatEther(totalEarned));
    } catch (error) {
      console.error("Error fetching earnings from events:", error);
    }
  };

  return (
    <div className="p-6">
      {walletAddress ? (
        <>
          {/* User Info */}
          <div className="flex items-center space-x-2 mb-4">
            <Wallet size={20} className="text-gray-500" />
            <span className="text-sm text-gray-600">{walletAddress}</span>
          </div>

          {/* Token Balance & Earnings */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2 flex items-center">
                <Award size={20} className="mr-2 text-blue-500" />
                Token Balance
              </h3>
              <p className="text-2xl font-bold text-blue-600">
                {tokenBalance ?? "0"} VIBE
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2 flex items-center">
                <BarChart2 size={20} className="mr-2 text-green-500" />
                Total Earnings
              </h3>
              <p className="text-2xl font-bold text-green-600">
                {totalEarnings} VIBE
              </p>
            </div>
          </div>
        </>
      ) : (
        <button
          onClick={connectWallet}
          className="bg-amber-600 text-white px-4 py-2 rounded"
        >
          Connect MetaMask
        </button>
      )}
    </div>
  );
};

export default ConnectWallet;
