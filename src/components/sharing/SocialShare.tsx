import React from 'react';
import { Share2, Facebook, Twitter, Link as LinkIcon, WhatsApp } from 'lucide-react';
import { Building, Language } from '@/types';

interface SocialShareProps {
  building: Building;
  language: Language;
}

const SocialShare: React.FC<SocialShareProps> = ({ building, language }) => {
  const [copied, setCopied] = React.useState(false);

  const translations = {
    en: {
      share: "Share",
      shareOn: "Share on",
      copyLink: "Copy Link",
      linkCopied: "Link Copied!",
      shareTitle: "Check out this historical Kurdish building"
    },
    ku: {
      share: "هاوبەشکردن",
      shareOn: "هاوبەشی بکە لە",
      copyLink: "کۆپیکردنی بەستەر",
      linkCopied: "بەستەر کۆپی کرا!",
      shareTitle: "سەیری ئەم بینا مێژووییە کوردییە بکە"
    }
  };

  const shareUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/building/${building.id}`
    : '';

  const shareData = {
    title: translations[language].shareTitle,
    text: building.translations[language].title,
    url: shareUrl
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.error('Error sharing:', error);
      }
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="border-4 border-black p-6">
      <h3 className="font-mono text-xl mb-4 flex items-center gap-2">
        <Share2 size={24} />
        {translations[language].share}
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button
          onClick={() => window.open(
            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
            '_blank'
          )}
          className="flex items-center justify-center gap-2 bg-black text-white p-3 hover:bg-white hover:text-black border-2 border-black transition-colors"
        >
          <Facebook size={20} />
          Facebook
        </button>

        <button
          onClick={() => window.open(
            `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareData.text)}`,
            '_blank'
          )}
          className="flex items-center justify-center gap-2 bg-black text-white p-3 hover:bg-white hover:text-black border-2 border-black transition-colors"
        >
          <Twitter size={20} />
          Twitter
        </button>

        <button
          onClick={() => window.open(
            `https://wa.me/?text=${encodeURIComponent(`${shareData.text} ${shareUrl}`)}`,
            '_blank'
          )}
          className="flex items-center justify-center gap-2 bg-black text-white p-3 hover:bg-white hover:text-black border-2 border-black transition-colors"
        >
          <WhatsApp size={20} />
          WhatsApp
        </button>

        <button
          onClick={handleCopyLink}
          className="flex items-center justify-center gap-2 bg-black text-white p-3 hover:bg-white hover:text-black border-2 border-black transition-colors"
        >
          <LinkIcon size={20} />
          {copied ? translations[language].linkCopied : translations[language].copyLink}
        </button>
      </div>
    </div>
  );
};

export default SocialShare;