import React, { useState, useEffect } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";

const StudentProgress: React.FC = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<any[]>([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [progressStatus, setProgressStatus] = useState<any[]>([]);

  useEffect(() => {
    // Ideally we fetch courses this student is enrolled in.
    // For MVP, fetch all courses for selection.
    api.get("/courses").then(res => {
      if (res.data.success) setCourses(res.data.data);
    });
  }, []);

  useEffect(() => {
    if (selectedCourse && (user as any)?.personId) {
      api.get(`/certifications/status/${selectedCourse}/${(user as any)?.personId}`).then(res => {
        if (res.data.success) {
          setProgressStatus(res.data.data);
        }
      });
    }
  }, [selectedCourse, user]);

  return (
    <div>
      <PageBreadcrumb pageTitle="My Progress Checklist" />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
        
        <div className="mb-6 max-w-md">
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Enrolled Course</label>
          <select 
            value={selectedCourse} 
            onChange={e => setSelectedCourse(e.target.value)}
            className="w-full border rounded-lg p-2.5 bg-gray-50"
          >
            <option value="">-- Choose Course --</option>
            {courses.map(c => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>
        </div>

        {selectedCourse && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Certification Checklist</h3>
            
            {progressStatus.length === 0 ? (
              <p className="text-gray-500">No progress data or requirements found for this course.</p>
            ) : (
              <div className="space-y-4">
                {progressStatus.map(status => (
                  <div key={status._id} className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
                    <div>
                      <div className="font-medium text-gray-800 capitalize">
                        {status.requirementId?.ruleType.replace('_', ' ')}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        Progress: {status.currentValue} / {status.requirementId?.thresholdValue}
                      </div>
                    </div>
                    <div>
                      {status.satisfied ? (
                        <span className="px-3 py-1 bg-success-100 text-success-800 rounded-full text-sm font-medium">Completed</span>
                      ) : (
                        <span className="px-3 py-1 bg-warning-100 text-warning-800 rounded-full text-sm font-medium">Pending</span>
                      )}
                    </div>
                  </div>
                ))}

                <div className="mt-8 p-4 bg-brand-50 rounded-xl border border-brand-100 text-center">
                  <h4 className="text-brand-800 font-semibold mb-2">Ready to Graduate?</h4>
                  <p className="text-sm text-brand-600 mb-4">Once all items are marked complete, your instructor can issue your certificate.</p>
                  <button className="px-4 py-2 bg-brand-500 text-white rounded-lg text-sm disabled:opacity-50" disabled>
                    Download Certificate (Unavailable)
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default StudentProgress;
