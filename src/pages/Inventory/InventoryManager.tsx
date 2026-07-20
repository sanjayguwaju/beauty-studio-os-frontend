import React, { useState, useEffect } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import api from "../../utils/api";

const InventoryManager: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // New Product Form
  const [name, setName] = useState("");
  const [unit, setUnit] = useState("bottle");
  const [currentStock, setCurrentStock] = useState(0);
  const [reorderThreshold, setReorderThreshold] = useState(5);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get("/products");
      if (res.data.success) {
        setProducts(res.data.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateProduct = async () => {
    try {
      await api.post("/products", { name, unit, currentStock, reorderThreshold });
      setIsModalOpen(false);
      fetchProducts();
      // Reset
      setName(""); setUnit("bottle"); setCurrentStock(0); setReorderThreshold(5);
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddStock = async (id: string) => {
    const qty = prompt("How much stock to add?");
    if (qty && !isNaN(Number(qty))) {
      try {
        await api.post(`/products/${id}/stock`, { quantity: Number(qty) });
        fetchProducts();
      } catch (e) {
        console.error(e);
      }
    }
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="Inventory Manager" />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
        
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-800">Products & Stock Levels</h3>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-brand-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-brand-600"
          >
            + Add New Product
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-500">
            <thead className="bg-gray-50 text-xs uppercase text-gray-700">
              <tr>
                <th className="px-6 py-3">Product Name</th>
                <th className="px-6 py-3">Current Stock</th>
                <th className="px-6 py-3">Unit</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => {
                const isLowStock = p.currentStock <= p.reorderThreshold;
                return (
                  <tr key={p._id} className="border-b bg-white hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{p.name}</td>
                    <td className="px-6 py-4 font-bold">{p.currentStock}</td>
                    <td className="px-6 py-4">{p.unit}</td>
                    <td className="px-6 py-4">
                      {isLowStock ? (
                        <span className="px-2 py-1 text-xs rounded-full bg-error-100 text-error-800 font-medium">Low Stock</span>
                      ) : (
                        <span className="px-2 py-1 text-xs rounded-full bg-success-100 text-success-800 font-medium">In Stock</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <button onClick={() => handleAddStock(p._id)} className="text-brand-500 hover:underline">
                        + Add Stock
                      </button>
                    </td>
                  </tr>
                );
              })}
              {products.length === 0 && (
                <tr><td colSpan={5} className="px-6 py-4 text-center">No products found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="mb-4 text-xl font-bold text-gray-800">Add New Product</h3>
            
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium">Name</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full rounded-lg border p-2" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium">Unit</label>
                  <input type="text" value={unit} onChange={e => setUnit(e.target.value)} className="w-full rounded-lg border p-2" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Current Stock</label>
                  <input type="number" value={currentStock} onChange={e => setCurrentStock(Number(e.target.value))} className="w-full rounded-lg border p-2" />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Reorder Threshold</label>
                <input type="number" value={reorderThreshold} onChange={e => setReorderThreshold(Number(e.target.value))} className="w-full rounded-lg border p-2" />
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button onClick={() => setIsModalOpen(false)} className="rounded-lg px-4 py-2 text-gray-600 hover:bg-gray-100">Cancel</button>
              <button onClick={handleCreateProduct} className="rounded-lg bg-brand-500 px-4 py-2 text-white hover:bg-brand-600">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryManager;
