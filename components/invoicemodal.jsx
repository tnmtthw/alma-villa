'use client';

import { useState, useRef } from 'react';
import { X, Download, Printer } from 'lucide-react';

export const InvoiceModal = ({ isOpen, onClose, invoice, previewMode = false }) => {
  const receiptRef = useRef(null);
  const [isPrinting, setIsPrinting] = useState(false);

  if (!isOpen) return null;

  // Handle Receipt Download as Image
  const handleDownloadReceipt = async () => {
    if (!receiptRef.current) return;

    try {
      // Wait for images to load
      const images = receiptRef.current.querySelectorAll('img');
      await Promise.all(
        Array.from(images).map((img) => {
          if (img.complete) return Promise.resolve();
          return new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = resolve; // Continue even if image fails
            setTimeout(resolve, 2000); // Timeout after 2 seconds
          });
        })
      );

      // Dynamic import of html2canvas library
      const html2canvas = (await import('html2canvas')).default;
      
      const element = receiptRef.current;

      // Build an off-screen clone to avoid modal constraints and ensure full render
      const offscreenContainer = document.createElement('div');
      offscreenContainer.style.position = 'fixed';
      offscreenContainer.style.left = '-10000px';
      offscreenContainer.style.top = '0';
      offscreenContainer.style.background = '#ffffff';
      offscreenContainer.style.zIndex = '-1';
      offscreenContainer.style.padding = '0';
      offscreenContainer.style.margin = '0';

      const cloned = element.cloneNode(true);
      if (cloned && cloned.style) {
        cloned.style.maxHeight = 'none';
        cloned.style.overflow = 'visible';
        cloned.style.height = 'auto';
        cloned.style.width = '100%';
      }
      // Hide header and any controls in the cloned node
      try {
        const toHide = cloned.querySelectorAll('.no-download, .no-print');
        toHide.forEach((el) => {
          if (el && el.style) el.style.display = 'none';
        });
      } catch {}
      offscreenContainer.appendChild(cloned);
      document.body.appendChild(offscreenContainer);

      // Wait for layout
      await new Promise(resolve => setTimeout(resolve, 150));

      const rect = cloned.getBoundingClientRect();
      const width = Math.ceil(Math.max(cloned.scrollWidth, rect.width));
      const height = Math.ceil(Math.max(cloned.scrollHeight, rect.height));

      const canvas = await html2canvas(cloned, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
        width: width,
        height: height,
        x: 0,
        y: 0,
        scrollX: 0,
        scrollY: -window.scrollY,
        windowWidth: width,
        windowHeight: height,
        allowTaint: false,
        removeContainer: false,
        imageTimeout: 15000,
        useCORS: true,
        onclone: undefined
      });
      
      // Cleanup offscreen container
      document.body.removeChild(offscreenContainer);

      // Convert canvas to blob
      canvas.toBlob((blob) => {
        if (!blob) return;
        
        // Create download link
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Receipt_${invoice.receiptNo || invoice.reference || 'receipt'}_${new Date().toISOString().split('T')[0]}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 'image/png', 0.95);
    } catch (error) {
      console.error('Error downloading receipt:', error);
      // Fallback to print dialog
      window.print();
    }
  };

  // Handle print
  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
      setTimeout(() => setIsPrinting(false), 500);
    }, 100);
  };

  const InvoiceContent = () => (
    <div 
      ref={receiptRef}
      className="receipt-container overflow-y-auto max-h-[calc(90vh-60px)] bg-white print:max-h-none print:overflow-visible"
      style={{ minHeight: 'fit-content', height: 'auto' }}
    >
      {/* Branded Header */}
      <div className="bg-[#23479A] text-white no-download">
        <div className="px-4 md:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/Logo.png" alt="Alma Villa Logo" className="w-10 h-10 rounded-full bg-white object-contain" />
            <div>
              <h1 className="text-lg md:text-xl font-bold leading-tight">Barangay Alma Villa - Digital System</h1>
              <p className="text-[10px] md:text-xs opacity-90">{invoice.companyAddress || 'Alma Villa, Gloria, Oriental Mindoro 5209'}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 no-print">
            <button 
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded text-[10px] md:text-xs transition-colors" 
              onClick={handlePrint}
            >
              <Printer className="w-3.5 h-3.5" />
              Print
            </button>
            <button 
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-white text-[#23479A] hover:bg-gray-100 rounded text-[10px] md:text-xs font-medium transition-colors" 
              onClick={handleDownloadReceipt}
            >
              <Download className="w-3.5 h-3.5" />
              Download
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media print {
          @page {
            size: A4;
            margin: 10mm;
          }
          
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          
          body {
            margin: 0;
            padding: 0;
          }
          
          body * {
            visibility: hidden;
          }
          
          .receipt-container,
          .receipt-container * {
            visibility: visible !important;
          }
          
          .receipt-container {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
            overflow: visible !important;
            page-break-inside: avoid !important;
          }
          
          .no-print {
            display: none !important;
          }
          
          .print-break {
            page-break-after: always;
          }
          
          .print-break-avoid {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
          
          .bg-\\[\\#23479A\\] {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            background-color: #23479A !important;
          }
          
          .bg-gray-50,
          .bg-gray-100 {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          
          /* Ensure all content fits on one page */
          .receipt-container > div {
            max-width: 100% !important;
            overflow: visible !important;
          }
        }
      `}</style>

      <div className="p-4 md:p-6 print:p-6 print:max-w-none print:min-w-full">
        {/* Receipt Title */}
        <div className="mb-4 print:mb-3 print-break-avoid">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 print:text-xl">Transaction Receipt</h2>
          <p className="text-xs text-gray-500 print:text-[10px]">Official acknowledgment of payment</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5 print:mb-4 print-break-avoid">
          <div className="border-2 border-gray-200 rounded-lg p-3 print:border print:p-2">
            <p className="text-[10px] text-gray-500 print:text-[9px] mb-1">Receipt No.</p>
            <p className="font-bold text-sm text-gray-900 print:text-xs">{invoice.receiptNo || invoice.reference || '—'}</p>
          </div>
          <div className="border-2 border-gray-200 rounded-lg p-3 print:border print:p-2">
            <p className="text-[10px] text-gray-500 print:text-[9px] mb-1">Date</p>
            <p className="font-bold text-sm text-gray-900 print:text-xs">{invoice.issueDate}</p>
          </div>
          <div className="border-2 border-gray-200 rounded-lg p-3 print:border print:p-2">
            <p className="text-[10px] text-gray-500 print:text-[9px] mb-1">Payment Method</p>
            <p className="font-bold text-sm text-gray-900 print:text-xs">{invoice.paymentMethod || '—'}</p>
          </div>
        </div>

        {/* Information Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-5 print:mb-4 print-break-avoid">
          {/* Receipt Information */}
          <div className="border-2 border-gray-200 rounded-lg print:border print-break-avoid">
            <div className="px-3 py-2 border-b-2 border-gray-200 bg-gray-50 print:bg-gray-100 flex items-center justify-between print:px-2 print:py-1.5">
              <h3 className="text-xs font-bold text-gray-900 print:text-[10px]">Receipt Information</h3>
              <span className="inline-flex items-center gap-1 text-[9px] px-2 py-0.5 rounded-full bg-[#23479A] text-white font-semibold uppercase print:text-[8px]">
                <svg className="w-2.5 h-2.5" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-7.364 7.364a1 1 0 01-1.414 0L3.293 10.435a1 1 0 011.414-1.414l3.02 3.02 6.657-6.657a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Verified
              </span>
            </div>
            <div className="p-3 text-xs text-gray-700 space-y-1.5 print:p-2 print:space-y-1">
              <div className="flex justify-between items-center"><span className="text-gray-500 text-[10px] print:text-[9px]">Reference No:</span><span className="font-semibold text-gray-900 text-[10px] print:text-xs">{invoice.reference || invoice.referenceNo || '—'}</span></div>
              <div className="flex justify-between items-center"><span className="text-gray-500 text-[10px] print:text-[9px]">Document:</span><span className="font-semibold text-gray-900 text-[10px] print:text-xs">{invoice.documentType || invoice.document || '—'}</span></div>
              <div className="flex justify-between items-center border-t pt-1.5 print:pt-1"><span className="text-gray-500 text-[10px] print:text-[9px]">Amount Paid:</span><span className="font-bold text-base text-[#23479A] print:text-sm">₱{(invoice.total || 0).toFixed(2)}</span></div>
            </div>
          </div>

          {/* Resident Information */}
          <div className="border-2 border-gray-200 rounded-lg print:border print-break-avoid">
            <div className="px-3 py-2 border-b-2 border-gray-200 bg-gray-50 print:bg-gray-100 print:px-2 print:py-1.5">
              <h3 className="text-xs font-bold text-gray-900 print:text-[10px]">Resident Information</h3>
            </div>
            <div className="p-3 text-xs text-gray-700 space-y-1.5 print:p-2 print:space-y-1">
              <div className="flex justify-between items-start"><span className="text-gray-500 text-[10px] print:text-[9px]">Name:</span><span className="font-semibold text-gray-900 text-right text-[10px] print:text-xs">{invoice.clientName || '—'}</span></div>
              <div className="flex justify-between items-start"><span className="text-gray-500 text-[10px] print:text-[9px]">Address:</span><span className="font-medium text-gray-900 text-right text-[10px] print:text-xs max-w-[60%]">{invoice.clientAddress ? `${invoice.clientAddress.street || ''} ${invoice.clientAddress.city || ''} ${invoice.clientAddress.postcode || ''}`.trim() || '—' : '—'}</span></div>
            </div>
          </div>
        </div>

        {/* Processing Information */}
        <div className="border-2 border-gray-200 rounded-lg mb-5 print:mb-4 print-break-avoid">
          <div className="px-3 py-2 border-b-2 border-gray-200 bg-gray-50 print:bg-gray-100 print:px-2 print:py-1.5">
            <h3 className="text-xs font-bold text-gray-900 print:text-[10px]">Processing Information</h3>
          </div>
            <div className="p-3 text-xs text-gray-700 grid grid-cols-1 md:grid-cols-2 gap-2 print:p-2 print:gap-1.5">
            <div className="flex justify-between items-center"><span className="text-gray-500 text-[10px] print:text-[9px]">Status:</span>
              <span className="inline-flex items-center gap-1.5 text-[10px] print:text-xs text-green-700 font-semibold bg-green-100 border border-green-200 px-2.5 py-1 rounded-full">
                <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-7.364 7.364a1 1 0 01-1.414 0L3.293 10.435a1 1 0 011.414-1.414l3.02 3.02 6.657-6.657a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Verified & Approved
              </span>
            </div>
            <div className="flex justify-between items-center"><span className="text-gray-500 text-[10px] print:text-[9px]">Processed By:</span><span className="font-semibold text-gray-900 text-[10px] print:text-xs">{invoice.processedBy || 'Staff'}</span></div>
            <div className="flex justify-between items-center"><span className="text-gray-500 text-[10px] print:text-[9px]">Date Approved:</span><span className="font-semibold text-gray-900 text-[10px] print:text-xs">{invoice.dateApproved || invoice.issueDate}</span></div>
            {invoice.proofImageUrl && (
              <div className="flex justify-between items-center no-print">
                <span className="text-gray-500 text-[10px] print:text-[9px]">Proof of Payment:</span>
                <a href={invoice.proofImageUrl} target="_blank" className="text-[#23479A] hover:underline text-[10px] print:text-xs">View Image</a>
              </div>
            )}
          </div>
        </div>

        {/* Items Table (simple) */}
        <div className="mb-4 print:mb-3 print-break-avoid">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#23479A] text-white">
                <th className="text-left py-2 px-3 text-[10px] md:text-xs font-bold uppercase border border-gray-300 print:py-1.5 print:px-2">Description</th>
                <th className="text-center py-2 px-3 text-[10px] md:text-xs font-bold uppercase border border-gray-300 print:py-1.5 print:px-2">Qty</th>
                <th className="text-right py-2 px-3 text-[10px] md:text-xs font-bold uppercase border border-gray-300 print:py-1.5 print:px-2">Document Fee</th>
                <th className="text-right py-2 px-3 text-[10px] md:text-xs font-bold uppercase border border-gray-300 print:py-1.5 print:px-2">Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items && invoice.items.length > 0 ? (
                invoice.items.map((item, index) => (
                  <tr key={index} className="border-b border-gray-200 print:border-gray-300">
                    <td className="py-2 px-3 border-r border-gray-200 print:py-1.5 print:px-2">
                      <p className="text-xs font-semibold text-gray-900 print:text-[10px]">{item.name}</p>
                      {item.description && <p className="text-[10px] text-gray-500 mt-0.5 print:text-[9px]">{item.description}</p>}
                    </td>
                    <td className="text-center py-2 px-3 text-xs text-gray-900 border-r border-gray-200 print:py-1.5 print:px-2 print:text-[10px]">{item.quantity}</td>
                    <td className="text-right py-2 px-3 text-xs text-gray-900 border-r border-gray-200 print:py-1.5 print:px-2 print:text-[10px]">₱{item.unitPrice.toFixed(2)}</td>
                    <td className="text-right py-2 px-3 text-xs font-semibold text-gray-900 print:py-1.5 print:px-2 print:text-[10px]">₱{item.amount.toFixed(2)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-3 px-3 text-center text-xs text-gray-500 print:py-1.5 print:text-[10px]">No items</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Totals Section */}
        <div className="flex justify-end mb-4 print:mb-3 print-break-avoid">
          <div className="w-full md:w-80 print:w-full">
            <div className="flex justify-between py-2 px-3 bg-gray-50 border border-gray-200 print:py-1.5 print:px-2">
              <span className="text-xs font-bold text-gray-700 uppercase print:text-[10px]">Total (PHP):</span>
              <span className="text-base font-bold text-gray-900 print:text-sm">₱{(invoice.total || 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-2.5 px-3 bg-[#23479A] text-white border-2 border-[#23479A] print:py-2 print:px-2">
              <span className="text-xs font-bold uppercase print:text-[10px]">Total Due (PHP)</span>
              <span className="text-lg font-bold print:text-base">₱{(invoice.totalDue || invoice.total || 0).toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t-2 border-gray-200 pt-4 print:pt-3 print-break-avoid">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-3">
            <div className="flex-1">
              <p className="text-[10px] text-gray-500 mb-1 print:text-[9px]">Thank you for your payment!</p>
              <p className="text-[10px] text-gray-600 print:text-[9px]">This is an official receipt issued by Barangay Alma Villa</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-gray-500 mb-1 print:text-[9px]">Issued by:</p>
              <p className="text-sm font-semibold text-gray-900 print:text-xs">{invoice.signature || 'Barangay Alma Villa'}</p>
              <div className="mt-2 pt-2 border-t border-gray-200 print:mt-1 print:pt-1">
                <p className="text-[10px] text-gray-500 print:text-[9px]">Date: {invoice.issueDate}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Preview mode - full page view
  if (previewMode) {
    return (
      <div className="fixed inset-0 z-50 bg-white overflow-auto">
        {/* Preview Header */}
        <div className="bg-[#23479A] text-white px-6 py-4 flex items-center justify-between sticky top-0 shadow-lg">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold">Invoice Preview</h2>
            <span className="text-xs bg-white bg-opacity-20 px-3 py-1 rounded-full">Print-ready view</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Preview Content - A4 size simulation */}
        <div className="flex justify-center py-8 bg-gray-100 min-h-screen">
          <div className="bg-white shadow-2xl" style={{ width: '210mm', minHeight: '297mm' }}>
            <InvoiceContent />
          </div>
        </div>
      </div>
    );
  }

  // Modal mode - original popup
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-2xl max-w-3xl w-full max-h-[85vh] overflow-hidden flex flex-col">
        {/* Header with close button */}
        <div className="bg-[#23479A] text-white px-4 py-2 flex items-center justify-between flex-shrink-0">
          <h2 className="text-base font-semibold">Invoice</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Invoice Content */}
        <div className="overflow-y-auto flex-1">
          <InvoiceContent />
        </div>
      </div>
    </div>
  );
};

// Example usage component
export default function InvoiceModalExample() {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [previewMode, setPreviewMode] = useState(false);

  const sampleInvoice = {
    companyName: 'Ellington Wood Decor',
    companyAddress: '36 Terrick Rd, Ellington PE18 2NT, United Kingdom',
    clientName: 'Your client',
    clientAddress: {
      street: '11 Beech Dr',
      city: 'Ellington',
      postcode: 'NE61 5EU',
      country: 'United Kingdom'
    },
    invoiceNo: '042022',
    issueDate: '30/04/2022',
    dueDate: '14/05/2022',
    reference: '042022',
    items: [
      {
        name: 'Sample service',
        description: 'Sample wood decoration service',
        quantity: 1,
        unitPrice: 400.00,
        amount: 400.00
      },
      {
        name: 'Sample service 1',
        description: 'Sample wood decoration service 1',
        quantity: 1,
        unitPrice: 200.00,
        amount: 200.00
      }
    ],
    total: 600.00,
    totalDue: 600.00,
    signature: 'Ellington Wood Decor'
  };

  const openModal = (preview = false) => {
    setPreviewMode(preview);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-800">Invoice System</h1>
        <p className="text-gray-600">Professional invoice modal component</p>
        
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => openModal(false)}
            className="px-6 py-3 bg-[#23479A] text-white rounded-lg hover:bg-[#1a3678] transition-colors font-medium shadow-lg"
          >
            View Invoice (Modal)
          </button>
          <button
            onClick={() => openModal(true)}
            className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium shadow-lg"
          >
            View Invoice (Preview)
          </button>
        </div>

        <InvoiceModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          invoice={sampleInvoice}
          previewMode={previewMode}
        />
      </div>
    </div>
  );
}

