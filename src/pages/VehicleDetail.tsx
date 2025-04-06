import  { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Car, 
  MapPin, 
  Phone, 
  Calendar, 
  Info, 
  Droplet, 
  Settings, 
  Heart, 
  Share, 
  AlertCircle,
  Mail
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../firebase';
import ShareModal from '../components/ShareModal';

export default function VehicleDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [vehicle, setVehicle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: currentUser?.email || '',
    phone: '',
    message: ''
  });

  useEffect(() => {
    // In a real app, you'd fetch from Firestore based on the id
    // For demonstration, we'll create a dummy vehicle based on the id
    const vehiclesData: Record<string, any> = {
      '1': {
        id: '1',
        title: 'Luxury Sedan 2023',
        type: 'Sedan',
        price: 45999,
        location: 'Downtown, Tech City',
        year: 2023,
        mileage: 0,
        transmission: 'Automatic',
        fuelType: 'Hybrid',
        images: [
          'https://img.freepik.com/free-photo/white-offroader-jeep-parking_114579-4007.jpg?t=st=1743930797~exp=1743934397~hmac=db2b4e2eef3784b62892a72d47d79d94a15104255023848aafdae2e529d811d5&w=2000',
          'https://img.freepik.com/free-photo/view-3d-car_23-2150796980.jpg?t=st=1743931054~exp=1743934654~hmac=00282a6890fdf8c6372cb611e0f2f36d9d0a461bd4c1e746848327fc730e17f9&w=2000',
          'https://img.freepik.com/free-photo/sport-car-with-black-white-autotuning_114579-4075.jpg?t=st=1743931119~exp=1743934719~hmac=a099bd8784b3ce2866891af6af3eb87d64b6f080e4522f60f96f9387973ba85e&w=2000'
        ],
        description: 'Experience unparalleled luxury with this brand new 2023 Luxury Sedan. Featuring cutting-edge technology, premium materials, and exceptional performance, this vehicle represents the pinnacle of automotive engineering.',
        features: [
          'Premium leather interior',
          'Panoramic sunroof',
          'Advanced driver assistance systems',
          'Premium sound system with 15 speakers',
          'Heated and ventilated seats',
          'Wireless phone charging',
          '360-degree camera system',
          'Smart cruise control'
        ],
        specifications: {
          engine: '3.0L Turbo V6',
          power: '385 hp',
          acceleration: '0-60 mph in 4.5 seconds',
          topSpeed: '155 mph (limited)',
          fuelEfficiency: '26 mpg combined',
          warranty: '4 years/50,000 miles basic, 6 years/70,000 miles powertrain'
        },
        seller: {
          name: 'Luxury Auto Gallery',
          phone: '0788699190',
          email: 'sales@luxuryautogallery.com'
        },
        featured: true
      },
      '2': {
        id: '2',
        title: 'Family SUV 2022',
        type: 'SUV',
        price: 38500,
        location: 'Pleasant Valley, Tech City',
        year: 2022,
        mileage: 15000,
        transmission: 'Automatic',
        fuelType: 'Gasoline',
        images: [
          'https://images.unsplash.com/photo-1512100356356-de1b84283e18?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHwyfHxsdXh1cnklMjB2ZWhpY2xlcyUyMHNob3djYXNlJTIwc2hvd3Jvb218ZW58MHx8fHwxNzQzNTkzNDY5fDA&ixlib=rb-4.0.3&fit=fillmax&h=600&w=800',
          'https://images.unsplash.com/photo-1528154291023-a6525fabe5b4?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB2ZWhpY2xlcyUyMHNob3djYXNlJTIwc2hvd3Jvb218ZW58MHx8fHwxNzQzNTkzNDY5fDA&ixlib=rb-4.0.3&fit=fillmax&h=600&w=800'
        ],
        description: 'Perfect for families, this spacious and comfortable SUV offers ample room for passengers and cargo. With low mileage and excellent condition, this 2022 model provides reliability, safety, and modern features for your peace of mind.',
        features: [
          'Three-row seating for 7 passengers',
          'Adaptive cruise control',
          'Lane keeping assist',
          'Apple CarPlay and Android Auto',
          'Rear seat entertainment system',
          'Power liftgate',
          'Roof rails',
          'Multiple USB ports'
        ],
        specifications: {
          engine: '2.5L Inline-4',
          power: '250 hp',
          acceleration: '0-60 mph in 7.2 seconds',
          topSpeed: '130 mph',
          fuelEfficiency: '24 mpg combined',
          warranty: '3 years/36,000 miles remaining'
        },
        seller: {
          name: 'Family Auto Center',
          phone: '0788699190',
          email: 'info@familyautocenter.com'
        },
        featured: false
      },
      '3': {
        id: '3',
        title: 'Electric Compact Car',
        type: 'Compact',
        price: 32000,
        location: 'Eco District, Tech City',
        year: 2023,
        mileage: 5000,
        transmission: 'Automatic',
        fuelType: 'Electric',
        images: [
          'https://images.unsplash.com/photo-1549413863-8a3a0d7a7c7f?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHw5fHxlbGVjdHJpYyUyMHZlaGljbGVzJTIwY2FyfGVufDB8fHx8MTc0MzU5MzUzOHww&ixlib=rb-4.0.3&fit=fillmax&h=600&w=800',
          'https://images.unsplash.com/photo-1528154291023-a6525fabe5b4?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB2ZWhpY2xlcyUyMHNob3djYXNlJTIwc2hvd3Jvb218ZW58MHx8fHwxNzQzNTkzNDY5fDA&ixlib=rb-4.0.3&fit=fillmax&h=600&w=800'
        ],
        description: 'Join the electric revolution with this efficient and eco-friendly compact car. With a recent 2023 model and minimal usage, this vehicle offers cutting-edge electric technology, zero emissions, and significant savings on fuel costs.',
        features: [
          '250 miles range on full charge',
          'Fast charging capability (10% to 80% in 30 minutes)',
          'Regenerative braking system',
          'Digital cockpit display',
          'Advanced battery management system',
          'Smartphone app for remote monitoring',
          'Heat pump for efficient climate control',
          'Level 2 home charger included'
        ],
        specifications: {
          motor: 'Single electric motor',
          power: '201 hp',
          acceleration: '0-60 mph in 6.1 seconds',
          topSpeed: '115 mph',
          batteryCapacity: '64 kWh',
          warranty: '8 years/100,000 miles battery warranty'
        },
        seller: {
          name: 'Green Motors',
          phone: '0788699190',
          email: 'sales@greenmotors.com'
        },
        featured: true
      },
      '4': {
        id: '4',
        title: 'Heavy Duty Pickup Truck',
        type: 'Truck',
        price: 52000,
        location: 'Industrial Zone, Tech City',
        year: 2021,
        mileage: 25000,
        transmission: 'Automatic',
        fuelType: 'Diesel',
        images: [
          'https://images.unsplash.com/photo-1531303435785-3853ba035cda?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHw1fHxtb2Rlcm4lMjBsdXh1cnklMjBjYXJzJTIwZm9yJTIwc2FsZSUyMHNob3dyb29tfGVufDB8fHx8MTc0MzU5MjY1Nnww&ixlib=rb-4.0.3&fit=fillmax&h=600&w=800',
          'https://images.unsplash.com/photo-1528154291023-a6525fabe5b4?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB2ZWhpY2xlcyUyMHNob3djYXNlJTIwc2hvd3Jvb218ZW58MHx8fHwxNzQzNTkzNDY5fDA&ixlib=rb-4.0.3&fit=fillmax&h=600&w=800'
        ],
        description: 'Built for the toughest jobs, this powerful heavy duty pickup truck delivers exceptional towing capacity and payload capabilities. With a durable build and reliable performance, this 2021 model is ready to take on any challenge.',
        features: [
          '12,000 lbs towing capacity',
          '2,500 lbs payload capacity',
          'Four-wheel drive with low range',
          'Trailer brake controller',
          'Spray-in bedliner',
          'LED cargo box lighting',
          'Integrated trailer brake controller',
          'Heavy-duty suspension'
        ],
        specifications: {
          engine: '6.7L Turbo Diesel V8',
          power: '475 hp and 1050 lb-ft torque',
          acceleration: '0-60 mph in 7.0 seconds',
          topSpeed: '110 mph',
          fuelEfficiency: '18 mpg combined',
          warranty: '2 years/24,000 miles remaining'
        },
        seller: {
          name: 'WorkHorse Trucks',
          phone: '0788699190',
          email: 'sales@workhorsetrucks.com'
        },
        featured: false
      },
      '5': {
        id: '5',
        title: 'Sports Car 2023',
        type: 'Sports',
        price: 89000,
        location: 'Luxury District, Tech City',
        year: 2023,
        mileage: 1000,
        transmission: 'Manual',
        fuelType: 'Gasoline',
        images: [
          'https://images.unsplash.com/photo-1498994292978-4d6ff757c6dc?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHw1fHxsdXh1cnklMjB2ZWhpY2xlcyUyMHNob3djYXNlJTIwc2hvd3Jvb218ZW58MHx8fHwxNzQzNTkzNDY5fDA&ixlib=rb-4.0.3&fit=fillmax&h=600&w=800',
          'https://images.unsplash.com/photo-1528154291023-a6525fabe5b4?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB2ZWhpY2xlcyUyMHNob3djYXNlJTIwc2hvd3Jvb218ZW58MHx8fHwxNzQzNTkzNDY5fDA&ixlib=rb-4.0.3&fit=fillmax&h=600&w=800'
        ],
        description: 'Experience pure driving excitement with this high-performance sports car. With cutting-edge aerodynamics, precision handling, and breathtaking acceleration, this low-mileage 2023 model delivers an unforgettable driving experience.',
        features: [
          'Carbon fiber body components',
          'Active aerodynamics',
          'Adaptive suspension',
          'Racing bucket seats',
          'Limited-slip differential',
          'Launch control',
          'Track telemetry system',
          'Brembo performance brakes'
        ],
        specifications: {
          engine: '4.0L Twin-Turbo V8',
          power: '650 hp',
          acceleration: '0-60 mph in 3.0 seconds',
          topSpeed: '205 mph',
          fuelEfficiency: '17 mpg combined',
          warranty: 'Full factory warranty'
        },
        seller: {
          name: 'Performance Motors',
          phone: '0788699190',
          email: 'sales@performancemotors.com'
        },
        featured: true
      }
    };
    
    setVehicle(vehiclesData[id as string] || null);
    setLoading(false);
  }, [id]);

  const handleContactInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setContactForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Contact form submitted:', contactForm);
    setShowContactModal(false);
    alert('Your inquiry has been sent. The seller will contact you shortly.');
  };

  const handleWhatsAppInquiry = () => {
    if (!vehicle) return;
    
    // Create message for WhatsApp
    let message = `Hello, I am interested in the ${vehicle.year} ${vehicle.title} (ID: ${vehicle.id}) that you have for sale at $${vehicle.price.toLocaleString()}.`;
    message += "\n\nPlease contact me with more information.";
    
    if (currentUser?.email) {
      message += `\n\nMy email: ${currentUser.email}`;
    }
    
    // Encode message for URL
    const encodedMessage = encodeURIComponent(message);
    
    // Open WhatsApp with pre-filled message
    window.open(`https://wa.me/250788699190?text=${encodedMessage}`, '_blank');
  };

  const handleAddToWishlist = async () => {
    if (!currentUser) {
      alert('Please log in to save vehicles to your wishlist');
      return;
    }

    try {
      setSaving(true);
      
      // Check if wishlist exists
      const wishlistRef = doc(db, 'wishlists', currentUser.uid);
      const wishlistDoc = await getDoc(wishlistRef);
      
      if (wishlistDoc.exists()) {
        // Update existing wishlist
        const wishlistData = wishlistDoc.data();
        const wishlistItems = wishlistData.items || [];
        
        // Check if vehicle already in wishlist
        const existingItem = wishlistItems.find((item: any) => item.productId === id);
        
        if (!existingItem) {
          // Add to wishlist
          await updateDoc(wishlistRef, {
            items: arrayUnion({
              productId: id,
              name: vehicle.title,
              price: vehicle.price,
              image: vehicle.images[0],
              type: 'vehicle',
              addedAt: new Date()
            }),
            updatedAt: new Date()
          });
        }
      } else {
        // Create new wishlist
        await setDoc(wishlistRef, {
          userId: currentUser.uid,
          items: [{
            productId: id,
            name: vehicle.title,
            price: vehicle.price,
            image: vehicle.images[0],
            type: 'vehicle',
            addedAt: new Date()
          }],
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
      
      // Show success feedback
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      alert('Failed to add to wishlist. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-96">Loading...</div>;
  }

  if (!vehicle) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center py-12">
          <Car className="h-12 w-12 mx-auto text-gray-300 mb-3" />
          <h2 className="text-2xl font-bold mb-4">Vehicle Not Found</h2>
          <p className="mb-6">The vehicle you're looking for doesn't exist or has been removed.</p>
          <Link to="/vehicles" className="btn btn-primary">
            Browse Other Vehicles
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-6">
        <Link to="/vehicles" className="text-primary-600 hover:text-primary-700 flex items-center">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Vehicles
        </Link>
      </div>
      
      {/* Vehicle Title and Quick Info */}
      <div className="mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2">{vehicle.title}</h1>
            <div className="flex items-center text-gray-600 mb-3">
              <MapPin className="h-5 w-5 mr-1" />
              {vehicle.location}
            </div>
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={handleAddToWishlist}
              disabled={saving}
              className={`p-2 rounded-full ${saved ? 'bg-pink-100 text-pink-600' : 'bg-gray-100 hover:bg-pink-100 text-gray-600 hover:text-pink-600'}`}
              title="Save to wishlist"
            >
              <Heart className="h-5 w-5" />
            </button>
            <button 
              onClick={() => setShowShareModal(true)}
              className="p-2 rounded-full bg-gray-100 hover:bg-primary-100 text-gray-600 hover:text-primary-600"
              title="Share"
            >
              <Share className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="flex flex-wrap gap-4 font-medium">
          <div className="flex items-center">
            <Calendar className="h-5 w-5 mr-1 text-primary-600" />
            {vehicle.year}
          </div>
          <div className="flex items-center">
            <Info className="h-5 w-5 mr-1 text-primary-600" />
            {vehicle.mileage.toLocaleString()} miles
          </div>
          <div className="flex items-center">
            <Settings className="h-5 w-5 mr-1 text-primary-600" />
            {vehicle.transmission}
          </div>
          <div className="flex items-center">
            <Droplet className="h-5 w-5 mr-1 text-primary-600" />
            {vehicle.fuelType}
          </div>
        </div>
      </div>
      
      {/* Vehicle Images Gallery */}
      <div className="mb-8">
        <div className="bg-gray-100 rounded-xl overflow-hidden mb-2">
          <img 
            src={vehicle.images[selectedImage]} 
            alt={vehicle.title} 
            className="w-full h-[500px] object-cover object-center"
          />
        </div>
        
        <div className="grid grid-cols-3 gap-2">
          {vehicle.images.map((image: string, index: number) => (
            <div 
              key={index}
              className={`cursor-pointer rounded-lg overflow-hidden h-24 ${selectedImage === index ? 'ring-2 ring-primary-500' : ''}`}
              onClick={() => setSelectedImage(index)}
            >
              <img 
                src={image} 
                alt={`${vehicle.title} view ${index + 1}`} 
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Vehicle Details */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">About this vehicle</h2>
            <p className="text-gray-700 mb-6">{vehicle.description}</p>
            
            <h3 className="text-lg font-medium mb-3">Features and Specifications</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
              <div>
                <h4 className="font-medium text-primary-700 mb-2">Features</h4>
                <ul className="space-y-2">
                  {vehicle.features.map((feature: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <span className="text-primary-600 mr-2">•</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-primary-700 mb-2">Specifications</h4>
                <div className="space-y-2">
                  {Object.entries(vehicle.specifications).map(([key, value]: [string, any], index: number) => (
                    <div key={index} className="grid grid-cols-2">
                      <div className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                      <div>{value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Notice */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start">
              <AlertCircle className="h-5 w-5 text-yellow-500 mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-800">Viewing and Test Drive</h4>
                <p className="text-yellow-700 text-sm">
                  We recommend inspecting the vehicle and taking a test drive before making a purchase decision. 
                  Contact the seller to schedule a viewing at a convenient time.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Sidebar */}
        <div className="lg:col-span-1">
          {/* Price and Action Buttons */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="text-3xl font-bold text-gray-900 mb-6">${vehicle.price.toLocaleString()}</div>
            
            <div className="space-y-3">
              <button 
                onClick={() => setShowWhatsAppModal(true)}
                className="btn bg-green-600 hover:bg-green-700 text-white w-full py-3 flex justify-center items-center"
              >
                <Phone className="h-5 w-5 mr-2" />
                Contact via WhatsApp
              </button>
              <button 
                onClick={() => setShowContactModal(true)}
                className="btn btn-outline w-full py-3"
              >
                Contact Seller
              </button>
            </div>
            
            <div className="flex mt-4 justify-center space-x-4 pt-4 border-t border-gray-100">
              <button 
                onClick={handleAddToWishlist}
                disabled={saving}
                className={`flex items-center ${saved ? 'text-pink-600' : 'text-gray-600 hover:text-pink-600'}`}
              >
                <Heart className="h-5 w-5 mr-1" />
                Save
              </button>
              <button 
                onClick={() => setShowShareModal(true)}
                className="flex items-center text-gray-600 hover:text-primary-600"
              >
                <Share className="h-5 w-5 mr-1" />
                Share
              </button>
            </div>
          </div>
          
          {/* Agent Info */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Listed by</h3>
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold mr-3">
                {vehicle.seller.name.charAt(0)}
              </div>
              <div>
                <p className="font-medium">{vehicle.seller.name}</p>
                <p className="text-sm text-gray-600">NoraTech Auto Sales</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2 text-gray-400" />
                <a href={`tel:${vehicle.seller.phone}`} className="hover:text-primary-600">
                  {vehicle.seller.phone}
                </a>
              </div>
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2 text-gray-400" />
                <a href={`mailto:${vehicle.seller.email}`} className="hover:text-primary-600">
                  {vehicle.seller.email}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-semibold mb-4">Contact Seller</h2>
            <form onSubmit={handleContactSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={contactForm.name}
                    onChange={handleContactInputChange}
                    className="input"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Your Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={contactForm.email}
                    onChange={handleContactInputChange}
                    className="input"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Your Phone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={contactForm.phone}
                    onChange={handleContactInputChange}
                    className="input"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={contactForm.message}
                    onChange={handleContactInputChange}
                    className="input"
                    placeholder={`Hi, I'm interested in the ${vehicle.year} ${vehicle.title} and would like more information.`}
                    required
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowContactModal(false)}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* WhatsApp Modal */}
      {showWhatsAppModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-semibold mb-4">Contact via WhatsApp</h2>
            <p className="mb-4">
              You'll be redirected to WhatsApp to chat directly with the seller about this {vehicle.year} {vehicle.title}.
            </p>
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Vehicle:</span>
                <span className="font-medium">{vehicle.year} {vehicle.title}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Price:</span>
                <span className="font-medium">${vehicle.price.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Seller:</span>
                <span className="font-medium">{vehicle.seller.name}</span>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowWhatsAppModal(false)}
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleWhatsAppInquiry();
                  setShowWhatsAppModal(false);
                }}
                className="btn bg-green-600 hover:bg-green-700 text-white flex items-center"
              >
                <Phone className="h-4 w-4 mr-2" />
                Continue to WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Share Modal */}
      {showShareModal && (
        <ShareModal
          title={vehicle.title}
          url={window.location.href}
          onClose={() => setShowShareModal(false)}
        />
      )}
    </div>
  );
}
 
