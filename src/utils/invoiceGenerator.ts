import html2pdf from 'html2pdf.js';

export interface InvoiceData {
  invoiceNumber: string;
  dateCreated: string;
  diver: string;
  course: string;
  coursePrice: number;
  accommodation: string;
  accommodationPrice: number;
  checkIn?: string;
  checkOut?: string;
  totalAmount: number;
  paymentStatus: string;
  notes?: string;
}

export function generateInvoicePDF(data: InvoiceData) {
  const element = document.createElement('div');
  element.innerHTML = `
    <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #0066cc; padding-bottom: 20px;">
        <h1 style="color: #0066cc; margin: 0; font-size: 32px;">DIVE BUDDY</h1>
        <p style="color: #666; margin: 5px 0;">Diving Adventures & Training</p>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px;">
        <div>
          <h3 style="color: #0066cc; margin-top: 0;">Company Details</h3>
          <p style="margin: 5px 0;"><strong>Dive Buddy</strong></p>
          <p style="margin: 5px 0; color: #666;">Premium Diving Services</p>
          <p style="margin: 5px 0; color: #666;">📧 contact@divebuddy.com</p>
          <p style="margin: 5px 0; color: #666;">📱 +1 (555) 123-4567</p>
        </div>
        <div>
          <h3 style="color: #0066cc; margin-top: 0;">Invoice Details</h3>
          <p style="margin: 5px 0;"><strong>Invoice #:</strong> ${data.invoiceNumber}</p>
          <p style="margin: 5px 0;"><strong>Date:</strong> ${data.dateCreated}</p>
          <p style="margin: 5px 0;"><strong>Status:</strong> <span style="background-color: ${data.paymentStatus === 'paid' ? '#10b981' : '#ef4444'}; color: white; padding: 4px 8px; border-radius: 4px; font-weight: bold;">${data.paymentStatus.toUpperCase()}</span></p>
        </div>
      </div>

      <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin-bottom: 30px;">
        <h3 style="color: #0066cc; margin-top: 0;">Bill To</h3>
        <p style="margin: 5px 0; font-size: 16px;"><strong>${data.diver}</strong></p>
      </div>

      <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
        <thead>
          <tr style="background-color: #0066cc; color: white;">
            <th style="padding: 12px; text-align: left; border: 1px solid #ddd;">Description</th>
            <th style="padding: 12px; text-align: right; border: 1px solid #ddd;">Unit Price</th>
            <th style="padding: 12px; text-align: right; border: 1px solid #ddd;">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${data.course !== "No Course" ? `
          <tr style="border-bottom: 1px solid #ddd;">
            <td style="padding: 12px; border-right: 1px solid #ddd;">
              <strong>${data.course}</strong><br/>
              ${data.checkIn && data.checkOut ? `<span style="color: #666; font-size: 12px;">${data.checkIn} to ${data.checkOut}</span>` : ''}
            </td>
            <td style="padding: 12px; text-align: right; border-right: 1px solid #ddd;">$${data.coursePrice.toFixed(2)}</td>
            <td style="padding: 12px; text-align: right;">$${data.coursePrice.toFixed(2)}</td>
          </tr>
          ` : ''}
          
          ${data.accommodation !== "No Accommodation" ? `
          <tr style="border-bottom: 1px solid #ddd;">
            <td style="padding: 12px; border-right: 1px solid #ddd;">
              <strong>${data.accommodation}</strong>
            </td>
            <td style="padding: 12px; text-align: right; border-right: 1px solid #ddd;">—</td>
            <td style="padding: 12px; text-align: right;">$${data.accommodationPrice.toFixed(2)}</td>
          </tr>
          ` : ''}
        </tbody>
      </table>

      <div style="display: flex; justify-content: flex-end; margin-bottom: 30px;">
        <div style="width: 300px;">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; border-top: 2px solid #0066cc; padding-top: 15px;">
            <div style="text-align: right; font-weight: bold;">TOTAL:</div>
            <div style="text-align: right; font-size: 24px; font-weight: bold; color: #0066cc;">$${data.totalAmount.toFixed(2)}</div>
          </div>
        </div>
      </div>

      <div style="text-align: center; color: #666; font-size: 12px; border-top: 1px solid #ddd; padding-top: 20px;">
        <p style="margin: 5px 0;">Thank you for diving with Dive Buddy!</p>
        <p style="margin: 5px 0;">For questions, contact us at contact@divebuddy.com</p>
        <p style="margin: 5px 0; color: #999;">Invoice generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
      </div>
    </div>
  `;

  const options = {
    margin: 10,
    filename: `invoice-${data.invoiceNumber}.pdf`,
    image: { type: 'jpeg' as const, quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { orientation: 'portrait' as const, unit: 'mm', format: 'a4' },
  };

  html2pdf().set(options).from(element).save();
}

export function printInvoice(data: InvoiceData) {
  const element = document.createElement('div');
  element.innerHTML = `
    <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #0066cc; padding-bottom: 20px;">
        <h1 style="color: #0066cc; margin: 0; font-size: 32px;">DIVE BUDDY</h1>
        <p style="color: #666; margin: 5px 0;">Diving Adventures & Training</p>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px;">
        <div>
          <h3 style="color: #0066cc; margin-top: 0;">Company Details</h3>
          <p style="margin: 5px 0;"><strong>Dive Buddy</strong></p>
          <p style="margin: 5px 0; color: #666;">Premium Diving Services</p>
          <p style="margin: 5px 0; color: #666;">📧 contact@divebuddy.com</p>
          <p style="margin: 5px 0; color: #666;">📱 +1 (555) 123-4567</p>
        </div>
        <div>
          <h3 style="color: #0066cc; margin-top: 0;">Invoice Details</h3>
          <p style="margin: 5px 0;"><strong>Invoice #:</strong> ${data.invoiceNumber}</p>
          <p style="margin: 5px 0;"><strong>Date:</strong> ${data.dateCreated}</p>
          <p style="margin: 5px 0;"><strong>Status:</strong> <span style="background-color: ${data.paymentStatus === 'paid' ? '#10b981' : '#ef4444'}; color: white; padding: 4px 8px; border-radius: 4px; font-weight: bold;">${data.paymentStatus.toUpperCase()}</span></p>
        </div>
      </div>

      <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin-bottom: 30px;">
        <h3 style="color: #0066cc; margin-top: 0;">Bill To</h3>
        <p style="margin: 5px 0; font-size: 16px;"><strong>${data.diver}</strong></p>
      </div>

      <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
        <thead>
          <tr style="background-color: #0066cc; color: white;">
            <th style="padding: 12px; text-align: left; border: 1px solid #ddd;">Description</th>
            <th style="padding: 12px; text-align: right; border: 1px solid #ddd;">Unit Price</th>
            <th style="padding: 12px; text-align: right; border: 1px solid #ddd;">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${data.course !== "No Course" ? `
          <tr style="border-bottom: 1px solid #ddd;">
            <td style="padding: 12px; border-right: 1px solid #ddd;">
              <strong>${data.course}</strong><br/>
              ${data.checkIn && data.checkOut ? `<span style="color: #666; font-size: 12px;">${data.checkIn} to ${data.checkOut}</span>` : ''}
            </td>
            <td style="padding: 12px; text-align: right; border-right: 1px solid #ddd;">$${data.coursePrice.toFixed(2)}</td>
            <td style="padding: 12px; text-align: right;">$${data.coursePrice.toFixed(2)}</td>
          </tr>
          ` : ''}
          
          ${data.accommodation !== "No Accommodation" ? `
          <tr style="border-bottom: 1px solid #ddd;">
            <td style="padding: 12px; border-right: 1px solid #ddd;">
              <strong>${data.accommodation}</strong>
            </td>
            <td style="padding: 12px; text-align: right; border-right: 1px solid #ddd;">—</td>
            <td style="padding: 12px; text-align: right;">$${data.accommodationPrice.toFixed(2)}</td>
          </tr>
          ` : ''}
        </tbody>
      </table>

      <div style="display: flex; justify-content: flex-end; margin-bottom: 30px;">
        <div style="width: 300px;">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; border-top: 2px solid #0066cc; padding-top: 15px;">
            <div style="text-align: right; font-weight: bold;">TOTAL:</div>
            <div style="text-align: right; font-size: 24px; font-weight: bold; color: #0066cc;">$${data.totalAmount.toFixed(2)}</div>
          </div>
        </div>
      </div>

      <div style="text-align: center; color: #666; font-size: 12px; border-top: 1px solid #ddd; padding-top: 20px;">
        <p style="margin: 5px 0;">Thank you for diving with Dive Buddy!</p>
        <p style="margin: 5px 0;">For questions, contact us at contact@divebuddy.com</p>
        <p style="margin: 5px 0; color: #999;">Invoice generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
      </div>
    </div>
  `;

  const printWindow = window.open('', '', 'width=800,height=600');
  if (printWindow) {
    printWindow.document.write(element.outerHTML);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  }
}
