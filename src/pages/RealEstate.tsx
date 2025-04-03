import  { useState } from 'react';
import { Search, Home, MapPin, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import PropertyCard from '../components/PropertyCard';

export default function RealEstate() {
  const [searchTerm, setSearchTerm] = useState('');
  const [propertyType, setPropertyType] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  
  const properties = [
    {
      id: '1',
      title: 'Modern Apartment in City Center',
      type: 'Apartment',
      price: 299000,
      location: 'Downtown, Tech City',
      bedrooms: 2,
      bathrooms: 2,
      area: 1200,
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      featured: true
    },
    {
      id: '2',
      title: 'Suburban Family Home',
      type: 'House',
      price: 450000,
      location: 'Pleasant Valley, Tech City',
      bedrooms: 4,
      bathrooms: 3,
      area: 2400,
      image: 'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      featured: false
    },
    {
      id: '3',
      title: 'Rustic Farmhouse with Land',
      type: 'Farm',
      price: 750000,
      location: 'Countryside, 20 miles from Tech City',
      bedrooms: 5,
      bathrooms: 3,
      area: 3800,
      image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      featured: false
    },
    {
      id: '4',
      title: 'Luxury Penthouse with Terrace',
      type: 'Apartment',
      price: 890000,
      location: 'Skyline District, Tech City',
      bedrooms: 3,
      bathrooms: 3,
      area: 2100,
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      featured: true
    },
    {
      id: '5',
      title: 'Commercial Building Downtown',
      type: 'Commercial',
      price: 1200000,
      location: 'Business District, Tech City',
      bedrooms: 0,
      bathrooms: 4,
      area: 5000,
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      featured: false
    }
  ];
  
  // Filter properties based on search and filters
  const filteredProperties = properties.filter(property => {
    // Search term filter
    const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          property.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Property type filter
    const matchesType = propertyType === 'all' || property.type === propertyType;
    
    // Price range filter
    let matchesPrice = true;
    if (priceRange === 'under300k') {
      matchesPrice = property.price < 300000;
    } else if (priceRange === '300k-500k') {
      matchesPrice = property.price >= 300000 && property.price <= 500000;
    } else if (priceRange === '500k-1m') {
      matchesPrice = property.price > 500000 && property.price <= 1000000;
    } else if (priceRange === 'above1m') {
      matchesPrice = property.price > 1000000;
    }
    
    return matchesSearch && matchesType && matchesPrice;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Real Estate</h1>
        <p className="text-gray-600">Find your dream property with NoraTech</p>
      </div>
      
      {/* Search and Filters */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search properties..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 input"
            />
          </div>
          
          <div>
            <select
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              className="input"
            >
              <option value="all">All Property Types</option>
              <option value="Apartment">Apartment</option>
              <option value="House">House</option>
              <option value="Farm">Farm</option>
              <option value="Commercial">Commercial</option>
            </select>
          </div>
          
          <div>
            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className="input"
            >
              <option value="all">All Price Ranges</option>
              <option value="under300k">Under $300,000</option>
              <option value="300k-500k">$300,000 - $500,000</option>
              <option value="500k-1m">$500,000 - $1,000,000</option>
              <option value="above1m">Above $1,000,000</option>
            </select>
          </div>
          
          <button className="btn btn-primary">
            Search Properties
          </button>
        </div>
      </div>
      
      {/* Featured Properties */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold mb-6">Featured Properties</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {properties.filter(property => property.featured).map(property => (
            <PropertyCard
              key={property.id}
              id={property.id}
              title={property.title}
              price={property.price}
              location={property.location}
              bedrooms={property.bedrooms}
              bathrooms={property.bathrooms}
              area={property.area}
              image={property.image}
              featured={property.featured}
            />
          ))}
        </div>
      </div>
      
      {/* All Properties */}
      <div>
        <h2 className="text-2xl font-bold mb-6">All Properties</h2>
        
        {filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map(property => (
              <PropertyCard
                key={property.id}
                id={property.id}
                title={property.title}
                price={property.price}
                location={property.location}
                bedrooms={property.bedrooms}
                bathrooms={property.bathrooms}
                area={property.area}
                image={property.image}
                compact={true}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <Home className="h-12 w-12 mx-auto text-gray-300 mb-3" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No properties found</h3>
            <p className="text-gray-500">
              No properties match your search criteria. Try adjusting your filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
 