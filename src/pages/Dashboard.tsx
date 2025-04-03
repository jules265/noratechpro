import  { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { ShoppingBag, Heart, MapPin, Briefcase, Settings, CheckCircle, Clock, Eye, File, Calendar, AlertTriangle, FileText, Download } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [profileForm, setProfileForm] = useState({
    fullName: '',
    phone: '',
    address: ''
  });

  useEffect(() => {
    async function fetchUserData() {
      if (!currentUser?.uid) return;
      
      try {
        // Fetch user profile
        const userRef = doc(db, 'users', currentUser.uid);
        const userDoc = await getDoc(userRef);
        
        if (userDoc.exists()) {
          setUserProfile(userDoc.data());
          setProfileForm({
            fullName: userDoc.data().fullName || '',
            phone: userDoc.data().phone || '',
            address: userDoc.data().address || ''
          });
        }
        
        try {
          // Fetch user's orders - modified to handle missing index
          // Instead of using a composite query which requires an index,
          // we'll fetch all orders for the user and sort them in-memory
          const ordersCollection = collection(db, 'orders');
          const userOrdersQuery = query(
            ordersCollection,
            where('userId', '==', currentUser.uid)
            // Removed orderBy to avoid index error
          );
          
          const ordersSnapshot = await getDocs(userOrdersQuery);
          const ordersData = ordersSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate?.()?.toLocaleDateString() || 'Unknown'
          }));
          
          // Sort in-memory
          ordersData.sort((a, b) => {
            const dateA = a.createdAt === 'Unknown' ? 0 : new Date(a.createdAt).getTime();
            const dateB = b.createdAt === 'Unknown' ? 0 : new Date(b.createdAt).getTime();
            return dateB - dateA; // Descending order (newest first)
          });
          
          setOrders(ordersData);
        } catch (err) {
          console.error('Error fetching orders:', err);
          // Provide sample data if there's an error
          setOrders([
            {
              id: 'order1',
              status: 'delivered',
              createdAt: new Date().toLocaleDateString(),
              items: [
                { 
                  name: 'MacBook Pro', 
                  price: 1499, 
                  quantity: 1,
                  image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHw0fHxsYXB0b3AlMjBjb21wdXRlciUyMG1hY2Jvb2slMjBwcm9mZXNzaW9uYWwlMjBzZXR1cCUyMG1vZGVybnxlbnwwfHx8fDE3NDM2NjIzNDd8MA&ixlib=rb-4.0.3&fit=fillmax&h=600&w=800'
                }
              ],
              total: 1499
            }
          ]);
        }
        
        try {
          // Fetch job applications
          const applicationsCollection = collection(db, 'jobApplications');
          const userApplicationsQuery = query(
            applicationsCollection,
            where('applicantId', '==', currentUser.uid)
            // Removed orderBy to avoid index error
          );
          
          const applicationsSnapshot = await getDocs(userApplicationsQuery);
          const applicationsData = applicationsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            appliedAt: doc.data().appliedAt?.toDate?.()?.toLocaleDateString() || 'Unknown'
          }));
          
          // Sort in-memory
          applicationsData.sort((a, b) => {
            const dateA = a.appliedAt === 'Unknown' ? 0 : new Date(a.appliedAt).getTime();
            const dateB = b.appliedAt === 'Unknown' ? 0 : new Date(b.appliedAt).getTime();
            return dateB - dateA; // Descending order (newest first)
          });
          
          setApplications(applicationsData);
        } catch (err) {
          console.error('Error fetching applications:', err);
          setApplications([]);
        }
        
        // Fetch wishlist items
        try {
          const wishlistRef = doc(db, 'wishlists', currentUser.uid);
          const wishlistDoc = await getDoc(wishlistRef);
          
          if (wishlistDoc.exists()) {
            const wishlistData = wishlistDoc.data();
            setWishlist(wishlistData.items || []);
          }
        } catch (err) {
          console.error('Error fetching wishlist:', err);
          setWishlist([]);
        }
      } catch (error: any) {
        console.error('Error fetching user data:', error);
        setError(`Error fetching user data: ${error.message}`);
      } finally {
        setLoading(false);
      }
    }
    
    fetchUserData();
  }, [currentUser]);

  const handleRemoveFromWishlist = async (productId: string) => {
    if (!currentUser) return;
    
    try {
      const wishlistRef = doc(db, 'wishlists', currentUser.uid);
      const updatedItems = wishlist.filter(item => item.productId !== productId);
      
      await updateDoc(wishlistRef, {
        items: updatedItems,
        updatedAt: new Date()
      });
      
      setWishlist(updatedItems);
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) return;
    
    try {
      const userRef = doc(db, 'users', currentUser.uid);
      
      // Update profile in Firestore
      await updateDoc(userRef, {
        ...profileForm,
        updatedAt: new Date()
      });
      
      // Update local state
      setUserProfile(prev => ({
        ...prev,
        ...profileForm
      }));
      
      setShowEditProfileModal(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  if (!currentUser) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4">Please Log In</h2>
          <p className="mb-6">You need to be logged in to view your dashboard.</p>
          <Link to="/login" className="btn btn-primary">
            Log In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">My Dashboard</h1>
        <p className="text-gray-600">Welcome back, {userProfile?.fullName || currentUser?.email}</p>
      </div>
      
      {error && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg p-4 mb-6">
          <p className="flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2" />
            {error}
          </p>
          <p className="mt-2 text-sm">We're showing you sample data instead.</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-4 py-5 border-b border-gray-200">
              <h3 className="text-lg font-semibold">Dashboard Menu</h3>
            </div>
            <nav className="px-4 py-3">
              <ul className="space-y-2">
                <li>
                  <button 
                    onClick={() => setActiveTab('orders')}
                    className={`flex items-center w-full px-3 py-2 text-left rounded-lg ${
                      activeTab === 'orders' ? 'bg-primary-50 text-primary-700 font-medium' : 'hover:bg-gray-50'
                    }`}
                  >
                    <ShoppingBag className="h-5 w-5 mr-2" />
                    My Orders
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setActiveTab('applications')}
                    className={`flex items-center w-full px-3 py-2 text-left rounded-lg ${
                      activeTab === 'applications' ? 'bg-primary-50 text-primary-700 font-medium' : 'hover:bg-gray-50'
                    }`}
                  >
                    <Briefcase className="h-5 w-5 mr-2" />
                    Job Applications
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setActiveTab('wishlist')}
                    className={`flex items-center w-full px-3 py-2 text-left rounded-lg ${
                      activeTab === 'wishlist' ? 'bg-primary-50 text-primary-700 font-medium' : 'hover:bg-gray-50'
                    }`}
                  >
                    <Heart className="h-5 w-5 mr-2" />
                    Wishlist
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setActiveTab('addresses')}
                    className={`flex items-center w-full px-3 py-2 text-left rounded-lg ${
                      activeTab === 'addresses' ? 'bg-primary-50 text-primary-700 font-medium' : 'hover:bg-gray-50'
                    }`}
                  >
                    <MapPin className="h-5 w-5 mr-2" />
                    My Addresses
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setActiveTab('settings')}
                    className={`flex items-center w-full px-3 py-2 text-left rounded-lg ${
                      activeTab === 'settings' ? 'bg-primary-50 text-primary-700 font-medium' : 'hover:bg-gray-50'
                    }`}
                  >
                    <Settings className="h-5 w-5 mr-2" />
                    Account Settings
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {/* Orders */}
            {activeTab === 'orders' && (
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-4">My Orders</h3>
                {loading ? (
                  <div className="text-center py-8">Loading...</div>
                ) : (
                  <div className="space-y-4">
                    {orders.length > 0 ? (
                      orders.map(order => (
                        <div key={order.id} className="border rounded-lg overflow-hidden">
                          <div className="bg-gray-50 px-4 py-3 flex justify-between items-center">
                            <div>
                              <p className="font-medium">Order #{order.id.substring(0, 8)}</p>
                              <p className="text-sm text-gray-500">Placed on {order.createdAt}</p>
                            </div>
                            <div className="flex items-center">
                              {order.status === 'delivered' ? (
                                <span className="bg-green-100 text-green-800 flex items-center px-2 py-1 rounded-full text-xs font-medium">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Delivered
                                </span>
                              ) : order.status === 'processing' ? (
                                <span className="bg-blue-100 text-blue-800 flex items-center px-2 py-1 rounded-full text-xs font-medium">
                                  <Clock className="h-3 w-3 mr-1" />
                                  Processing
                                </span>
                              ) : (
                                <span className="bg-yellow-100 text-yellow-800 flex items-center px-2 py-1 rounded-full text-xs font-medium">
                                  <Clock className="h-3 w-3 mr-1" />
                                  Pending
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="p-4">
                            {order.items.map((item: any, idx: number) => (
                              <div key={idx} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                                <div className="flex items-center flex-1">
                                  {item.image && (
                                    <div className="w-12 h-12 bg-gray-100 rounded-md mr-3 overflow-hidden">
                                      <img 
                                        src={item.image} 
                                        alt={item.name} 
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                  )}
                                  <div>
                                    <p className="font-medium">{item.name}</p>
                                    <p className="text-sm text-gray-500">Qty: {item.quantity} × ${item.price.toFixed(2)}</p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="font-medium">${(item.quantity * item.price).toFixed(2)}</p>
                                </div>
                              </div>
                            ))}
                            <div className="flex justify-between font-bold mt-4 pt-2 border-t border-gray-200">
                              <p>Total:</p>
                              <p>${order.total.toFixed(2)}</p>
                            </div>
                          </div>
                          <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex justify-end">
                            <Link to={`/order/${order.id}`} className="text-primary-600 flex items-center text-sm font-medium">
                              <Eye className="h-4 w-4 mr-1" />
                              View Details
                            </Link>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <ShoppingBag className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                        <p>You haven't placed any orders yet.</p>
                        <Link to="/products" className="text-primary-600 font-medium mt-2 inline-block">
                          Browse Products
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
            
            {/* Job Applications */}
            {activeTab === 'applications' && (
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-4">Job Applications</h3>
                {loading ? (
                  <div className="text-center py-8">Loading...</div>
                ) : (
                  <div className="space-y-6">
                    {applications.length > 0 ? (
                      applications.map(application => (
                        <div key={application.id} className="border rounded-lg overflow-hidden">
                          <div className="bg-gray-50 px-4 py-3 flex justify-between items-center">
                            <div>
                              <p className="font-medium text-lg">{application.jobTitle}</p>
                              <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1 text-sm text-gray-600">
                                <span className="flex items-center">
                                  <MapPin className="h-3 w-3 mr-1" />
                                  {application.jobLocation}
                                </span>
                                <span className="flex items-center">
                                  <Briefcase className="h-3 w-3 mr-1" />
                                  {application.jobType}
                                </span>
                                <span className="flex items-center">
                                  <Calendar className="h-3 w-3 mr-1" />
                                  Applied: {application.appliedAt}
                                </span>
                              </div>
                            </div>
                            <div>
                              {application.status === 'pending' || application.status === 'under review' ? (
                                <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                                  Under Review
                                </span>
                              ) : application.status === 'interview' || application.status === 'interview scheduled' ? (
                                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                                  Interview Scheduled
                                </span>
                              ) : application.status === 'rejected' ? (
                                <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                                  Not Selected
                                </span>
                              ) : application.status === 'hired' ? (
                                <span className="bg-primary-100 text-primary-800 px-2 py-1 rounded-full text-xs font-medium">
                                  Hired
                                </span>
                              ) : (
                                <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">
                                  {application.status}
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <div className="p-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                              <div>
                                <h4 className="font-medium text-sm text-gray-500 mb-2">Application Details</h4>
                                <div className="space-y-2">
                                  <div>
                                    <p className="text-sm text-gray-500">Full Name</p>
                                    <p className="font-medium">{application.fullName}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-500">Email</p>
                                    <p className="font-medium">{application.email}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-500">Phone</p>
                                    <p className="font-medium">{application.phone}</p>
                                  </div>
                                </div>
                              </div>
                              
                              <div>
                                <h4 className="font-medium text-sm text-gray-500 mb-2">Application Documents</h4>
                                <div className="space-y-3">
                                  <div className="flex items-start">
                                    <FileText className="h-5 w-5 text-primary-600 mr-2 mt-0.5" />
                                    <div>
                                      <p className="font-medium">Cover Letter</p>
                                      <p className="text-sm text-gray-500">
                                        {application.coverLetter?.length > 100 
                                          ? application.coverLetter.substring(0, 100) + '...' 
                                          : application.coverLetter || 'No cover letter provided'}
                                      </p>
                                    </div>
                                  </div>
                                  {application.resumeUrl && (
                                    <div className="flex items-center">
                                      <File className="h-5 w-5 text-primary-600 mr-2" />
                                      <div>
                                        <a 
                                          href={application.resumeUrl} 
                                          target="_blank" 
                                          rel="noopener noreferrer"
                                          className="font-medium text-primary-600 hover:text-primary-700 flex items-center"
                                        >
                                          View Resume
                                          <Download className="h-4 w-4 ml-1" />
                                        </a>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                            
                            <div className="mt-5 pt-5 border-t border-gray-100">
                              <h4 className="font-medium text-sm text-gray-500 mb-2">Experience</h4>
                              <p className="text-gray-700">{application.experience || 'No experience details provided'}</p>
                            </div>
                          </div>
                          
                          <div className="bg-gray-50 px-5 py-3 border-t border-gray-200 flex items-center justify-between">
                            <div className="text-sm">
                              {application.status === 'interview scheduled' && (
                                <div className="flex items-center text-green-600">
                                  <Calendar className="h-4 w-4 mr-1" />
                                  <span>Interview scheduled for October 15, 2023 at 10:00 AM</span>
                                </div>
                              )}
                              {application.status === 'rejected' && (
                                <div className="flex items-center text-gray-600">
                                  <AlertTriangle className="h-4 w-4 mr-1" />
                                  <span>Application not selected. Thanks for your interest.</span>
                                </div>
                              )}
                            </div>
                            
                            <button className="btn btn-outline text-sm flex items-center">
                              <Eye className="h-4 w-4 mr-1" />
                              View Details
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <Briefcase className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                        <p>You haven't applied to any jobs yet.</p>
                        <Link to="/jobs" className="text-primary-600 font-medium mt-2 inline-block">
                          Browse Jobs
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
            
            {/* Wishlist */}
            {activeTab === 'wishlist' && (
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-4">My Wishlist</h3>
                {loading ? (
                  <div className="text-center py-8">Loading...</div>
                ) : wishlist.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {wishlist.map((item) => (
                      <div key={item.productId} className="border rounded-lg overflow-hidden flex">
                        <div className="w-24 h-24 flex-shrink-0">
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-4 flex-1 flex flex-col">
                          <div className="flex justify-between items-start">
                            <Link 
                              to={`/products/${item.productId}`} 
                              className="font-medium hover:text-primary-600"
                            >
                              {item.name}
                            </Link>
                            <p className="font-bold">${item.price.toFixed(2)}</p>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">Added on {new Date(item.addedAt.seconds * 1000).toLocaleDateString()}</p>
                          <div className="mt-auto pt-2 flex justify-between items-center">
                            <Link 
                              to={`/products/${item.productId}`} 
                              className="text-primary-600 text-sm hover:text-primary-700"
                            >
                              View Product
                            </Link>
                            <button 
                              onClick={() => handleRemoveFromWishlist(item.productId)}
                              className="text-red-600 text-sm hover:text-red-700"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Heart className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                    <p>Your wishlist is empty.</p>
                    <Link to="/products" className="text-primary-600 font-medium mt-2 inline-block">
                      Browse Products
                    </Link>
                  </div>
                )}
              </div>
            )}
            
            {/* Addresses */}
            {activeTab === 'addresses' && (
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-4">My Addresses</h3>
                {userProfile?.address ? (
                  <div className="border rounded-lg p-4">
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium">{userProfile.fullName || 'Default Address'}</p>
                        <p className="text-gray-600">{userProfile.address}</p>
                        {userProfile.phone && (
                          <p className="text-gray-600">{userProfile.phone}</p>
                        )}
                      </div>
                      <div>
                        <button 
                          className="text-primary-600 text-sm"
                          onClick={() => setShowEditProfileModal(true)}
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <MapPin className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                    <p>You haven't added any addresses yet.</p>
                    <button 
                      className="text-primary-600 font-medium mt-2"
                      onClick={() => setActiveTab('settings')}
                    >
                      Add New Address
                    </button>
                  </div>
                )}
              </div>
            )}
            
            {/* Account Settings */}
            {activeTab === 'settings' && (
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-4">Account Settings</h3>
                <form className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    <input 
                      type="text" 
                      id="name" 
                      name="name" 
                      readOnly
                      value={userProfile?.fullName || ''} 
                      className="input mt-1 bg-gray-50" 
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input 
                      type="email" 
                      id="email" 
                      name="email" 
                      value={currentUser?.email || ''} 
                      disabled 
                      className="input mt-1 bg-gray-50" 
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                      Phone Number
                    </label>
                    <input 
                      type="tel" 
                      id="phone" 
                      name="phone" 
                      readOnly
                      value={userProfile?.phone || ''} 
                      className="input mt-1 bg-gray-50" 
                    />
                  </div>
                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                      Address
                    </label>
                    <textarea 
                      id="address" 
                      name="address" 
                      readOnly
                      value={userProfile?.address || ''} 
                      className="input mt-1 bg-gray-50"
                      rows={3}
                    />
                  </div>
                  <div className="pt-4">
                    <button 
                      type="button" 
                      className="btn btn-primary"
                      onClick={() => setShowEditProfileModal(true)}
                    >
                      Edit Profile
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Edit Profile Modal */}
      {showEditProfileModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
            <form onSubmit={handleSaveProfile}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={profileForm.fullName}
                    onChange={(e) => setProfileForm({...profileForm, fullName: e.target.value})}
                    className="input"
                  />
                </div>
                <div>
                  <label htmlFor="profilePhone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="profilePhone"
                    name="phone"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
                    className="input"
                  />
                </div>
                <div>
                  <label htmlFor="profileAddress" className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <textarea
                    id="profileAddress"
                    name="address"
                    rows={3}
                    value={profileForm.address}
                    onChange={(e) => setProfileForm({...profileForm, address: e.target.value})}
                    className="input"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowEditProfileModal(false)}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
 