import React, { useState, useEffect } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import api from "../../api/axios";

interface Enrollment {
  _id: string;
  studentPersonId: {
    _id: string;
    fullName: string;
  };
}



const AttendanceTracker: React.FC = () => {
  const [batches, setBatches] = useState<any[]>([]);
  const [selectedBatchId, setSelectedBatchId] = useState<string>("");
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [attendanceData, setAttendanceData] = useState<Record<string, "present" | "absent" | "excused">>({});
  const [sessionDate, setSessionDate] = useState<string>(new Date().toISOString().split('T')[0]);
  
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingSync, setPendingSync] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    
    // Check for pending sync
    const offlineData = localStorage.getItem("pending_attendance");
    if (offlineData) {
      setPendingSync(true);
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const fetchBatches = async () => {
    try {
      const response = await api.get(`/batches`);
      if (response.data.success) {
        setBatches(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch batches", error);
    }
  };

  useEffect(() => {
    fetchBatches();
  }, []);

  useEffect(() => {
    if (selectedBatchId) {
      // Fetch enrollments for the batch
      api.get(`/batches/${selectedBatchId}`).then(res => {
        if (res.data.success) {
          setEnrollments(res.data.data.enrollments || []);
          // Initialize attendance
          const initial: any = {};
          (res.data.data.enrollments || []).forEach((en: Enrollment) => {
            initial[en.studentPersonId._id] = "present";
          });
          setAttendanceData(initial);
        }
      });
    }
  }, [selectedBatchId]);

  const handleStatusChange = (studentId: string, status: "present" | "absent" | "excused") => {
    setAttendanceData(prev => ({ ...prev, [studentId]: status }));
  };

  const handleSave = async () => {
    const records = enrollments.map(en => ({
      batchId: selectedBatchId,
      studentPersonId: en.studentPersonId._id,
      sessionDate,
      status: attendanceData[en.studentPersonId._id],
      recordedOffline: !isOnline,
      syncedAt: new Date().toISOString()
    }));

    if (isOnline) {
      try {
        await api.post(`/attendance/sync`, { records });
        alert("Attendance saved and synced to server.");
      } catch (e) {
        alert("Failed to sync to server. Saving offline.");
        saveOffline(records);
      }
    } else {
      saveOffline(records);
    }
  };

  const saveOffline = (records: any[]) => {
    const existing = JSON.parse(localStorage.getItem("pending_attendance") || "[]");
    localStorage.setItem("pending_attendance", JSON.stringify([...existing, ...records]));
    setPendingSync(true);
    alert("Saved offline. Will sync when connection is restored.");
  };

  const handleSyncNow = async () => {
    const records = JSON.parse(localStorage.getItem("pending_attendance") || "[]");
    if (records.length === 0) return;
    
    try {
      await api.post(`/attendance/sync`, { records });
      localStorage.removeItem("pending_attendance");
      setPendingSync(false);
      alert("Offline records synced successfully!");
    } catch (e) {
      alert("Sync failed. Try again later.");
    }
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="Attendance Tracker" />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
        
        <div className="mb-4 flex justify-between items-center bg-gray-50 p-4 rounded-lg">
          <div>
            <span className="text-sm font-medium">Status: </span>
            {isOnline ? (
              <span className="text-success-600 font-bold">Online</span>
            ) : (
              <span className="text-error-500 font-bold">Offline</span>
            )}
          </div>
          {pendingSync && (
            <div>
              <span className="text-warning-600 text-sm mr-4">You have unsynced records</span>
              <button 
                onClick={handleSyncNow}
                disabled={!isOnline}
                className="rounded bg-brand-500 px-3 py-1 text-sm font-medium text-white disabled:opacity-50"
              >
                Sync Now
              </button>
            </div>
          )}
        </div>

        <div className="flex gap-4 mb-6">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Batch</label>
            <select 
              value={selectedBatchId} 
              onChange={e => setSelectedBatchId(e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-2"
            >
              <option value="">-- Choose Batch --</option>
              {batches.map(b => (
                <option key={b._id} value={b._id}>{b.name}</option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Session Date</label>
            <input 
              type="date" 
              value={sessionDate}
              onChange={e => setSessionDate(e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-2"
            />
          </div>
        </div>

        {selectedBatchId && enrollments.length > 0 && (
          <div>
            <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400 mb-4">
              <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th className="px-6 py-3">Student Name</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {enrollments.map((en) => (
                  <tr key={en.studentPersonId._id} className="border-b bg-white hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{en.studentPersonId.fullName}</td>
                    <td className="px-6 py-4 flex gap-2">
                      <button 
                        onClick={() => handleStatusChange(en.studentPersonId._id, "present")}
                        className={`px-3 py-1 rounded ${attendanceData[en.studentPersonId._id] === "present" ? "bg-success-500 text-white" : "bg-gray-200 text-gray-700"}`}
                      >Present</button>
                      <button 
                        onClick={() => handleStatusChange(en.studentPersonId._id, "absent")}
                        className={`px-3 py-1 rounded ${attendanceData[en.studentPersonId._id] === "absent" ? "bg-error-500 text-white" : "bg-gray-200 text-gray-700"}`}
                      >Absent</button>
                      <button 
                        onClick={() => handleStatusChange(en.studentPersonId._id, "excused")}
                        className={`px-3 py-1 rounded ${attendanceData[en.studentPersonId._id] === "excused" ? "bg-warning-500 text-white" : "bg-gray-200 text-gray-700"}`}
                      >Excused</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-end">
              <button 
                onClick={handleSave}
                className="rounded-lg bg-brand-500 px-6 py-2 text-sm font-medium text-white hover:bg-brand-600"
              >
                Save Attendance
              </button>
            </div>
          </div>
        )}
        
        {selectedBatchId && enrollments.length === 0 && (
          <p className="text-gray-500">No students enrolled in this batch.</p>
        )}

      </div>
    </div>
  );
};

export default AttendanceTracker;
