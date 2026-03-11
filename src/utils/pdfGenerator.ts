import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { APP_CONFIG } from '../constants';

export const generatePDF = async (elementId: string, fileName: string) => {
  const element = document.getElementById(elementId);
  if (!element) return;

  // Set margins (15mm)
  const marginMm = 15;
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();
  
  // Content area dimensions (leave space for footer)
  const footerHeight = 20;
  const contentWidth = pdfWidth - (2 * marginMm);
  const overlap = 4; // 4mm overlap to prevent text cutting
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
  let pageNumber = 1;

  // First page
  pdf.addImage(imgData, 'PNG', marginMm, marginMm, imgWidth, imgHeight);
  heightLeft -= (contentHeight - overlap);

  while (heightLeft > 0) {
    pdf.addPage();
    pageNumber++;
    // Calculate position with overlap
    const position = -(contentHeight - overlap) * (pageNumber - 1);
    pdf.addImage(imgData, 'PNG', marginMm, position + marginMm, imgWidth, imgHeight);
    heightLeft -= (contentHeight - overlap);
  }

  // Second pass: Add footer and page numbers to all pages
  const totalPages = pageNumber;
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    
    // Mask footer area to prevent content overlap
    pdf.setFillColor(255, 255, 255);
    const maskY = pdfHeight - footerHeight - marginMm + 2; // Slight adjustment
    pdf.rect(0, maskY, pdfWidth, footerHeight + marginMm, 'F');

    // Mask top margin area to prevent bleed from previous page slices
    pdf.rect(0, 0, pdfWidth, marginMm, 'F');

    // Footer line
    pdf.setDrawColor(230);
    pdf.line(marginMm, maskY, pdfWidth - marginMm, maskY);

    // Contact info in footer
    pdf.setFontSize(8);
    pdf.setTextColor(120);
    const contactText = `${APP_CONFIG.distributorName} | ${APP_CONFIG.contactNumbers.join(' | ')} | ${APP_CONFIG.email}`;
    pdf.text(contactText, marginMm, pdfHeight - 12);

    // Page number
    pdf.text(`Page ${i} of ${totalPages}`, pdfWidth - marginMm - 20, pdfHeight - 12);
  }

  pdf.save(`${fileName}.pdf`);
};
