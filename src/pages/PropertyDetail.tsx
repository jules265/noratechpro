import  { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Home, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar, 
  Square, 
  Bed, 
  Bath, 
  Heart,
  Share
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../firebase';
import ShareModal from '../components/ShareModal';

export default function PropertyDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
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
    // For demonstration, we'll create a dummy property based on the id
    const propertiesData: Record<string, any> = {
      '1': {
        id: '1',
        title: 'Modern Apartment in City Center',
        type: 'Apartment',
        price: 299000,
        location: 'Downtown, Tech City',
        bedrooms: 2,
        bathrooms: 2,
        area: 1200,
        images: [
          'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
          'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1980&q=80',
          'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
        ],
        description: 'Beautiful and modern apartment located in the heart of Tech City. This luxurious apartment features 2 bedrooms, 2 bathrooms, and a spacious living area with high ceilings and large windows providing abundant natural light.',
        features: [
          'Modern kitchen with stainless steel appliances',
          'Hardwood floors throughout',
          'Central air conditioning',
          'In-unit washer and dryer',
          'Balcony with city views',
          'Secure building with doorman',
          'Fitness center access',
          'Underground parking'
        ],
        agent: {
          name: 'Sarah Johnson',
          phone: '0788699190',
          email: 'sarah.johnson@noratech.com'
        },
        yearBuilt: 2019,
        featured: true
      },
      '2': {
        id: '2',
        title: 'Suburban Family Home',
        type: 'House',
        price: 450000,
        location: 'Pleasant Valley, Tech City',
        bedrooms: 4,
        bathrooms: 3,
        area: 2400,
        images: [
          'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
          'https://images.unsplash.com/photo-1560184897-ae75f418493e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
          'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
        ],
        description: 'Spacious family home in a quiet suburban neighborhood. Perfect for families looking for space and comfort. The property features 4 bedrooms, 3 bathrooms, a large kitchen, and a beautiful backyard with a patio area.',
        features: [
          'Open concept kitchen and living area',
          'Master suite with walk-in closet',
          'Finished basement',
          'Two-car garage',
          'Large backyard with patio',
          'Energy-efficient windows and appliances',
          'Newly renovated bathrooms',
          'Close to schools and parks'
        ],
        agent: {
          name: 'Michael Rodriguez',
          phone: '0788699190',
          email: 'michael.rodriguez@noratech.com'
        },
        yearBuilt: 2012,
        featured: false
      },
      '4': {
        id: '4',
        title: 'Luxury Penthouse with Terrace',
        type: 'Apartment',
        price: 890000,
        location: 'Skyline District, Tech City',
        bedrooms: 3,
        bathrooms: 3,
        area: 2100,
        images: [
          'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
          'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
        ],
        description: 'Stunning luxury penthouse with panoramic city views and a private terrace. This high-end residence features 3 bedrooms, 3 bathrooms, and a spacious open-plan living area with floor-to-ceiling windows.',
        features: [
          'Private rooftop terrace with stunning views',
          'Gourmet kitchen with premium appliances',
          'Smart home technology throughout',
          'Marble bathrooms with heated floors',
          'Private elevator access',
          'Concierge service',
          'Access to building amenities including pool and gym',
          'Two parking spaces'
        ],
        agent: {
          name: 'Emma Chen',
          phone: '0788699190',
          email: 'emma.chen@noratech.com'
        },
        yearBuilt: 2021,
        featured: true
      }
    };
    
    setProperty(propertiesData[id as string] || null);
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
    // In a real app, you'd send this to Firestore
    console.log('Contact form submitted:', contactForm);
    setShowContactModal(false);
    alert('Your message has been sent to the agent. They will contact you shortly.');
  };

  const handlePurchaseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you'd process payment or send request to Firestore
    setShowPurchaseModal(false);
    
    // Redirect to WhatsApp
    if (!property) return;
    
    // Create message for WhatsApp
    let message = `Hello, I am interested in purchasing the property: ${property.title} (ID: ${property.id}) that is listed for $${property.price.toLocaleString()}.`;
    message += "\n\nPlease contact me with more information about the purchasing process.";
    
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
      alert('Please log in to save properties to your wishlist');
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
        
        // Check if property already in wishlist
        const existingItem = wishlistItems.find((item: any) => item.productId === id);
        
        if (!existingItem) {
          // Add to wishlist
          await updateDoc(wishlistRef, {
            items: arrayUnion({
              productId: id,
              name: property.title,
              price: property.price,
              image: property.images[0],
              type: 'property',
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
            name: property.title,
            price: property.price,
            image: property.images[0],
            type: 'property',
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

  if (!property) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center py-12">
          <Home className="h-12 w-12 mx-auto text-gray-300 mb-3" />
          <h2 className="text-2xl font-bold mb-4">Property Not Found</h2>
          <p className="mb-6">The property you're looking for doesn't exist or has been removed.</p>
          <Link to="/real-estate" className="btn btn-primary">
            Browse Other Properties
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-6">
        <Link to="/real-estate" className="text-primary-600 hover:text-primary-700 flex items-center">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Properties
        </Link>
      </div>
      
      {/* Property Title and Quick Info */}
      <div className="mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2">{property.title}</h1>
            <div className="flex items-center text-gray-600 mb-3">
              <MapPin className="h-5 w-5 mr-1" />
              {property.location}
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
            <Bed className="h-5 w-5 mr-1 text-primary-600" />
            {property.bedrooms} Bedrooms
          </div>
          <div className="flex items-center">
            <Bath className="h-5 w-5 mr-1 text-primary-600" />
            {property.bathrooms} Bathrooms
          </div>
          <div className="flex items-center">
            <Square className="h-5 w-5 mr-1 text-primary-600" />
            {property.area} sq ft
          </div>
          <div className="flex items-center">
            <Calendar className="h-5 w-5 mr-1 text-primary-600" />
            Built in {property.yearBuilt}
          </div>
        </div>
      </div>
      
      {/* Property Images Gallery */}
      <div className="mb-8">
        <div className="bg-gray-100 rounded-xl overflow-hidden mb-2">
          <img 
            src={property.images[selectedImage]} 
            alt={property.title} 
            className="w-full h-[500px] object-cover object-center"
          />
        </div>
        
        <div className="grid grid-cols-3 gap-2">
          {property.images.map((image: string, index: number) => (
            <div 
              key={index}
              className={`cursor-pointer rounded-lg overflow-hidden h-24 ${selectedImage === index ? 'ring-2 ring-primary-500' : ''}`}
              onClick={() => setSelectedImage(index)}
            >
              <img 
                src={image} 
                alt={`${property.title} view ${index + 1}`} 
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Property Details */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">About this property</h2>
            <p className="text-gray-700 mb-6">{property.description}</p>
            
            <h3 className="text-lg font-medium mb-3">Features and Amenities</h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4 mb-4">
              {property.features.map((feature: string, index: number) => (
                <li key={index} className="flex items-start">
                  <span className="text-primary-600 mr-2">•</span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Sidebar */}
        <div className="lg:col-span-1">
          {/* Price and Action Buttons */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="text-3xl font-bold text-gray-900 mb-6">${property.price.toLocaleString()}</div>
            
            <div className="space-y-3">
              <button 
                onClick={() => setShowPurchaseModal(true)}
                className="btn btn-primary w-full py-3"
              >
                Request to Purchase
              </button>
              <button 
                onClick={() => setShowContactModal(true)}
                className="btn btn-outline w-full py-3"
              >
                Contact Agent
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
                {property.agent.name.charAt(0)}
              </div>
              <div>
                <p className="font-medium">{property.agent.name}</p>
                <p className="text-sm text-gray-600">NoraTech Real Estate</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2 text-gray-400" />
                <a href={`tel:${property.agent.phone}`} className="hover:text-primary-600">
                  {property.agent.phone}
                </a>
              </div>
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2 text-gray-400" />
                <a href={`mailto:${property.agent.email}`} className="hover:text-primary-600">
                  {property.agent.email}
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
            <h2 className="text-xl font-semibold mb-4">Contact Agent</h2>
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
                    placeholder={`Hi ${property.agent.name}, I'm interested in this property and would like more information.`}
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
      
      {/* Purchase Modal */}
      {showPurchaseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-semibold mb-4">Request to Purchase</h2>
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <p className="font-medium">{property.title}</p>
              <p className="text-gray-700">{property.location}</p>
              <p className="text-lg font-bold text-primary-600 mt-2">${property.price.toLocaleString()}</p>
            </div>
            <form onSubmit={handlePurchaseSubmit}>
              <p className="text-sm text-gray-600 mb-4">
                By submitting this request, you're expressing interest in purchasing this property. 
                A real estate agent will contact you to discuss financing options, arrange viewings, 
                and guide you through the purchasing process.
              </p>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowPurchaseModal(false)}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  Confirm Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Share Modal */}
      {showShareModal && (
        <ShareModal
          title={property.title}
          url={window.location.href}
          onClose={() => setShowShareModal(false)}
        />
      )}
    </div>
  );
}
 