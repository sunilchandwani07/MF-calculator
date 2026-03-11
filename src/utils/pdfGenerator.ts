import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { APP_CONFIG } from '../constants';

export const generatePDF = async (elementId: string, fileName: string) => {
  const element = document.getElementById(elementId);
  if (!element) return;

  // Set margins (0.5 inch = 12.7 mm)
  const marginMm = 12.7;
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();
  
  // Content area dimensions (leave space for footer)
  const footerHeight = 15;
  const contentWidth = pdfWidth - (2 * marginMm);
  const contentHeight = pdfHeight - (2 * marginMm) - footerHeight;

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: '#ffffff',
    windowWidth: element.scrollWidth,
    onclone: (clonedDoc) => {
      // Find all style tags and replace oklch with a fallback hex color
      // html2canvas parser crashes on oklch()
      const styles = clonedDoc.getElementsByTagName('style');
      for (let i = 0; i < styles.length; i++) {
        const style = styles[i];
        if (style.innerHTML.includes('oklch')) {
          style.innerHTML = style.innerHTML.replace(/oklch\([^)]+\)/g, '#777777');
        }
      }
      
      // Also check inline styles
      const allElements = clonedDoc.getElementsByTagName('*');
      for (let i = 0; i < allElements.length; i++) {
        const el = allElements[i] as HTMLElement;
        if (el.style) {
          const styleStr = el.getAttribute('style') || '';
          if (styleStr.includes('oklch')) {
            el.setAttribute('style', styleStr.replace(/oklch\([^)]+\)/g, '#777777'));
          }
        }
      }
    }
  });

  const imgData = canvas.toDataURL('image/png');
  const imgProps = pdf.getImageProperties(imgData);
  
  // Calculate how much of the image fits on one page
  const imgWidth = contentWidth;
  const imgHeight = (imgProps.height * imgWidth) / imgProps.width;
  
  let heightLeft = imgHeight;
  let position = 0;
  let pageNumber = 1;

  // First page
  pdf.addImage(imgData, 'PNG', marginMm, marginMm, imgWidth, imgHeight);
  heightLeft -= contentHeight;

  while (heightLeft > 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pageNumber++;
    // Add the image slice
    pdf.addImage(imgData, 'PNG', marginMm, position + marginMm, imgWidth, imgHeight);
    heightLeft -= contentHeight;
  }

  // Second pass: Add footer and page numbers to all pages
  const totalPages = pageNumber;
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    
    // Mask footer area to prevent content overlap
    pdf.setFillColor(255, 255, 255);
    const maskY = pdfHeight - footerHeight - marginMm;
    pdf.rect(0, maskY, pdfWidth, footerHeight + marginMm, 'F');

    // Mask top margin area to prevent bleed from previous page slices
    pdf.rect(0, 0, pdfWidth, marginMm, 'F');

    // Footer line
    pdf.setDrawColor(200);
    pdf.line(marginMm, maskY, pdfWidth - marginMm, maskY);

    // Contact info in footer
    pdf.setFontSize(8);
    pdf.setTextColor(100);
    const contactText = `${APP_CONFIG.distributorName} | ${APP_CONFIG.contactNumbers.join(' | ')} | ${APP_CONFIG.email}`;
    pdf.text(contactText, marginMm, pdfHeight - 10);

    // Page number
    pdf.text(`Page ${i} of ${totalPages}`, pdfWidth - marginMm - 20, pdfHeight - 10);
  }

  pdf.save(`${fileName}.pdf`);
};
