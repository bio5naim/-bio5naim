import React from 'react';
import { ReceiptData } from '../types';
import { DavetrackLogo } from './DavetrackLogo';
import { formatNaira, numberToNairaWords } from '../utils/numberToWords';
import { CheckCircle2, Phone, Mail, MapPin, Facebook, Instagram, ShieldCheck } from 'lucide-react';

interface ReceiptPreviewProps {
  receipt: ReceiptData;
  template?: 'modern' | 'classic' | 'bordered';
  printId?: string;
}

export const ReceiptPreview: React.FC<ReceiptPreviewProps> = ({
  receipt,
  template = 'modern',
  printId = 'printable-receipt',
}) => {
  const { company, customer, items, payment, taxRate, discount } = receipt;

  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const taxAmount = (subtotal * taxRate) / 100;
  const grandTotal = Math.max(0, subtotal + taxAmount - discount);
  const balanceDue = Math.max(0, grandTotal - payment.amountPaid);
  const words = numberToNairaWords(grandTotal);

  return (
    <div
      id={printId}
      className="bg-white text-slate-900 w-full max-w-[800px] mx-auto p-8 sm:p-10 shadow-xl border border-slate-200 rounded-lg font-sans relative overflow-hidden print:border-none print:shadow-none print:p-6 print:max-w-full"
      style={{ minHeight: '1050px' }}
    >
      {/* Decorative Top Accent Stripe */}
      <div className="absolute top-0 left-0 right-0 h-2.5 bg-gradient-to-r from-emerald-800 via-green-600 to-emerald-800" />

      {/* HEADER SECTION */}
      <header className="border-b-2 border-slate-200 pb-5 mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <DavetrackLogo size={68} />
            <div>
              <div className="flex items-baseline gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-emerald-800 uppercase font-serif">
                  {company.name}
                </h1>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs font-semibold px-2 py-0.5 bg-emerald-50 text-emerald-800 rounded border border-emerald-300">
                  {company.regNumber}
                </span>
                <span className="text-xs text-slate-500 font-medium">Shop: {company.shopNumber}</span>
              </div>
              <p className="text-[11px] font-semibold text-slate-700 tracking-wide mt-1 max-w-lg leading-tight uppercase">
                {company.tagline}
              </p>
            </div>
          </div>

          {/* Receipt Badge Header */}
          <div className="sm:text-right shrink-0">
            <div className="inline-block bg-emerald-700 text-white px-3.5 py-1.5 rounded font-bold text-sm tracking-wider uppercase shadow-sm">
              Official Sales Receipt
            </div>
            <div className="mt-2 text-xs text-slate-500 font-medium">
              Receipt No: <span className="font-mono font-bold text-slate-800 text-sm">{receipt.receiptNumber}</span>
            </div>
            <div className="text-xs text-slate-500">
              Date: <span className="font-medium text-slate-800">{receipt.date}</span>
            </div>
          </div>
        </div>

        {/* Store Location & Contact Grid */}
        <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-600">
          <div className="flex items-start gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-medium text-slate-800">{company.addressLine1}</span>
              <div className="text-slate-500 text-[11px]">{company.addressLine2}</div>
            </div>
          </div>

          <div className="flex flex-col gap-1 md:items-end">
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
              <span className="font-medium text-slate-800">{company.phones.join(', ')}</span>
            </div>
            <div className="flex items-center gap-3 text-[11px] text-slate-500">
              <span className="flex items-center gap-1">
                <Mail className="w-3 h-3 text-emerald-700" />
                {company.email}
              </span>
              <span className="flex items-center gap-1">
                <Instagram className="w-3 h-3 text-emerald-700" />
                {company.socialTag}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* BILLED TO & PAYMENT SUMMARY */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 p-4 rounded-lg bg-slate-50 border border-slate-200 text-xs">
        <div className="sm:col-span-2">
          <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block mb-1">
            Customer / Billed To:
          </span>
          <div className="text-sm font-bold text-slate-800">{customer.name || 'Valued Customer / Cash Sale'}</div>
          {customer.phone && (
            <div className="text-slate-600 mt-0.5">Phone: <span className="font-medium">{customer.phone}</span></div>
          )}
          {customer.email && (
            <div className="text-slate-600">Email: {customer.email}</div>
          )}
          {customer.address && (
            <div className="text-slate-500 text-[11px] mt-0.5">Address: {customer.address}</div>
          )}
        </div>

        <div className="border-t sm:border-t-0 sm:border-l border-slate-200 sm:pl-4 flex flex-col justify-center">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Payment Info:
          </span>
          <div className="flex items-center gap-1.5 font-bold text-emerald-800 text-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{payment.status}</span>
          </div>
          <div className="text-slate-600 mt-1">
            Method: <span className="font-medium text-slate-800">{payment.method}</span>
          </div>
          {payment.referenceNo && (
            <div className="text-slate-500 text-[11px] font-mono">
              Ref: {payment.referenceNo}
            </div>
          )}
        </div>
      </section>

      {/* ITEMS TABLE */}
      <section className="mb-6">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-emerald-800 text-white text-xs uppercase tracking-wider font-semibold">
              <th className="py-2.5 px-3 rounded-tl">#</th>
              <th className="py-2.5 px-3">Item Description</th>
              <th className="py-2.5 px-3 text-center">Qty</th>
              <th className="py-2.5 px-3 text-right">Unit Price</th>
              <th className="py-2.5 px-3 text-right rounded-tr">Total</th>
            </tr>
          </thead>
          <tbody className="text-xs divide-y divide-slate-200 border-b border-slate-200">
            {items.map((item, idx) => {
              const itemTotal = item.quantity * item.unitPrice;
              return (
                <tr key={item.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}>
                  <td className="py-3 px-3 font-medium text-slate-400">{idx + 1}</td>
                  <td className="py-3 px-3">
                    <div className="font-bold text-slate-800 text-sm">{item.name}</div>
                    {item.description && (
                      <div className="text-[11px] text-slate-500 mt-0.5">{item.description}</div>
                    )}
                  </td>
                  <td className="py-3 px-3 text-center font-semibold text-slate-700">{item.quantity}</td>
                  <td className="py-3 px-3 text-right font-medium text-slate-600">{formatNaira(item.unitPrice)}</td>
                  <td className="py-3 px-3 text-right font-bold text-slate-900">{formatNaira(itemTotal)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

      {/* TOTALS & AMOUNT IN WORDS */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-6">
        <div className="md:col-span-7 bg-slate-50 p-4 rounded-lg border border-slate-200 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Amount In Words:
            </span>
            <div className="text-xs font-semibold text-emerald-950 italic bg-white p-2.5 rounded border border-slate-200 leading-relaxed">
              "{words}"
            </div>
          </div>

          {receipt.notes && (
            <div className="mt-3 pt-2 border-t border-slate-200 text-[11px] text-slate-600">
              <span className="font-semibold text-slate-700">Remarks: </span>
              {receipt.notes}
            </div>
          )}
        </div>

        <div className="md:col-span-5 bg-white p-3.5 rounded-lg border border-slate-200 flex flex-col justify-center space-y-1.5 text-xs">
          <div className="flex justify-between text-slate-600">
            <span>Subtotal:</span>
            <span className="font-medium text-slate-800">{formatNaira(subtotal)}</span>
          </div>

          {taxRate > 0 && (
            <div className="flex justify-between text-slate-600">
              <span>VAT / Tax ({taxRate}%):</span>
              <span className="font-medium text-slate-800">{formatNaira(taxAmount)}</span>
            </div>
          )}

          {discount > 0 && (
            <div className="flex justify-between text-emerald-700">
              <span>Discount:</span>
              <span className="font-medium">-{formatNaira(discount)}</span>
            </div>
          )}

          <div className="pt-2 border-t-2 border-emerald-800 flex justify-between items-center text-sm font-bold text-slate-900">
            <span>Grand Total:</span>
            <span className="text-base text-emerald-800 font-extrabold">{formatNaira(grandTotal)}</span>
          </div>

          <div className="flex justify-between text-slate-600 pt-1 text-xs">
            <span>Amount Paid:</span>
            <span className="font-semibold text-slate-800">{formatNaira(payment.amountPaid)}</span>
          </div>

          {balanceDue > 0 ? (
            <div className="flex justify-between text-red-600 font-bold pt-1 border-t border-red-100">
              <span>Balance Due:</span>
              <span>{formatNaira(balanceDue)}</span>
            </div>
          ) : (
            <div className="flex justify-between text-emerald-700 font-semibold pt-1 border-t border-emerald-100 text-[11px]">
              <span>Balance:</span>
              <span>₦0.00 (Fully Settled)</span>
            </div>
          )}
        </div>
      </section>

      {/* WARRANTY & TERMS */}
      <section className="mb-8 p-3.5 bg-emerald-50/50 rounded-lg border border-emerald-100 text-[11px] text-slate-600">
        <div className="flex items-center gap-1.5 font-bold text-emerald-800 mb-1.5 uppercase tracking-wide text-xs">
          <ShieldCheck className="w-4 h-4 text-emerald-700" />
          <span>Warranty & Purchase Conditions</span>
        </div>
        <ul className="list-disc list-inside space-y-0.5 leading-relaxed text-slate-600 pl-1">
          {receipt.terms.map((term, index) => (
            <li key={index}>{term}</li>
          ))}
        </ul>
      </section>

      {/* SIGNATURE & STAMP ROW */}
      <footer className="pt-4 border-t border-slate-200">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 items-end">
          {/* Customer Signature */}
          <div className="text-center">
            <div className="border-b border-slate-400 h-10 mb-1" />
            <span className="text-[11px] font-medium text-slate-600 block">Customer's Signature</span>
            <span className="text-[10px] text-slate-400">Goods received in good order</span>
          </div>

          {/* Official Stamp Box */}
          <div className="flex flex-col items-center justify-center">
            <div className="border-2 border-dashed border-emerald-600/70 rounded-full p-2.5 w-24 h-24 flex flex-col items-center justify-center text-center transform -rotate-6 bg-emerald-50/30">
              <span className="text-[8px] font-bold text-emerald-900 uppercase">DAVETRACK TECH</span>
              <span className="text-[10px] font-extrabold text-emerald-700 tracking-tighter">★ PAID ★</span>
              <span className="text-[8px] text-emerald-800 font-mono">{receipt.date}</span>
              <span className="text-[7px] text-slate-500">IKEJA LAGOS</span>
            </div>
          </div>

          {/* Authorized Signature */}
          <div className="text-center col-span-2 sm:col-span-1">
            <div className="border-b border-slate-400 h-10 mb-1 flex items-end justify-center pb-1">
              <span className="font-serif italic font-semibold text-emerald-900 text-sm">
                {receipt.issuedBy || 'Davetrack Manager'}
              </span>
            </div>
            <span className="text-[11px] font-medium text-slate-600 block">Authorized Signatory</span>
            <span className="text-[10px] text-slate-400">{company.name}</span>
          </div>
        </div>

        <div className="mt-6 text-center text-[10px] text-slate-400 border-t border-slate-100 pt-3">
          This receipt is computer generated and valid for all warranty and tax claims. Keep safe for warranty verification.
        </div>
      </footer>
    </div>
  );
};
