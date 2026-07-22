import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Megaphone, Plus, Search, CheckCircle2, Clock, XCircle, Send, MessageSquare } from 'lucide-react';
import api from '../../api/axios';
import { toast } from 'react-hot-toast';

interface Campaign {
  _id: string;
  name: string;
  targetAudience: string;
  messageTemplate: string;
  status: 'draft' | 'sending' | 'completed' | 'failed';
  sentCount: number;
  totalTarget: number;
  createdAt: string;
}

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCampaign, setNewCampaign] = useState({
    name: '',
    targetAudience: 'all_clients',
    messageTemplate: 'Hi {{name}},\n\n'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const res = await api.get('/marketing');
      setCampaigns(res.data?.data || []);
    } catch (error) {
      toast.error('Failed to load campaigns');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post('/marketing', newCampaign);
      toast.success("Campaign created and launched!");
      setIsModalOpen(false);
      setNewCampaign({ name: '', targetAudience: 'all_clients', messageTemplate: 'Hi {{name}},\n\n' });
      fetchCampaigns();
    } catch (error) {
      toast.error("Failed to launch campaign");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredCampaigns = campaigns.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'completed': return <span className="flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full text-xs font-bold"><CheckCircle2 className="w-3 h-3"/> Completed</span>;
      case 'sending': return <span className="flex items-center gap-1.5 px-3 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded-full text-xs font-bold animate-pulse"><Clock className="w-3 h-3"/> Sending</span>;
      case 'failed': return <span className="flex items-center gap-1.5 px-3 py-1 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-full text-xs font-bold"><XCircle className="w-3 h-3"/> Failed</span>;
      default: return <span className="flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400 rounded-full text-xs font-bold">Draft</span>;
    }
  };

  const formatAudience = (aud: string) => {
    return aud.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 relative">
      <Helmet><title>Marketing Campaigns | BeautyStudio OS</title></Helmet>

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Marketing Campaigns</h1>
          <p className="text-gray-500 dark:text-gray-400">Automate your WhatsApp outreach</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-xl transition-colors shadow-lg shadow-brand-500/30"
        >
          <Plus className="w-5 h-5" /> New Campaign
        </button>
      </div>

      {/* Campaigns List */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
          <h2 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-brand-500" /> Campaign History
          </h2>
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search campaigns..." 
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
                <th className="px-6 py-4">Campaign Name</th>
                <th className="px-6 py-4">Audience</th>
                <th className="px-6 py-4">Sent / Target</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Created Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredCampaigns.map((camp) => (
                <tr key={camp._id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                  <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">
                    {camp.name}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-600 dark:text-gray-300">
                    {formatAudience(camp.targetAudience)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 max-w-[100px]">
                        <div className="bg-brand-500 h-2 rounded-full" style={{ width: `\${camp.totalTarget > 0 ? (camp.sentCount / camp.totalTarget) * 100 : 0}%` }}></div>
                      </div>
                      <span className="text-xs font-bold">{camp.sentCount} / {camp.totalTarget}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(camp.status)}
                  </td>
                  <td className="px-6 py-4">
                    {new Date(camp.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {filteredCampaigns.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    No marketing campaigns found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Campaign Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-4xl w-full flex overflow-hidden border border-gray-200 dark:border-gray-700">
            
            {/* Form Section */}
            <div className="flex-1 p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Create Campaign</h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 bg-gray-100 dark:bg-gray-700 rounded-full">
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleCreateCampaign} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Campaign Name</label>
                  <input 
                    type="text" required placeholder="e.g. Holiday Special Discount"
                    value={newCampaign.name} onChange={e => setNewCampaign({...newCampaign, name: e.target.value})}
                    className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none dark:text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Target Audience</label>
                  <select 
                    value={newCampaign.targetAudience} onChange={e => setNewCampaign({...newCampaign, targetAudience: e.target.value})}
                    className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none dark:text-white"
                  >
                    <option value="all_clients">All Clients</option>
                    <option value="inactive_clients">Inactive Clients (&gt;3 Months)</option>
                    <option value="academy_students">Academy Students</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Message Template (WhatsApp)</label>
                  <p className="text-xs text-gray-500 mb-2">Use <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">{"{{name}}"}</code> to personalize the message.</p>
                  <textarea 
                    required rows={6}
                    value={newCampaign.messageTemplate} onChange={e => setNewCampaign({...newCampaign, messageTemplate: e.target.value})}
                    className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none dark:text-white resize-none"
                  />
                </div>

                <button 
                  type="submit" disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-600 text-white font-bold py-4 rounded-xl transition-colors disabled:opacity-50"
                >
                  <Send className="w-5 h-5"/> {isSubmitting ? 'Launching...' : 'Launch Campaign'}
                </button>
              </form>
            </div>

            {/* Live Preview Section */}
            <div className="w-80 bg-gray-50 dark:bg-gray-900/50 p-8 border-l border-gray-200 dark:border-gray-700 hidden sm:block">
              <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-6 flex items-center gap-2">
                <MessageSquare className="w-4 h-4"/> Live Preview
              </h3>
              
              {/* Fake WhatsApp Bubble */}
              <div className="bg-[#E7FFDB] dark:bg-[#005C4B] p-4 rounded-2xl rounded-tr-sm shadow-sm relative">
                <p className="text-[#111B21] dark:text-white text-[15px] leading-relaxed whitespace-pre-wrap">
                  {newCampaign.messageTemplate.replace(/\{\{name\}\}/g, 'Sarah')}
                </p>
                <div className="text-right mt-1">
                  <span className="text-[11px] text-gray-500 dark:text-gray-300">10:42 AM</span>
                </div>
              </div>
              <p className="text-xs text-center text-gray-400 mt-6 mt-4">Preview shown for client "Sarah"</p>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
