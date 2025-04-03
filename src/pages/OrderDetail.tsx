import  { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Package, Truck, CheckCircle, Map, Calendar, ShoppingBag } from 'lucide-react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const { currentUser, userRole } = useAuth();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    async function fetchOrder() {
      if (!id || !currentUser) return;
      
      try {
        const orderRef = doc(db, 'orders', id);
        const orderDoc = await getDoc(orderRef);
        
        if (orderDoc.exists()) {
          const orderData = orderDoc.data();
          // Check if user is admin or if it's their own order
          if (userRole === 'admin' || orderData.userId === currentUser.uid) {
            setOrder({
              id: orderDoc.id,
              ...orderData,
              createdAt: orderData.createdAt?.toDate?.()?.toLocaleDateString() || 'Unknown'
            });
          } else {
            setError('You do not have permission to view this order');
          }
        } else {
          setError('Order not found');
        }
      } catch (err: any) {
        console.error('Error fetching order:', err);
        setError('Failed to load order details: ' + err.message);
      } finally {
        setLoading(false);
      }
    }
    
    fetchOrder();
  }, [id, currentUser, userRole]);

  const updateOrderStatus = async (status: string) => {
    if (!id || !currentUser || userRole !== 'admin') return;
    
    try {
      setUpdating(true);
      const orderRef = doc(db, 'orders', id);
      
      await updateDoc(orderRef, {
        status,
        updatedAt: new Date()
      });
      
      setOrder(prev => ({
        ...prev,
        status
      }));
      
    } catch (err: any) {
      console.error('Error updating order:', err);
      alert('Failed to update order status: ' + err.message);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-96">Loading order details...</div>;
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center py-12">
          <ShoppingBag className="h-12 w-12 mx-auto text-gray-300 mb-3" />
          <h2 className="text-2xl font-bold mb-4">Error</h2>
          <p className="mb-6">{error}</p>
          <Link to="/dashboard" className="btn btn-primary">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center py-12">
          <ShoppingBag className="h-12 w-12 mx-auto text-gray-300 mb-3" />
          <h2 className="text-2xl font-bold mb-4">Order Not Found</h2>
          <p className="mb-6">The order you're looking for doesn't exist or has been removed.</p>
          <Link to="/dashboard" className="btn btn-primary">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-6">
        <Link to="/dashboard" className="text-primary-600 hover:text-primary-700 flex items-center">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Dashboard
        </Link>
      </div>
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Order #{order.id.substring(0, 8)}</h1>
        <div>
          {order.status === 'delivered' ? (
            <span className="bg-green-100 text-green-800 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium">
              <CheckCircle className="h-4 w-4 mr-1" />
              Delivered
            </span>
          ) : order.status === 'processing' ? (
            <span className="bg-blue-100 text-blue-800 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium">
              <Truck className="h-4 w-4 mr-1" />
              Processing
            </span>
          ) : order.status === 'pending' ? (
            <span className="bg-yellow-100 text-yellow-800 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium">
              <Package className="h-4 w-4 mr-1" />
              Pending
            </span>
          ) : (
            <span className="bg-gray-100 text-gray-800 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium">
              {order.status}
            </span>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Details */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold">Order Items</h2>
            </div>
            
            <ul className="divide-y divide-gray-200">
              {order.items.map((item: any, index: number) => (
                <li key={index} className="p-6 flex">
                  <div className="flex-shrink-0 w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover object-center"
                    />
                  </div>
                  <div className="ml-6 flex-1">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          <Link to={`/products/${item.productId}`} className="hover:text-primary-600">
                            {item.name}
                          </Link>
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                      <p className="text-lg font-medium text-gray-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Admin Controls - Only shown to admins */}
          {userRole === 'admin' && (
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold">Admin Controls</h2>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-medium mb-4">Update Order Status</h3>
                <div className="flex flex-wrap gap-3">
                  <button
                    className={`btn ${order.status === 'pending' ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => updateOrderStatus('pending')}
                    disabled={updating || order.status === 'pending'}
                  >
                    Mark as Pending
                  </button>
                  <button
                    className={`btn ${order.status === 'processing' ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => updateOrderStatus('processing')}
                    disabled={updating || order.status === 'processing'}
                  >
                    Mark as Processing
                  </button>
                  <button
                    className={`btn ${order.status === 'delivered' ? 'bg-green-600 text-white hover:bg-green-700' : 'btn-outline'}`}
                    onClick={() => updateOrderStatus('delivered')}
                    disabled={updating || order.status === 'delivered'}
                  >
                    Mark as Delivered
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold">Order Summary</h2>
            </div>
            <div className="p-6">
              <div className="flex justify-between mb-2">
                <p className="text-gray-600">Subtotal</p>
                <p className="font-medium">${order.subtotal?.toFixed(2) || '0.00'}</p>
              </div>
              <div className="flex justify-between mb-2">
                <p className="text-gray-600">Tax</p>
                <p className="font-medium">${order.tax?.toFixed(2) || '0.00'}</p>
              </div>
              <div className="flex justify-between mb-2">
                <p className="text-gray-600">Shipping</p>
                <p className="font-medium">
                  {order.shipping === 0 ? 'Free' : `$${order.shipping?.toFixed(2) || '0.00'}`}
                </p>
              </div>
              <div className="border-t border-gray-200 mt-4 pt-4 flex justify-between">
                <p className="text-lg font-semibold">Total</p>
                <p className="text-xl font-bold">${order.total?.toFixed(2) || '0.00'}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold">Order Information</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <div className="flex items-center text-gray-600 mb-1">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span className="text-sm">Order Date</span>
                  </div>
                  <p className="font-medium">{order.createdAt}</p>
                </div>
                <div>
                  <div className="flex items-center text-gray-600 mb-1">
                    <Map className="h-4 w-4 mr-2" />
                    <span className="text-sm">Shipping Address</span>
                  </div>
                  <p className="font-medium">
                    {order.shippingAddress || 'Default shipping address'}
                  </p>
                </div>
                <div>
                  <div className="flex items-center text-gray-600 mb-1">
                    <Truck className="h-4 w-4 mr-2" />
                    <span className="text-sm">Estimated Delivery</span>
                  </div>
                  <p className="font-medium">
                    {order.status === 'delivered' 
                      ? 'Delivered'
                      : order.status === 'processing'
                      ? '3-5 business days'
                      : '5-7 business days'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
 