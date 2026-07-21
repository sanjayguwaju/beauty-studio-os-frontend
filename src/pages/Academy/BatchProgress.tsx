import React, { useState, useEffect } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import api from "../../api/axios";

const BatchProgress: React.FC = () => {
  const [batches, setBatches] = useState<any[]>([]);
  const [selectedBatch, setSelectedBatch] = useState<any>(null);
  const [enrollments, setEnrollments] = useState<any[]>([]);

  useEffect(() => {
    api.get("/batches").then(res => {
      if (res.data.success) setBatches(res.data.data);
    });
  }, []);

  const handleSelectBatch = async (batchId: string) => {
    const batch = batches.find(b => b._id === batchId);
    setSelectedBatch(batch);
    if (batch) {
      try {
        const res = await api.get(`/batches/${batchId}`);
        if (res.data.success) {
          // For MVP, we pretend the API aggregates progress or we just show a mockup of the students in the batch
          // Real implementation would join CertificationStatus
          setEnrollments(res.data.data.enrollments || []);
        }
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleIssueCertificate = async (studentPersonId: string) => {
    if (!selectedBatch) return;
    try {
      const res = await api.post("/certifications/issue", {
        studentPersonId,
        courseId: selectedBatch.courseId._id
      });
      alert(`Certificate issued! Number: ${res.data.data.certificateNumber}`);
    } catch (e: any) {
      alert(e.response?.data?.message || "Failed to issue certificate");
    }
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="Batch Progress & Certification" />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
        
        <div className="mb-6 max-w-md">
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Batch</label>
          <select 
            onChange={e => handleSelectBatch(e.target.value)}
            className="w-full border rounded-lg p-2.5 bg-gray-50"
          >
            <option value="">-- Choose Batch --</option>
            {batches.map(b => (
              <option key={b._id} value={b._id}>{b.name} ({b.courseId?.name})</option>
            ))}
          </select>
        </div>

        {selectedBatch && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Students Progress Overview</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-500">
                <thead className="bg-gray-50 text-xs uppercase text-gray-700">
                  <tr>
                    <th className="px-6 py-3">Student Name</th>
                    <th className="px-6 py-3">Requirements Met</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {enrollments.map((en, index) => (
                    <tr key={en.studentPersonId._id} className="border-b bg-white hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">{en.studentPersonId.fullName}</td>
                      <td className="px-6 py-4">
                        {/* Mocking completion randomly for MVP demonstration */}
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                          <div className={`h-2.5 rounded-full ${index % 2 === 0 ? 'bg-success-500 w-full' : 'bg-brand-500 w-2/3'}`}></div>
                        </div>
                        <span className="text-xs text-gray-500 mt-1 block">{index % 2 === 0 ? "100%" : "66%"}</span>
                      </td>
                      <td className="px-6 py-4">
                        {index % 2 === 0 ? (
                          <span className="px-2 py-1 text-xs rounded-full bg-success-100 text-success-800 font-medium">Ready</span>
                        ) : (
                          <span className="px-2 py-1 text-xs rounded-full bg-warning-100 text-warning-800 font-medium">In Progress</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <button 
                          onClick={() => handleIssueCertificate(en.studentPersonId._id)}
                          className="text-brand-500 hover:underline disabled:opacity-50"
                        >
                          Issue Certificate
                        </button>
                      </td>
                    </tr>
                  ))}
                  {enrollments.length === 0 && (
                    <tr><td colSpan={4} className="px-6 py-4 text-center">No students in this batch.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default BatchProgress;
