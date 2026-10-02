import React from 'react';
import { ReceiptData } from '../types';
import { formatNaira, numberToNairaWords } from '../utils/numberToWords';

interface ThermalReceiptProps {
  receipt: ReceiptData;
  printId?: string;
}

export const ThermalReceiptPreview: React.FC<ThermalReceiptProps> = ({
  receipt,
  printId = 'printable-thermal-receipt',
}) => {
  const { company, customer, items, payment, taxRate, discount } = receipt;
  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const taxAmount = (subtotal * taxRate) / 100;
  const grandTotal = Math.max(0, subtotal + taxAmount - discount);

  return (
    <div
      id={printId}
      className="bg-white text-slate-900 w-[320px] mx-auto p-5 font-mono text-[11px] shadow-lg border border-slate-300 rounded leading-tight print:shadow-none print:border-none print:w-[80mm] print:p-2"
    >
      {/* Header */}
      <div className="text-center pb-3 border-b border-dashed border-slate-400">
        <h2 className="text-sm font-black uppercase tracking-wider">{company.name}</h2>
        <div className="text-[10px] text-slate-700 font-semibold">{company.regNumber}</div>
        <div className="text-[9px] text-slate-600 mt-1 leading-snug">
          {company.addressLine1}
          <br />
          {company.addressLine2}
        </div>
        <div className="text-[9px] mt-1 font-bold">Tel: {company.phones[0]}</div>
      </div>

      {/* Meta */}
      <div className="py-2 border-b border-dashed border-slate-400 space-y-0.5 text-[10px]">
        <div className="flex justify-between">
          <span>RC NO:</span>
          <span className="font-bold">{receipt.receiptNumber}</span>
        </div>
        <div className="flex justify-between">
          <span>DATE:</span>
          <span>{receipt.date}</span>
        </div>
        <div className="flex justify-between">
          <span>CUSTOMER:</span>
          <span className="truncate max-w-[170px]">{customer.name || 'Walk-in Customer'}</span>
        </div>
        {customer.phone && (
          <div className="flex justify-between">
            <span>PHONE:</span>
            <span>{customer.phone}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span>PAY MODE:</span>
          <span className="font-bold">{payment.method} ({payment.status})</span>
        </div>
      </div>

      {/* Items list */}
      <div className="py-2 border-b border-dashed border-slate-400">
        <div className="flex justify-between font-bold text-[10px] mb-1">
          <span className="w-1/2">ITEM</span>
          <span className="w-1/6 text-center">QTY</span>
          <span className="w-1/3 text-right">PRICE (₦)</span>
        </div>
        <div className="space-y-1.5">
          {items.map((item, idx) => (
            <div key={item.id} className="text-[10px]">
              <div className="font-semibold text-slate-800">{idx + 1}. {item.name}</div>
              <div className="flex justify-between text-slate-600 pl-2">
                <span>{item.quantity} x {formatNaira(item.unitPrice).replace('₦', '')}</span>
                <span className="font-bold text-slate-900">
                  {formatNaira(item.quantity * item.unitPrice).replace('₦', '')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Totals */}
      <div className="py-2 border-b border-dashed border-slate-400 space-y-1 text-[11px]">
        <div className="flex justify-between">
          <span>SUBTOTAL:</span>
          <span>{formatNaira(subtotal)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between">
            <span>DISCOUNT:</span>
            <span>-{formatNaira(discount)}</span>
          </div>
        )}
        {taxRate > 0 && (
          <div className="flex justify-between">
            <span>VAT ({taxRate}%):</span>
            <span>{formatNaira(taxAmount)}</span>
          </div>
        )}
        <div className="flex justify-between font-black text-xs pt-1 border-t border-slate-300">
          <span>TOTAL:</span>
          <span>{formatNaira(grandTotal)}</span>
        </div>
        <div className="flex justify-between text-[10px]">
          <span>PAID:</span>
          <span>{formatNaira(payment.amountPaid)}</span>
        </div>
      </div>

      {/* Amount in Words */}
      <div className="py-2 border-b border-dashed border-slate-400 text-[9px] italic text-slate-700">
        {numberToNairaWords(grandTotal)}
      </div>

      {/* Footer / Warranty Note */}
      <div className="text-center pt-2 space-y-1 text-[9px] text-slate-600">
        <p className="font-bold">*** GOODS RECEIVED IN GOOD CONDITION ***</p>
        <p>1 Year Warranty on DVR & PSU (Excl. Surges)</p>
        <p className="mt-1 font-bold">THANK YOU FOR YOUR PATRONAGE!</p>
        <p className="text-[8px] text-slate-400">IG: {company.socialTag} | {company.email}</p>
      </div>
    </div>
  );
};
