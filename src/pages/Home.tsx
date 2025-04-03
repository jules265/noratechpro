import  { Link } from 'react-router-dom';
import { ChevronRight, Box, Car, Home as HomeIcon, Briefcase, Laptop } from 'lucide-react';

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900/70 to-primary-800/50 z-10"></div>
        <img 
          src="https://images.unsplash.com/photo-1611770632493-ae6eaac29b0a?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBlbGVjdHJvbmljcyUyMHN0b3JlJTIwZGlzcGxheXxlbnwwfHx8fDE3NDM1ODkzMDJ8MA&ixlib=rb-4.0.3" 
          alt="NoraTech Company" 
          className="w-full h-[500px] object-cover"
        />
        <div className="absolute inset-0 flex items-center z-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-lg">
              <h1 className="text-4xl font-bold text-white sm:text-5xl">
                Your One-Stop Marketplace
              </h1>
              <p className="mt-4 text-xl text-white">
                Electronics, Vehicles, Real Estate, and Jobs - All in One Place
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link to="/products" className="btn btn-primary">
                  Browse Products
                </Link>
                <Link to="/register" className="btn bg-white text-primary-600 hover:bg-gray-100">
                  Join Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Explore Our Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link to="/products" className="card p-6 text-center hover:border-primary-500 hover:border-2 transition-all">
              <div className="mx-auto w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                <Laptop className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Laptops & Electronics</h3>
              <p className="text-gray-600 mb-4">Latest gadgets and electronic devices</p>
              <span className="text-primary-600 flex items-center justify-center mt-auto">
                Explore <ChevronRight className="h-4 w-4 ml-1" />
              </span>
            </Link>

            <Link to="/vehicles" className="card p-6 text-center hover:border-primary-500 hover:border-2 transition-all">
              <div className="mx-auto w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                <Car className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Vehicles</h3>
              <p className="text-gray-600 mb-4">Cars, trucks, and all types of vehicles</p>
              <span className="text-primary-600 flex items-center justify-center mt-auto">
                Explore <ChevronRight className="h-4 w-4 ml-1" />
              </span>
            </Link>

            <Link to="/real-estate" className="card p-6 text-center hover:border-primary-500 hover:border-2 transition-all">
              <div className="mx-auto w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                <HomeIcon className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Real Estate</h3>
              <p className="text-gray-600 mb-4">Houses, apartments, lands and farms</p>
              <span className="text-primary-600 flex items-center justify-center mt-auto">
                Explore <ChevronRight className="h-4 w-4 ml-1" />
              </span>
            </Link>

            <Link to="/jobs" className="card p-6 text-center hover:border-primary-500 hover:border-2 transition-all">
              <div className="mx-auto w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                <Briefcase className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Jobs</h3>
              <p className="text-gray-600 mb-4">Career opportunities across industries</p>
              <span className="text-primary-600 flex items-center justify-center mt-auto">
                Explore <ChevronRight className="h-4 w-4 ml-1" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Featured Products</h2>
            <Link to="/products" className="text-primary-600 hover:text-primary-700 font-medium flex items-center">
              View All <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="card group">
              <div className="relative overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHw0fHxsYXB0b3AlMjBjb21wdXRlciUyMG1hY2Jvb2slMjBwcm9mZXNzaW9uYWwlMjBzZXR1cCUyMG1vZGVybnxlbnwwfHx8fDE3NDM2NjIzNDd8MA&ixlib=rb-4.0.3&fit=fillmax&h=600&w=800" 
                  alt="MacBook Pro" 
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 right-2 bg-primary-600 text-white text-xs px-2 py-1 rounded-full">
                  Laptops
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg">MacBook Pro 16"</h3>
                <p className="text-gray-500 text-sm mb-2">$2499</p>
                <div className="flex justify-between items-center mt-3">
                  <Link to="/products/1" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                    View Details
                  </Link>
                  <button className="p-2 bg-gray-100 rounded-full hover:bg-primary-100 transition-colors">
                    <Box className="h-5 w-5 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>

            <div className="card group">
              <div className="relative overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1484981138541-3d074aa97716?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHwzfHxsYXB0b3AlMjBjb21wdXRlciUyMG1hY2Jvb2slMjBwcm9mZXNzaW9uYWwlMjBzZXR1cCUyMG1vZGVybnxlbnwwfHx8fDE3NDM2NjIzNDd8MA&ixlib=rb-4.0.3&fit=fillmax&h=600&w=800" 
                  alt="Professional Desktop Setup" 
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 right-2 bg-primary-600 text-white text-xs px-2 py-1 rounded-full">
                  Laptops
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg">Professional Desktop Setup</h3>
                <p className="text-gray-500 text-sm mb-2">$1799</p>
                <div className="flex justify-between items-center mt-3">
                  <Link to="/products/18" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                    View Details
                  </Link>
                  <button className="p-2 bg-gray-100 rounded-full hover:bg-primary-100 transition-colors">
                    <Box className="h-5 w-5 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>

            <div className="card group">
              <div className="relative overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHwyfHxsYXB0b3AlMjBjb21wdXRlciUyMG1hY2Jvb2slMjBwcm9mZXNzaW9uYWwlMjBzZXR1cCUyMG1vZGVybnxlbnwwfHx8fDE3NDM2NjIzNDd8MA&ixlib=rb-4.0.3&fit=fillmax&h=600&w=800"
                  alt="Business Laptop Package" 
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 right-2 bg-primary-600 text-white text-xs px-2 py-1 rounded-full">
                  Laptops
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg">Business Laptop Package</h3>
                <p className="text-gray-500 text-sm mb-2">$1899</p>
                <div className="flex justify-between items-center mt-3">
                  <Link to="/products/19" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                    View Details
                  </Link>
                  <button className="p-2 bg-gray-100 rounded-full hover:bg-primary-100 transition-colors">
                    <Box className="h-5 w-5 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Join NoraTech Today</h2>
          <p className="text-xl max-w-2xl mx-auto mb-8">
            Create an account to buy and sell products, find your dream home, or discover new career opportunities.
          </p>
          <div className="flex justify-center space-x-4">
            <Link to="/register" className="btn bg-white text-primary-800 hover:bg-gray-100">
              Register Now
            </Link>
            <Link to="/login" className="btn border border-white text-white hover:bg-primary-700">
              Log In
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
 