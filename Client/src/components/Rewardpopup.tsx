import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react'; // Import the CheckCircle icon from Lucide

interface RewardPopupProps {
  rewardAmount: number;
  onClose: () => void;
}

const RewardPopup: React.FC<RewardPopupProps> = ({ rewardAmount, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000); // Automatically close after 3 seconds
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <motion.div
        className="bg-green-500 text-white rounded-lg shadow-lg p-4 flex items-center space-x-2"
        initial={{ opacity: 0, scale: 0.8 }} // Initial state
        animate={{ opacity: 1, scale: 1 }} // Animate to this state
        exit={{ opacity: 0, scale: 0.8 }} // Exit animation
        transition={{ duration: 0.3 }} // Transition duration
      >
        <CheckCircle size={24} className="text-white" /> {/* Lucide icon */}
        <div>
          <h3 className="text-lg font-bold">Congratulations!</h3>
          <p>You earned <span className="font-semibold">{rewardAmount}</span> tokens!</p>
        </div>
      </motion.div>
    </div>
  );
};

export default RewardPopup;