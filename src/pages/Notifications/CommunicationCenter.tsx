import React, { useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import api from "../../utils/api";

const CommunicationCenter: React.FC = () => {
  const [audience, setAudience] = useState("all_clients");
  const [channel, setChannel] = useState("sms");
  const [messageBody, setMessageBody] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!messageBody) {
      alert("Please enter a message body");
      return;
    }

    if (!window.confirm(`Are you sure you want to queue this message for ${audience.replace('_', ' ')}?`)) {
      return;
    }

    setIsLoading(true);
    try {
      const res = await api.post("/notifications/send-promo", {
        audience, channel, messageBody
      });
      alert(`Success! ${res.data.message}`);
      setMessageBody("");
    } catch (e: any) {
      alert(e.response?.data?.message || "Failed to send promotional messages");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="Communication Center" />
      
      <div className="max-w-2xl rounded-2xl border border-gray-200 bg-white p-6">
        <h3 className="font-semibold text-gray-800 mb-2">Send Bulk Promotions & Updates</h3>
        <p className="text-sm text-gray-500 mb-6">
          Use this tool to broadcast messages to specific segments of your users. 
          Messages are queued and sent in the background.
        </p>

        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Target Audience</label>
              <select value={audience} onChange={e => setAudience(e.target.value)} className="w-full border rounded-lg p-2.5">
                <option value="all_clients">All Clients</option>
                <option value="all_students">All Students</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Channel</label>
              <select value={channel} onChange={e => setChannel(e.target.value)} className="w-full border rounded-lg p-2.5">
                <option value="sms">SMS</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="email">Email</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Message Body</label>
            <textarea 
              value={messageBody} 
              onChange={e => setMessageBody(e.target.value)} 
              className="w-full border rounded-lg p-3 h-32" 
              placeholder="E.g., Hi {{clientName}}, grab a 20% discount on haircuts this weekend!"
            ></textarea>
            <p className="text-xs text-gray-500 mt-1">Available variables: {'{{clientName}}'}</p>
          </div>

          <button 
            onClick={handleSend} 
            disabled={isLoading}
            className={`w-full text-white p-3 rounded-lg font-bold transition-colors ${
              isLoading ? 'bg-gray-400' : 'bg-brand-500 hover:bg-brand-600'
            }`}
          >
            {isLoading ? "Queueing Messages..." : "Send Bulk Message"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommunicationCenter;
