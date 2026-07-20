import React, { useState, useEffect } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import api from "../../utils/api";

interface Client {
  _id: string;
  personId: {
    _id: string;
    fullName: string;
    phone: string;
    email: string;
  };
  preferences: string[];
  allergyNotes: string;
  patchTestOnFile: boolean;
}

const Clients: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchClients = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/clients?search=${search}`);
      if (response.data.success) {
        setClients(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch clients", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, [search]);

  return (
    <div>
      <PageBreadcrumb pageTitle="Clients" />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
        <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Clients Directory</h3>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search by name or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
            <button className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600">
              Add Client
            </button>
          </div>
        </div>

        {loading ? (
          <p className="text-gray-500 dark:text-gray-400">Loading clients...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
              <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Phone</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Patch Test</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((client) => (
                  <tr key={client._id} className="border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{client.personId.fullName}</td>
                    <td className="px-6 py-4">{client.personId.phone || '-'}</td>
                    <td className="px-6 py-4">{client.personId.email || '-'}</td>
                    <td className="px-6 py-4">
                      {client.patchTestOnFile ? (
                        <span className="text-success-600">Yes</span>
                      ) : (
                        <span className="text-error-500">No</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <button className="text-brand-500 hover:underline">View Profile</button>
                    </td>
                  </tr>
                ))}
                {clients.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center">No clients found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Clients;
