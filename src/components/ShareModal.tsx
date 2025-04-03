import  { X } from 'lucide-react';

interface ShareModalProps {
  title: string;
  url: string;
  onClose: () => void;
}

export default function ShareModal({ title, url, onClose }: ShareModalProps) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  
  const shareLinks = [
    {
      name: 'Facebook',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      name: 'Twitter',
      url: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      color: 'bg-blue-400 hover:bg-blue-500'
    },
    {
      name: 'WhatsApp',
      url: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      name: 'Email',
      url: `mailto:?subject=${encodedTitle}&body=${encodedUrl}`,
      color: 'bg-gray-600 hover:bg-gray-700'
    }
  ];
  
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold">Share</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-4">
          <div className="mb-4">
            <p className="text-sm text-gray-500 mb-2">Share this link via</p>
            <div className="flex flex-wrap gap-2">
              {shareLinks.map(link => (
                <a 
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className={`${link.color} text-white py-2 px-4 rounded-lg text-sm font-medium`}
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>
          
          <div>
            <p className="text-sm text-gray-500 mb-2">Or copy link</p>
            <div className="flex">
              <input 
                type="text" 
                value={url} 
                readOnly
                className="flex-1 input rounded-r-none"
              />
              <button 
                onClick={copyToClipboard}
                className="btn btn-primary rounded-l-none"
              >
                Copy
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
 