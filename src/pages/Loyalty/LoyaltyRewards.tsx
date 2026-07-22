import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Star, Gift, TrendingUp, Trophy, Clock } from 'lucide-react';
import api from '../../api/axios';
import { toast } from 'react-hot-toast';

interface LeaderboardClient {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  loyaltyPoints: number;
}

interface LoyaltyTransaction {
  _id: string;
  personId: { fullName: string; email: string };
  type: 'earn' | 'redeem';
  points: number;
  description: string;
  createdAt: string;
}

export default function LoyaltyRewards() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardClient[]>([]);
  const [transactions, setTransactions] = useState<LoyaltyTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchLoyaltyData();
  }, []);

  const fetchLoyaltyData = async () => {
    try {
      const res = await api.get('/loyalty/dashboard');
      if (res.data?.data) {
        setLeaderboard(res.data.data.leaderboard || []);
        setTransactions(res.data.data.recentTransactions || []);
      }
    } catch (error) {
      toast.error('Failed to load loyalty data');
      // Mock data for UI demonstration
      setLeaderboard([
        { _id: '1', fullName: 'Jessica Alba', email: 'jess@gmail.com', phone: '9800000004', loyaltyPoints: 450 },
        { _id: '2', fullName: 'Emma Watson', email: 'emma@gmail.com', phone: '9800000003', loyaltyPoints: 320 },
      ]);
      setTransactions([
        { _id: 't1', personId: { fullName: 'Jessica Alba', email: 'jess@gmail.com' }, type: 'earn', points: 150, description: 'Earned from POS Purchase', createdAt: new Date().toISOString() },
        { _id: 't2', personId: { fullName: 'Emma Watson', email: 'emma@gmail.com' }, type: 'redeem', points: 100, description: 'Redeemed for $1.00 discount', createdAt: new Date(Date.now() - 86400000).toISOString() },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <Helmet><title>Loyalty & Rewards | BeautyStudio OS</title></Helmet>

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Loyalty & Rewards</h1>
          <p className="text-gray-500 dark:text-gray-400">Track client points and redemptions</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Leaderboard */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Trophy className="w-24 h-24 text-brand-500" />
            </div>
            
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-brand-500" /> Top Clients
            </h2>

            <div className="space-y-4 relative z-10">
              {leaderboard.map((client, index) => (
                <div key={client._id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-4">
                    <div className={\`w-8 h-8 rounded-full flex items-center justify-center font-bold \${index === 0 ? 'bg-yellow-100 text-yellow-600' : index === 1 ? 'bg-gray-200 text-gray-600' : index === 2 ? 'bg-orange-100 text-orange-700' : 'bg-brand-50 text-brand-600'}\`}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white">{client.fullName}</p>
                      <p className="text-xs text-gray-500">{client.phone}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-brand-600 dark:text-brand-400 text-lg">{client.loyaltyPoints}</div>
                    <div className="text-xs font-medium text-gray-400 uppercase">Points</div>
                  </div>
                </div>
              ))}
              {leaderboard.length === 0 && (
                <p className="text-center text-gray-500 py-4">No points awarded yet.</p>
              )}
            </div>
          </div>
        </div>

        {/* Transaction History */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden h-full">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
              <h2 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-brand-500" /> Recent Transactions
              </h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
                <thead className="bg-white dark:bg-gray-800 text-xs uppercase text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    <th className="px-6 py-4">Client</th>
                    <th className="px-6 py-4">Action</th>
                    <th className="px-6 py-4 text-right">Points</th>
                    <th className="px-6 py-4">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {transactions.map((t) => (
                    <tr key={t._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-bold text-gray-900 dark:text-white">{t.personId.fullName}</p>
                        <p className="text-xs">{t.description}</p>
                      </td>
                      <td className="px-6 py-4">
                        {t.type === 'earn' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                            <TrendingUp className="w-3 h-3" /> Earned
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">
                            <Gift className="w-3 h-3" /> Redeemed
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className={\`font-bold text-lg \${t.type === 'earn' ? 'text-green-600' : 'text-purple-600'}\`}>
                          {t.type === 'earn' ? '+' : '-'}{t.points}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-medium">
                        {new Date(t.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                  {transactions.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                        No transactions found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
