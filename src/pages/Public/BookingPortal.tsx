import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Calendar, Clock, User, CheckCircle2, ChevronRight, ChevronLeft } from 'lucide-react';
import api from '../../api/axios';
import { toast } from 'react-hot-toast';

interface Service {
  id: string;
  name: string;
  durationMinutes: number;
  price: number;
  category: string;
}

export default function BookingPortal() {
  const [step, setStep] = useState(1);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    // Fetch available services
    api.get('/public/services')
      .then(res => setServices(res.data.data || []))
      .catch(err => {
        console.error(err);
        toast.error("Failed to load services");
      });
  }, []);

  const handleNext = () => setStep(s => s + 1);
  const handlePrev = () => setStep(s => s - 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post('/public/book', {
        ...formData,
        serviceId: selectedService?.id,
        date: selectedDate,
        time: selectedTime
      });
      setIsSuccess(true);
    } catch (error) {
      toast.error("Booking failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <Helmet><title>Booking Confirmed | BeautyStudio</title></Helmet>
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center border border-gray-200 dark:border-gray-700">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Booking Confirmed!</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Thank you, {formData.firstName}. Your appointment for {selectedService?.name} is confirmed for {selectedDate} at {selectedTime}. We will send you a reminder shortly.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="w-full py-3 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-xl transition-colors"
          >
            Book Another Appointment
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <Helmet><title>Book Appointment | BeautyStudio</title></Helmet>
      
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-3">BeautyStudio</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">Book your next appointment online</p>
        </div>

        {/* Progress Bar */}
        <div className="flex justify-between items-center mb-8 relative">
          <div className="absolute left-0 top-1/2 w-full h-1 bg-gray-200 dark:bg-gray-700 -z-10 -translate-y-1/2 rounded-full"></div>
          <div className={`absolute left-0 top-1/2 h-1 bg-brand-500 -z-10 -translate-y-1/2 rounded-full transition-all duration-300`} style={{ width: `\${((step - 1) / 2) * 100}%` }}></div>
          
          {[1, 2, 3].map(i => (
            <div key={i} className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors \${step >= i ? 'bg-brand-500 text-white shadow-lg' : 'bg-white dark:bg-gray-800 text-gray-400 border-2 border-gray-200 dark:border-gray-700'}`}>
              {i}
            </div>
          ))}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Step 1: Services */}
          {step === 1 && (
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Select a Service</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {services.map(service => (
                  <button
                    key={service.id}
                    onClick={() => { setSelectedService(service); handleNext(); }}
                    className="text-left p-6 rounded-2xl border-2 border-gray-100 dark:border-gray-700 hover:border-brand-500 hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-all group"
                  >
                    <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-1">{service.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 font-medium">
                      <span className="flex items-center gap-1.5"><Clock className="w-4 h-4"/> {service.durationMinutes} min</span>
                      <span className="text-brand-600 dark:text-brand-400 font-bold">$\${service.price.toFixed(2)}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Date & Time */}
          {step === 2 && (
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Choose Date & Time</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Select Date</label>
                  <input 
                    type="date" 
                    required
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full p-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Select Time</label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {['10:00', '11:00', '13:00', '14:00', '15:30', '17:00'].map(time => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`p-3 rounded-xl font-bold border-2 transition-colors \${selectedTime === time ? 'border-brand-500 bg-brand-50 text-brand-600' : 'border-gray-100 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300'}`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-8 flex justify-between">
                <button onClick={handlePrev} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 font-medium px-4 py-2">
                  <ChevronLeft className="w-5 h-5"/> Back
                </button>
                <button 
                  onClick={handleNext} 
                  disabled={!selectedDate || !selectedTime}
                  className="flex items-center gap-2 bg-gray-900 hover:bg-black text-white font-bold px-8 py-3 rounded-xl disabled:opacity-50 transition-colors"
                >
                  Continue <ChevronRight className="w-5 h-5"/>
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Details */}
          {step === 3 && (
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Your Details</h2>
              
              <div className="mb-8 p-4 bg-brand-50 dark:bg-brand-900/20 rounded-xl border border-brand-100 dark:border-brand-900/50 flex justify-between items-center">
                <div>
                  <p className="font-bold text-brand-900 dark:text-brand-100">{selectedService?.name}</p>
                  <p className="text-brand-600 text-sm font-medium">{selectedDate} at {selectedTime}</p>
                </div>
                <div className="font-bold text-lg text-brand-700">$\${selectedService?.price.toFixed(2)}</div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
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
                <div className="grid sm:grid-cols-2 gap-4">
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
                
                <div className="mt-8 flex justify-between items-center pt-4 border-t border-gray-100 dark:border-gray-800">
                  <button type="button" onClick={handlePrev} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 font-medium px-4 py-2">
                    <ChevronLeft className="w-5 h-5"/> Back
                  </button>
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white font-bold px-8 py-3 rounded-xl disabled:opacity-50 transition-colors"
                  >
                    {isSubmitting ? 'Confirming...' : 'Confirm Booking'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
