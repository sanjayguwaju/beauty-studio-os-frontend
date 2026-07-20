import React, { useState, useEffect, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { DateSelectArg, EventClickArg } from "@fullcalendar/core";
import { io, Socket } from "socket.io-client";
import { useAuth } from "../../context/AuthContext";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { Modal } from "../../components/ui/modal";
import api from "../../utils/api";

const BookingCalendar: React.FC = () => {
  const { user } = useAuth();
  const calendarRef = useRef<FullCalendar>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);

  // Form states
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [clientName, setClientName] = useState("");
  const [serviceName, setServiceName] = useState("");
  const [practitionerRole, setPractitionerRole] = useState("stylist");
  const [supervisingInstructor, setSupervisingInstructor] = useState("");
  const [startDatetime, setStartDatetime] = useState("");
  const [endDatetime, setEndDatetime] = useState("");
  
  // Session Complete states
  const [outcomeNotes, setOutcomeNotes] = useState("");
  const [availableProducts, setAvailableProducts] = useState<any[]>([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [quantityUsed, setQuantityUsed] = useState(1);
  const [productsUsed, setProductsUsed] = useState<any[]>([]);
  
  useEffect(() => {
    fetchAppointments();

    const newSocket = io(process.env.REACT_APP_API_URL || "http://localhost:5000", {
      withCredentials: true,
      auth: { token: localStorage.getItem("accessToken") }
    });

    newSocket.on("connect", () => {
      console.log("Connected to socket server");
    });

    newSocket.on("appointment_created", (appointment) => {
      fetchAppointments();
    });

    newSocket.on("appointment_updated", (appointment) => {
      fetchAppointments();
    });

    setSocket(newSocket);
    fetchProducts();

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await api.get(`/appointments`);
      if (res.data.success) {
        const formattedEvents = res.data.data.map((appt: any) => ({
          id: appt._id,
          title: `${appt.clientPersonId?.fullName} - ${appt.serviceId?.name}`,
          start: appt.scheduledStart,
          end: appt.scheduledEnd,
          extendedProps: { ...appt },
          backgroundColor: appt.status === 'completed' ? '#10B981' : appt.status === 'in_progress' ? '#F59E0B' : '#3B82F6',
        }));
        setEvents(formattedEvents);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await api.get("/products");
      if (res.data.success) {
        setAvailableProducts(res.data.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    setSelectedAppointment(null);
    setStartDatetime(selectInfo.startStr.slice(0, 16));
    setEndDatetime(selectInfo.endStr.slice(0, 16));
    setIsModalOpen(true);
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    const appt = clickInfo.event.extendedProps;
    setSelectedAppointment(appt);
    setProductsUsed([]);
    setOutcomeNotes("");
    setIsSessionModalOpen(true);
  };

  const handleSaveAppointment = async () => {
    // Basic stub, assumes we are typing IDs or names for simplicity in this MVP
    // A real implementation would have a dropdown for client, service, practitioner
    try {
      const payload = {
        clientPersonId: "placeholder_client_id", // In real life, selected from UI
        serviceId: "placeholder_service_id",
        practitionerPersonId: "placeholder_practitioner_id",
        practitionerRole,
        supervisingInstructorPersonId: practitionerRole === 'student' ? "placeholder_instructor_id" : undefined,
        scheduledStart: new Date(startDatetime),
        scheduledEnd: new Date(endDatetime),
      };

      await api.post(`/appointments`, payload);
      setIsModalOpen(false);
      // Event triggers socket so no need to fetch here, but we can optimistically fetch
      fetchAppointments();
    } catch (e: any) {
      alert(e.response?.data?.message || "Failed to create appointment");
    }
  };

  const handleCompleteSession = async () => {
    if (!selectedAppointment) return;
    try {
      await api.post(`/appointments/${selectedAppointment._id}/complete`, {
        outcomeNotes,
        productsUsed
      });
      setIsSessionModalOpen(false);
      setOutcomeNotes("");
      alert("Session completed successfully!");
      fetchAppointments();
    } catch (e: any) {
      alert(e.response?.data?.message || "Failed to complete session");
    }
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="Booking Engine" />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
        
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          events={events}
          selectable={true}
          select={handleDateSelect}
          eventClick={handleEventClick}
          height="auto"
        />

      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} className="max-w-[500px] p-6">
        <h3 className="text-lg font-semibold mb-4">Create Appointment</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Practitioner Role</label>
            <select value={practitionerRole} onChange={e => setPractitionerRole(e.target.value)} className="w-full border rounded p-2">
              <option value="stylist">Stylist</option>
              <option value="student">Student (Supervised)</option>
            </select>
          </div>
          {practitionerRole === 'student' && (
            <div>
              <label className="block text-sm font-medium text-red-600">Supervising Instructor Required</label>
              <input type="text" placeholder="Select Instructor" className="w-full border rounded p-2" />
            </div>
          )}
          <button onClick={handleSaveAppointment} className="w-full bg-brand-500 text-white p-2 rounded">
            Save Appointment
          </button>
        </div>
      </Modal>

      <Modal isOpen={isSessionModalOpen} onClose={() => setIsSessionModalOpen(false)} className="max-w-[500px] p-6">
        <h3 className="text-lg font-semibold mb-4">Appointment Details</h3>
        {selectedAppointment && (
          <div className="space-y-4">
            <p><strong>Status:</strong> {selectedAppointment.status}</p>
            {selectedAppointment.status !== 'completed' && (
              <>
                <div>
                  <label className="block text-sm font-medium">Outcome Notes</label>
                  <textarea value={outcomeNotes} onChange={e => setOutcomeNotes(e.target.value)} className="w-full border rounded p-2" rows={3}></textarea>
                </div>
                
                <div className="border p-4 rounded bg-gray-50">
                  <h4 className="text-sm font-medium mb-2">Products Used</h4>
                  <div className="flex gap-2 mb-3">
                    <select value={selectedProductId} onChange={e => setSelectedProductId(e.target.value)} className="flex-1 border rounded p-2">
                      <option value="">-- Select Product --</option>
                      {availableProducts.map(p => (
                        <option key={p._id} value={p._id}>{p.name} ({p.unit})</option>
                      ))}
                    </select>
                    <input type="number" min="1" value={quantityUsed} onChange={e => setQuantityUsed(Number(e.target.value))} className="w-20 border rounded p-2" />
                    <button 
                      onClick={() => {
                        if (selectedProductId) {
                          const prod = availableProducts.find(p => p._id === selectedProductId);
                          setProductsUsed([...productsUsed, { productId: prod._id, productName: prod.name, quantityUsed }]);
                          setSelectedProductId("");
                          setQuantityUsed(1);
                        }
                      }}
                      className="bg-brand-100 text-brand-800 px-3 rounded"
                    >
                      Add
                    </button>
                  </div>
                  <ul className="text-sm space-y-1">
                    {productsUsed.map((pu, idx) => (
                      <li key={idx}>- {pu.quantityUsed}x {pu.productName}</li>
                    ))}
                  </ul>
                </div>

                <button onClick={handleCompleteSession} className="w-full bg-success-500 text-white p-2 rounded">
                  Complete Session & Generate Invoice
                </button>
              </>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default BookingCalendar;
