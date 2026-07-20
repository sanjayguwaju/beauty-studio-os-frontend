import React from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";

const Developer: React.FC = () => {
  return (
    <div>
      <PageBreadcrumb pageTitle="Developer Settings" />
      
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
        <h2 className="text-lg font-bold text-gray-800 mb-2">API Keys</h2>
        <p className="text-sm text-gray-500 mb-4">Manage API keys to integrate StudioOS with your custom systems.</p>
        
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 flex justify-between items-center">
          <div>
            <p className="font-medium text-gray-800">Production Key</p>
            <p className="text-xs text-gray-500 mt-1">Created on Jul 20, 2026</p>
          </div>
          <div className="flex gap-2 items-center">
            <span className="text-sm font-mono bg-white border px-2 py-1 rounded text-gray-600">sk_live_****************</span>
            <button className="text-brand-600 text-sm font-medium hover:underline">Reveal</button>
          </div>
        </div>
        <button className="mt-4 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50">
          Generate New Key
        </button>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold text-gray-800 mb-2">Webhooks</h2>
        <p className="text-sm text-gray-500 mb-4">Receive real-time HTTP POST notifications when events occur in your studio.</p>
        
        <div className="border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-600 text-center py-4">No webhooks configured yet.</p>
        </div>
        
        <button className="mt-4 bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-700">
          Add Webhook Endpoint
        </button>
      </div>
    </div>
  );
};

export default Developer;
