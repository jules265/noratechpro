import  { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Vehicles from './pages/Vehicles';
import VehicleDetail from './pages/VehicleDetail';
import Jobs from './pages/Jobs';
import JobApplication from './pages/JobApplication';
import RealEstate from './pages/RealEstate';
import PropertyDetail from './pages/PropertyDetail';
import Cart from './pages/Cart';
import NotFound from './pages/NotFound';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="products" element={<Products />} />
          <Route path="products/:id" element={<ProductDetail />} />
          <Route path="jobs" element={<Jobs />} />
          <Route path="jobs/:id/apply" element={<JobApplication />} />
          <Route path="real-estate" element={<RealEstate />} />
          <Route path="real-estate/:id" element={<PropertyDetail />} />
          <Route path="vehicles" element={<Vehicles />} />
          <Route path="vehicles/:id" element={<VehicleDetail />} />
          <Route path="cart" element={<Cart />} />
          
          <Route path="dashboard" element={<ProtectedRoute />}>
            <Route index element={<Dashboard />} />
          </Route>
          
          <Route path="admin" element={<AdminRoute />}>
            <Route index element={<AdminDashboard />} />
          </Route>
          
          <Route path="404" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
 