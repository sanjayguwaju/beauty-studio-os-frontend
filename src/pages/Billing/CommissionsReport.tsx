import React, { useState, useEffect } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import api from "../../api/axios";

const CommissionsReport: React.FC = () => {
  const [commissions, setCommissions] = useState<any[]>([]);

  useEffect(() => {
    fetchCommissions();
  }, []);

  const fetchCommissions = async () => {
    try {
      const res = await api.get("/billing/commissions");
      if (res.data.success) {
        setCommissions(res.data.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleMarkPaid = async (id: string) => {
    try {
      await api.post(`/billing/commissions/${id}/pay`);
      fetchCommissions();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="Staff Commissions Report" />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
        
        <p className="text-sm text-gray-500 mb-6">
          Commissions are automatically generated when a <strong>Stylist</strong> completes a solo service.
          Supervised student sessions do not generate commissions.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-500">
            <thead className="bg-gray-50 text-xs uppercase text-gray-700">
              <tr>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Stylist</th>
                <th className="px-6 py-3">Basis</th>
                <th className="px-6 py-3">Amount Earned</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {commissions.map(c => (
                <tr key={c._id} className="border-b bg-white hover:bg-gray-50">
                  <td className="px-6 py-4">{new Date(c.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">{c.staffPersonId?.fullName}</td>
                  <td className="px-6 py-4 capitalize">{c.basis.replace('_', ' ')}</td>
                  <td className="px-6 py-4 font-semibold text-success-600">${c.amount.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    {c.paid ? (
                      <span className="px-2 py-1 text-xs rounded-full bg-success-100 text-success-800 font-medium">Paid</span>
                    ) : (
                      <span className="px-2 py-1 text-xs rounded-full bg-warning-100 text-warning-800 font-medium">Unpaid</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {!c.paid && (
                      <button onClick={() => handleMarkPaid(c._id)} className="text-brand-500 hover:underline">
                        Mark Paid
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {commissions.length === 0 && (
                <tr><td colSpan={6} className="px-6 py-4 text-center">No commissions found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CommissionsReport;
