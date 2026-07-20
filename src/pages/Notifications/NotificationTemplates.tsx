import React, { useState, useEffect } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import api from "../../utils/api";
import { Modal } from "../../components/ui/modal";

const NotificationTemplates: React.FC = () => {
  const [templates, setTemplates] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentId, setCurrentId] = useState("");

  const [channel, setChannel] = useState("sms");
  const [triggerType, setTriggerType] = useState("appointment_reminder");
  const [subject, setSubject] = useState("");
  const [bodyTemplate, setBodyTemplate] = useState("");

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const res = await api.get("/notifications/templates");
      if (res.data.success) {
        setTemplates(res.data.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSave = async () => {
    try {
      const payload = { channel, triggerType, subject, bodyTemplate };
      if (isEdit) {
        await api.put(`/notifications/templates/${currentId}`, payload);
      } else {
        await api.post("/notifications/templates", payload);
      }
      setIsModalOpen(false);
      fetchTemplates();
      resetForm();
    } catch (e: any) {
      alert(e.response?.data?.message || "Failed to save template");
    }
  };

  const openNew = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEdit = (tmpl: any) => {
    setIsEdit(true);
    setCurrentId(tmpl._id);
    setChannel(tmpl.channel);
    setTriggerType(tmpl.triggerType);
    setSubject(tmpl.subject || "");
    setBodyTemplate(tmpl.bodyTemplate);
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setIsEdit(false);
    setCurrentId("");
    setChannel("sms");
    setTriggerType("appointment_reminder");
    setSubject("");
    setBodyTemplate("");
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="Notification Templates" />
      <div className="rounded-2xl border border-gray-200 bg-white p-5">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-semibold text-gray-800">Manage Message Templates</h3>
          <button onClick={openNew} className="bg-brand-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-brand-600">
            + New Template
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-500">
            <thead className="bg-gray-50 text-xs uppercase text-gray-700">
              <tr>
                <th className="px-6 py-3">Trigger Type</th>
                <th className="px-6 py-3">Channel</th>
                <th className="px-6 py-3">Template Preview</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {templates.map(tmpl => (
                <tr key={tmpl._id} className="border-b bg-white hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900 capitalize">{tmpl.triggerType.replace('_', ' ')}</td>
                  <td className="px-6 py-4 uppercase font-bold text-gray-600">{tmpl.channel}</td>
                  <td className="px-6 py-4 truncate max-w-xs">{tmpl.bodyTemplate}</td>
                  <td className="px-6 py-4">
                    <button onClick={() => openEdit(tmpl)} className="text-brand-500 hover:underline">Edit</button>
                  </td>
                </tr>
              ))}
              {templates.length === 0 && (
                <tr><td colSpan={4} className="px-6 py-4 text-center">No templates configured.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} className="max-w-md p-6">
        <h3 className="text-lg font-semibold mb-4">{isEdit ? "Edit Template" : "New Template"}</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Trigger Event</label>
            <select value={triggerType} onChange={e => setTriggerType(e.target.value)} disabled={isEdit} className="w-full border rounded p-2">
              <option value="appointment_reminder">Appointment Reminder</option>
              <option value="class_alert">Class Alert</option>
              <option value="certificate_ready">Certificate Ready</option>
              <option value="low_stock">Low Stock</option>
              <option value="promo">Promotional / Bulk Send</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Channel</label>
            <select value={channel} onChange={e => setChannel(e.target.value)} disabled={isEdit} className="w-full border rounded p-2">
              <option value="sms">SMS</option>
              <option value="whatsapp">WhatsApp</option>
              <option value="email">Email</option>
            </select>
          </div>
          {channel === "email" && (
            <div>
              <label className="block text-sm font-medium mb-1">Subject</label>
              <input type="text" value={subject} onChange={e => setSubject(e.target.value)} className="w-full border rounded p-2" />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium mb-1">Message Body</label>
            <textarea 
              value={bodyTemplate} 
              onChange={e => setBodyTemplate(e.target.value)} 
              className="w-full border rounded p-2" 
              rows={4}
              placeholder="Hi {{clientName}}, this is a reminder..."
            ></textarea>
            <p className="text-xs text-gray-500 mt-1">Available variables: {'{{clientName}}, {{time}}, {{productName}}, {{certNumber}}'}</p>
          </div>
          <button onClick={handleSave} className="w-full bg-brand-500 text-white p-2 rounded hover:bg-brand-600 font-medium">
            Save Template
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default NotificationTemplates;
