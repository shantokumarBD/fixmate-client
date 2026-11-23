import { jsPDF } from "jspdf";
import { formatDate } from "@/lib/utils";

export interface InvoiceData {
  invoiceNumber?: string;
  bookingId: string;
  serviceTitle: string;
  category?: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  address?: string;
  technicianName: string;
  technicianEmail: string;
  preferredDate?: string | Date;
  timeSlot?: string;
  problemDescription?: string;
  basePrice?: number;
  finalAmount: number;
  paidAt?: string | Date;
  transactionId?: string;
}

/**
 * Client-Side PDF Invoice Generator for FixMate Platform
 * Generates an official, Neobrutalist-styled A4 workshop invoice and triggers download.
 */
export function generateInvoicePDF(data: InvoiceData): boolean {
  try {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = 210;
    const margin = 15;
    const contentWidth = pageWidth - margin * 2; // 180mm

    const invoiceCode =
      data.invoiceNumber ||
      `INV-FX-${(data.bookingId || "ORDER").slice(-8).toUpperCase()}`;
    const formattedPaidAt = data.paidAt ? formatDate(data.paidAt) : formatDate(new Date());
    const formattedServiceDate = data.preferredDate ? formatDate(data.preferredDate) : "Flexible";
    const totalAmount = data.finalAmount || data.basePrice || 0;

    // ================= 1. TOP HEADER BANNER =================
    // Black & Orange Accent Header Bar
    doc.setFillColor(21, 21, 21); // #151515
    doc.rect(margin, 12, contentWidth, 24, "F");

    // Left: FixMate Workshop Brand Logo
    doc.setFillColor(255, 91, 46); // #FF5B2E
    doc.rect(margin + 4, 16, 16, 16, "F");
    doc.setDrawColor(255, 255, 255);
    doc.setLineWidth(0.5);
    doc.rect(margin + 4, 16, 16, 16, "S");

    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text("FX", margin + 7.5, 27.5);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("FIXMATE WORKSHOP", margin + 24, 23);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(220, 220, 220);
    doc.text("SMART DEVICE & HOME APPLIANCE REPAIR SERVICE PLATFORM", margin + 24, 29);

    // Right: Invoice Tag
    doc.setFillColor(252, 208, 61); // #FCD03D
    doc.rect(pageWidth - margin - 42, 16, 38, 16, "F");
    doc.setDrawColor(21, 21, 21);
    doc.setLineWidth(0.6);
    doc.rect(pageWidth - margin - 42, 16, 38, 16, "S");

    doc.setTextColor(21, 21, 21);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.text("OFFICIAL RECEIPT", pageWidth - margin - 39, 21.5);
    doc.setFontSize(8.5);
    doc.text(invoiceCode, pageWidth - margin - 39, 28);

    // ================= 2. METADATA BAR =================
    let y = 42;
    doc.setDrawColor(21, 21, 21);
    doc.setLineWidth(0.6);
    doc.line(margin, y, pageWidth - margin, y);

    y += 6;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(91, 64, 58); // #5B403A
    doc.text("DATE OF SETTLEMENT:", margin, y);
    doc.setTextColor(21, 21, 21);
    doc.text(formattedPaidAt, margin + 42, y);

    doc.setTextColor(91, 64, 58);
    doc.text("STRIPE TXN REF:", margin + 95, y);
    doc.setTextColor(21, 21, 21);
    doc.text(data.transactionId || "Verified Escrow Release", margin + 128, y);

    y += 5;
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.3);
    doc.line(margin, y, pageWidth - margin, y);

    // ================= 3. CLIENT & SPECIALIST BOXES =================
    y += 6;
    const colWidth = (contentWidth - 6) / 2;

    // Box 1: Billed To (Customer)
    doc.setFillColor(254, 249, 239); // #FEF9EF
    doc.rect(margin, y, colWidth, 34, "F");
    doc.setDrawColor(21, 21, 21);
    doc.setLineWidth(0.6);
    doc.rect(margin, y, colWidth, 34, "S");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(255, 91, 46);
    doc.text("CUSTOMER // BILLED TO", margin + 4, y + 6);

    doc.setTextColor(21, 21, 21);
    doc.setFontSize(10);
    doc.text(data.customerName || "Customer", margin + 4, y + 13);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(70, 70, 70);
    doc.text(`Email: ${data.customerEmail || "N/A"}`, margin + 4, y + 19);
    doc.text(`Contact: ${data.customerPhone || "N/A"}`, margin + 4, y + 24);
    const safeAddress = (data.address || "On-site Workshop Service").slice(0, 36);
    doc.text(`Address: ${safeAddress}`, margin + 4, y + 29);

    // Box 2: Specialist (Technician)
    const rightColX = margin + colWidth + 6;
    doc.setFillColor(254, 249, 239);
    doc.rect(rightColX, y, colWidth, 34, "F");
    doc.setDrawColor(21, 21, 21);
    doc.setLineWidth(0.6);
    doc.rect(rightColX, y, colWidth, 34, "S");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(255, 91, 46);
    doc.text("ASSIGNED REPAIR SPECIALIST", rightColX + 4, y + 6);

    doc.setTextColor(21, 21, 21);
    doc.setFontSize(10);
    doc.text(data.technicianName || "Certified Master Specialist", rightColX + 4, y + 13);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(70, 70, 70);
    doc.text(`Specialist Email: ${data.technicianEmail || "N/A"}`, rightColX + 4, y + 19);
    doc.text(`Service Scheduled: ${formattedServiceDate}`, rightColX + 4, y + 24);
    doc.text(`Operating Window: ${data.timeSlot || "Flexible Appointment Window"}`, rightColX + 4, y + 29);

    // ================= 4. ITEMIZED SERVICE MANIFEST =================
    y += 42;

    // Table Header
    doc.setFillColor(242, 237, 227); // #F2EDE3
    doc.rect(margin, y, contentWidth, 8, "F");
    doc.setDrawColor(21, 21, 21);
    doc.setLineWidth(0.6);
    doc.rect(margin, y, contentWidth, 8, "S");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(21, 21, 21);
    doc.text("REPAIR SERVICE WORK ORDER", margin + 4, y + 5.5);
    doc.text("CATEGORY", margin + 115, y + 5.5);
    doc.text("AMOUNT (USD)", margin + 150, y + 5.5);

    // Table Row 1: Primary Service
    y += 8;
    doc.setFillColor(255, 255, 255);
    doc.rect(margin, y, contentWidth, 24, "F");
    doc.setDrawColor(21, 21, 21);
    doc.setLineWidth(0.6);
    doc.rect(margin, y, contentWidth, 24, "S");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(21, 21, 21);
    doc.text(data.serviceTitle || "Certified Repair Service", margin + 4, y + 7);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(90, 90, 90);
    const descText = data.problemDescription
      ? `Diagnostic Scope: ${data.problemDescription.slice(0, 95)}...`
      : "Multi-point diagnostic inspection, burn-in hardware test, and precision parts overhaul.";
    doc.text(descText, margin + 4, y + 13, { maxWidth: 105 });

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(21, 21, 21);
    doc.text(data.category || "Smart Device", margin + 115, y + 9);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text(`$${totalAmount.toFixed(2)}`, margin + 152, y + 9);

    // ================= 5. FINANCIAL BREAKDOWN & PAID STAMP =================
    y += 30;

    // Left: Official Neobrutalist "PAID IN FULL" Stamp Box
    doc.setFillColor(220, 252, 231); // #DCFCE7
    doc.rect(margin, y, 95, 34, "F");
    doc.setDrawColor(22, 163, 74); // #16A34A
    doc.setLineWidth(1);
    doc.rect(margin, y, 95, 34, "S");

    doc.setTextColor(22, 163, 74);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("PAID IN FULL // SETTLED", margin + 6, y + 8);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(21, 21, 21);
    doc.text("Status: Verified Electronic Escrow Release", margin + 6, y + 15);
    doc.text(`Payment Gateway: Stripe Checkout`, margin + 6, y + 21);
    doc.text(`Settlement Timestamp: ${formattedPaidAt}`, margin + 6, y + 27);

    // Right: Calculation Summary Box
    const calcX = margin + 102;
    const calcWidth = contentWidth - 102;
    doc.setFillColor(254, 249, 239);
    doc.rect(calcX, y, calcWidth, 34, "F");
    doc.setDrawColor(21, 21, 21);
    doc.setLineWidth(0.6);
    doc.rect(calcX, y, calcWidth, 34, "S");

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(70, 70, 70);
    doc.text("Service Labor & Inspection:", calcX + 4, y + 8);
    doc.setTextColor(21, 21, 21);
    doc.text(`$${totalAmount.toFixed(2)}`, calcX + calcWidth - 18, y + 8);

    doc.setTextColor(70, 70, 70);
    doc.text("Platform Surcharge & Tax:", calcX + 4, y + 15);
    doc.setTextColor(21, 21, 21);
    doc.text("$0.00", calcX + calcWidth - 18, y + 15);

    doc.setDrawColor(21, 21, 21);
    doc.setLineWidth(0.4);
    doc.line(calcX + 4, y + 20, calcX + calcWidth - 4, y + 20);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(21, 21, 21);
    doc.text("TOTAL SETTLED:", calcX + 4, y + 27);
    doc.setTextColor(22, 163, 74);
    doc.setFontSize(11);
    doc.text(`$${totalAmount.toFixed(2)} USD`, calcX + calcWidth - 26, y + 27);

    // ================= 6. GUARANTEE TERMS & FOOTER =================
    y += 42;
    doc.setFillColor(242, 237, 227);
    doc.rect(margin, y, contentWidth, 18, "F");
    doc.setDrawColor(21, 21, 21);
    doc.setLineWidth(0.6);
    doc.rect(margin, y, contentWidth, 18, "S");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(255, 91, 46);
    doc.text("FIXMATE 90-DAY WORKMANSHIP & COMPONENT WARRANTY", margin + 4, y + 6);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(70, 70, 70);
    doc.text(
      "This invoice covers the repaired hardware under our 90-day parts and diagnostic rework policy. If any recurrence",
      margin + 4,
      y + 11
    );
    doc.text(
      "takes place within 90 days, free workshop recalibration is guaranteed. Support: support@fixmate.app",
      margin + 4,
      y + 15
    );

    // Bottom Watermark
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.setTextColor(140, 140, 140);
    doc.text("FIXMATE REPAIR DISPATCH NETWORK • DIGITALLY VERIFIED INVOICE", margin, 285);
    doc.text(`TICKET #${(data.bookingId || "").toUpperCase()}`, pageWidth - margin - 45, 285);

    // Save and Trigger Automatic Download
    const fileName = `FixMate-Invoice-${(data.bookingId || "TICKET").slice(-6).toUpperCase()}.pdf`;
    doc.save(fileName);
    return true;
  } catch (error) {
    console.error("Failed to generate PDF invoice:", error);
    return false;
  }
}
