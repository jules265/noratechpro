import  { Link } from 'react-router-dom';
import { ShoppingCart, Star, Check, Heart } from 'lucide-react';
import { useState } from 'react';
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  rating?: number;
  reviews?: number;
}

export default function ProductCard({ id, name, price, image, category, rating, reviews }: ProductCardProps) {
  const { currentUser } = useAuth();
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const renderRatingStars = () => {
    if (!rating) return null;

    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    
    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} className="h-4 w-4 text-yellow-400 fill-current" />
        ))}
        {halfStar && (
          <div className="relative">
            <Star className="h-4 w-4 text-gray-300 fill-current" />
            <div className="absolute inset-0 overflow-hidden w-1/2">
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
            </div>
          </div>
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />
        ))}
        {reviews && (
          <span className="text-xs text-gray-600 ml-1">({reviews})</span>
        )}
      </div>
    );
  };

  const handleAddToCart = async () => {
    if (!currentUser) {
      // Redirect to login or show login modal
      alert('Please log in to add items to your cart');
      return;
    }

    try {
      setAdding(true);

      // Check if user has a cart
      const userCartRef = doc(db, 'carts', currentUser.uid);
      const cartDoc = await getDoc(userCartRef);

      if (cartDoc.exists()) {
        // Update existing cart
        const cartData = cartDoc.data();
        const cartItems = cartData.items || [];
        
        // Check if product already in cart
        const existingItemIndex = cartItems.findIndex((item: any) => item.productId === id);
        
        if (existingItemIndex !== -1) {
          // Increase quantity of existing item
          cartItems[existingItemIndex].quantity += 1;
        } else {
          // Add new item
          cartItems.push({
            productId: id,
            name,
            price,
            image,
            quantity: 1,
            addedAt: new Date()
          });
        }
        
        await updateDoc(userCartRef, {
          items: cartItems,
          updatedAt: new Date()
        });
      } else {
        // Create new cart
        await setDoc(userCartRef, {
          userId: currentUser.uid,
          items: [{
            productId: id,
            name,
            price,
            image,
            quantity: 1,
            addedAt: new Date()
          }],
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }

      // Show success feedback
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add to cart. Please try again.');
    } finally {
      setAdding(false);
    }
  };

  const handleAddToWishlist = async () => {
    if (!currentUser) {
      alert('Please log in to add items to your wishlist');
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
        
        // Check if product already in wishlist
        const existingItem = wishlistItems.find((item: any) => item.productId === id);
        
        if (!existingItem) {
          // Add to wishlist
          await updateDoc(wishlistRef, {
            items: arrayUnion({
              productId: id,
              name,
              price,
              image,
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
            name,
            price,
            image,
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

  return (
    <div className="card group">
      <div className="relative overflow-hidden">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-2 right-2 bg-primary-600 text-white text-xs px-2 py-1 rounded-full">
          {category}
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg">{name}</h3>
        <div className="flex justify-between items-center mt-1 mb-2">
          <p className="text-gray-900 font-bold">${price.toLocaleString()}</p>
          {renderRatingStars()}
        </div>
        <div className="flex justify-between items-center mt-3">
          <Link to={`/products/${id}`} className="text-primary-600 hover:text-primary-700 text-sm font-medium">
            View Details
          </Link>
          <div className="flex gap-2">
            <button 
              className={`p-2 rounded-full transition-colors ${saved ? 'bg-pink-100 text-pink-600' : saving ? 'bg-gray-100 opacity-50' : 'bg-gray-100 hover:bg-pink-100 text-gray-600 hover:text-pink-600'}`}
              onClick={handleAddToWishlist}
              disabled={saving}
              title="Add to wishlist"
            >
              <Heart className="h-5 w-5" />
            </button>
            <button 
              className={`p-2 rounded-full transition-colors ${added ? 'bg-green-100 text-green-600' : adding ? 'bg-gray-100 opacity-50' : 'bg-gray-100 hover:bg-primary-100 text-gray-600 hover:text-primary-600'}`}
              onClick={handleAddToCart}
              disabled={adding}
              title="Add to cart"
            >
              {added ? (
                <Check className="h-5 w-5" />
              ) : (
                <ShoppingCart className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
 