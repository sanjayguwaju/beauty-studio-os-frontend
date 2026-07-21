import React, { useState, useEffect } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import api from "../../api/axios";

const OcrIntake: React.FC = () => {
  const [pendingExtractions, setPendingExtractions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  // For the active review modal
  const [activeReview, setActiveReview] = useState<any>(null);
  const [reviewFields, setReviewFields] = useState<any>({});

  const fetchPending = async () => {
    setLoading(true);
    try {
      const res = await api.get("/ai/ocr/pending");
      if (res.data.success) {
        setPendingExtractions(res.data.data);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleSimulateUpload = async () => {
    setUploading(true);
    try {
      const res = await api.post("/ai/ocr/process", {
        sourceDocumentUrl: "https://example.com/mock-id-document.jpg"
      });
      if (res.data.success) {
        fetchPending();
      }
    } catch (e) {
      console.error(e);
    }
    setUploading(false);
  };

  const handleOpenReview = (extraction: any) => {
    setActiveReview(extraction);
    setReviewFields({
      name: extraction.extractedFields.name || "",
      dob: extraction.extractedFields.dob || "",
      idNumber: extraction.extractedFields.idNumber || "",
    });
  };

  const handleApprove = async () => {
    if (!activeReview) return;
    try {
      const res = await api.post(`/ai/ocr/${activeReview._id}/approve`, {
        finalFields: reviewFields
      });
      if (res.data.success) {
        alert("Student profile created successfully!");
        setActiveReview(null);
        fetchPending();
      }
    } catch (e) {
      console.error(e);
      alert("Error approving document");
    }
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="AI OCR Intake" />

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
        <h2 className="text-lg font-bold text-gray-800 mb-2">Document Processing</h2>
        <p className="text-sm text-gray-500 mb-4">
          Upload student ID documents here. The AI will extract the details and place them in the pending review queue.
        </p>
        <button 
          onClick={handleSimulateUpload} 
          disabled={uploading}
          className="bg-brand-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-600 disabled:opacity-50"
        >
          {uploading ? "Processing with AI..." : "Simulate ID Upload"}
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-800">Pending Review Queue</h3>
        </div>
        <div className="p-4">
          {loading ? (
            <p className="text-sm text-gray-500">Loading...</p>
          ) : pendingExtractions.length === 0 ? (
            <p className="text-sm text-gray-500">No pending documents to review.</p>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase">Document</th>
                  <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase">Confidence</th>
                  <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase">Extracted Name</th>
                  <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingExtractions.map(ext => (
                  <tr key={ext._id} className="border-b border-gray-50">
                    <td className="py-3 px-4 text-sm text-blue-500 underline cursor-pointer">View Image</td>
                    <td className="py-3 px-4 text-sm">
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-bold">
                        {(ext.confidenceScore * 100).toFixed(0)}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">{ext.extractedFields.name || "N/A"}</td>
                    <td className="py-3 px-4 text-sm">
                      <button onClick={() => handleOpenReview(ext)} className="text-brand-500 hover:underline font-medium">Review</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Review Modal */}
      {activeReview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-lg overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold text-gray-800">Review AI Extraction</h3>
              <button onClick={() => setActiveReview(null)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-orange-50 text-orange-700 p-3 rounded-lg text-sm mb-4">
                Please verify the extracted fields against the source document.
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input 
                  type="text" 
                  value={reviewFields.name}
                  onChange={e => setReviewFields({...reviewFields, name: e.target.value})}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                <input 
                  type="date" 
                  value={reviewFields.dob}
                  onChange={e => setReviewFields({...reviewFields, dob: e.target.value})}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ID Number</label>
                <input 
                  type="text" 
                  value={reviewFields.idNumber}
                  onChange={e => setReviewFields({...reviewFields, idNumber: e.target.value})}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                />
              </div>

            </div>
            <div className="p-4 bg-gray-50 flex justify-end gap-3">
              <button onClick={() => setActiveReview(null)} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
              <button onClick={handleApprove} className="px-4 py-2 text-sm font-medium text-white bg-brand-500 hover:bg-brand-600 rounded-lg">
                Approve & Create Student
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default OcrIntake;
