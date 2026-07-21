import React, { useState, useEffect } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import api from "../../api/axios";

const CertificationRules: React.FC = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [requirements, setRequirements] = useState<any[]>([]);
  
  const [ruleType, setRuleType] = useState("supervised_count");
  const [thresholdValue, setThresholdValue] = useState(1);
  const [targetCurriculumItemId, setTargetCurriculumItemId] = useState("");
  

  useEffect(() => {
    // Fetch courses to select from
    api.get("/courses").then(res => {
      if (res.data.success) setCourses(res.data.data);
    });
  }, []);

  useEffect(() => {
    if (selectedCourse) {
      fetchRequirements();
      // Fetch curriculum items for this course to allow selecting for supervised_count rules
      // For simplicity in MVP, we might fetch all and filter or just fetch modules then items
      // api.get(`/courses/${selectedCourse}/curriculum`).then(...)
    }
  }, [selectedCourse]);

  const fetchRequirements = async () => {
    try {
      const res = await api.get(`/certifications/requirements?courseId=${selectedCourse}`);
      if (res.data.success) {
        setRequirements(res.data.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddRequirement = async () => {
    try {
      const payload: any = {
        courseId: selectedCourse,
        ruleType,
        thresholdValue,
      };
      if (ruleType === "supervised_count" && targetCurriculumItemId) {
        payload.targetCurriculumItemId = targetCurriculumItemId;
      }

      await api.post("/certifications/requirements", payload);
      alert("Requirement added");
      fetchRequirements();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="Certification Rules" />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
        
        <div className="mb-6 max-w-md">
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Course</label>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* List Existing Rules */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Current Requirements</h3>
              {requirements.length === 0 ? (
                <p className="text-gray-500">No requirements defined for this course.</p>
              ) : (
                <ul className="space-y-3">
                  {requirements.map(req => (
                    <li key={req._id} className="p-4 border rounded-lg bg-gray-50">
                      <div className="font-medium text-gray-800 capitalize">{req.ruleType.replace('_', ' ')}</div>
                      <div className="text-sm text-gray-600 mt-1">
                        Threshold: <span className="font-bold">{req.thresholdValue}</span>
                      </div>
                      {req.targetCurriculumItemId && (
                        <div className="text-xs text-brand-500 mt-1">Curriculum Target: {req.targetCurriculumItemId.title}</div>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Add New Rule */}
            <div className="bg-gray-50 p-5 rounded-xl border">
              <h3 className="text-lg font-semibold mb-4">Add Requirement</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Rule Type</label>
                  <select value={ruleType} onChange={e => setRuleType(e.target.value)} className="w-full border rounded p-2">
                    <option value="supervised_count">Supervised Session Count</option>
                    <option value="solo_count">Solo Session Count</option>
                    <option value="exam_pass">Exam Pass</option>
                    <option value="attendance_percentage">Attendance %</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Threshold Value</label>
                  <input 
                    type="number" 
                    value={thresholdValue} 
                    onChange={e => setThresholdValue(Number(e.target.value))} 
                    className="w-full border rounded p-2"
                  />
                </div>

                {ruleType === "supervised_count" && (
                  <div>
                    <label className="block text-sm font-medium mb-1">Target Curriculum Item ID (Optional)</label>
                    <input 
                      type="text" 
                      placeholder="Curriculum Item ID"
                      value={targetCurriculumItemId} 
                      onChange={e => setTargetCurriculumItemId(e.target.value)} 
                      className="w-full border rounded p-2"
                    />
                  </div>
                )}

                <button 
                  onClick={handleAddRequirement}
                  className="w-full bg-brand-500 text-white rounded-lg p-2.5 font-medium hover:bg-brand-600"
                >
                  Save Requirement
                </button>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default CertificationRules;
