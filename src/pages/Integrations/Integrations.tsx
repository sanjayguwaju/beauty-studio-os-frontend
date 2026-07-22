import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { MessageSquare, CheckCircle, Smartphone } from 'lucide-react';
import api from '../../api/axios';

export default function Integrations() {
  const [whatsappStatus, setWhatsappStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
  const [qrCode, setQrCode] = useState<string | null>(null);

  const connectWhatsApp = async () => {
    try {
      setWhatsappStatus('connecting');
      // Create instance
      await api.post('/integrations/evolution/instance/create');
      
      // Fetch QR Code
      const res = await api.get('/integrations/evolution/instance/qrcode');
      if (res.data?.data?.base64) {
        setQrCode(res.data.data.base64);
      } else {
        // Fallback or assume connected if already connected
        setWhatsappStatus('connected');
      }
    } catch (error) {
      console.error(error);
      setWhatsappStatus('disconnected');
    }
  };

  return (
    <div className="space-y-6">
      <Helmet>
        <title>Social Integrations | BeautyStudio OS</title>
      </Helmet>

      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Social Integrations
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Connect your social media accounts to manage messages in the Omnichannel Inbox.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* WhatsApp Integration Card */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">WhatsApp</h3>
              <p className="text-sm text-gray-500">via Evolution API</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Connect your studio's WhatsApp number to reply to clients and send automated booking reminders.
            </p>

            {whatsappStatus === 'disconnected' && (
              <button 
                onClick={connectWhatsApp}
                className="w-full flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-600 text-white font-medium py-2.5 rounded-xl transition-colors"
              >
                <Smartphone className="w-4 h-4" /> Connect WhatsApp
              </button>
            )}

            {whatsappStatus === 'connecting' && qrCode && (
              <div className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <p className="text-sm font-medium mb-3">Scan with WhatsApp</p>
                <img src={qrCode} alt="WhatsApp QR Code" className="w-48 h-48 bg-white p-2 rounded-lg" />
                <button 
                  onClick={() => setWhatsappStatus('connected')} // Mock manual transition
                  className="mt-4 text-brand-500 text-sm font-medium hover:underline"
                >
                  Simulate Connection Success
                </button>
              </div>
            )}

            {whatsappStatus === 'connected' && (
              <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-xl">
                <div className="flex items-center gap-2 font-medium">
                  <CheckCircle className="w-5 h-5" /> Connected
                </div>
                <button 
                  onClick={() => { setWhatsappStatus('disconnected'); setQrCode(null); }}
                  className="text-xs font-semibold hover:underline"
                >
                  Disconnect
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Instagram Integration Card */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm opacity-60">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-pink-100 text-pink-600 rounded-xl flex items-center justify-center">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Instagram</h3>
              <p className="text-sm text-gray-500">Coming Soon</p>
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
            Reply to Instagram DMs and story replies directly from your inbox.
          </p>
          <button disabled className="w-full bg-gray-100 dark:bg-gray-800 text-gray-400 font-medium py-2.5 rounded-xl cursor-not-allowed">
            Connect Instagram
          </button>
        </div>

        {/* Facebook Integration Card */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm opacity-60">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Facebook</h3>
              <p className="text-sm text-gray-500">Coming Soon</p>
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
            Manage your Facebook Page messenger inbox.
          </p>
          <button disabled className="w-full bg-gray-100 dark:bg-gray-800 text-gray-400 font-medium py-2.5 rounded-xl cursor-not-allowed">
            Connect Facebook
          </button>
        </div>

      </div>
    </div>
  );
}
