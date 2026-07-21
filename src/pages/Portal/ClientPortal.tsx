import React, { useState, useEffect } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import api from "../../api/axios";
import { Modal } from "../../components/ui/modal";
import { useAuth } from "../../context/AuthContext";

const ClientPortal: React.FC = () => {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState<any[]>([]);
  

  // Booking Form State
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [serviceId, setServiceId] = useState("");
  const [practitionerPersonId] = useState("");
  const [startDatetime, setStartDatetime] = useState("");
  
  // Dummy data for dropdowns (in a real app, fetch from `/services` and `/staff`)
  const availableServices = [
    { _id: "srv1", name: "Haircut & Style", duration: 60 },
    { _id: "srv2", name: "Color Treatment", duration: 120 }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appRes, recRes, invRes] = await Promise.all([
          api.get("/portal/client/appointments"),
          api.get(`/ai/recommendations/${(user as any)?.personId}`),
          api.get("/portal/client/invoices")
        ]);

        if (appRes.data.success) {
          setAppointments(appRes.data.data);
        }
        if (recRes.data.success) {
          setRecommendations(recRes.data.data);
        }
        if (invRes.data.success) {
          setInvoices(invRes.data.data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        
      }
    };
    if ((user as any)?.personId) {
      fetchData();
    }
  }, [user]);

  const handleDismissRec = async (id: string) => {
    try {
      await api.patch(`/ai/recommendations/${id}/dismiss`);
      setRecommendations(recommendations.filter((r: any) => r._id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  const handleBook = async () => {
    try {
      // Find duration
      const service = availableServices.find(s => s._id === serviceId);
      const start = new Date(startDatetime);
      const end = new Date(start.getTime() + (service?.duration || 60) * 60000);

      await api.post("/portal/client/appointments", {
        serviceId,
        practitionerPersonId: practitionerPersonId || "any_available",
        scheduledStart: start,
        scheduledEnd: end
      });
      setIsBookingModalOpen(false);
      const appRes = await api.get("/portal/client/appointments");
      if (appRes.data.success) {
        setAppointments(appRes.data.data);
      }
      alert("Appointment booked successfully!");
    } catch (e: any) {
      alert(e.response?.data?.message || "Failed to book appointment");
    }
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="Client Portal" />
      
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">My Appointments</h2>
        <button 
          onClick={() => setIsBookingModalOpen(true)}
          className="bg-brand-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-brand-600"
        >
          Book Appointment
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Appointments List */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <h3 className="font-semibold text-gray-800 mb-4">Upcoming & Past Visits</h3>
          {appointments.length === 0 ? (
            <p className="text-gray-500 text-sm">No appointments found.</p>
          ) : (
            <div className="space-y-4">
              {appointments.map(appt => (
                <div key={appt._id} className="p-4 border rounded-xl bg-gray-50">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">{appt.serviceId?.name || "Service"}</h4>
                    <span className={`px-2 py-1 text-xs rounded-md capitalize font-medium
                      ${appt.status === 'completed' ? 'bg-success-100 text-success-800' : 'bg-brand-100 text-brand-800'}`}>
                      {appt.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">
                    <strong>Date:</strong> {new Date(appt.scheduledStart).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Practitioner:</strong> {appt.practitionerPersonId?.fullName || "Not assigned"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Invoices List */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <h3 className="font-semibold text-gray-800 mb-4">My Invoices</h3>
          {invoices.length === 0 ? (
            <p className="text-gray-500 text-sm">No invoices found.</p>
          ) : (
            <div className="space-y-4">
              {invoices.map(inv => (
                <div key={inv._id} className="p-4 border rounded-xl bg-gray-50 flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">Service Invoice</h4>
                    <p className="text-sm text-gray-600">
                      {new Date(inv.issuedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">${inv.totalAmount.toFixed(2)}</p>
                    <span className={`text-xs font-medium capitalize ${inv.status === 'paid' ? 'text-success-600' : 'text-warning-600'}`}>
                      {inv.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* AI Recommendations */}
      {recommendations.length > 0 && (
        <div className="bg-gradient-to-r from-brand-50 to-blue-50 p-6 rounded-2xl shadow-sm border border-brand-100/50 mt-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="text-xl">✨</span> Suggested for You
          </h2>
          <div className="space-y-4">
            {recommendations.map((rec: any) => (
              <div key={rec._id} className="bg-white/80 p-4 rounded-xl border border-white flex justify-between items-center shadow-sm backdrop-blur-sm">
                <div>
                  <h4 className="font-bold text-gray-800">{rec.recommendedServiceId?.name || "Complementary Service"}</h4>
                  <p className="text-sm text-gray-600 mt-1">{rec.reasoning}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleDismissRec(rec._id)} className="px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                    Dismiss
                  </button>
                  <button onClick={() => setIsBookingModalOpen(true)} className="px-4 py-1.5 bg-brand-500 text-white text-xs font-medium rounded-lg hover:bg-brand-600 shadow-sm transition-colors">
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <Modal isOpen={isBookingModalOpen} onClose={() => setIsBookingModalOpen(false)} className="max-w-md p-6">
        <h3 className="text-lg font-semibold mb-4">Book a Service</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Service</label>
            <select value={serviceId} onChange={e => setServiceId(e.target.value)} className="w-full border rounded p-2">
              <option value="">-- Select Service --</option>
              {availableServices.map(s => (
                <option key={s._id} value={s._id}>{s.name} ({s.duration} min)</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Preferred Date & Time</label>
            <input 
              type="datetime-local" 
              value={startDatetime} 
              onChange={e => setStartDatetime(e.target.value)} 
              className="w-full border rounded p-2"
            />
          </div>
          <button onClick={handleBook} className="w-full bg-brand-500 text-white p-2 rounded hover:bg-brand-600 font-medium mt-2">
            Confirm Booking
          </button>
        </div>
      </Modal>

    </div>
  );
};

export default ClientPortal;
