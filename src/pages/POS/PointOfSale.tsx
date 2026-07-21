import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Search, ShoppingBag, Plus, Minus, Trash2, CreditCard, Banknote, QrCode, User, FileText } from 'lucide-react';
import api from '../../api/axios';
import { toast } from 'react-hot-toast';

interface CatalogItem {
  id: string;
  name: string;
  price: number;
  category: 'service' | 'product';
  image: string;
}

interface CartItem extends CatalogItem {
  quantity: number;
}

export default function PointOfSale() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'service' | 'product'>('all');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'qr'>('card');
  const [clientType, setClientType] = useState<'walk-in' | 'existing'>('walk-in');
  
  // Mock Catalog Data
  const catalog: CatalogItem[] = [
    { id: '1', name: 'Premium Haircut', price: 45.00, category: 'service', image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=200' },
    { id: '2', name: 'Balayage Color', price: 150.00, category: 'service', image: 'https://images.unsplash.com/photo-1600948836101-f9ffda59d250?auto=format&fit=crop&q=80&w=200' },
    { id: '3', name: 'Bridal Makeup', price: 200.00, category: 'service', image: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&q=80&w=200' },
    { id: '4', name: 'Olaplex No. 3', price: 30.00, category: 'product', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80&w=200' },
    { id: '5', name: 'Moroccan Oil 100ml', price: 45.00, category: 'product', image: 'https://images.unsplash.com/photo-1585232351009-aaa08fb565c8?auto=format&fit=crop&q=80&w=200' },
    { id: '6', name: 'Keratin Shampoo', price: 25.00, category: 'product', image: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4aed?auto=format&fit=crop&q=80&w=200' },
  ];

  const filteredCatalog = catalog.filter(item => 
    (filter === 'all' || item.category === filter) &&
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addToCart = (item: CatalogItem) => {
    setCart(prev => {
      const existing = prev.find(c => c.id === item.id);
      if (existing) {
        return prev.map(c => c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(c => {
      if (c.id === id) {
        const newQty = c.quantity + delta;
        return newQty > 0 ? { ...c, quantity: newQty } : c;
      }
      return c;
    }));
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(c => c.id !== id));
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.13;
  const total = subtotal + tax;

  const handleCheckout = async () => {
    if (cart.length === 0) return toast.error("Cart is empty");
    setIsProcessing(true);
    
    try {
      const payload = {
        clientPersonId: null, // Walk-in for now
        paymentMethod,
        lineItems: cart.map(item => ({
          name: item.name,
          amount: item.price,
          quantity: item.quantity
        }))
      };

      const res = await api.post('/billing/pos-checkout', payload);
      const invoiceId = res.data.data._id;

      toast.success("Checkout Successful!");
      setCart([]);
      
      // Auto-trigger PDF download
      window.open(\`http://localhost:5000/api/v1/billing/invoices/\${invoiceId}/pdf\`, '_blank');
      
    } catch (error) {
      console.error(error);
      toast.error("Checkout failed");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-100px)] overflow-hidden bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
      <Helmet>
        <title>POS Kiosk | BeautyStudio OS</title>
      </Helmet>

      {/* Left Column - Catalog */}
      <div className="flex-1 flex flex-col min-w-0 border-r border-gray-200 dark:border-gray-800">
        <div className="p-6 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Point of Sale</h1>
            <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
              <button 
                onClick={() => setFilter('all')}
                className={\`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors \${filter === 'all' ? 'bg-white dark:bg-gray-700 shadow-sm' : 'text-gray-500'}\`}
              >All</button>
              <button 
                onClick={() => setFilter('service')}
                className={\`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors \${filter === 'service' ? 'bg-white dark:bg-gray-700 shadow-sm' : 'text-gray-500'}\`}
              >Services</button>
              <button 
                onClick={() => setFilter('product')}
                className={\`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors \${filter === 'product' ? 'bg-white dark:bg-gray-700 shadow-sm' : 'text-gray-500'}\`}
              >Retail</button>
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search catalog..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition-all dark:text-white"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50 dark:bg-gray-900/50">
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredCatalog.map(item => (
              <div 
                key={item.id} 
                onClick={() => addToCart(item)}
                className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-brand-500 hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="h-32 w-full overflow-hidden">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="p-4">
                  <div className="text-xs text-brand-500 font-semibold uppercase tracking-wider mb-1">{item.category}</div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2 leading-tight">{item.name}</h3>
                  <div className="font-semibold text-gray-600 dark:text-gray-300">$\${item.price.toFixed(2)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Column - Cart */}
      <div className="w-[400px] flex flex-col bg-white dark:bg-gray-900 shrink-0">
        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
            <ShoppingBag className="w-6 h-6 text-brand-500" /> 
            Current Order
          </h2>
          
          <div className="mt-4 flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
            <button 
              onClick={() => setClientType('walk-in')}
              className={\`flex-1 py-2 text-sm font-medium rounded-lg flex items-center justify-center gap-2 transition-colors \${clientType === 'walk-in' ? 'bg-white dark:bg-gray-700 shadow-sm' : 'text-gray-500'}\`}
            ><User className="w-4 h-4"/> Walk-In</button>
            <button 
              onClick={() => setClientType('existing')}
              className={\`flex-1 py-2 text-sm font-medium rounded-lg flex items-center justify-center gap-2 transition-colors \${clientType === 'existing' ? 'bg-white dark:bg-gray-700 shadow-sm' : 'text-gray-500'}\`}
            ><Search className="w-4 h-4"/> Client</button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400">
              <ShoppingBag className="w-16 h-16 mb-4 opacity-20" />
              <p>Cart is empty</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="flex gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-800">
                <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover" />
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-white line-clamp-1">{item.name}</h4>
                  <div className="text-brand-500 font-medium">$\${item.price.toFixed(2)}</div>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                      <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:text-brand-500"><Minus className="w-4 h-4"/></button>
                      <span className="w-8 text-center font-medium text-sm">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:text-brand-500"><Plus className="w-4 h-4"/></button>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="p-1.5 text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Checkout Summary */}
        <div className="p-6 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-800">
          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-gray-500 text-sm">
              <span>Subtotal</span>
              <span>$\${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-500 text-sm">
              <span>Tax (13%)</span>
              <span>$\${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xl font-bold text-gray-900 dark:text-white pt-3 border-t border-gray-200 dark:border-gray-700">
              <span>Total</span>
              <span>$\${total.toFixed(2)}</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mb-4">
            <button 
              onClick={() => setPaymentMethod('card')}
              className={\`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-colors \${paymentMethod === 'card' ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20 text-brand-600' : 'border-gray-200 dark:border-gray-700 hover:border-brand-300'}\`}
            >
              <CreditCard className="w-6 h-6 mb-1" />
              <span className="text-xs font-semibold">Card</span>
            </button>
            <button 
              onClick={() => setPaymentMethod('cash')}
              className={\`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-colors \${paymentMethod === 'cash' ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20 text-brand-600' : 'border-gray-200 dark:border-gray-700 hover:border-brand-300'}\`}
            >
              <Banknote className="w-6 h-6 mb-1" />
              <span className="text-xs font-semibold">Cash</span>
            </button>
            <button 
              onClick={() => setPaymentMethod('qr')}
              className={\`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-colors \${paymentMethod === 'qr' ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20 text-brand-600' : 'border-gray-200 dark:border-gray-700 hover:border-brand-300'}\`}
            >
              <QrCode className="w-6 h-6 mb-1" />
              <span className="text-xs font-semibold">QR Code</span>
            </button>
          </div>

          <button 
            onClick={handleCheckout}
            disabled={isProcessing || cart.length === 0}
            className="w-full py-4 bg-brand-500 hover:bg-brand-600 disabled:opacity-50 disabled:hover:bg-brand-500 text-white rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-colors"
          >
            {isProcessing ? 'Processing...' : 'Charge $'+total.toFixed(2)}
          </button>
        </div>
      </div>
    </div>
  );
}
