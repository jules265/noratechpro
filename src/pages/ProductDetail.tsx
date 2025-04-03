import  { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, Heart, ArrowLeft, Check, Truck, Minus, Plus } from 'lucide-react';
import { doc, getDoc, setDoc, updateDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const { currentUser } = useAuth();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  useEffect(() => {
    // In a real app, you'd fetch from Firestore based on the id
    // For demonstration, we'll create a dummy product based on the id
    const productData: Record<string, any> = {
      '1': {
        id: '1',
        name: 'MacBook Pro 16"',
        description: 'The most powerful MacBook Pro ever is here. With the blazing-fast M1 Pro chip — the first Apple silicon designed for pros — you get groundbreaking performance and amazing battery life.',
        price: 2499,
        stock: 15,
        images: [
          'https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHw0fHxsYXB0b3AlMjBjb21wdXRlciUyMG1hY2Jvb2slMjBwcm9mZXNzaW9uYWwlMjBzZXR1cCUyMG1vZGVybnxlbnwwfHx8fDE3NDM2NjIzNDd8MA&ixlib=rb-4.0.3&fit=fillmax&h=600&w=800'
        ],
        category: 'Laptops',
        specifications: [
          { name: 'Processor', value: 'M1 Pro chip' },
          { name: 'Memory', value: '16GB unified memory' },
          { name: 'Storage', value: '512GB SSD' },
          { name: 'Display', value: '16-inch Liquid Retina XDR display' },
          { name: 'Battery Life', value: 'Up to 21 hours' }
        ]
      },
      '2': {
        id: '2',
        name: 'Apple MacBook Air',
        description: 'Our thinnest, lightest notebook, completely transformed by the Apple M1 chip. CPU speeds up to 3.5x faster. GPU speeds up to 5x faster. Apple\'s most advanced Neural Engine for up to 9x faster machine learning.',
        price: 1299,
        stock: 25,
        images: [
          'https://images.unsplash.com/photo-1484788984921-03950022c9ef?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHwxfHxsYXB0b3AlMjBjb21wdXRlciUyMG1hY2Jvb2slMjBwcm9mZXNzaW9uYWwlMjBzZXR1cCUyMG1vZGVybnxlbnwwfHx8fDE3NDM2NjIzNDd8MA&ixlib=rb-4.0.3&fit=fillmax&h=600&w=800'
        ],
        category: 'Laptops',
        specifications: [
          { name: 'Processor', value: 'Apple M1 chip' },
          { name: 'Memory', value: '8GB unified memory' },
          { name: 'Storage', value: '256GB SSD' },
          { name: 'Display', value: '13.3-inch Retina display' },
          { name: 'Battery Life', value: 'Up to 18 hours' }
        ]
      },
      '3': {
        id: '3',
        name: 'Premium Laptop Workstation',
        description: 'Professional-grade laptop workstation ideal for designers, developers, and content creators. Featuring a high-performance processor, dedicated graphics, and an exceptional display for your most demanding tasks.',
        price: 1599,
        stock: 10,
        images: [
          'https://images.unsplash.com/photo-1453928582365-b6ad33cbcf64?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHw5fHxsYXB0b3AlMjBjb21wdXRlciUyMG1hY2Jvb2slMjBwcm9mZXNzaW9uYWwlMjBzZXR1cCUyMG1vZGVybnxlbnwwfHx8fDE3NDM2NjE5NzN8MA&ixlib=rb-4.0.3&fit=fillmax&h=600&w=800'
        ],
        category: 'Laptops',
        specifications: [
          { name: 'Processor', value: 'Intel Core i7-11800H' },
          { name: 'Graphics', value: 'NVIDIA RTX 3060 6GB' },
          { name: 'Memory', value: '32GB DDR4' },
          { name: 'Storage', value: '1TB NVMe SSD' },
          { name: 'Display', value: '15.6" 4K OLED Touch Display' }
        ]
      },
      '4': {
        id: '4',
        name: 'Student Laptop Bundle',
        description: 'Perfect for students and remote learning, this laptop bundle includes everything needed for educational success. Combining performance, portability, and essential accessories at an affordable price.',
        price: 1199,
        stock: 30,
        images: [
          'https://images.unsplash.com/photo-1471897488648-5eae4ac6686b?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHw1fHxsYXB0b3AlMjBjb21wdXRlciUyMG1hY2Jvb2slMjBwcm9mZXNzaW9uYWwlMjBzZXR1cCUyMG1vZGVybnxlbnwwfHx8fDE3NDM2NjIzNDd8MA&ixlib=rb-4.0.3&fit=fillmax&h=600&w=800'
        ],
        category: 'Laptops',
        specifications: [
          { name: 'Processor', value: 'AMD Ryzen 5 5500U' },
          { name: 'Memory', value: '16GB DDR4' },
          { name: 'Storage', value: '512GB SSD' },
          { name: 'Display', value: '14" Full HD IPS' },
          { name: 'Extras', value: 'Wireless mouse, laptop bag, headphones' }
        ]
      },
      '5': {
        id: '5',
        name: 'Office Laptop Setup',
        description: 'Complete office laptop setup for professionals. This high-productivity package includes a business-class laptop and essential accessories to create an efficient workspace anywhere.',
        price: 1399,
        stock: 20,
        images: [
          'https://images.unsplash.com/photo-1496180470114-6ef490f3ff22?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHw4fHxsYXB0b3AlMjBjb21wdXRlciUyMG1hY2Jvb2slMjBwcm9mZXNzaW9uYWwlMjBzZXR1cCUyMG1vZGVybnxlbnwwfHx8fDE3NDM2NjE5NzN8MA&ixlib=rb-4.0.3&fit=fillmax&h=600&w=800'
        ],
        category: 'Laptops',
        specifications: [
          { name: 'Processor', value: 'Intel Core i5-1135G7' },
          { name: 'Memory', value: '16GB DDR4' },
          { name: 'Storage', value: '512GB SSD' },
          { name: 'Display', value: '15.6" Full HD' },
          { name: 'Extras', value: 'Docking station, wireless keyboard and mouse' }
        ]
      },
      '6': {
        id: '6',
        name: 'AMD Ryzen 7 Processor',
        description: 'Experience blazing-fast performance with the AMD Ryzen 7 processor. Ideal for gaming, content creation, and professional workloads.',
        price: 329,
        stock: 15,
        images: [
          'https://images.unsplash.com/photo-1591799265444-d66432b91588?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHwxfHxlbGVjdHJvbmljcyUyMHByb2R1Y3RzJTIwb24lMjBzaGVsdmVzfGVufDB8fHx8MTc0MzU5NDY1OHww&ixlib=rb-4.0.3&fit=fillmax&h=600&w=800'
        ],
        category: 'Electronics',
        specifications: [
          { name: 'Cores', value: '8 cores' },
          { name: 'Threads', value: '16 threads' },
          { name: 'Base Clock', value: '3.8 GHz' },
          { name: 'Max Boost Clock', value: '4.7 GHz' },
          { name: 'TDP', value: '65W' }
        ]
      }
    };
    
    setProduct(productData[id as string] || null);
    setLoading(false);
  }, [id]);

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= (product?.stock || 1)) {
      setQuantity(newQuantity);
    }
  };

  const addToCart = async () => {
    if (!currentUser) {
      setNotificationMessage('Please log in to add items to your cart');
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
      return;
    }

    try {
      setAddingToCart(true);

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
          // Update quantity of existing item
          cartItems[existingItemIndex].quantity += quantity;
        } else {
          // Add new item
          cartItems.push({
            productId: id,
            name: product.name,
            price: product.price,
            image: product.images[0],
            quantity: quantity,
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
            name: product.name,
            price: product.price,
            image: product.images[0],
            quantity: quantity,
            addedAt: new Date()
          }],
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }

      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
      
      setNotificationMessage(`${product.name} added to your cart!`);
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    } catch (error) {
      console.error('Error adding to cart:', error);
      setNotificationMessage('Failed to add to cart. Please try again.');
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    } finally {
      setAddingToCart(false);
    }
  };

  const addToWishlist = async () => {
    if (!currentUser) {
      setNotificationMessage('Please log in to add items to your wishlist');
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
      return;
    }

    try {
      // Check if item already in wishlist
      const wishlistRef = collection(db, 'wishlists');
      const wishlistDoc = await getDoc(doc(wishlistRef, currentUser.uid));
      
      if (wishlistDoc.exists()) {
        const wishlistData = wishlistDoc.data();
        const wishlistItems = wishlistData.items || [];
        
        // Check if product already in wishlist
        if (!wishlistItems.some((item: any) => item.productId === id)) {
          wishlistItems.push({
            productId: id,
            name: product.name,
            price: product.price,
            image: product.images[0],
            addedAt: new Date()
          });
          
          await updateDoc(doc(wishlistRef, currentUser.uid), {
            items: wishlistItems,
            updatedAt: new Date()
          });
        }
      } else {
        // Create new wishlist
        await setDoc(doc(wishlistRef, currentUser.uid), {
          userId: currentUser.uid,
          items: [{
            productId: id,
            name: product.name,
            price: product.price,
            image: product.images[0],
            addedAt: new Date()
          }],
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }

      setNotificationMessage(`${product.name} added to your wishlist!`);
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      setNotificationMessage('Failed to add to wishlist. Please try again.');
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-96">Loading...</div>;
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
          <p className="mb-6">The product you're looking for doesn't exist or has been removed.</p>
          <Link to="/products" className="btn btn-primary">
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-6">
        <Link to="/products" className="text-primary-600 hover:text-primary-700 flex items-center">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Products
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Product Images */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <img 
            src={product.images[0]} 
            alt={product.name} 
            className="w-full h-auto object-cover"
          />
        </div>
        
        {/* Product Details */}
        <div>
          <div className="mb-4">
            <span className="inline-block bg-primary-100 text-primary-800 px-2 py-1 text-xs font-medium rounded-full">
              {product.category}
            </span>
          </div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <div className="text-2xl font-semibold text-gray-900 mb-4">
            ${product.price}
          </div>
          
          <div className="mb-6">
            <p className="text-gray-600">{product.description}</p>
          </div>
          
          {/* Stock Status */}
          <div className="flex items-center mb-6">
            <div className="flex items-center text-green-600 mr-4">
              <Check className="h-5 w-5 mr-1" />
              <span>In Stock</span>
            </div>
            <div className="text-gray-600">
              {product.stock} available
            </div>
          </div>
          
          {/* Quantity Selector */}
          <div className="mb-6">
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
              Quantity
            </label>
            <div className="flex items-center">
              <button 
                onClick={() => handleQuantityChange(quantity - 1)}
                className="p-2 border border-gray-300 rounded-l-lg bg-gray-50 hover:bg-gray-100 flex items-center justify-center"
              >
                <Minus className="h-4 w-4" />
              </button>
              <input
                type="number"
                id="quantity"
                min="1"
                max={product.stock}
                value={quantity}
                onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                className="w-16 text-center border-t border-b border-gray-300 py-2"
              />
              <button 
                onClick={() => handleQuantityChange(quantity + 1)}
                className="p-2 border border-gray-300 rounded-r-lg bg-gray-50 hover:bg-gray-100 flex items-center justify-center"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 mb-8">
            <button 
              className="btn btn-primary flex-1 py-3 flex justify-center items-center"
              onClick={addToCart}
              disabled={addingToCart}
            >
              {addedToCart ? (
                <>
                  <Check className="h-5 w-5 mr-2" />
                  Added to Cart
                </>
              ) : (
                <>
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  {addingToCart ? 'Adding...' : 'Add to Cart'}
                </>
              )}
            </button>
            <button 
              className="btn btn-outline flex items-center justify-center"
              onClick={addToWishlist}
            >
              <Heart className="h-5 w-5 mr-2" />
              Wishlist
            </button>
          </div>
          
          {/* Delivery Info */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <Truck className="h-5 w-5 text-primary-600 mt-1 mr-2" />
              <div>
                <h3 className="font-medium">Delivery Information</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Free shipping on orders over $50. Estimated delivery time: 3-5 business days.
                </p>
              </div>
            </div>
          </div>
          
          {/* Specifications */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold mb-4">Specifications</h3>
            <div className="space-y-3">
              {product.specifications.map((spec: any, index: number) => (
                <div key={index} className="grid grid-cols-3 text-sm">
                  <div className="text-gray-600">{spec.name}</div>
                  <div className="col-span-2">{spec.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Related Products */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6">You Might Also Like</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* We'll show related products in a future update */}
        </div>
      </div>
      
      {/* Notification */}
      {showNotification && (
        <div className="fixed bottom-4 right-4 bg-primary-600 text-white px-4 py-3 rounded-lg shadow-lg z-50 max-w-md">
          {notificationMessage}
        </div>
      )}
    </div>
  );
}
 