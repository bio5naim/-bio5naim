import React, { useState, useRef, useEffect } from 'react';
import { ReceiptData } from './types';
import { ReceiptPreview } from './components/ReceiptPreview';
import { ThermalReceiptPreview } from './components/ThermalReceiptPreview';
import { ReceiptEditor } from './components/ReceiptEditor';
import { exportToPdf } from './utils/pdfGenerator';
import { formatNaira, numberToNairaWords } from './utils/numberToWords';
import {
  Download,
  Printer,
  Share2,
  Check,
  Eye,
  FileEdit,
  Sparkles,
  Receipt,
  FileCheck2,
  Image as ImageIcon,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

const INITIAL_RECEIPT: ReceiptData = {
  receiptNumber: `DT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
  date: new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }),
  company: {
    name: 'DAVETRACK TECHNOLOGIES',
    regNumber: 'BN: 3577792',
    tagline: 'CCTV, Access Control, Alarm Systems, Time Attendance, Intercom, POS Systems, Networking Kits & Smart Locks',
    addressLine1: 'No 2, Pepple Street, Computer Village, Ikeja Lagos',
    addressLine2: 'The M Square Plaza Shop B28 First Floor',
    phones: ['08063440147', '07042978776'],
    email: 'Davetracktech@gmail.com',
    facebook: 'Davetrack Technologies',
    socialTag: '@Davetrackng',
    shopNumber: 'B28 First Floor',
  },
  customer: {
    name: 'Engr. Bio Naim / Client',
    phone: '0806 344 0000',
    email: 'bio5naim@gmail.com',
    address: 'Lagos, Nigeria',
  },
  items: [
    {
      id: 'item-1',
      name: 'Digital Video Recorder (DVR)',
      description: 'High-definition multi-channel video surveillance recorder',
      quantity: 1,
      unitPrice: 184000,
    },
    {
      id: 'item-2',
      name: 'Hikvision Power Supply Unit (16-Way)',
      description: 'Hikvision 16-channel regulated multi-output CCTV power supply box',
      quantity: 2,
      unitPrice: 66000,
    },
    {
      id: 'item-3',
      name: 'BNC Video Connectors',
      description: 'Heavy duty twist-on / crimp BNC connectors for RG59 coaxial video',
      quantity: 20,
      unitPrice: 800,
    },
    {
      id: 'item-4',
      name: '12V DC Power Connectors',
      description: 'Standard 2.1mm male/female security camera power pigtail jacks',
      quantity: 10,
      unitPrice: 700,
    },
  ],
  payment: {
    method: 'Bank Transfer',
    status: 'PAID',
    referenceNo: `TRF/DTV/${Math.floor(100000 + Math.random() * 900000)}`,
    amountPaid: 339000,
  },
  taxRate: 0,
  discount: 0,
  notes: 'All units inspected, packaged, and tested prior to handover.',
  terms: [
    'Goods received in good condition. Please verify item counts upon collection.',
    'DVR and Hikvision 16-Way Power Supply units carry a 12-Month Limited Manufacturer Warranty against defects.',
    'Warranty strictly excludes physical damage, water ingress, lightning strikes, and electrical power surges.',
    'BNC and DC Power connectors carry test-at-counter warranty.',
    'Goods once sold cannot be refunded; replacement or service covered in accordance with warranty terms.',
  ],
  issuedBy: 'Dave (Davetrack Sales & Tech)',
};

export default function App() {
  const [receipt, setReceipt] = useState<ReceiptData>(INITIAL_RECEIPT);
  const [activeTab, setActiveTab] = useState<'preview' | 'editor'>('preview');
  const [formatType, setFormatType] = useState<'a4' | 'thermal'>('a4');
  const [isDownloading, setIsDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showSignboardModal, setShowSignboardModal] = useState(false);

  // Keep amountPaid updated with grand total by default if it was full payment
  const subtotal = receipt.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const taxAmount = (subtotal * receipt.taxRate) / 100;
  const grandTotal = Math.max(0, subtotal + taxAmount - receipt.discount);

  const handleResetToDefault = () => {
    setReceipt({
      ...INITIAL_RECEIPT,
      receiptNumber: `DT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      payment: {
        ...INITIAL_RECEIPT.payment,
        amountPaid: 339000,
      },
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = async () => {
    setIsDownloading(true);
    const targetId = formatType === 'a4' ? 'printable-receipt' : 'printable-thermal-receipt';
    const filename = `Receipt_${receipt.receiptNumber}_Davetrack_Technologies`;

    try {
      await exportToPdf(targetId, filename);
    } catch (err) {
      console.error(err);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCopySummary = () => {
    const lines = [
      `*${receipt.company.name}*`,
      `Reg: ${receipt.company.regNumber}`,
      `Address: ${receipt.company.addressLine1}, ${receipt.company.addressLine2}`,
      `Tel: ${receipt.company.phones.join(' / ')}`,
      `-----------------------------`,
      `*OFFICIAL SALES RECEIPT*`,
      `Receipt No: ${receipt.receiptNumber}`,
      `Date: ${receipt.date}`,
      `Customer: ${receipt.customer.name}`,
      `-----------------------------`,
      `*ITEMS PURCHASED:*`,
      ...receipt.items.map(
        (i, idx) =>
          `${idx + 1}. ${i.name} (x${i.quantity}) @ ${formatNaira(i.unitPrice)} = ${formatNaira(
            i.quantity * i.unitPrice
          )}`
      ),
      `-----------------------------`,
      `*GRAND TOTAL: ${formatNaira(grandTotal)}*`,
      `Amount Paid: ${formatNaira(receipt.payment.amountPaid)}`,
      `Payment Method: ${receipt.payment.method} (${receipt.payment.status})`,
      `Words: ${numberToNairaWords(grandTotal)}`,
      `-----------------------------`,
      `_Thank you for choosing Davetrack Technologies!_`,
    ];

    navigator.clipboard.writeText(lines.join('\n')).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans">
      {/* Top Navigation & Brand Header */}
      <header className="bg-slate-900 text-white sticky top-0 z-30 shadow-md border-b border-slate-800 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-600 flex items-center justify-center font-bold text-white shadow-inner">
              <span className="text-xl tracking-tighter">DT</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-white text-base sm:text-lg tracking-wide uppercase">
                  DAVETRACK TECHNOLOGIES
                </span>
                <span className="hidden sm:inline-block text-[11px] bg-emerald-950 text-emerald-300 font-semibold px-2 py-0.5 rounded border border-emerald-800">
                  BN: 3577792
                </span>
              </div>
              <p className="text-slate-400 text-xs hidden md:block">
                Computer Village Ikeja • CCTV, Access Control & Security Systems Receipt Generator
              </p>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSignboardModal(true)}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition"
              title="View original Davetrack Technologies storefront signboard"
            >
              <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
              Signboard Photo
            </button>

            <button
              onClick={handleCopySummary}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition"
              title="Copy receipt summary for WhatsApp or SMS"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy Summary'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition"
              title="Print Receipt using browser dialog"
            >
              <Printer className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Print</span>
            </button>

            <button
              onClick={handleDownloadPdf}
              disabled={isDownloading}
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 rounded-lg shadow-sm transition disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isDownloading ? 'Generating PDF...' : 'Download PDF'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Sub-header / Status Toolbar */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-2.5 print:hidden">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Order Summary Chips */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-4">
            <span className="font-semibold text-slate-700">Order Summary:</span>
            <div className="flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded text-slate-800 font-mono">
              <span className="text-slate-500">Items:</span>
              <span className="font-bold">{receipt.items.length}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-900 border border-emerald-200 px-2.5 py-1 rounded font-bold font-mono">
              <span>Total:</span>
              <span>{formatNaira(grandTotal)}</span>
            </div>
            <div className="hidden md:flex items-center gap-1 text-slate-500 italic">
              ({numberToNairaWords(grandTotal)})
            </div>
          </div>

          {/* Template & Tab Selectors */}
          <div className="flex items-center gap-2">
            {/* View Format Selector */}
            <div className="bg-slate-100 p-0.5 rounded-lg flex items-center border border-slate-200 text-xs">
              <button
                onClick={() => setFormatType('a4')}
                className={`px-3 py-1 rounded-md font-semibold transition ${
                  formatType === 'a4' ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                A4 Tax Invoice
              </button>
              <button
                onClick={() => setFormatType('thermal')}
                className={`px-3 py-1 rounded-md font-semibold transition ${
                  formatType === 'thermal' ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                POS Slip (80mm)
              </button>
            </div>

            {/* Mobile Tab Switcher */}
            <div className="flex lg:hidden bg-slate-100 p-0.5 rounded-lg border border-slate-200">
              <button
                onClick={() => setActiveTab('preview')}
                className={`px-3 py-1 rounded-md font-semibold text-xs transition ${
                  activeTab === 'preview' ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-600'
                }`}
              >
                <Eye className="w-3.5 h-3.5 inline mr-1" />
                Receipt
              </button>
              <button
                onClick={() => setActiveTab('editor')}
                className={`px-3 py-1 rounded-md font-semibold text-xs transition ${
                  activeTab === 'editor' ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-600'
                }`}
              >
                <FileEdit className="w-3.5 h-3.5 inline mr-1" />
                Edit
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: Customizer & Editor (Visible on desktop or when active on mobile) */}
          <div
            className={`lg:col-span-5 space-y-6 print:hidden ${
              activeTab === 'editor' ? 'block' : 'hidden lg:block'
            }`}
          >
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-extrabold text-slate-800 text-sm uppercase tracking-wide flex items-center gap-1.5">
                  <FileCheck2 className="w-4 h-4 text-emerald-600" />
                  Customize Receipt Details
                </h2>
                <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                  Live Preview
                </span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed mb-4">
                You can adjust customer names, phone numbers, add more security items, update quantities, or add warranty terms.
              </p>

              <ReceiptEditor
                receipt={receipt}
                onChange={setReceipt}
                onResetToDefault={handleResetToDefault}
              />
            </div>
          </div>

          {/* RIGHT: Live Printable Receipt Preview (Visible on desktop or when active on mobile) */}
          <div
            className={`lg:col-span-7 flex flex-col items-center print:w-full print:block ${
              activeTab === 'preview' ? 'block' : 'hidden lg:block'
            }`}
          >
            {/* Quick action bar right above receipt */}
            <div className="w-full flex items-center justify-between mb-3 px-1 print:hidden">
              <div className="text-xs font-semibold text-slate-600 flex items-center gap-2">
                <span>Format:</span>
                <span className="text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 uppercase font-bold text-[11px]">
                  {formatType === 'a4' ? 'A4 Official Letterhead & Invoice' : '80mm Thermal Receipt'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownloadPdf}
                  disabled={isDownloading}
                  className="text-xs font-semibold flex items-center gap-1 text-emerald-700 hover:text-emerald-800 bg-white border border-emerald-200 hover:bg-emerald-50 px-2.5 py-1 rounded shadow-sm transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  {isDownloading ? 'Saving...' : 'PDF'}
                </button>
                <button
                  onClick={handlePrint}
                  className="text-xs font-semibold flex items-center gap-1 text-slate-700 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-50 px-2.5 py-1 rounded shadow-sm transition"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Print
                </button>
              </div>
            </div>

            {/* Receipt Preview Canvas */}
            <div className="w-full transition-all">
              {formatType === 'a4' ? (
                <ReceiptPreview receipt={receipt} printId="printable-receipt" />
              ) : (
                <ThermalReceiptPreview receipt={receipt} printId="printable-thermal-receipt" />
              )}
            </div>

            {/* Bottom Download Banner */}
            <div className="w-full mt-6 bg-emerald-900 text-white p-4 rounded-xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-800 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5 text-emerald-300" />
                </div>
                <div>
                  <h4 className="text-sm font-bold">Ready to issue this receipt?</h4>
                  <p className="text-xs text-emerald-200">
                    Download as crisp vector PDF or print directly onto an A4 sheet or thermal roll.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleDownloadPdf}
                  disabled={isDownloading}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-xs shadow transition flex items-center gap-1.5"
                >
                  <Download className="w-4 h-4" />
                  {isDownloading ? 'Generating PDF...' : 'Download PDF Now'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modal for Storefront Signboard Verification */}
      {showSignboardModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm">Davetrack Technologies Storefront Reference</span>
                <span className="text-xs text-emerald-400 font-mono">Shop B28 Computer Village</span>
              </div>
              <button
                onClick={() => setShowSignboardModal(false)}
                className="text-slate-400 hover:text-white text-sm font-bold px-2 py-1"
              >
                ✕
              </button>
            </div>
            <div className="p-4 bg-slate-100 flex flex-col items-center">
              <img
                src="/image.png"
                alt="Davetrack Technologies Store Signboard"
                className="max-h-[60vh] object-contain rounded-lg shadow-md border border-slate-300"
              />
              <div className="mt-3 text-xs text-slate-600 text-center leading-relaxed">
                <strong>Verified Details:</strong> Davetrack Technologies (BN: 3577792), Shop B28 First Floor, The M Square Plaza, No 2 Pepple Street, Computer Village, Ikeja Lagos.
              </div>
            </div>
            <div className="p-3 bg-white border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setShowSignboardModal(false)}
                className="px-4 py-1.5 bg-slate-800 text-white text-xs font-semibold rounded-lg hover:bg-slate-700 transition"
              >
                Close Reference
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500 print:hidden">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            Davetrack Technologies Receipt Generator &bull; No 2, Pepple Street, Computer Village, Ikeja, Lagos
          </span>
          <span className="text-slate-400">
            Tel: 08063440147, 07042978776 &bull; Email: Davetracktech@gmail.com
          </span>
        </div>
      </footer>
    </div>
  );
}
