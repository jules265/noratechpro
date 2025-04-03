import  { useState, FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Upload, ArrowLeft, Briefcase } from 'lucide-react';
import { collection, addDoc, serverTimestamp, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';
import { useAuth } from '../contexts/AuthContext';

export default function JobApplication() {
  const { id } = useParams<{ id: string }>();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState('');
  const [experience, setExperience] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  // Find the job based on ID
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
  
  const job = jobs.find(job => job.id === id);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0]);
    }
  };
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!fullName || !email || !phone || !experience || !coverLetter) {
      setError('Please fill in all required fields');
      return;
    }
    
    if (!currentUser) {
      setError('You must be logged in to apply');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      let resumeUrl = '';
      
      // Upload resume if provided
      if (resumeFile) {
        const fileRef = ref(storage, `resumes/${currentUser.uid}/${Date.now()}-${resumeFile.name}`);
        await uploadBytes(fileRef, resumeFile);
        resumeUrl = await getDownloadURL(fileRef);
      }
      
      // Create application data
      const applicationData = {
        jobId: id,
        jobTitle: job?.title,
        jobType: job?.type,
        jobLocation: job?.location,
        jobSalary: job?.salary,
        applicantId: currentUser.uid,
        applicantEmail: currentUser.email,
        fullName,
        email,
        phone,
        experience,
        coverLetter,
        resumeUrl,
        status: 'pending',
        appliedAt: serverTimestamp()
      };
      
      // Save application to Firestore
      const applicationRef = await addDoc(collection(db, 'jobApplications'), applicationData);
      
      // Update user profile to include this application
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        jobApplications: arrayUnion({
          id: applicationRef.id,
          jobId: id,
          jobTitle: job?.title,
          status: 'pending',
          appliedAt: new Date().toISOString()
        }),
        lastUpdated: serverTimestamp()
      });
      
      // Notify admin (for demo purposes - in a real app this would be handled by a cloud function)
      await addDoc(collection(db, 'adminNotifications'), {
        type: 'job_application',
        message: `New job application from ${fullName} for ${job?.title}`,
        applicationId: applicationRef.id,
        read: false,
        createdAt: serverTimestamp()
      });
      
      setSuccess(true);
      
      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
      
    } catch (err: any) {
      setError('Failed to submit application: ' + err.message);
    } finally {
      setLoading(false);
    }
  };
  
  if (!job) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center py-12">
          <Briefcase className="h-12 w-12 mx-auto text-gray-300 mb-3" />
          <h2 className="text-2xl font-bold mb-2">Job Not Found</h2>
          <p className="mb-4">The job listing you're looking for doesn't exist or has been removed.</p>
          <button 
            onClick={() => navigate('/jobs')} 
            className="btn btn-primary inline-flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Jobs
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <button 
        onClick={() => navigate('/jobs')} 
        className="flex items-center text-primary-600 hover:text-primary-700 mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to Jobs
      </button>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="bg-primary-700 text-white px-6 py-4">
          <h1 className="text-2xl font-bold">Apply for: {job.title}</h1>
          <p className="text-primary-100">{job.company} • {job.location}</p>
        </div>
        
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-6 pb-6 border-b border-gray-200">
            <div>
              <div className="text-primary-600 font-medium mb-1">{job.type}</div>
              <div className="text-lg font-medium mb-2">{job.salary}</div>
              <div className="text-sm text-gray-500">Posted {job.posted}</div>
            </div>
            <div className="mt-4 md:mt-0">
              <span className="inline-block bg-primary-100 text-primary-800 px-2 py-1 text-xs font-medium rounded-full">
                {job.category}
              </span>
            </div>
          </div>
          
          {success ? (
            <div className="text-center py-8">
              <div className="bg-green-100 text-green-800 rounded-lg p-4 mb-4">
                Your application has been submitted successfully!
              </div>
              <p className="mb-4">We'll review your application and contact you soon.</p>
              <p>Redirecting to your dashboard...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}
              
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="input"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email <span className="text-red-600">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number <span className="text-red-600">*</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="input"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">
                  Relevant Experience <span className="text-red-600">*</span>
                </label>
                <textarea
                  id="experience"
                  rows={4}
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  className="input"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="resume" className="block text-sm font-medium text-gray-700 mb-1">
                  Resume (PDF)
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="resume"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500"
                      >
                        <span>Upload a file</span>
                        <input id="resume" name="resume" type="file" className="sr-only" accept=".pdf" onChange={handleFileChange} />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PDF up to 5MB</p>
                  </div>
                </div>
                {resumeFile && (
                  <p className="mt-2 text-sm text-gray-600">Selected file: {resumeFile.name}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="coverLetter" className="block text-sm font-medium text-gray-700 mb-1">
                  Cover Letter <span className="text-red-600">*</span>
                </label>
                <textarea
                  id="coverLetter"
                  rows={6}
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  className="input"
                  required
                />
              </div>
              
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn btn-primary py-3 flex justify-center items-center"
                >
                  {loading ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
 