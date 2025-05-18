import { useState } from "react";
import { useGameState } from "@/hooks/useGameState";
import { Button } from "@/components/ui/button";
import { X, Copy, Twitter, Facebook } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { useToast } from "@/hooks/use-toast";

interface ShareResultModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ShareResultModal({ isOpen, onClose }: ShareResultModalProps) {
  const { lastReactionTime, stats } = useGameState();
  const { toast } = useToast();

  if (!isOpen) return null;

  const shareText = `I just achieved a reaction time of ${lastReactionTime}ms in ReactionRush! Can you beat my time?`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareText).then(() => {
      toast({
        title: "Copied!",
        description: "Result copied to clipboard",
      });
    }).catch(err => {
      console.error("Could not copy text: ", err);
    });
  };

  const shareViaTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`, "_blank");
  };

  const shareViaWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, "_blank");
  };

  const shareViaFacebook = () => {
    const url = window.location.href;
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(shareText)}`, "_blank");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full mx-4 overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="font-display font-semibold text-lg">Share Your Result</h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="p-6">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Share your amazing reaction time of {lastReactionTime}ms with your friends!
          </p>
          
          <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg flex items-center justify-between mb-6">
            <p className="text-sm">{shareText}</p>
            <Button variant="ghost" size="icon" onClick={copyToClipboard}>
              <Copy className="h-5 w-5 text-primary hover:text-indigo-600" />
            </Button>
          </div>
          
          <div className="flex space-x-3">
            <Button
              onClick={shareViaTwitter}
              className="flex-1 py-2 px-4 bg-[#1DA1F2] hover:bg-[#0c8de4] text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center"
            >
              <Twitter className="mr-2 h-4 w-4" />
              Twitter
            </Button>
            <Button
              onClick={shareViaWhatsApp}
              className="flex-1 py-2 px-4 bg-[#25D366] hover:bg-[#1ebf5a] text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center"
            >
              <FaWhatsapp className="mr-2 h-4 w-4" />
              WhatsApp
            </Button>
            <Button
              onClick={shareViaFacebook}
              className="flex-1 py-2 px-4 bg-[#1877F2] hover:bg-[#0b5fdf] text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center"
            >
              <Facebook className="mr-2 h-4 w-4" />
              Facebook
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 