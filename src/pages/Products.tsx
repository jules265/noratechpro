import  { useState, useEffect } from 'react';
import { Filter, Search } from 'lucide-react';
import ProductCard from '../components/ProductCard';

export default function Products() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    // In a real app, you'd fetch from Firestore
    // For demonstration, we'll use dummy data
    const dummyProducts = [
      {
        id: '1',
        name: 'MacBook Pro 16"',
        price: 2499,
        image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHw0fHxsYXB0b3AlMjBjb21wdXRlciUyMG1hY2Jvb2slMjBwcm9mZXNzaW9uYWwlMjBzZXR1cCUyMG1vZGVybnxlbnwwfHx8fDE3NDM2NjIzNDd8MA&ixlib=rb-4.0.3&fit=fillmax&h=600&w=800',
        category: 'Laptops',
        rating: 4.9,
        reviews: 214
      },
      {
        id: '2',
        name: 'Apple MacBook Air',
        price: 1299,
        image: 'https://images.unsplash.com/photo-1484788984921-03950022c9ef?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHwxfHxsYXB0b3AlMjBjb21wdXRlciUyMG1hY2Jvb2slMjBwcm9mZXNzaW9uYWwlMjBzZXR1cCUyMG1vZGVybnxlbnwwfHx8fDE3NDM2NjIzNDd8MA&ixlib=rb-4.0.3&fit=fillmax&h=600&w=800',
        category: 'Laptops',
        rating: 4.8,
        reviews: 156
      },
      {
        id: '3',
        name: 'Premium Laptop Workstation',
        price: 1599,
        image: 'https://images.unsplash.com/photo-1453928582365-b6ad33cbcf64?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHw5fHxsYXB0b3AlMjBjb21wdXRlciUyMG1hY2Jvb2slMjBwcm9mZXNzaW9uYWwlMjBzZXR1cCUyMG1vZGVybnxlbnwwfHx8fDE3NDM2NjE5NzN8MA&ixlib=rb-4.0.3&fit=fillmax&h=600&w=800',
        category: 'Laptops',
        rating: 4.6,
        reviews: 89
      },
      {
        id: '4',
        name: 'Student Laptop Bundle',
        price: 1199,
        image: 'https://images.unsplash.com/photo-1471897488648-5eae4ac6686b?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHw1fHxsYXB0b3AlMjBjb21wdXRlciUyMG1hY2Jvb2slMjBwcm9mZXNzaW9uYWwlMjBzZXR1cCUyMG1vZGVybnxlbnwwfHx8fDE3NDM2NjIzNDd8MA&ixlib=rb-4.0.3&fit=fillmax&h=600&w=800',
        category: 'Laptops',
        rating: 4.5,
        reviews: 72
      },
      {
        id: '5',
        name: 'Office Laptop Setup',
        price: 1399,
        image: 'https://images.unsplash.com/photo-1496180470114-6ef490f3ff22?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHw4fHxsYXB0b3AlMjBjb21wdXRlciUyMG1hY2Jvb2slMjBwcm9mZXNzaW9uYWwlMjBzZXR1cCUyMG1vZGVybnxlbnwwfHx8fDE3NDM2NjE5NzN8MA&ixlib=rb-4.0.3&fit=fillmax&h=600&w=800',
        category: 'Laptops',
        rating: 4.7,
        reviews: 103
      },
      {
        id: '6',
        name: 'AMD Ryzen 7 Processor',
        price: 329,
        image: 'https://images.unsplash.com/photo-1591799265444-d66432b91588?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBlbGVjdHJvbmljcyUyMHN0b3JlJTIwZGlzcGxheSUyMGl0ZW1zJTIwZ2FkZ2V0c3xlbnwwfHx8fDE3NDM1ODk4NzR8MA&ixlib=rb-4.0.3&fit=fillmax&h=600&w=800',
        category: 'Electronics',
        rating: 4.8,
        reviews: 124
      },
      {
        id: '7',
        name: 'LED Bar Graph Module',
        price: 49.99,
        image: 'https://images.unsplash.com/photo-1603694681044-e71c5993d6cd?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHwzfHxtb2Rlcm4lMjBlbGVjdHJvbmljcyUyMHN0b3JlJTIwZGlzcGxheSUyMGl0ZW1zJTIwZ2FkZ2V0c3xlbnwwfHx8fDE3NDM1ODk4NzR8MA&ixlib=rb-4.0.3&fit=fillmax&h=600&w=800',
        category: 'Electronics',
        rating: 4.2,
        reviews: 48
      },
      {
        id: '8',
        name: 'Pro Development Kit',
        price: 129.99,
        image: 'https://images.unsplash.com/photo-1609230430613-13cf4862a80f?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHw0fHxtb2Rlcm4lMjBlbGVjdHJvbmljcyUyMHN0b3JlJTIwZGlzcGxheSUyMGl0ZW1zJTIwZ2FkZ2V0c3xlbnwwfHx8fDE3NDM1ODk4NzR8MA&ixlib=rb-4.0.3&fit=fillmax&h=600&w=800',
        category: 'Electronics',
        rating: 4.5,
        reviews: 37
      },
      {
        id: '9',
        name: '4K Ultra HD Monitor',
        price: 499,
        image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHwyfHxtb2Rlcm4lMjBlbGVjdHJvbmljcyUyMHN0b3JlJTIwZGlzcGxheSUyMGl0ZW1zJTIwZ2FkZ2V0c3xlbnwwfHx8fDE3NDM1ODk4NzR8MA&ixlib=rb-4.0.3&fit=fillmax&h=600&w=800',
        category: 'Electronics',
        rating: 4.7,
        reviews: 92
      },
      {
        id: '10',
        name: 'Arduino Development Board',
        price: 39.99,
        image: 'https://images.unsplash.com/photo-1603732551658-5fabbafa84eb?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHw1fHxtb2Rlcm4lMjBlbGVjdHJvbmljcyUyMHN0b3JlJTIwZGlzcGxheSUyMGl0ZW1zJTIwZ2FkZ2V0c3xlbnwwfHx8fDE3NDM1ODk4NzR8MA&ixlib=rb-4.0.3&fit=fillmax&h=600&w=800',
        category: 'Electronics',
        rating: 4.6,
        reviews: 78
      },
      {
        id: '11',
        name: 'Power Drill Set',
        price: 149.99,
        image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
        category: 'Building',
        rating: 4.4,
        reviews: 53
      },
      {
        id: '12',
        name: 'Professional Welding Machine',
        price: 449,
        image: 'https://img.freepik.com/free-photo/carpenter-cutting-mdf-board-inside-workshop_23-2149451099.jpg?t=st=1743677921~exp=1743681521~hmac=ca51d33d52b63735588d8bef95e3431b0eddb7c73908fa478288e8d5f8ddd281&w=996',
        category: 'Building',
        rating: 4.8,
        reviews: 29
      },
      {
        id: '13',
        name: 'Heavy Duty Concrete Mixer',
        price: 899,
        image: 'https://img.freepik.com/free-photo/excavator-digging-ground-day-light_23-2149194766.jpg?t=st=1743677982~exp=1743681582~hmac=34db34d5b8416d8cb382f2843ec8e8a8d62e5bd7ae41715f3c69da2d6fe7804c&w=740',
        category: 'Building',
        rating: 4.9,
        reviews: 17
      },
      {
        id: '14',
        name: 'High-Power Laser Cutter',
        price: 2499,
        image: 'https://img.freepik.com/premium-photo/cnc-laser-cutting-metal-modern-industrial-technology-small-depth-field-warning-authentic-shooting-challenging-conditions_564276-3324.jpg?w=900',
        category: 'Building',
        rating: 4.7,
        reviews: 8
      },
      {
        id: '15',
        name: 'Smart Home Security System',
        price: 349.99,
        image: 'https://images.unsplash.com/photo-1558002038-1055907df827?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80',
        category: 'Electronics',
        rating: 4.5,
        reviews: 63
      },
      {
        id: '16',
        name: 'Wireless Gaming Mouse',
        price: 79.99,
        image: 'https://images.unsplash.com/photo-1605773527852-c546a8584ea3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80',
        category: 'Electronics',
        rating: 4.3,
        reviews: 106
      },
      {
        id: '17',
        name: 'Circular Saw Professional',
        price: 199.99,
        image: 'https://images.unsplash.com/photo-1449247526693-aa049327be54?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80',
        category: 'Building',
        rating: 4.6,
        reviews: 42
      },
      {
        id: '18',
        name: 'Professional Desktop Setup',
        price: 1799,
        image: 'https://images.unsplash.com/photo-1484981138541-3d074aa97716?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHwzfHxsYXB0b3AlMjBjb21wdXRlciUyMG1hY2Jvb2slMjBwcm9mZXNzaW9uYWwlMjBzZXR1cCUyMG1vZGVybnxlbnwwfHx8fDE3NDM2NjIzNDd8MA&ixlib=rb-4.0.3&fit=fillmax&h=600&w=800',
        category: 'Laptops',
        rating: 4.8,
        reviews: 85
      },
      {
        id: '19',
        name: 'Business Laptop Package',
        price: 1899,
        image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHwyfHxsYXB0b3AlMjBjb21wdXRlciUyMG1hY2Jvb2slMjBwcm9mZXNzaW9uYWwlMjBzZXR1cCUyMG1vZGVybnxlbnwwfHx8fDE3NDM2NjIzNDd8MA&ixlib=rb-4.0.3&fit=fillmax&h=600&w=800',
        category: 'Laptops',
        rating: 4.7,
        reviews: 63
      },
      {
        id: '20',
        name: 'Executive Workstation',
        price: 2099,
        image: 'https://images.unsplash.com/photo-1425421669292-0c3da3b8f529?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHw2fHxsYXB0b3AlMjBjb21wdXRlciUyMG1hY2Jvb2slMjBwcm9mZXNzaW9uYWwlMjBzZXR1cCUyMG1vZGVybnxlbnwwfHx8fDE3NDM2NjE5NzN8MA&ixlib=rb-4.0.3&fit=fillmax&h=600&w=800',
        category: 'Laptops',
        rating: 4.9,
        reviews: 47
      }
    ];
    
    setProducts(dummyProducts);
    setLoading(false);
  }, []);

  // Filter products by search term and category
  let filteredProducts = products.filter(product => {
    return (
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (categoryFilter === 'all' || product.category === categoryFilter)
    );
  });
  
  // Sort products
  if (sortBy === 'price-asc') {
    filteredProducts = [...filteredProducts].sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-desc') {
    filteredProducts = [...filteredProducts].sort((a, b) => b.price - a.price);
  } else if (sortBy === 'popular') {
    filteredProducts = [...filteredProducts].sort((a, b) => b.rating - a.rating);
  }
  // For 'newest', we'll use the original order as a proxy for newest

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Products</h1>
        <p className="text-gray-600">Browse our selection of high-quality products</p>
      </div>
      
      {/* Filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div className="w-full md:w-auto relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 input"
          />
        </div>
        
        <div className="w-full md:w-auto flex gap-4">
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="input py-2"
            >
              <option value="all">All Categories</option>
              <option value="Laptops">Laptops</option>
              <option value="Electronics">Electronics</option>
              <option value="Building">Building Tools</option>
            </select>
          </div>
          
          <select 
            className="input py-2"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">Newest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="popular">Most Popular</option>
          </select>
        </div>
      </div>
      
      {/* Products Grid */}
      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard 
              key={product.id}
              id={product.id}
              name={product.name}
              price={product.price}
              image={product.image}
              category={product.category}
              rating={product.rating}
              reviews={product.reviews}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          <p>No products found matching your search criteria.</p>
        </div>
      )}
    </div>
  );
}
 
