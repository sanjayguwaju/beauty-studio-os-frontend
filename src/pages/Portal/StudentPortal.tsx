import React, { useState, useEffect } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import api from "../../utils/api";

const StudentPortal: React.FC = () => {
  const [schedule, setSchedule] = useState<any[]>([]);
  const [progress, setProgress] = useState<any[]>([]);
  const [certificates, setCertificates] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [schedRes, progRes, certRes] = await Promise.all([
        api.get("/portal/student/schedule"),
        api.get("/portal/student/progress"),
        api.get("/portal/student/certificates")
      ]);

      if (schedRes.data.success) setSchedule(schedRes.data.data);
      if (progRes.data.success) setProgress(progRes.data.data);
      if (certRes.data.success) setCertificates(certRes.data.data);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="Student Portal" />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Active Courses / Schedule */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <h3 className="font-semibold text-gray-800 mb-4">My Active Courses</h3>
          {schedule.length === 0 ? (
            <p className="text-gray-500 text-sm">No active enrollments found.</p>
          ) : (
            <div className="space-y-4">
              {schedule.map(enrollment => (
                <div key={enrollment._id} className="p-4 border rounded-xl bg-gray-50">
                  <h4 className="font-medium text-brand-600">
                    {enrollment.batchId?.courseId?.title || "Course"}
                  </h4>
                  <p className="text-sm text-gray-900 mb-2 font-semibold">
                    Batch: {enrollment.batchId?.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Schedule:</strong> {enrollment.batchId?.schedule}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Dates:</strong> {new Date(enrollment.batchId?.startDate).toLocaleDateString()} to {new Date(enrollment.batchId?.endDate).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Progress & Certifications */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <h3 className="font-semibold text-gray-800 mb-4">Curriculum Progress</h3>
            {progress.length === 0 ? (
              <p className="text-gray-500 text-sm">No progress data available.</p>
            ) : (
              <div className="space-y-4">
                {progress.map(prog => (
                  <div key={prog._id} className="p-4 border rounded-xl bg-gray-50">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium">{prog.courseId?.title || "Course"}</h4>
                      <span className={`px-2 py-1 text-xs rounded-md capitalize font-medium
                        ${prog.status === 'certified' ? 'bg-success-100 text-success-800' : 'bg-warning-100 text-warning-800'}`}>
                        {prog.status}
                      </span>
                    </div>
                    
                    <div className="mt-3">
                      <p className="text-sm text-gray-600 mb-1">Modules Completed:</p>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-brand-500 h-2.5 rounded-full" style={{ width: `${(prog.modulesCompleted.length / Math.max(prog.modulesCompleted.length + 1, 3)) * 100}%` }}></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <h3 className="font-semibold text-gray-800 mb-4">My Certificates</h3>
            {certificates.length === 0 ? (
              <p className="text-gray-500 text-sm">No certificates issued yet.</p>
            ) : (
              <div className="space-y-3">
                {certificates.map(cert => (
                  <div key={cert._id} className="flex justify-between items-center p-3 border rounded-lg bg-gray-50">
                    <div>
                      <p className="font-medium text-sm">{cert.courseId?.title}</p>
                      <p className="text-xs text-gray-500">Issued: {new Date(cert.issuedAt).toLocaleDateString()}</p>
                    </div>
                    {cert.pdfUrl && (
                      <a href={cert.pdfUrl} target="_blank" rel="noopener noreferrer" className="text-brand-500 hover:underline text-sm font-medium">
                        Download PDF
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default StudentPortal;
