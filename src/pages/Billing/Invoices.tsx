import React, { useState, useEffect } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import api from "../../utils/api";

const Invoices: React.FC = () => {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [filterType, setFilterType] = useState<string>("");

  useEffect(() => {
    fetchInvoices();
  }, [filterType]);

  const fetchInvoices = async () => {
    try {
      const url = filterType ? `/billing/invoices?type=${filterType}` : "/billing/invoices";
      const res = await api.get(url);
      if (res.data.success) {
        setInvoices(res.data.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="Invoices & Billing" />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
        
        <div className="mb-6 max-w-md">
          <label className="block text-sm font-medium text-gray-700 mb-2">Filter Ledger Type</label>
          <select 
            value={filterType} 
            onChange={e => setFilterType(e.target.value)}
            className="w-full border rounded-lg p-2.5 bg-gray-50"
          >
            <option value="">All Invoices</option>
            <option value="service">Salon Services Only</option>
            <option value="course_fee">Academy Course Fees Only</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-500">
            <thead className="bg-gray-50 text-xs uppercase text-gray-700">
              <tr>
                <th className="px-6 py-3">Date Issued</th>
                <th className="px-6 py-3">Client / Student</th>
                <th className="px-6 py-3">Type</th>
                <th className="px-6 py-3">Total Amount</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map(inv => (
                <tr key={inv._id} className="border-b bg-white hover:bg-gray-50">
                  <td className="px-6 py-4">{new Date(inv.issuedAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">{inv.clientOrStudentPersonId?.fullName}</td>
                  <td className="px-6 py-4">
                    {inv.type === "service" ? (
                      <span className="px-2 py-1 text-xs rounded-md bg-blue-100 text-blue-800 font-medium">Service</span>
                    ) : (
                      <span className="px-2 py-1 text-xs rounded-md bg-purple-100 text-purple-800 font-medium">Course Fee</span>
                    )}
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-900">${inv.totalAmount.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    {inv.status === "paid" ? (
                      <span className="text-success-600 font-medium capitalize">{inv.status}</span>
                    ) : (
                      <span className="text-warning-600 font-medium capitalize">{inv.status}</span>
                    )}
                  </td>
                </tr>
              ))}
              {invoices.length === 0 && (
                <tr><td colSpan={5} className="px-6 py-4 text-center">No invoices found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Invoices;
