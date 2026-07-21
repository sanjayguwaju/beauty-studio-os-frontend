import React, { useState, useEffect } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import api from "../../api/axios";
import { io } from "socket.io-client";

const NotificationLogs: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    fetchLogs();

    const socket = io(import.meta.env.VITE_API_URL || "http://localhost:5000", {
      withCredentials: true,
      auth: { token: localStorage.getItem("accessToken") }
    });

    socket.on("notification_sent", (log) => {
      setLogs((prev) => [log, ...prev].slice(0, 100)); // Keep top 100
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await api.get("/notifications/logs");
      if (res.data.success) {
        setLogs(res.data.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="Notification Logs" />
      
      <div className="rounded-2xl border border-gray-200 bg-white p-5">
        <h3 className="font-semibold text-gray-800 mb-6">Recent Sent Messages (Mock Sender)</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-500">
            <thead className="bg-gray-50 text-xs uppercase text-gray-700">
              <tr>
                <th className="px-6 py-3">Timestamp</th>
                <th className="px-6 py-3">Recipient</th>
                <th className="px-6 py-3">Channel</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 max-w-md">Message Content</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, idx) => (
                <tr key={log._id || idx} className="border-b bg-white hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{new Date(log.createdAt).toLocaleString()}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {log.personId ? log.personId.fullName : "Internal Alert"}
                    <br/><span className="text-xs text-gray-500">{log.recipientContact}</span>
                  </td>
                  <td className="px-6 py-4 uppercase font-bold text-gray-600">{log.channel}</td>
                  <td className="px-6 py-4">
                    {log.status === 'sent' ? (
                      <span className="px-2 py-1 text-xs rounded-full bg-success-100 text-success-800 font-medium">Sent (Mock)</span>
                    ) : (
                      <span className="px-2 py-1 text-xs rounded-full bg-warning-100 text-warning-800 font-medium capitalize">{log.status}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-xs">
                    {log.sentContent}
                  </td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr><td colSpan={5} className="px-6 py-4 text-center">No logs found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default NotificationLogs;
