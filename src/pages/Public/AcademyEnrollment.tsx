import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { GraduationCap, Calendar, CheckCircle2 } from 'lucide-react';
import api from '../../api/axios';
import { toast } from 'react-hot-toast';

interface Course {
  id: string;
  name: string;
  durationWeeks: number;
  fee: number;
}

export default function AcademyEnrollment() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    // Fetch available courses
    api.get('/public/courses')
      .then(res => setCourses(res.data.data || []))
      .catch(err => {
        console.error(err);
        toast.error("Failed to load courses");
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourseId) return toast.error("Please select a course");

    setIsSubmitting(true);
    try {
      await api.post('/public/enroll', {
        ...formData,
        courseId: selectedCourseId,
      });
      setIsSuccess(true);
    } catch (error) {
      toast.error("Enrollment failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <Helmet><title>Enrollment Received | BeautyStudio Academy</title></Helmet>
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center border border-gray-200 dark:border-gray-700">
          <div className="w-20 h-20 bg-brand-100 dark:bg-brand-900/30 text-brand-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Application Received!</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Thank you, {formData.firstName}. We have received your application for the academy. Our admissions team will review it and contact you shortly at {formData.phone}.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="w-full py-3 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-xl transition-colors"
          >
            Submit Another Application
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <Helmet><title>Academy Enrollment | BeautyStudio</title></Helmet>
      
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-brand-500 text-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <GraduationCap className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-3">BeautyStudio Academy</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">Enroll in our professional masterclasses</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">1. Select Your Course</h2>
              <div className="grid gap-4">
                {courses.map(course => (
                  <label 
                    key={course.id}
                    className={\`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all \${selectedCourseId === course.id ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20' : 'border-gray-200 dark:border-gray-700 hover:border-brand-300'}\`}
                  >
                    <div className="flex items-center gap-4">
                      <input 
                        type="radio" 
                        name="course" 
                        value={course.id}
                        checked={selectedCourseId === course.id}
                        onChange={(e) => setSelectedCourseId(e.target.value)}
                        className="w-5 h-5 text-brand-500 focus:ring-brand-500 border-gray-300"
                      />
                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-white">{course.name}</h3>
                        <p className="text-sm text-gray-500 flex items-center gap-1 mt-1"><Calendar className="w-4 h-4"/> {course.durationWeeks} Weeks</p>
                      </div>
                    </div>
                    <div className="font-bold text-lg text-brand-600 dark:text-brand-400">$\${course.fee.toFixed(2)}</div>
                  </label>
                ))}
              </div>
            </div>

            <hr className="border-gray-200 dark:border-gray-700" />

            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">2. Student Details</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">First Name</label>
                  <input 
                    type="text" required
                    value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})}
                    className="w-full p-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Last Name</label>
                  <input 
                    type="text" required
                    value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})}
                    className="w-full p-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none dark:text-white"
                  />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Phone</label>
                  <input 
                    type="tel" required
                    value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})}
                    className="w-full p-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Email</label>
                  <input 
                    type="email" required
                    value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                    className="w-full p-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none dark:text-white"
                  />
                </div>
              </div>
            </div>

            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gray-900 hover:bg-black text-white font-bold py-4 rounded-xl text-lg disabled:opacity-50 transition-colors"
            >
              {isSubmitting ? 'Submitting Application...' : 'Submit Application'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
