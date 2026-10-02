import React from 'react';
import { ReceiptData, ReceiptItem } from '../types';
import { Plus, Trash2, RotateCcw, Building2, User, CreditCard, Shield, FileText } from 'lucide-react';

interface ReceiptEditorProps {
  receipt: ReceiptData;
  onChange: (receipt: ReceiptData) => void;
  onResetToDefault: () => void;
}

export const ReceiptEditor: React.FC<ReceiptEditorProps> = ({
  receipt,
  onChange,
  onResetToDefault,
}) => {
  const handleItemChange = (id: string, field: keyof ReceiptItem, value: any) => {
    const updatedItems = receipt.items.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          [field]: field === 'quantity' || field === 'unitPrice' ? Number(value) || 0 : value,
        };
      }
      return item;
    });
    onChange({ ...receipt, items: updatedItems });
  };

  const handleAddItem = () => {
    const newItem: ReceiptItem = {
      id: 'item-' + Date.now(),
      name: 'New Security Equipment',
      description: '',
      quantity: 1,
      unitPrice: 5000,
    };
    onChange({ ...receipt, items: [...receipt.items, newItem] });
  };

  const handleRemoveItem = (id: string) => {
    if (receipt.items.length <= 1) {
      alert('A receipt must contain at least one item.');
      return;
    }
    onChange({ ...receipt, items: receipt.items.filter((item) => item.id !== id) });
  };

  const addPopularItem = (name: string, description: string, unitPrice: number, quantity: number = 1) => {
    const newItem: ReceiptItem = {
      id: 'item-' + Date.now(),
      name,
      description,
      quantity,
      unitPrice,
    };
    onChange({ ...receipt, items: [...receipt.items, newItem] });
  };

  return (
    <div className="space-y-6 text-sm">
      {/* Quick Reset */}
      <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 p-3 rounded-lg">
        <div>
          <span className="font-semibold text-emerald-900 block text-xs">Davetrack Official Template</span>
          <span className="text-[11px] text-emerald-700">Pre-loaded with your CCTV & Security order</span>
        </div>
        <button
          onClick={onResetToDefault}
          className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 bg-white border border-emerald-300 text-emerald-800 rounded hover:bg-emerald-100 transition shadow-sm"
          title="Restore the initial order items"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Items
        </button>
      </div>

      {/* Invoice Meta */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2 font-bold text-slate-800 pb-2 border-b border-slate-100">
          <FileText className="w-4 h-4 text-emerald-600" />
          <span>Receipt Information</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Receipt Number</label>
            <input
              type="text"
              value={receipt.receiptNumber}
              onChange={(e) => onChange({ ...receipt, receiptNumber: e.target.value })}
              className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded font-mono focus:ring-1 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Date</label>
            <input
              type="text"
              value={receipt.date}
              onChange={(e) => onChange({ ...receipt, date: e.target.value })}
              className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-emerald-500 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Issued By / Attendant</label>
          <input
            type="text"
            value={receipt.issuedBy}
            onChange={(e) => onChange({ ...receipt, issuedBy: e.target.value })}
            className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-emerald-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Customer Info */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center gap-2 font-bold text-slate-800 pb-2 border-b border-slate-100">
          <User className="w-4 h-4 text-emerald-600" />
          <span>Customer / Billed To</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Customer / Company Name</label>
            <input
              type="text"
              placeholder="e.g. Engr. Bio Naim / Client"
              value={receipt.customer.name}
              onChange={(e) =>
                onChange({
                  ...receipt,
                  customer: { ...receipt.customer, name: e.target.value },
                })
              }
              className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Phone Number</label>
            <input
              type="text"
              placeholder="e.g. 08012345678"
              value={receipt.customer.phone}
              onChange={(e) =>
                onChange({
                  ...receipt,
                  customer: { ...receipt.customer, phone: e.target.value },
                })
              }
              className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-emerald-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Email (Optional)</label>
            <input
              type="email"
              placeholder="client@gmail.com"
              value={receipt.customer.email}
              onChange={(e) =>
                onChange({
                  ...receipt,
                  customer: { ...receipt.customer, email: e.target.value },
                })
              }
              className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Delivery / Installation Address</label>
            <input
              type="text"
              placeholder="e.g. Ikeja, Lagos"
              value={receipt.customer.address}
              onChange={(e) =>
                onChange({
                  ...receipt,
                  customer: { ...receipt.customer, address: e.target.value },
                })
              }
              className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-emerald-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Items Section */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2 font-bold text-slate-800">
            <span>Purchased Items & Prices</span>
            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-normal">
              {receipt.items.length} items
            </span>
          </div>

          <button
            onClick={handleAddItem}
            className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 bg-emerald-600 text-white rounded hover:bg-emerald-700 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Item
          </button>
        </div>

        <div className="space-y-3">
          {receipt.items.map((item, index) => (
            <div
              key={item.id}
              className="p-3 rounded-lg border border-slate-200 bg-slate-50/60 relative hover:border-slate-300 transition"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-[11px] font-bold text-slate-400">#{index + 1}</span>
                <button
                  onClick={() => handleRemoveItem(item.id)}
                  className="text-slate-400 hover:text-red-500 transition p-1"
                  title="Remove item"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                <div className="sm:col-span-6">
                  <label className="block text-[10px] font-semibold text-slate-500 uppercase">Item Name</label>
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => handleItemChange(item.id, 'name', e.target.value)}
                    className="w-full px-2.5 py-1 text-xs font-semibold border border-slate-300 rounded bg-white focus:outline-emerald-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-semibold text-slate-500 uppercase">Qty</label>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(item.id, 'quantity', e.target.value)}
                    className="w-full px-2 py-1 text-xs border border-slate-300 rounded bg-white text-center focus:outline-emerald-500"
                  />
                </div>

                <div className="sm:col-span-4">
                  <label className="block text-[10px] font-semibold text-slate-500 uppercase">
                    Unit Price (₦)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="100"
                    value={item.unitPrice}
                    onChange={(e) => handleItemChange(item.id, 'unitPrice', e.target.value)}
                    className="w-full px-2 py-1 text-xs font-mono border border-slate-300 rounded bg-white text-right focus:outline-emerald-500"
                  />
                </div>

                <div className="sm:col-span-12">
                  <input
                    type="text"
                    placeholder="Optional specs / brand details (e.g. 16-channel, RG59 copper, 12V 20A)"
                    value={item.description || ''}
                    onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                    className="w-full px-2.5 py-1 text-[11px] text-slate-600 border border-slate-200 rounded bg-white placeholder-slate-400 focus:outline-emerald-500"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Add Common Security Add-ons */}
        <div className="pt-2 border-t border-slate-100">
          <span className="text-[11px] font-medium text-slate-500 block mb-1.5">
            Quick Add Common CCTV Accessories:
          </span>
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => addPopularItem('Hard Drive (Surveillance 2TB)', 'Seagate SkyHawk / WD Purple', 75000, 1)}
              className="text-[11px] px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded transition"
            >
              + 2TB HDD (₦75k)
            </button>
            <button
              onClick={() => addPopularItem('Cat6 Network Cable (305m)', 'Pure Copper High-Speed Roll', 58000, 1)}
              className="text-[11px] px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded transition"
            >
              + Cat6 Roll (₦58k)
            </button>
            <button
              onClick={() => addPopularItem('HDMI Cable (5m 4K High Speed)', 'Gold Plated Connectors', 4500, 1)}
              className="text-[11px] px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded transition"
            >
              + 5m HDMI (₦4.5k)
            </button>
            <button
              onClick={() => addPopularItem('RJ45 Connectors (Pack of 100)', 'Cat6 Modular Plugs', 4000, 1)}
              className="text-[11px] px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded transition"
            >
              + RJ45 Pack (₦4k)
            </button>
          </div>
        </div>
      </div>

      {/* Payment & Adjustment */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2 font-bold text-slate-800 pb-2 border-b border-slate-100">
          <CreditCard className="w-4 h-4 text-emerald-600" />
          <span>Payment & Totals</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Payment Method</label>
            <select
              value={receipt.payment.method}
              onChange={(e) =>
                onChange({
                  ...receipt,
                  payment: { ...receipt.payment, method: e.target.value as any },
                })
              }
              className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded bg-white focus:outline-emerald-500"
            >
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Cash">Cash</option>
              <option value="POS Terminal">POS Terminal</option>
              <option value="Cheque">Cheque</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Status</label>
            <select
              value={receipt.payment.status}
              onChange={(e) =>
                onChange({
                  ...receipt,
                  payment: { ...receipt.payment, status: e.target.value as any },
                })
              }
              className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded bg-white focus:outline-emerald-500 font-semibold"
            >
              <option value="PAID">PAID IN FULL</option>
              <option value="PARTIAL">PARTIAL PAYMENT</option>
              <option value="PENDING">PENDING</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Transaction Ref / Note</label>
            <input
              type="text"
              placeholder="e.g. TRF/GTB/94827"
              value={receipt.payment.referenceNo}
              onChange={(e) =>
                onChange({
                  ...receipt,
                  payment: { ...receipt.payment, referenceNo: e.target.value },
                })
              }
              className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded bg-white focus:outline-emerald-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Discount (₦)</label>
            <input
              type="number"
              min="0"
              value={receipt.discount}
              onChange={(e) => onChange({ ...receipt, discount: Number(e.target.value) || 0 })}
              className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded bg-white focus:outline-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">VAT Rate (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              step="0.5"
              value={receipt.taxRate}
              onChange={(e) => onChange({ ...receipt, taxRate: Number(e.target.value) || 0 })}
              className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded bg-white focus:outline-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* Davetrack Store Details */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center gap-2 font-bold text-slate-800 pb-2 border-b border-slate-100">
          <Building2 className="w-4 h-4 text-emerald-600" />
          <span>Davetrack Store Info (From Signboard)</span>
        </div>

        <div className="text-xs text-slate-600 space-y-1 bg-slate-50 p-2.5 rounded border border-slate-200">
          <div className="font-semibold text-emerald-900">{receipt.company.name} ({receipt.company.regNumber})</div>
          <div>{receipt.company.addressLine1}</div>
          <div>{receipt.company.addressLine2}</div>
          <div>Phones: {receipt.company.phones.join(', ')}</div>
          <div>Email: {receipt.company.email} | Instagram/TikTok: {receipt.company.socialTag}</div>
        </div>
      </div>
    </div>
  );
};
