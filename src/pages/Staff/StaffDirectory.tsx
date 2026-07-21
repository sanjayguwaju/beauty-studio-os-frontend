import React, { useState, useEffect } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import api from "../../api/axios";

interface Staff {
  _id: string;
  personId: {
    _id: string;
    fullName: string;
    phone: string;
    email: string;
  };
  specialties: string[];
  workingHours: { day: string; start: string; end: string }[];
}

const StaffDirectory: React.FC = () => {
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchStaff = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/staff?search=${search}`);
      if (response.data.success) {
        setStaffList(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch staff", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, [search]);

  return (
    <div>
      <PageBreadcrumb pageTitle="Staff Directory" />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
        <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Staff Members</h3>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search by name or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
            <button className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600">
              Add Staff
            </button>
          </div>
        </div>

        {loading ? (
          <p className="text-gray-500 dark:text-gray-400">Loading staff...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
              <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Contact</th>
                  <th className="px-6 py-3">Specialties</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {staffList.map((staff) => (
                  <tr key={staff._id} className="border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{staff.personId.fullName}</td>
                    <td className="px-6 py-4">
                      {staff.personId.phone} <br/>
                      <span className="text-xs text-gray-400">{staff.personId.email}</span>
                    </td>
                    <td className="px-6 py-4">
                      {staff.specialties.map(s => (
                        <span key={s} className="mr-1 capitalize inline-block px-2 py-1 text-xs bg-gray-100 rounded-full">{s}</span>
                      ))}
                    </td>
                    <td className="px-6 py-4">
                      <button className="text-brand-500 hover:underline">View Profile</button>
                    </td>
                  </tr>
                ))}
                {staffList.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center">No staff found.</td>
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

export default StaffDirectory;
