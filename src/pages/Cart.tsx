import  { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Trash, ArrowRight, CheckCircle, Phone } from 'lucide-react';
import { doc, getDoc, updateDoc, deleteDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';

export default function Cart() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  
  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }
    
    const fetchCart = async () => {
      try {
        const cartRef = doc(db, 'carts', currentUser.uid);
        const cartDoc = await getDoc(cartRef);
        
        if (cartDoc.exists()) {
          const cartData = cartDoc.data();
          setCartItems(cartData.items || []);
        }
      } catch (error) {
        console.error('Error fetching cart:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCart();
  }, [currentUser]);
  
  const updateItemQuantity = async (productId: string, newQuantity: number) => {
    if (!currentUser) return;
    
    if (newQuantity < 1) {
      removeItem(productId);
      return;
    }
    
    try {
      const updatedItems = cartItems.map(item => 
        item.productId === productId ? { ...item, quantity: newQuantity } : item
      );
      
      setCartItems(updatedItems);
      
      const cartRef = doc(db, 'carts', currentUser.uid);
      await updateDoc(cartRef, {
        items: updatedItems,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };
  
  const removeItem = async (productId: string) => {
    if (!currentUser) return;
    
    try {
      const updatedItems = cartItems.filter(item => item.productId !== productId);
      
      setCartItems(updatedItems);
      
      const cartRef = doc(db, 'carts', currentUser.uid);
      
      if (updatedItems.length === 0) {
        // If cart is empty, delete the cart document
        await deleteDoc(cartRef);
      } else {
        // Otherwise update the cart with remaining items
        await updateDoc(cartRef, {
          items: updatedItems,
          updatedAt: new Date()
        });
      }
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };
  
  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };
  
  const calculateTax = () => {
    return calculateSubtotal() * 0.1; // 10% tax
  };
  
  const calculateShipping = () => {
    const subtotal = calculateSubtotal();
    return subtotal >= 50 ? 0 : 10; // Free shipping on orders over $50
  };
  
  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax() + calculateShipping();
  };
  
  const handleCheckout = async () => {
    if (!currentUser || cartItems.length === 0) return;
    
    try {
      setCheckoutLoading(true);
      
      // Create new order in orders collection
      const orderRef = await addDoc(collection(db, 'orders'), {
        userId: currentUser.uid,
        items: cartItems,
        subtotal: calculateSubtotal(),
        tax: calculateTax(),
        shipping: calculateShipping(),
        total: calculateTotal(),
        status: 'pending',
        createdAt: serverTimestamp()
      });
      
      // Clear the cart
      const cartRef = doc(db, 'carts', currentUser.uid);
      await deleteDoc(cartRef);
      
      // Update local state
      setCartItems([]);
      setOrderNumber(orderRef.id);
      setShowSuccessModal(true);
      
    } catch (error) {
      console.error('Error processing checkout:', error);
    } finally {
      setCheckoutLoading(false);
    }
  };
  
  const handleWhatsAppCheckout = () => {
    if (cartItems.length === 0) return;
    
    // Create message for WhatsApp
    let message = "Hello, I would like to place an order:\n\n";
    
    // Add each item
    cartItems.forEach((item, index) => {
      message += `${index + 1}. ${item.name} - $${item.price.toFixed(2)} x ${item.quantity}\n`;
    });
    
    // Add order summary
    message += `\nSubtotal: $${calculateSubtotal().toFixed(2)}`;
    message += `\nTax: $${calculateTax().toFixed(2)}`;
    message += `\nShipping: ${calculateShipping() === 0 ? 'Free' : `$${calculateShipping().toFixed(2)}`}`;
    message += `\nTotal: $${calculateTotal().toFixed(2)}`;
    
    if (currentUser?.email) {
      message += `\n\nMy email: ${currentUser.email}`;
    }
    
    // Encode message for URL
    const encodedMessage = encodeURIComponent(message);
    
    // Open WhatsApp with pre-filled message
    window.open(`https://wa.me/250788699190?text=${encodedMessage}`, '_blank');
  };
  
  if (!currentUser) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <ShoppingCart className="h-12 w-12 mx-auto text-gray-300 mb-3" />
          <h2 className="text-2xl font-bold mb-2">Your Cart is Empty</h2>
          <p className="text-gray-600 mb-6">Please log in to view your cart</p>
          <Link to="/login" className="btn btn-primary">
            Log In
          </Link>
        </div>
      </div>
    );
  }
  
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center py-12">Loading your cart...</div>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold mb-8">Your Shopping Cart</h1>
      
      {cartItems.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <ShoppingCart className="h-12 w-12 mx-auto text-gray-300 mb-3" />
          <h2 className="text-2xl font-bold mb-2">Your Cart is Empty</h2>
          <p className="text-gray-600 mb-6">Looks like you haven't added any products to your cart yet.</p>
          <Link to="/products" className="btn btn-primary">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold">Cart Items ({cartItems.length})</h2>
              </div>
              <ul className="divide-y divide-gray-200">
                {cartItems.map((item) => (
                  <li key={item.productId} className="p-6">
                    <div className="flex flex-col sm:flex-row">
                      <div className="flex-shrink-0 w-full sm:w-24 h-24 bg-gray-100 rounded-lg overflow-hidden mb-4 sm:mb-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover object-center"
                        />
                      </div>
                      <div className="flex-1 sm:ml-6">
                        <div className="flex justify-between">
                          <div>
                            <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                            <p className="mt-1 text-sm text-gray-500">
                              ${item.price.toFixed(2)} per unit
                            </p>
                          </div>
                          <p className="text-lg font-medium text-gray-900">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                        <div className="mt-4 flex justify-between items-center">
                          <div className="flex items-center border border-gray-300 rounded-lg">
                            <button
                              type="button"
                              className="p-2 text-gray-600 hover:text-gray-900"
                              onClick={() => updateItemQuantity(item.productId, item.quantity - 1)}
                            >
                              -
                            </button>
                            <span className="px-4 py-1">{item.quantity}</span>
                            <button
                              type="button"
                              className="p-2 text-gray-600 hover:text-gray-900"
                              onClick={() => updateItemQuantity(item.productId, item.quantity + 1)}
                            >
                              +
                            </button>
                          </div>
                          <button
                            type="button"
                            className="text-red-600 hover:text-red-800 flex items-center"
                            onClick={() => removeItem(item.productId)}
                          >
                            <Trash className="h-4 w-4 mr-1" />
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold">Order Summary</h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex justify-between">
                  <p className="text-gray-600">Subtotal</p>
                  <p className="font-medium">${calculateSubtotal().toFixed(2)}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-gray-600">Tax (10%)</p>
                  <p className="font-medium">${calculateTax().toFixed(2)}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-gray-600">Shipping</p>
                  <p className="font-medium">
                    {calculateShipping() === 0 ? 'Free' : `$${calculateShipping().toFixed(2)}`}
                  </p>
                </div>
                <div className="border-t border-gray-200 pt-4 flex justify-between items-center">
                  <p className="text-lg font-semibold">Total</p>
                  <p className="text-xl font-bold">${calculateTotal().toFixed(2)}</p>
                </div>
                
                <div className="space-y-3 pt-2">
                  <button
                    type="button"
                    className="btn btn-primary w-full py-3 flex justify-center items-center"
                    onClick={handleCheckout}
                    disabled={checkoutLoading}
                  >
                    {checkoutLoading ? 'Processing...' : (
                      <>
                        Proceed to Checkout <ArrowRight className="h-4 w-4 ml-2" />
                      </>
                    )}
                  </button>
                  
                  <button
                    type="button"
                    className="btn bg-green-600 hover:bg-green-700 text-white w-full py-3 flex justify-center items-center"
                    onClick={handleWhatsAppCheckout}
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Checkout via WhatsApp
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Order Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Order Placed!</h2>
            <p className="text-gray-600 mb-6">
              Your order #{orderNumber.substring(0, 8)} has been successfully placed.
              We'll send you an email with the order details.
            </p>
            <div className="space-y-3">
              <button
                className="btn btn-primary w-full py-3"
                onClick={() => {
                  setShowSuccessModal(false);
                  navigate('/dashboard');
                }}
              >
                View Your Orders
              </button>
              <button
                className="btn btn-outline w-full py-3"
                onClick={() => {
                  setShowSuccessModal(false);
                  navigate('/products');
                }}
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
 