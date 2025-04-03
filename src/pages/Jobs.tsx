import  { useState } from 'react';
import { Search, MapPin, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Jobs() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  
  const jobs = [
    {
      id: '1',
      title: 'Software Engineer',
      company: 'NoraTech',
      location: 'Tech City, CA',
      type: 'Full-time',
      salary: '$80,000 - $120,000',
      posted: '2 days ago',
      category: 'Technology'
    },
    {
      id: '2',
      title: 'Sales Representative',
      company: 'NoraTech',
      location: 'Business Avenue, NY',
      type: 'Full-time',
      salary: '$60,000 - $90,000',
      posted: '1 week ago',
      category: 'Sales'
    },
    {
      id: '3',
      title: 'Automotive Technician',
      company: 'NoraTech',
      location: 'Vehicle Plaza, TX',
      type: 'Full-time',
      salary: '$50,000 - $70,000',
      posted: '3 days ago',
      category: 'Automotive'
    },
    {
      id: '4',
      title: 'Real Estate Agent',
      company: 'NoraTech',
      location: 'Property Lane, FL',
      type: 'Contract',
      salary: 'Commission-based',
      posted: '5 days ago',
      category: 'Real Estate'
    },
    {
      id: '5',
      title: 'Warehouse Associate',
      company: 'NoraTech',
      location: 'Logistics Center, IL',
      type: 'Full-time',
      salary: '$35,000 - $45,000',
      posted: '1 day ago',
      category: 'Logistics'
    }
  ];
  
  // Filter jobs by search term and category
  const filteredJobs = jobs.filter(job => {
    return (
      (job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
       job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
       job.location.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (categoryFilter === 'all' || job.category === categoryFilter)
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Job Opportunities</h1>
        <p className="text-gray-600">Find your next career opportunity with NoraTech</p>
      </div>
      
      {/* Search and Filters */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search jobs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 input"
            />
          </div>
          
          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="input"
            >
              <option value="all">All Categories</option>
              <option value="Technology">Technology</option>
              <option value="Sales">Sales</option>
              <option value="Automotive">Automotive</option>
              <option value="Real Estate">Real Estate</option>
              <option value="Logistics">Logistics</option>
            </select>
          </div>
          
          <button className="btn btn-primary">
            Search Jobs
          </button>
        </div>
      </div>
      
      {/* Job Listings */}
      <div className="space-y-6">
        {filteredJobs.length > 0 ? (
          filteredJobs.map(job => (
            <div key={job.id} className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-1">{job.title}</h2>
                  <div className="text-primary-600 font-medium mb-2">{job.company}</div>
                  <div className="flex flex-wrap gap-y-2 gap-x-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                      {job.location}
                    </div>
                    <div className="flex items-center">
                      <Briefcase className="h-4 w-4 mr-1 text-gray-400" />
                      {job.type}
                    </div>
                    <div>
                      Salary: {job.salary}
                    </div>
                  </div>
                </div>
                <div className="mt-4 md:mt-0 flex flex-col items-start md:items-end">
                  <span className="inline-block bg-primary-100 text-primary-800 px-2 py-1 text-xs font-medium rounded-full mb-2">
                    {job.category}
                  </span>
                  <span className="text-sm text-gray-500">Posted {job.posted}</span>
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <Link to={`/jobs/${job.id}/apply`} className="btn btn-primary">
                  Apply Now
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <Briefcase className="h-12 w-12 mx-auto text-gray-300 mb-3" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No jobs found</h3>
            <p className="text-gray-500">
              No job listings match your search criteria. Try adjusting your filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
 