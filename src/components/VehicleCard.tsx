import  { Link } from 'react-router-dom';
import { Car, MapPin, Calendar, Droplet, Settings, Heart, Share } from 'lucide-react';
import { useState } from 'react';
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import ShareModal from './ShareModal';

interface VehicleCardProps {
  id: string;
  title: string;
  price: number;
  location: string;
  year: number;
  mileage: number;
  transmission: string;
  fuelType: string;
  image: string;
  featured?: boolean;
  compact?: boolean;
}

export default function VehicleCard({ 
  id, 
  title, 
  price, 
  location, 
  year, 
  mileage, 
  transmission, 
  fuelType, 
  image, 
  featured, 
  compact 
}: VehicleCardProps) {
  const { currentUser } = useAuth();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  const handleAddToWishlist = async () => {
    if (!currentUser) {
      alert('Please log in to save vehicles to your wishlist');
      return;
    }

    try {
      setSaving(true);
      
      // Check if wishlist exists
      const wishlistRef = doc(db, 'wishlists', currentUser.uid);
      const wishlistDoc = await getDoc(wishlistRef);
      
      if (wishlistDoc.exists()) {
        // Update existing wishlist
        const wishlistData = wishlistDoc.data();
        const wishlistItems = wishlistData.items || [];
        
        // Check if vehicle already in wishlist
        const existingItem = wishlistItems.find((item: any) => item.productId === id);
        
        if (!existingItem) {
          // Add to wishlist
          await updateDoc(wishlistRef, {
            items: arrayUnion({
              productId: id,
              name: title,
              price,
              image,
              type: 'vehicle',
              addedAt: new Date()
            }),
            updatedAt: new Date()
          });
        }
      } else {
        // Create new wishlist
        await setDoc(wishlistRef, {
          userId: currentUser.uid,
          items: [{
            productId: id,
            name: title,
            price,
            image,
            type: 'vehicle',
            addedAt: new Date()
          }],
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
      
      // Show success feedback
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      alert('Failed to add to wishlist. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (compact) {
    return (
      <div className="card group">
        <div className="relative h-48">
          <img 
            src={image} 
            alt={title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {featured && (
            <div className="absolute top-2 right-2 bg-primary-600 text-white text-xs px-2 py-1 rounded-full">
              Featured
            </div>
          )}
          <div className="absolute bottom-2 right-2 flex space-x-1">
            <button 
              onClick={handleAddToWishlist}
              disabled={saving}
              className={`p-1.5 rounded-full ${saved ? 'bg-pink-500 text-white' : 'bg-white text-gray-700 hover:text-pink-500'} shadow`}
            >
              <Heart className="h-4 w-4" />
            </button>
            <button 
              onClick={() => setShowShareModal(true)}
              className="p-1.5 rounded-full bg-white text-gray-700 hover:text-primary-500 shadow"
            >
              <Share className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-1">{title}</h3>
          <div className="flex items-center text-gray-600 text-sm mb-2">
            <MapPin className="h-4 w-4 mr-1" />
            {location}
          </div>
          <div className="text-lg font-bold text-primary-600 mb-3">
            ${price.toLocaleString()}
          </div>
          <Link to={`/vehicles/${id}`} className="btn btn-primary w-full py-2 text-sm">
            View Details
          </Link>
        </div>
        
        {showShareModal && (
          <ShareModal 
            title={title}
            url={`${window.location.origin}/vehicles/${id}`}
            onClose={() => setShowShareModal(false)}
          />
        )}
      </div>
    );
  }

  return (
    <div className="card group overflow-hidden">
      <div className="relative h-64">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {featured && (
          <div className="absolute top-2 right-2 bg-primary-600 text-white text-sm px-3 py-1 rounded-full">
            Featured
          </div>
        )}
        <div className="absolute bottom-2 right-2 flex space-x-1">
          <button 
            onClick={handleAddToWishlist}
            disabled={saving}
            className={`p-2 rounded-full ${saved ? 'bg-pink-500 text-white' : 'bg-white text-gray-700 hover:text-pink-500'} shadow`}
          >
            <Heart className="h-5 w-5" />
          </button>
          <button 
            onClick={() => setShowShareModal(true)}
            className="p-2 rounded-full bg-white text-gray-700 hover:text-primary-500 shadow"
          >
            <Share className="h-5 w-5" />
          </button>
        </div>
      </div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-semibold">{title}</h3>
          <div className="text-xl font-bold text-primary-600">${price.toLocaleString()}</div>
        </div>
        <div className="flex items-center text-gray-600 mb-4">
          <MapPin className="h-4 w-4 mr-1" />
          {location}
        </div>
        <div className="grid grid-cols-3 gap-2 mb-4 text-sm">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1 text-gray-500" />
            <span>{year}</span>
          </div>
          <div className="flex items-center">
            <Settings className="h-4 w-4 mr-1 text-gray-500" />
            <span>{transmission}</span>
          </div>
          <div className="flex items-center">
            <Droplet className="h-4 w-4 mr-1 text-gray-500" />
            <span>{fuelType}</span>
          </div>
        </div>
        <Link to={`/vehicles/${id}`} className="btn btn-primary w-full flex justify-center items-center">
          View Vehicle
        </Link>
      </div>
      
      {showShareModal && (
        <ShareModal 
          title={title}
          url={`${window.location.origin}/vehicles/${id}`}
          onClose={() => setShowShareModal(false)}
        />
      )}
    </div>
  );
}
 