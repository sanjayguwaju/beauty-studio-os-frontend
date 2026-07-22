import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Wallet, TrendingUp, CheckCircle2, Clock, Search, Download } from 'lucide-react';
import api from '../../api/axios';
import { toast } from 'react-hot-toast';

interface Commission {
  _id: string;
  staffPersonId: { _id: string; fullName: string; email: string };
  amount: number;
  percentage: number;
  sourceAmount: number;
  type: string;
  paid: boolean;
  createdAt: string;
}

export default function StaffPayroll() {
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // In a real app, this would be fetched from auth context
  const currentUser = { role: 'admin' }; 

  useEffect(() => {
    fetchCommissions();
  }, []);

  const fetchCommissions = async () => {
    try {
      // In MVP, we mock if the API isn't populated
      const res = await api.get('/billing/commissions');
      if (res.data?.data && res.data.data.length > 0) {
        setCommissions(res.data.data);
      } else {
        // Fallback mock data for visual demonstration
        setCommissions([
          {
            _id: '1',
            staffPersonId: { _id: 's1', fullName: 'Sarah Styles', email: 'sarah@beautystudio.com' },
            sourceAmount: 150,
            percentage: 40,
            amount: 60,
            type: 'service',
            paid: false,
            createdAt: new Date().toISOString()
          },
          {
            _id: '2',
            staffPersonId: { _id: 's1', fullName: 'Sarah Styles', email: 'sarah@beautystudio.com' },
            sourceAmount: 45,
            percentage: 10,
            amount: 4.5,
            type: 'retail',
            paid: true,
            createdAt: new Date(Date.now() - 86400000).toISOString()
          },
          {
            _id: '3',
            staffPersonId: { _id: 's2', fullName: 'Mike Color', email: 'mike@beautystudio.com' },
            sourceAmount: 200,
            percentage: 40,
            amount: 80,
            type: 'service',
            paid: false,
            createdAt: new Date().toISOString()
          }
        ]);
      }
    } catch (error) {
      toast.error('Failed to load payroll data');
    } finally {
      setIsLoading(false);
    }
  };

  const markAsPaid = async (id: string) => {
    try {
      // If using mock data, update locally. Else API.
      if (id.length < 5) {
        setCommissions(prev => prev.map(c => c._id === id ? { ...c, paid: true } : c));
        toast.success("Marked as paid");
        return;
      }
      
      await api.post(`/billing/commissions/\${id}/pay`);
      toast.success("Marked as paid");
      fetchCommissions();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const filteredCommissions = commissions.filter(c => 
    c.staffPersonId.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalEarned = filteredCommissions.reduce((sum, c) => sum + c.amount, 0);
  const pendingPayout = filteredCommissions.filter(c => !c.paid).reduce((sum, c) => sum + c.amount, 0);
  const paidPayout = filteredCommissions.filter(c => c.paid).reduce((sum, c) => sum + c.amount, 0);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <Helmet><title>Payroll | BeautyStudio OS</title></Helmet>

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Staff Payroll</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage commissions and staff payouts</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Commissions</p>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">$\${totalEarned.toFixed(2)}</h3>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 rounded-xl flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Pending Payout</p>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">$\${pendingPayout.toFixed(2)}</h3>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-xl flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Paid Out</p>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">$\${paidPayout.toFixed(2)}</h3>
          </div>
        </div>
      </div>

      {/* Ledger */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
          <h2 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Wallet className="w-5 h-5 text-brand-500" /> Commission Ledger
          </h2>
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search staff..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
            <thead className="bg-gray-50 dark:bg-gray-800/50 text-xs uppercase text-gray-700 dark:text-gray-300">
              <tr>
                <th className="px-6 py-4">Staff Member</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Source Type</th>
                <th className="px-6 py-4">Sale Amount</th>
                <th className="px-6 py-4">Comm. %</th>
                <th className="px-6 py-4 font-bold text-gray-900 dark:text-white">Earned</th>
                <th className="px-6 py-4">Status</th>
                {currentUser.role === 'admin' && <th className="px-6 py-4 text-right">Action</th>}
              </tr>
            </thead>
            <tbody>
              {filteredCommissions.map((comm) => (
                <tr key={comm._id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                    {comm.staffPersonId.fullName}
                  </td>
                  <td className="px-6 py-4">
                    {new Date(comm.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 capitalize">
                    {comm.type}
                  </td>
                  <td className="px-6 py-4">
                    $\${comm.sourceAmount?.toFixed(2) || '0.00'}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-block px-2.5 py-0.5 rounded-md bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-400 font-medium">
                      {comm.percentage}%
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">
                    $\${comm.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    {comm.paid ? (
                      <span className="flex items-center gap-1.5 text-green-600 font-medium"><CheckCircle2 className="w-4 h-4"/> Paid</span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-yellow-600 font-medium"><Clock className="w-4 h-4"/> Pending</span>
                    )}
                  </td>
                  {currentUser.role === 'admin' && (
                    <td className="px-6 py-4 text-right">
                      {!comm.paid && (
                        <button 
                          onClick={() => markAsPaid(comm._id)}
                          className="text-brand-600 hover:text-brand-800 font-medium transition-colors"
                        >
                          Mark Paid
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
              {filteredCommissions.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                    No commission records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
