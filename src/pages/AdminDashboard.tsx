import  { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc, deleteDoc, query, orderBy, limit, where, getDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { 
  Users, 
  Package, 
  ShoppingBag, 
  Briefcase, 
  Home as HomeIcon, 
  Car, 
  Settings, 
  PlusCircle,
  Edit,
  Trash,
  CheckCircle,
  Calendar,
  X,
  AlertCircle,
  Phone,
  Mail,
  Eye,
  Filter,
  Search,
  Download,
  FileText
} from 'lucide-react';
import DollarSign from '../components/DollarSign';

export default function AdminDashboard() {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [applicationActionLoading, setApplicationActionLoading] = useState(false);
  const [orderActionLoading, setOrderActionLoading] = useState(false);
  const [applicationSearchTerm, setApplicationSearchTerm] = useState('');
  const [applicationStatusFilter, setApplicationStatusFilter] = useState('all');
  const [orderSearchTerm, setOrderSearchTerm] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [showAddJobModal, setShowAddJobModal] = useState(false);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [newJob, setNewJob] = useState({
    title: '',
    company: 'NoraTech',
    location: '',
    type: 'Full-time',
    salary: '',
    category: 'Technology',
    description: ''
  });
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    category: 'Electronics',
    description: '',
    stock: '10',
    image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHwxfHxlbGVjdHJvbmljJTIwc3RvcmUlMjBkaXNwbGF5JTIwbW9kZXJuJTIwZ2FkZ2V0cyUyMGFuZCUyMHByb2R1Y3RzJTIwb24lMjBzaGVsdmVzfGVufDB8fHx8MTc0MzY2MzAwMXww&ixlib=rb-4.0.3&fit=fillmax&h=600&w=800'
  });
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [averageOrderValue, setAverageOrderValue] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [userGrowth, setUserGrowth] = useState(0);
  const [revenueGrowth, setRevenueGrowth] = useState(0);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch users with count
        const usersQuery = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
        const usersSnapshot = await getDocs(usersQuery);
        const usersData = usersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate?.()?.toLocaleDateString() || 'Unknown'
        }));
        
        setUsers(usersData);
        setUserCount(usersData.length);
        
        // Calculate user growth (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const newUsersCount = usersData.filter((user: any) => 
          user.createdAt !== 'Unknown' && new Date(user.createdAt) >= thirtyDaysAgo
        ).length;
        
        setUserGrowth(newUsersCount);
        
        // Fetch orders with total revenue
        const ordersQuery = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
        const ordersSnapshot = await getDocs(ordersQuery);
        const ordersData = ordersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate?.()?.toLocaleDateString() || 'Unknown'
        }));
        
        setOrders(ordersData);
        setOrderCount(ordersData.length);
        
        // Calculate total revenue and average order value
        const revenue = ordersData.reduce((sum, order) => sum + (order.total || 0), 0);
        setTotalRevenue(revenue);
        setAverageOrderValue(ordersData.length > 0 ? revenue / ordersData.length : 0);
        
        // Calculate revenue growth (compare last 30 days vs previous 30 days)
        const lastThirtyDaysOrders = ordersData.filter((order: any) => 
          order.createdAt !== 'Unknown' && new Date(order.createdAt) >= thirtyDaysAgo
        );
        const lastThirtyDaysRevenue = lastThirtyDaysOrders.reduce((sum, order) => sum + (order.total || 0), 0);
        
        const sixtyDaysAgo = new Date();
        sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
        
        const previousThirtyDaysOrders = ordersData.filter((order: any) => 
          order.createdAt !== 'Unknown' && 
          new Date(order.createdAt) >= sixtyDaysAgo && 
          new Date(order.createdAt) < thirtyDaysAgo
        );
        
        const previousThirtyDaysRevenue = previousThirtyDaysOrders.reduce((sum, order) => sum + (order.total || 0), 0);
        
        if (previousThirtyDaysRevenue > 0) {
          const growthRate = ((lastThirtyDaysRevenue - previousThirtyDaysRevenue) / previousThirtyDaysRevenue) * 100;
          setRevenueGrowth(parseFloat(growthRate.toFixed(1)));
        } else {
          setRevenueGrowth(100); // If previous period had no revenue, growth is 100%
        }
        
        // Fetch job applications
        const applicationsQuery = query(
          collection(db, 'jobApplications'),
          orderBy('appliedAt', 'desc')
        );
        
        const applicationsSnapshot = await getDocs(applicationsQuery);
        const applicationsData = applicationsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          appliedAt: doc.data().appliedAt?.toDate?.()?.toLocaleDateString() || 'Unknown'
        }));
        
        setApplications(applicationsData);
        
        // Count unread notifications
        const notificationsQuery = query(
          collection(db, 'adminNotifications'),
          where('read', '==', false)
        );
        
        const notificationsSnapshot = await getDocs(notificationsQuery);
        setNotificationCount(notificationsSnapshot.size);
        
        // Fetch products
        const productsQuery = query(collection(db, 'products'));
        const productsSnapshot = await getDocs(productsQuery);
        const productsData = productsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        if (productsData.length > 0) {
          setProducts(productsData);
        } else {
          // For demonstration, use dummy data if no products in Firestore
          setProducts([
            { id: '1', name: '4K Monitor', category: 'Electronics', price: 499, stock: 25, image: 'https://images.unsplash.com/photo-1591799265444-d66432b91588?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBlbGVjdHJvbmljcyUyMHN0b3JlJTIwZGlzcGxheSUyMGl0ZW1zJTIwZ2FkZ2V0c3xlbnwwfHx8fDE3NDM1ODk4NzR8MA&ixlib=rb-4.0.3&fit=fillmax&h=600&w=800' },
            { id: '2', name: 'Gaming Laptop', category: 'Electronics', price: 1299, stock: 10, image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHwxfHxlbGVjdHJvbmljJTIwc3RvcmUlMjBkaXNwbGF5JTIwbW9kZXJuJTIwZ2FkZ2V0cyUyMGFuZCUyMHByb2R1Y3RzJTIwb24lMjBzaGVsdmVzfGVufDB8fHx8MTc0MzY2MzAwMXww&ixlib=rb-4.0.3&fit=fillmax&h=600&w=800' },
            { id: '3', name: 'Wireless Earbuds', category: 'Electronics', price: 89, stock: 50, image: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHwyfHxlbGVjdHJvbmljJTIwc3RvcmUlMjBkaXNwbGF5JTIwbW9kZXJuJTIwZ2FkZ2V0cyUyMGFuZCUyMHByb2R1Y3RzJTIwb24lMjBzaGVsdmVzfGVufDB8fHx8MTc0MzY2MzAwMXww&ixlib=rb-4.0.3&fit=fillmax&h=600&w=800' },
            { id: '4', name: 'Luxury Sedan 2023', category: 'Vehicles', price: 45999, stock: 3, image: 'https://images.unsplash.com/photo-1528154291023-a6525fabe5b4?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB2ZWhpY2xlcyUyMHNob3djYXNlJTIwc2hvd3Jvb218ZW58MHx8fHwxNzQzNTkzNDY5fDA&ixlib=rb-4.0.3&fit=fillmax&h=600&w=800' },
            { id: '5', name: 'City Apartment', category: 'Real Estate', price: 299000, stock: 1, image: 'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHwzfHxlbGVjdHJvbmljJTIwc3RvcmUlMjBkaXNwbGF5JTIwbW9kZXJuJTIwZ2FkZ2V0cyUyMGFuZCUyMHByb2R1Y3RzJTIwb24lMjBzaGVsdmVzfGVufDB8fHx8MTc0MzY2MzAwMXww&ixlib=rb-4.0.3&fit=fillmax&h=600&w=800' }
          ]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, []);

  const handleDeleteProduct = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        // Delete from Firestore
        await deleteDoc(doc(db, 'products', id));
        
        // Update local state
        setProducts(products.filter(product => product.id !== id));
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };
  
  const handleViewApplication = (application: any) => {
    setSelectedApplication(application);
    setShowApplicationModal(true);
  };
  
  const handleViewOrder = (order: any) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };
  
  const handleApplicationAction = async (action: string) => {
    if (!selectedApplication) return;
    
    setApplicationActionLoading(true);
    
    try {
      const applicationRef = doc(db, 'jobApplications', selectedApplication.id);
      
      // Update the application status
      await updateDoc(applicationRef, {
        status: action,
        updatedAt: new Date()
      });
      
      // Update the user's application record too
      if (selectedApplication.applicantId) {
        const userRef = doc(db, 'users', selectedApplication.applicantId);
        const userDoc = await getDoc(userRef);
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const jobApplications = userData.jobApplications || [];
          
          const updatedApplications = jobApplications.map((app: any) => {
            if (app.id === selectedApplication.id) {
              return { ...app, status: action };
            }
            return app;
          });
          
          await updateDoc(userRef, {
            jobApplications: updatedApplications,
            lastUpdated: new Date()
          });
        }
      }
      
      // Update local state
      setApplications(applications.map(app => {
        if (app.id === selectedApplication.id) {
          return { ...app, status: action };
        }
        return app;
      }));
      
      // Create notification for the user
      if (selectedApplication.applicantId) {
        await addDoc(collection(db, 'notifications'), {
          userId: selectedApplication.applicantId,
          type: 'job_application_update',
          title: 'Application Status Updated',
          message: `Your application for ${selectedApplication.jobTitle} has been ${action === 'interview' ? 'moved to interview stage' : action}.`,
          read: false,
          createdAt: new Date()
        });
      }
      
      // Close the modal
      setShowApplicationModal(false);
      setSelectedApplication(null);
      
    } catch (error) {
      console.error('Error updating application:', error);
    } finally {
      setApplicationActionLoading(false);
    }
  };
  
  const handleOrderAction = async (status: string) => {
    if (!selectedOrder) return;
    
    setOrderActionLoading(true);
    
    try {
      const orderRef = doc(db, 'orders', selectedOrder.id);
      
      // Update the order status
      await updateDoc(orderRef, {
        status,
        updatedAt: new Date()
      });
      
      // Update local state
      setOrders(orders.map(order => {
        if (order.id === selectedOrder.id) {
          return { ...order, status };
        }
        return order;
      }));
      
      // Create notification for the user
      if (selectedOrder.userId) {
        await addDoc(collection(db, 'notifications'), {
          userId: selectedOrder.userId,
          type: 'order_status_update',
          title: 'Order Status Updated',
          message: `Your order #${selectedOrder.id.substring(0, 8)} has been marked as ${status}.`,
          read: false,
          createdAt: new Date()
        });
      }
      
      setSelectedOrder({...selectedOrder, status});
      
    } catch (error) {
      console.error('Error updating order:', error);
    } finally {
      setOrderActionLoading(false);
    }
  };
  
  const handleAddJob = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Add to Firestore
      const jobData = {
        ...newJob,
        posted: new Date(),
        active: true
      };
      
      const jobRef = await addDoc(collection(db, 'jobs'), jobData);
      
      // Update UI
      alert(`Job "${newJob.title}" has been added successfully!`);
      setShowAddJobModal(false);
      setNewJob({
        title: '',
        company: 'NoraTech',
        location: '',
        type: 'Full-time',
        salary: '',
        category: 'Technology',
        description: ''
      });
    } catch (error) {
      console.error('Error adding job:', error);
      alert('Failed to add job. Please try again.');
    }
  };
  
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Validate price and stock
      const price = parseFloat(newProduct.price);
      const stock = parseInt(newProduct.stock);
      
      if (isNaN(price) || price <= 0) {
        alert('Please enter a valid price');
        return;
      }
      
      if (isNaN(stock) || stock < 0) {
        alert('Please enter a valid stock amount');
        return;
      }
      
      // Add to Firestore
      const productData = {
        ...newProduct,
        price,
        stock,
        createdAt: serverTimestamp()
      };
      
      const productRef = await addDoc(collection(db, 'products'), productData);
      
      // Update local state
      const newProductWithId = {
        id: productRef.id,
        ...productData,
        createdAt: new Date().toLocaleDateString()
      };
      
      setProducts([newProductWithId, ...products]);
      
      // Reset form
      alert(`Product "${newProduct.name}" has been added successfully!`);
      setShowAddProductModal(false);
      setNewProduct({
        name: '',
        price: '',
        category: 'Electronics',
        description: '',
        stock: '10',
        image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHwxfHxlbGVjdHJvbmljJTIwc3RvcmUlMjBkaXNwbGF5JTIwbW9kZXJuJTIwZ2FkZ2V0cyUyMGFuZCUyMHByb2R1Y3RzJTIwb24lMjBzaGVsdmVzfGVufDB8fHx8MTc0MzY2MzAwMXww&ixlib=rb-4.0.3&fit=fillmax&h=600&w=800'
      });
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Failed to add product. Please try again.');
    }
  };
  
  const handleDownloadResume = async (url: string, applicantName: string) => {
    if (!url) {
      alert('No resume available for download');
      return;
    }
    
    try {
      // For security, we'll download through Firebase Storage
      const response = await fetch(url);
      const blob = await response.blob();
      
      // Create a download link
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `${applicantName.replace(/\s+/g, '_')}_Resume.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading resume:', error);
      alert('Failed to download resume. Please try again.');
    }
  };
  
  // Filter applications
  const filteredApplications = applications.filter(application => {
    const matchesSearch = 
      application.fullName?.toLowerCase().includes(applicationSearchTerm.toLowerCase()) ||
      application.email?.toLowerCase().includes(applicationSearchTerm.toLowerCase()) ||
      application.jobTitle?.toLowerCase().includes(applicationSearchTerm.toLowerCase());
    
    const matchesStatus = applicationStatusFilter === 'all' || application.status === applicationStatusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  // Filter orders
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id?.toLowerCase().includes(orderSearchTerm.toLowerCase()) ||
      order.userId?.toLowerCase().includes(orderSearchTerm.toLowerCase());
    
    const matchesStatus = orderStatusFilter === 'all' || order.status === orderStatusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-600">Manage your business operations</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-4 py-5 border-b border-gray-200">
              <h3 className="text-lg font-semibold">Admin Controls</h3>
            </div>
            <nav className="px-4 py-3">
              <ul className="space-y-2">
                <li>
                  <button 
                    onClick={() => setActiveTab('overview')}
                    className={`flex items-center w-full px-3 py-2 text-left rounded-lg ${
                      activeTab === 'overview' ? 'bg-primary-50 text-primary-700 font-medium' : 'hover:bg-gray-50'
                    }`}
                  >
                    <Package className="h-5 w-5 mr-2" />
                    Overview
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setActiveTab('orders')}
                    className={`flex items-center w-full px-3 py-2 text-left rounded-lg ${
                      activeTab === 'orders' ? 'bg-primary-50 text-primary-700 font-medium' : 'hover:bg-gray-50'
                    }`}
                  >
                    <ShoppingBag className="h-5 w-5 mr-2" />
                    Orders
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setActiveTab('products')}
                    className={`flex items-center w-full px-3 py-2 text-left rounded-lg ${
                      activeTab === 'products' ? 'bg-primary-50 text-primary-700 font-medium' : 'hover:bg-gray-50'
                    }`}
                  >
                    <Package className="h-5 w-5 mr-2" />
                    Products
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setActiveTab('users')}
                    className={`flex items-center w-full px-3 py-2 text-left rounded-lg ${
                      activeTab === 'users' ? 'bg-primary-50 text-primary-700 font-medium' : 'hover:bg-gray-50'
                    }`}
                  >
                    <Users className="h-5 w-5 mr-2" />
                    Users
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setActiveTab('jobs')}
                    className={`flex items-center w-full px-3 py-2 text-left rounded-lg ${
                      activeTab === 'jobs' ? 'bg-primary-50 text-primary-700 font-medium' : 'hover:bg-gray-50'
                    }`}
                  >
                    <Briefcase className="h-5 w-5 mr-2" />
                    <span>Jobs</span>
                    {notificationCount > 0 && (
                      <span className="ml-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                        {notificationCount}
                      </span>
                    )}
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setActiveTab('real-estate')}
                    className={`flex items-center w-full px-3 py-2 text-left rounded-lg ${
                      activeTab === 'real-estate' ? 'bg-primary-50 text-primary-700 font-medium' : 'hover:bg-gray-50'
                    }`}
                  >
                    <HomeIcon className="h-5 w-5 mr-2" />
                    Real Estate
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setActiveTab('vehicles')}
                    className={`flex items-center w-full px-3 py-2 text-left rounded-lg ${
                      activeTab === 'vehicles' ? 'bg-primary-50 text-primary-700 font-medium' : 'hover:bg-gray-50'
                    }`}
                  >
                    <Car className="h-5 w-5 mr-2" />
                    Vehicles
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
                    Settings
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {/* Overview */}
            {activeTab === 'overview' && (
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-6">Dashboard Overview</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  <div className="bg-primary-50 p-4 rounded-lg border border-primary-100">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-primary-700 text-sm font-medium">Total Users</p>
                        <p className="text-2xl font-bold mt-1">{userCount}</p>
                      </div>
                      <div className="bg-primary-100 p-2 rounded-lg">
                        <Users className="h-6 w-6 text-primary-600" />
                      </div>
                    </div>
                    <p className="text-xs text-primary-700 mt-2">+{userGrowth} new users in last 30 days</p>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-green-700 text-sm font-medium">Total Products</p>
                        <p className="text-2xl font-bold mt-1">{products.length}</p>
                      </div>
                      <div className="bg-green-100 p-2 rounded-lg">
                        <Package className="h-6 w-6 text-green-600" />
                      </div>
                    </div>
                    <p className="text-xs text-green-700 mt-2">
                      {products.filter(p => p.category === 'Electronics').length} Electronics, 
                      {products.filter(p => p.category === 'Vehicles').length} Vehicles
                    </p>
                  </div>
                  
                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-purple-700 text-sm font-medium">Total Orders</p>
                        <p className="text-2xl font-bold mt-1">{orderCount}</p>
                      </div>
                      <div className="bg-purple-100 p-2 rounded-lg">
                        <ShoppingBag className="h-6 w-6 text-purple-600" />
                      </div>
                    </div>
                    <p className="text-xs text-purple-700 mt-2">Avg. Order: ${averageOrderValue.toFixed(2)}</p>
                  </div>
                  
                  <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-amber-700 text-sm font-medium">Total Revenue</p>
                        <p className="text-2xl font-bold mt-1">${totalRevenue.toLocaleString()}</p>
                      </div>
                      <div className="bg-amber-100 p-2 rounded-lg">
                        <DollarSign className="h-6 w-6 text-amber-600" />
                      </div>
                    </div>
                    <p className="text-xs text-amber-700 mt-2">
                      {revenueGrowth >= 0 ? '+' : ''}{revenueGrowth}% from last period
                    </p>
                  </div>
                </div>
                
                <div className="mb-8">
                  <h4 className="font-semibold text-lg mb-3">Recent Orders</h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {orders.slice(0, 5).map((order) => (
                          <tr key={order.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{order.id.substring(0, 8)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.userId?.substring(0, 8) || 'Anonymous'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.createdAt}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">${order.total?.toFixed(2) || 0}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                order.status === 'delivered' ? 'bg-green-100 text-green-800' : 
                                order.status === 'processing' ? 'bg-blue-100 text-blue-800' : 
                                order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {order.status || 'pending'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <button 
                                className="text-primary-600 hover:text-primary-800"
                                onClick={() => handleViewOrder(order)}
                              >
                                Manage
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                
                <h4 className="font-semibold text-lg mb-3">Recent Users</h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.slice(0, 5).map((user) => (
                        <tr key={user.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.id.substring(0, 8)}...</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
                            }`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.createdAt}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            
            {/* Orders */}
            {activeTab === 'orders' && (
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-xl font-semibold">Manage Orders</h3>
                    <p className="text-sm text-gray-600">{orders.length} orders in database</p>
                  </div>
                </div>
                
                {/* Filters */}
                <div className="bg-gray-50 p-4 rounded-lg mb-6 flex flex-col md:flex-row gap-4">
                  <div className="relative flex-grow">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search orders..."
                      value={orderSearchTerm}
                      onChange={(e) => setOrderSearchTerm(e.target.value)}
                      className="pl-10 input"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2 min-w-[200px]">
                    <Filter className="h-5 w-5 text-gray-400" />
                    <select
                      value={orderStatusFilter}
                      onChange={(e) => setOrderStatusFilter(e.target.value)}
                      className="input py-2"
                    >
                      <option value="all">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="delivered">Delivered</option>
                    </select>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredOrders.map((order) => (
                        <tr key={order.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{order.id.substring(0, 8)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.userId?.substring(0, 8) || 'Anonymous'}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.items?.length || 0} items</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.createdAt}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">${order.total?.toFixed(2) || 0}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              order.status === 'delivered' ? 'bg-green-100 text-green-800' : 
                              order.status === 'processing' ? 'bg-blue-100 text-blue-800' : 
                              order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {order.status || 'pending'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <button 
                              className="text-primary-600 hover:text-primary-800"
                              onClick={() => handleViewOrder(order)}
                            >
                              Manage
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            
            {/* Products */}
            {activeTab === 'products' && (
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-xl font-semibold">Manage Products</h3>
                    <p className="text-sm text-gray-600">{products.length} products in database</p>
                  </div>
                  <button 
                    className="btn btn-primary flex items-center"
                    onClick={() => setShowAddProductModal(true)}
                  >
                    <PlusCircle className="h-5 w-5 mr-1" />
                    Add Product
                  </button>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {products.map((product) => (
                        <tr key={product.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="h-12 w-12 rounded-md overflow-hidden bg-gray-100">
                              {product.image && (
                                <img 
                                  src={product.image} 
                                  alt={product.name} 
                                  className="h-full w-full object-cover"
                                />
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.category}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${product.price.toLocaleString()}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.stock}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex space-x-2">
                              <button className="text-blue-600 hover:text-blue-900">
                                <Edit className="h-5 w-5" />
                              </button>
                              <button 
                                className="text-red-600 hover:text-red-900"
                                onClick={() => handleDeleteProduct(product.id)}
                              >
                                <Trash className="h-5 w-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            
            {/* Users */}
            {activeTab === 'users' && (
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-xl font-semibold">Manage Users</h3>
                    <p className="text-sm text-gray-600">{users.length} registered users</p>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map((user) => (
                        <tr key={user.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.id.substring(0, 8)}...</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
                            }`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.createdAt}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex space-x-2">
                              <button className="text-blue-600 hover:text-blue-900">
                                <Edit className="h-5 w-5" />
                              </button>
                              <button className="text-red-600 hover:text-red-900">
                                <Trash className="h-5 w-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            
            {/* Jobs */}
            {activeTab === 'jobs' && (
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-xl font-semibold">Job Applications</h3>
                    <p className="text-sm text-gray-600 mt-1">Manage job listings and applications</p>
                  </div>
                  <button 
                    className="btn btn-primary flex items-center"
                    onClick={() => setShowAddJobModal(true)}
                  >
                    <PlusCircle className="h-5 w-5 mr-1" />
                    Add Job Listing
                  </button>
                </div>
                
                {/* Filters */}
                <div className="bg-gray-50 p-4 rounded-lg mb-6 flex flex-col md:flex-row gap-4">
                  <div className="relative flex-grow">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search applications..."
                      value={applicationSearchTerm}
                      onChange={(e) => setApplicationSearchTerm(e.target.value)}
                      className="pl-10 input"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2 min-w-[200px]">
                    <Filter className="h-5 w-5 text-gray-400" />
                    <select
                      value={applicationStatusFilter}
                      onChange={(e) => setApplicationStatusFilter(e.target.value)}
                      className="input py-2"
                    >
                      <option value="all">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="interview">Interview</option>
                      <option value="hired">Hired</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                </div>
                
                {loading ? (
                  <div className="text-center py-8">Loading applications...</div>
                ) : filteredApplications.length > 0 ? (
                  <div className="space-y-4">
                    {filteredApplications.map(application => (
                      <div key={application.id} className="border rounded-lg overflow-hidden">
                        <div className="bg-gray-50 px-5 py-4 flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold text-lg">{application.jobTitle}</h4>
                            <div className="flex items-center text-sm text-gray-500 mt-1">
                              <Calendar className="h-4 w-4 mr-1" />
                              Applied on {application.appliedAt}
                            </div>
                          </div>
                          <div>
                            {application.status === 'pending' ? (
                              <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                                Pending Review
                              </span>
                            ) : application.status === 'interview' ? (
                              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                                Interview Scheduled
                              </span>
                            ) : application.status === 'hired' ? (
                              <span className="bg-primary-100 text-primary-800 px-2 py-1 rounded-full text-xs font-medium">
                                Hired
                              </span>
                            ) : application.status === 'rejected' ? (
                              <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                                Rejected
                              </span>
                            ) : (
                              <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">
                                {application.status}
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
                          <div>
                            <h5 className="font-medium text-sm text-gray-500 mb-2">Applicant Information</h5>
                            <div className="space-y-2">
                              <div className="flex items-center">
                                <span className="text-gray-600 font-medium w-24">Name:</span>
                                <span>{application.fullName}</span>
                              </div>
                              <div className="flex items-center">
                                <span className="text-gray-600 font-medium w-24">Email:</span>
                                <span>{application.email}</span>
                              </div>
                              <div className="flex items-center">
                                <span className="text-gray-600 font-medium w-24">Phone:</span>
                                <span>{application.phone}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <h5 className="font-medium text-sm text-gray-500 mb-2">Job Information</h5>
                            <div className="space-y-2">
                              <div className="flex items-center">
                                <span className="text-gray-600 font-medium w-24">Type:</span>
                                <span>{application.jobType}</span>
                              </div>
                              <div className="flex items-center">
                                <span className="text-gray-600 font-medium w-24">Location:</span>
                                <span>{application.jobLocation}</span>
                              </div>
                              <div className="flex items-center">
                                <span className="text-gray-600 font-medium w-24">Salary:</span>
                                <span>{application.jobSalary}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="px-5 py-4 border-t border-gray-200 flex justify-between">
                          <div className="flex space-x-2">
                            {application.status === 'pending' && (
                              <>
                                <button 
                                  className="btn btn-sm bg-green-500 text-white hover:bg-green-600 flex items-center"
                                  onClick={() => handleViewApplication(application)}
                                >
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Schedule Interview
                                </button>
                                <button 
                                  className="btn btn-sm bg-red-500 text-white hover:bg-red-600 flex items-center"
                                  onClick={() => handleViewApplication(application)}
                                >
                                  <X className="h-4 w-4 mr-1" />
                                  Reject
                                </button>
                              </>
                            )}
                            
                            {application.resumeUrl && (
                              <button 
                                className="btn btn-sm bg-blue-500 text-white hover:bg-blue-600 flex items-center"
                                onClick={() => handleDownloadResume(application.resumeUrl, application.fullName)}
                              >
                                <Download className="h-4 w-4 mr-1" />
                                Resume
                              </button>
                            )}
                          </div>
                          <button 
                            className="btn btn-sm btn-outline flex items-center"
                            onClick={() => handleViewApplication(application)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View Details
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-white rounded-lg shadow">
                    <Briefcase className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                    <p className="text-gray-700 font-medium mb-1">No applications found</p>
                    <p className="text-gray-500">
                      There are no job applications matching your filters.
                    </p>
                  </div>
                )}
              </div>
            )}
            
            {/* Real Estate */}
            {activeTab === 'real-estate' && (
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold">Manage Real Estate Listings</h3>
                  <button className="btn btn-primary flex items-center">
                    <PlusCircle className="h-5 w-5 mr-1" />
                    Add Property
                  </button>
                </div>
                <div className="text-center py-8 text-gray-500">
                  <HomeIcon className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                  <p>No property listings yet. Click "Add Property" to create your first listing.</p>
                </div>
              </div>
            )}
            
            {/* Vehicles */}
            {activeTab === 'vehicles' && (
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold">Manage Vehicle Listings</h3>
                  <button className="btn btn-primary flex items-center">
                    <PlusCircle className="h-5 w-5 mr-1" />
                    Add Vehicle
                  </button>
                </div>
                <div className="text-center py-8 text-gray-500">
                  <Car className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                  <p>No vehicle listings yet. Click "Add Vehicle" to create your first listing.</p>
                </div>
              </div>
            )}
            
            {/* Settings */}
            {activeTab === 'settings' && (
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-6">Admin Settings</h3>
                <form className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-4">Site Settings</h4>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="siteName" className="block text-sm font-medium text-gray-700">
                          Site Name
                        </label>
                        <input type="text" id="siteName" name="siteName" defaultValue="NoraTech Company" className="input mt-1" />
                      </div>
                      <div>
                        <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700">
                          Contact Email
                        </label>
                        <input type="email" id="contactEmail" name="contactEmail" defaultValue="info@noratech.com" className="input mt-1" />
                      </div>
                      <div>
                        <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                          Phone Number
                        </label>
                        <input type="tel" id="phoneNumber" name="phoneNumber" defaultValue="+250 788 699 190" className="input mt-1" />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-4">Admin User Settings</h4>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="adminEmail" className="block text-sm font-medium text-gray-700">
                          Admin Email
                        </label>
                        <input 
                          type="email" 
                          id="adminEmail" 
                          name="adminEmail" 
                          value={currentUser?.email || ''} 
                          disabled 
                          className="input mt-1 bg-gray-50" 
                        />
                      </div>
                      <div>
                        <label htmlFor="adminSecretCode" className="block text-sm font-medium text-gray-700">
                          Admin Secret Code
                        </label>
                        <input 
                          type="password" 
                          id="adminSecretCode" 
                          name="adminSecretCode" 
                          defaultValue="12345@" 
                          className="input mt-1" 
                        />
                        <p className="mt-1 text-sm text-gray-500">This code is required for new admin registrations.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <button type="submit" className="btn btn-primary">
                      Save Settings
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Application Detail Modal */}
      {showApplicationModal && selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full">
            <div className="bg-primary-700 text-white px-6 py-4 flex justify-between items-center rounded-t-lg">
              <h2 className="text-xl font-semibold">Application Details</h2>
              <button 
                onClick={() => {
                  setShowApplicationModal(false);
                  setSelectedApplication(null);
                }}
                className="text-white hover:text-gray-200"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-6 max-h-[80vh] overflow-y-auto">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-start">
                <AlertCircle className="h-6 w-6 text-blue-500 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium text-blue-800">Application Status</h3>
                  <p className="text-blue-600 text-sm">
                    This application is currently <span className="font-semibold">{selectedApplication.status || 'pending review'}</span>. 
                    Use the buttons below to update the status.
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Applicant Information</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-gray-500 text-sm">Full Name</p>
                      <p className="font-medium text-lg">{selectedApplication.fullName}</p>
                    </div>
                    
                    <div className="flex items-center">
                      <Mail className="h-5 w-5 text-gray-400 mr-2" />
                      <a href={`mailto:${selectedApplication.email}`} className="text-primary-600 hover:text-primary-700">
                        {selectedApplication.email}
                      </a>
                    </div>
                    
                    <div className="flex items-center">
                      <Phone className="h-5 w-5 text-gray-400 mr-2" />
                      <a href={`tel:${selectedApplication.phone}`} className="text-primary-600 hover:text-primary-700">
                        {selectedApplication.phone}
                      </a>
                    </div>
                    
                    <div>
                      <p className="text-gray-500 text-sm mb-1">Applied On</p>
                      <div className="flex items-center">
                        <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                        <span>{selectedApplication.appliedAt}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-4">Position Details</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-gray-500 text-sm">Job Title</p>
                      <p className="font-medium text-lg">{selectedApplication.jobTitle}</p>
                    </div>
                    
                    <div>
                      <p className="text-gray-500 text-sm">Job Type</p>
                      <p>{selectedApplication.jobType}</p>
                    </div>
                    
                    <div>
                      <p className="text-gray-500 text-sm">Location</p>
                      <p>{selectedApplication.jobLocation}</p>
                    </div>
                    
                    <div>
                      <p className="text-gray-500 text-sm">Salary Range</p>
                      <p>{selectedApplication.jobSalary}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Experience</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="whitespace-pre-line">{selectedApplication.experience}</p>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Cover Letter</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="whitespace-pre-line">{selectedApplication.coverLetter}</p>
                </div>
              </div>
              
              {selectedApplication.resumeUrl && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Resume</h3>
                  <div className="flex items-center bg-gray-50 p-4 rounded-lg">
                    <div className="p-2 bg-primary-50 rounded-lg mr-3">
                      <FileText className="h-6 w-6 text-primary-500" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Applicant Resume</p>
                      <a 
                        href={selectedApplication.resumeUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-primary-600 hover:text-primary-700 text-sm"
                      >
                        View Resume
                      </a>
                    </div>
                    <button 
                      onClick={() => handleDownloadResume(selectedApplication.resumeUrl, selectedApplication.fullName)}
                      className="btn btn-sm btn-outline flex items-center"
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </button>
                  </div>
                </div>
              )}
              
              <div className="border-t border-gray-200 pt-6 flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3">
                {selectedApplication.status !== 'rejected' && (
                  <button 
                    onClick={() => handleApplicationAction('rejected')}
                    disabled={applicationActionLoading}
                    className="btn bg-red-500 text-white hover:bg-red-600 flex items-center"
                  >
                    <X className="h-5 w-5 mr-1" />
                    Reject Application
                  </button>
                )}
                
                {selectedApplication.status !== 'interview' && selectedApplication.status !== 'hired' && (
                  <button 
                    onClick={() => handleApplicationAction('interview')}
                    disabled={applicationActionLoading}
                    className="btn bg-green-500 text-white hover:bg-green-600 flex items-center"
                  >
                    <Calendar className="h-5 w-5 mr-1" />
                    Schedule Interview
                  </button>
                )}
                
                {selectedApplication.status === 'interview' && (
                  <button 
                    onClick={() => handleApplicationAction('hired')}
                    disabled={applicationActionLoading}
                    className="btn bg-primary-600 text-white hover:bg-primary-700 flex items-center"
                  >
                    <CheckCircle className="h-5 w-5 mr-1" />
                    Hire Candidate
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Order Detail Modal */}
      {showOrderModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full">
            <div className="bg-primary-700 text-white px-6 py-4 flex justify-between items-center rounded-t-lg">
              <h2 className="text-xl font-semibold">Order #{selectedOrder.id.substring(0, 8)}</h2>
              <button 
                onClick={() => {
                  setShowOrderModal(false);
                  setSelectedOrder(null);
                }}
                className="text-white hover:text-gray-200"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-6 max-h-[80vh] overflow-y-auto">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-start">
                <AlertCircle className="h-6 w-6 text-blue-500 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium text-blue-800">Order Status</h3>
                  <p className="text-blue-600 text-sm">
                    This order is currently <span className="font-semibold">{selectedOrder.status || 'pending'}</span>. 
                    Use the buttons below to update the status.
                  </p>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4">Order Items</h3>
                <ul className="divide-y divide-gray-200 border rounded-lg overflow-hidden">
                  {selectedOrder.items?.map((item: any, index: number) => (
                    <li key={index} className="p-4 flex">
                      <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-lg overflow-hidden mr-4">
                        {item.image && (
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <div>
                            <h4 className="font-medium">{item.name}</h4>
                            <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                          </div>
                          <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Customer Information</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="space-y-3">
                      <div>
                        <p className="text-gray-500 text-sm">Customer ID</p>
                        <p className="font-medium">{selectedOrder.userId}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-sm">Order Date</p>
                        <p className="font-medium">{selectedOrder.createdAt}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <p className="text-gray-600">Subtotal</p>
                        <p className="font-medium">${selectedOrder.subtotal?.toFixed(2) || '0.00'}</p>
                      </div>
                      <div className="flex justify-between">
                        <p className="text-gray-600">Tax</p>
                        <p className="font-medium">${selectedOrder.tax?.toFixed(2) || '0.00'}</p>
                      </div>
                      <div className="flex justify-between">
                        <p className="text-gray-600">Shipping</p>
                        <p className="font-medium">
                          {selectedOrder.shipping === 0 ? 'Free' : `$${selectedOrder.shipping?.toFixed(2) || '0.00'}`}
                        </p>
                      </div>
                      <div className="border-t border-gray-200 mt-2 pt-2 flex justify-between">
                        <p className="font-semibold">Total</p>
                        <p className="font-bold">${selectedOrder.total?.toFixed(2) || '0.00'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-6 flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3">
                <button 
                  onClick={() => handleOrderAction('pending')}
                  disabled={orderActionLoading || selectedOrder.status === 'pending'}
                  className={`btn ${selectedOrder.status === 'pending' ? 'bg-yellow-500 text-white' : 'btn-outline'} flex items-center`}
                >
                  Mark as Pending
                </button>
                <button 
                  onClick={() => handleOrderAction('processing')}
                  disabled={orderActionLoading || selectedOrder.status === 'processing'}
                  className={`btn ${selectedOrder.status === 'processing' ? 'bg-blue-500 text-white' : 'btn-outline'} flex items-center`}
                >
                  Mark as Processing
                </button>
                <button 
                  onClick={() => handleOrderAction('delivered')}
                  disabled={orderActionLoading || selectedOrder.status === 'delivered'}
                  className={`btn ${selectedOrder.status === 'delivered' ? 'bg-green-500 text-white' : 'btn-outline'} flex items-center`}
                >
                  Mark as Delivered
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Add Job Modal */}
      {showAddJobModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
            <div className="bg-primary-700 text-white px-6 py-4 flex justify-between items-center rounded-t-lg">
              <h2 className="text-xl font-semibold">Add New Job Listing</h2>
              <button 
                onClick={() => setShowAddJobModal(false)}
                className="text-white hover:text-gray-200"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleAddJob} className="p-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700">
                    Job Title *
                  </label>
                  <input
                    type="text"
                    id="jobTitle"
                    value={newJob.title}
                    onChange={(e) => setNewJob({...newJob, title: e.target.value})}
                    className="input mt-1"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="jobLocation" className="block text-sm font-medium text-gray-700">
                    Location *
                  </label>
                  <input
                    type="text"
                    id="jobLocation"
                    value={newJob.location}
                    onChange={(e) => setNewJob({...newJob, location: e.target.value})}
                    className="input mt-1"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="jobType" className="block text-sm font-medium text-gray-700">
                      Job Type
                    </label>
                    <select
                      id="jobType"
                      value={newJob.type}
                      onChange={(e) => setNewJob({...newJob, type: e.target.value})}
                      className="input mt-1"
                    >
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contract</option>
                      <option value="Internship">Internship</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="jobCategory" className="block text-sm font-medium text-gray-700">
                      Category
                    </label>
                    <select
                      id="jobCategory"
                      value={newJob.category}
                      onChange={(e) => setNewJob({...newJob, category: e.target.value})}
                      className="input mt-1"
                    >
                      <option value="Technology">Technology</option>
                      <option value="Sales">Sales</option>
                      <option value="Automotive">Automotive</option>
                      <option value="Real Estate">Real Estate</option>
                      <option value="Logistics">Logistics</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="jobSalary" className="block text-sm font-medium text-gray-700">
                    Salary Range *
                  </label>
                  <input
                    type="text"
                    id="jobSalary"
                    value={newJob.salary}
                    onChange={(e) => setNewJob({...newJob, salary: e.target.value})}
                    className="input mt-1"
                    placeholder="e.g. $50,000 - $70,000"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="jobDescription" className="block text-sm font-medium text-gray-700">
                    Job Description *
                  </label>
                  <textarea
                    id="jobDescription"
                    rows={4}
                    value={newJob.description}
                    onChange={(e) => setNewJob({...newJob, description: e.target.value})}
                    className="input mt-1"
                    required
                  />
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddJobModal(false)}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  Add Job
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Add Product Modal */}
      {showAddProductModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
            <div className="bg-primary-700 text-white px-6 py-4 flex justify-between items-center rounded-t-lg">
              <h2 className="text-xl font-semibold">Add New Product</h2>
              <button 
                onClick={() => setShowAddProductModal(false)}
                className="text-white hover:text-gray-200"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleAddProduct} className="p-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="productName" className="block text-sm font-medium text-gray-700">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    id="productName"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                    className="input mt-1"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="productPrice" className="block text-sm font-medium text-gray-700">
                      Price ($) *
                    </label>
                    <input
                      type="number"
                      id="productPrice"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                      className="input mt-1"
                      min="0.01"
                      step="0.01"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="productStock" className="block text-sm font-medium text-gray-700">
                      Stock Quantity *
                    </label>
                    <input
                      type="number"
                      id="productStock"
                      value={newProduct.stock}
                      onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                      className="input mt-1"
                      min="0"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="productCategory" className="block text-sm font-medium text-gray-700">
                    Category
                  </label>
                  <select
                    id="productCategory"
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                    className="input mt-1"
                  >
                    <option value="Electronics">Electronics</option>
                    <option value="Building">Building Tools</option>
                    <option value="Vehicles">Vehicles</option>
                    <option value="Real Estate">Real Estate</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="productImage" className="block text-sm font-medium text-gray-700">
                    Image URL
                  </label>
                  <input
                    type="text"
                    id="productImage"
                    value={newProduct.image}
                    onChange={(e) => setNewProduct({...newProduct, image: e.target.value})}
                    className="input mt-1"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Provide a URL to an image for this product. Default image will be used if left empty.
                  </p>
                </div>
                
                <div>
                  <label htmlFor="productDescription" className="block text-sm font-medium text-gray-700">
                    Description *
                  </label>
                  <textarea
                    id="productDescription"
                    rows={3}
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                    className="input mt-1"
                    required
                  />
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddProductModal(false)}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  Add Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
 