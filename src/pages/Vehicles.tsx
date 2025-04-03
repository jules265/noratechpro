import  { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Car, MapPin, Filter, ArrowRight, Calendar, Settings, Droplet } from 'lucide-react';
import VehicleCard from '../components/VehicleCard';

export default function Vehicles() {
  const [searchTerm, setSearchTerm] = useState('');
  const [vehicleType, setVehicleType] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  
  const vehicles = [
    {
      id: '1',
      title: 'Luxury Sedan 2023',
      type: 'Sedan',
      price: 45999,
      location: 'Downtown, Tech City',
      year: 2023,
      mileage: 0,
      transmission: 'Automatic',
      fuelType: 'Hybrid',
      image: 'https://images.unsplash.com/photo-1528154291023-a6525fabe5b4?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB2ZWhpY2xlcyUyMHNob3djYXNlJTIwc2hvd3Jvb218ZW58MHx8fHwxNzQzNTkzNDY5fDA&ixlib=rb-4.0.3&fit=fillmax&h=600&w=800',
      featured: true
    },
    {
      id: '2',
      title: 'Family SUV 2022',
      type: 'SUV',
      price: 38500,
      location: 'Pleasant Valley, Tech City',
      year: 2022,
      mileage: 15000,
      transmission: 'Automatic',
      fuelType: 'Gasoline',
      image: 'https://images.unsplash.com/photo-1512100356356-de1b84283e18?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHwyfHxsdXh1cnklMjB2ZWhpY2xlcyUyMHNob3djYXNlJTIwc2hvd3Jvb218ZW58MHx8fHwxNzQzNTkzNDY5fDA&ixlib=rb-4.0.3&fit=fillmax&h=600&w=800',
      featured: false
    },
    {
      id: '3',
      title: 'Electric Compact Car',
      type: 'Compact',
      price: 32000,
      location: 'Eco District, Tech City',
      year: 2023,
      mileage: 5000,
      transmission: 'Automatic',
      fuelType: 'Electric',
      image: 'https://images.unsplash.com/photo-1549413863-8a3a0d7a7c7f?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHw5fHxlbGVjdHJpYyUyMHZlaGljbGVzJTIwY2FyfGVufDB8fHx8MTc0MzU5MzUzOHww&ixlib=rb-4.0.3&fit=fillmax&h=600&w=800',
      featured: true
    },
    {
      id: '4',
      title: 'Heavy Duty Pickup Truck',
      type: 'Truck',
      price: 52000,
      location: 'Industrial Zone, Tech City',
      year: 2021,
      mileage: 25000,
      transmission: 'Automatic',
      fuelType: 'Diesel',
      image: 'https://images.unsplash.com/photo-1531303435785-3853ba035cda?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHw1fHxtb2Rlcm4lMjBsdXh1cnklMjBjYXJzJTIwZm9yJTIwc2FsZSUyMHNob3dyb29tfGVufDB8fHx8MTc0MzU5MjY1Nnww&ixlib=rb-4.0.3&fit=fillmax&h=600&w=800',
      featured: false
    },
    {
      id: '5',
      title: 'Sports Car 2023',
      type: 'Sports',
      price: 89000,
      location: 'Luxury District, Tech City',
      year: 2023,
      mileage: 1000,
      transmission: 'Manual',
      fuelType: 'Gasoline',
      image: 'https://images.unsplash.com/photo-1498994292978-4d6ff757c6dc?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHw1fHxsdXh1cnklMjB2ZWhpY2xlcyUyMHNob3djYXNlJTIwc2hvd3Jvb218ZW58MHx8fHwxNzQzNTkzNDY5fDA&ixlib=rb-4.0.3&fit=fillmax&h=600&w=800',
      featured: false
    }
  ];
  
  // Filter vehicles based on search and filters
  const filteredVehicles = vehicles.filter(vehicle => {
    // Search term filter
    const matchesSearch = vehicle.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          vehicle.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Vehicle type filter
    const matchesType = vehicleType === 'all' || vehicle.type === vehicleType;
    
    // Price range filter
    let matchesPrice = true;
    if (priceRange === 'under30k') {
      matchesPrice = vehicle.price < 30000;
    } else if (priceRange === '30k-50k') {
      matchesPrice = vehicle.price >= 30000 && vehicle.price <= 50000;
    } else if (priceRange === '50k-80k') {
      matchesPrice = vehicle.price > 50000 && vehicle.price <= 80000;
    } else if (priceRange === 'above80k') {
      matchesPrice = vehicle.price > 80000;
    }
    
    return matchesSearch && matchesType && matchesPrice;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Vehicles</h1>
        <p className="text-gray-600">Find your perfect ride with NoraTech</p>
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
              placeholder="Search vehicles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 input"
            />
          </div>
          
          <div>
            <select
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value)}
              className="input"
            >
              <option value="all">All Vehicle Types</option>
              <option value="Sedan">Sedan</option>
              <option value="SUV">SUV</option>
              <option value="Compact">Compact</option>
              <option value="Truck">Truck</option>
              <option value="Sports">Sports</option>
            </select>
          </div>
          
          <div>
            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className="input"
            >
              <option value="all">All Price Ranges</option>
              <option value="under30k">Under $30,000</option>
              <option value="30k-50k">$30,000 - $50,000</option>
              <option value="50k-80k">$50,000 - $80,000</option>
              <option value="above80k">Above $80,000</option>
            </select>
          </div>
          
          <button className="btn btn-primary">
            Search Vehicles
          </button>
        </div>
      </div>
      
      {/* Featured Vehicles */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold mb-6">Featured Vehicles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {vehicles.filter(vehicle => vehicle.featured).map(vehicle => (
            <VehicleCard
              key={vehicle.id}
              id={vehicle.id}
              title={vehicle.title}
              price={vehicle.price}
              location={vehicle.location}
              year={vehicle.year}
              mileage={vehicle.mileage}
              transmission={vehicle.transmission}
              fuelType={vehicle.fuelType}
              image={vehicle.image}
              featured={vehicle.featured}
            />
          ))}
        </div>
      </div>
      
      {/* All Vehicles */}
      <div>
        <h2 className="text-2xl font-bold mb-6">All Vehicles</h2>
        
        {filteredVehicles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVehicles.map(vehicle => (
              <VehicleCard
                key={vehicle.id}
                id={vehicle.id}
                title={vehicle.title}
                price={vehicle.price}
                location={vehicle.location}
                year={vehicle.year}
                mileage={vehicle.mileage}
                transmission={vehicle.transmission}
                fuelType={vehicle.fuelType}
                image={vehicle.image}
                compact={true}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <Car className="h-12 w-12 mx-auto text-gray-300 mb-3" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No vehicles found</h3>
            <p className="text-gray-500">
              No vehicles match your search criteria. Try adjusting your filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
 