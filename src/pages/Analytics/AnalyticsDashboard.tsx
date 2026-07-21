import React, { useState, useEffect } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import api from "../../api/axios";

const AnalyticsDashboard: React.FC = () => {
  const [kpis, setKpis] = useState<any>(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchKpis = async () => {
    try {
      let query = "";
      if (startDate) query += `startDate=${startDate}&`;
      if (endDate) query += `endDate=${endDate}`;
      
      const res = await api.get(`/reports/kpis?${query}`);
      if (res.data.success) {
        setKpis(res.data.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchKpis();
  }, [startDate, endDate]);

  const handleExport = (type: string) => {
    let url = `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/v1/reports/export?type=${type}`;
    if (startDate) url += `&startDate=${startDate}`;
    if (endDate) url += `&endDate=${endDate}`;
    window.open(url, '_blank');
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="Analytics & Reporting" />

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-4 items-end mb-6">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Start Date</label>
          <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="border rounded px-3 py-1.5 text-sm" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">End Date</label>
          <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="border rounded px-3 py-1.5 text-sm" />
        </div>
        <button onClick={() => {setStartDate(""); setEndDate("");}} className="text-sm text-gray-500 hover:text-gray-700 underline">
          Clear Filters
        </button>
      </div>

      {kpis ? (
        <div className="space-y-6">
          {/* Revenue Split */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-800 text-lg">Revenue Split</h3>
              <button onClick={() => handleExport("revenue")} className="text-sm text-brand-500 hover:underline">
                Export Revenue (CSV)
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col justify-center items-center">
                <span className="text-gray-500 text-sm font-medium">Total Revenue</span>
                <span className="text-3xl font-bold text-gray-900 mt-2">${kpis.revenue.total.toLocaleString()}</span>
              </div>
              <div className="p-5 bg-brand-50 rounded-xl shadow-sm border border-brand-100 flex flex-col justify-center items-center">
                <span className="text-brand-600 text-sm font-medium">Salon Services</span>
                <span className="text-3xl font-bold text-brand-700 mt-2">${kpis.revenue.salon.toLocaleString()}</span>
              </div>
              <div className="p-5 bg-blue-50 rounded-xl shadow-sm border border-blue-100 flex flex-col justify-center items-center">
                <span className="text-blue-600 text-sm font-medium">Academy Courses</span>
                <span className="text-3xl font-bold text-blue-700 mt-2">${kpis.revenue.academy.toLocaleString()}</span>
              </div>
            </div>
            {/* MVP Simple Bar Visual */}
            <div className="mt-4 w-full h-8 bg-gray-200 rounded-full flex overflow-hidden">
              <div className="h-full bg-brand-500" style={{ width: `${kpis.revenue.total ? (kpis.revenue.salon / kpis.revenue.total) * 100 : 0}%` }} title="Salon"></div>
              <div className="h-full bg-blue-500" style={{ width: `${kpis.revenue.total ? (kpis.revenue.academy / kpis.revenue.total) * 100 : 0}%` }} title="Academy"></div>
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* Operational Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-bold text-gray-800 text-lg mb-4">Branch Occupancy</h3>
              <div className="p-5 bg-white rounded-xl shadow-sm border border-gray-100">
                <p className="text-sm text-gray-500">Total Booked Appointments</p>
                <p className="text-4xl font-bold text-gray-900 mt-2">{kpis.appointmentsBooked}</p>
                <p className="text-xs text-gray-400 mt-2">Versus available staff hours (Staff utilization placeholder)</p>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-800 text-lg">Enrollment Funnel</h3>
                <button onClick={() => handleExport("funnel")} className="text-sm text-brand-500 hover:underline">
                  Export Funnel (CSV)
                </button>
              </div>
              <div className="p-5 bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Enrolled</span>
                  <span className="font-bold">{kpis.enrollmentFunnel.enrolled}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                  <div className="bg-blue-400 h-2 rounded-full" style={{ width: '100%' }}></div>
                </div>

                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Certified (Completed)</span>
                  <span className="font-bold">{kpis.enrollmentFunnel.certified}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-success-500 h-2 rounded-full" style={{ width: `${kpis.enrollmentFunnel.enrolled ? (kpis.enrollmentFunnel.certified / kpis.enrollmentFunnel.enrolled) * 100 : 0}%` }}></div>
                </div>
              </div>
            </div>
          </div>

        </div>
      ) : (
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-6 py-1">
            <div className="h-32 bg-gray-200 rounded-xl"></div>
            <div className="h-32 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsDashboard;
