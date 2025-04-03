import  { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Instagram, Facebook, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white pt-10 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">About NoraTech</h3>
            <p className="text-gray-400 text-sm">
              NoraTech Company offers a wide range of products including electronics, building tools, vehicles, and real estate. We also provide job opportunities.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link to="/products" className="hover:text-white">Products</Link></li>
              <li><Link to="/vehicles" className="hover:text-white">Vehicles</Link></li>
              <li><Link to="/real-estate" className="hover:text-white">Real Estate</Link></li>
              <li><Link to="/jobs" className="hover:text-white">Jobs</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li className="flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                info@noratech.com
              </li>
              <li className="flex items-center">
                <Phone className="h-4 w-4 mr-2" />
                +250 0788578289
              </li>
              <li className="flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                234 Business Avenue, Rubavu City
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="https://facebook.com/nzizajules" className="text-gray-400 hover:text-white">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Twitter className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Instagram className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} NoraTech Company. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
 
