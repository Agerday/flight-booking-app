import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export const generatePDF = async (container: HTMLElement, fileName = "boarding-pass.pdf") => {
    const boardingPassElements = Array.from(container.children) as HTMLElement[];
    const pdf = new jsPDF("p", "mm", "a4");

    for (let i = 0; i < boardingPassElements.length; i++) {
        const element = boardingPassElements[i];
        const canvas = await html2canvas(element, { scale: 3 });
        const imgData = canvas.toDataURL("image/png");
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        if (i > 0) pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    }

    pdf.save(fileName);
};
