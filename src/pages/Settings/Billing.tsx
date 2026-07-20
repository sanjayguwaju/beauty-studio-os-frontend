import React from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";

const Billing: React.FC = () => {
  return (
    <div>
      <PageBreadcrumb pageTitle="Billing & Subscriptions" />
      
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Current Plan: Starter</h2>
        <p className="text-sm text-gray-600 mb-6">
          You are currently on the Starter plan. Your trial ends in 14 days.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-brand-500 rounded-lg p-5 bg-brand-50 relative">
            <div className="absolute top-0 right-0 bg-brand-500 text-white px-3 py-1 text-xs font-bold rounded-bl-lg rounded-tr-lg">CURRENT</div>
            <h3 className="font-bold text-gray-900 text-lg">Starter</h3>
            <p className="text-3xl font-extrabold mt-2">$49<span className="text-sm font-normal text-gray-500">/mo</span></p>
            <ul className="mt-4 space-y-2 text-sm text-gray-700">
              <li>✓ Core Studio Features</li>
              <li>✓ Point of Sale & Billing</li>
              <li>✓ Up to 5 Staff Members</li>
            </ul>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-5 hover:border-brand-300 transition-colors">
            <h3 className="font-bold text-gray-900 text-lg">Professional</h3>
            <p className="text-3xl font-extrabold mt-2">$99<span className="text-sm font-normal text-gray-500">/mo</span></p>
            <ul className="mt-4 space-y-2 text-sm text-gray-700">
              <li>✓ All Starter Features</li>
              <li>✓ Beauty Academy Module</li>
              <li>✓ AI Layer (OCR & Recommendations)</li>
            </ul>
            <button className="mt-6 w-full bg-brand-600 text-white py-2 rounded-lg font-medium hover:bg-brand-700">
              Upgrade to Professional
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Payment Methods</h2>
        <div className="flex gap-4">
          <button className="border border-gray-300 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center gap-2">
            <span className="text-blue-600 font-bold">stripe</span> Add Credit Card
          </button>
          <button className="border border-gray-300 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center gap-2">
            <span className="text-green-600 font-bold">eSewa</span> Link Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default Billing;
