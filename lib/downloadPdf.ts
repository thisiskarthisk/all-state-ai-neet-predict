/**
 * Utility helper to generate and trigger direct browser download for NEET Counselling Plan PDF
 */
export async function downloadCounsellingPdf(data: {
  name?: string;
  studentProfile?: any;
  selectedColleges?: any[];
}) {
  try {
    const { buildHTML } = await import('@/lib/pdf');
    const html2pdf = (await import('html2pdf.js')).default;

    const host = document.createElement('div');
    host.style.position = 'fixed';
    host.style.left = '0';
    host.style.top = '0';
    host.style.opacity = '0';
    host.style.pointerEvents = 'none';
    host.style.zIndex = '-1';

    const container = document.createElement('div');
    container.style.width = '700px';
    container.style.backgroundColor = '#ffffff';
    container.style.color = '#0f172a';
    container.style.fontFamily = 'Arial, sans-serif';
    host.appendChild(container);

    let collegesToRender = data.selectedColleges && data.selectedColleges.length > 0 ? data.selectedColleges : [];

    if (collegesToRender.length === 0 && typeof window !== 'undefined') {
      try {
        const raw =
          localStorage.getItem('selectCollege') ||
          localStorage.getItem('selectedColleges') ||
          localStorage.getItem('collegeList') ||
          localStorage.getItem('college_prediction_results');
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed) && parsed.length > 0) {
            collegesToRender = parsed;
          }
        }
      } catch {}
    }

    container.innerHTML = buildHTML({
      name: data.name || 'Medical Student',
      studentProfile: data.studentProfile || {
        rank: 'AIR 106',
        course: 'MBBS',
        exam: 'NEET UG',
        category: 'General / All Categories',
        quota: 'State / AIQ Quota',
        states: 'Karnataka (KA)',
      },
      selectedColleges: collegesToRender,
    });

    document.body.appendChild(host);

    const images = Array.from(container.querySelectorAll('img'));
    await Promise.all(
      images.map((img) => {
        if (img.complete) return Promise.resolve();
        return new Promise((resolve) => {
          img.onload = resolve;
          img.onerror = resolve;
        });
      })
    );

    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    await new Promise((resolve) => setTimeout(resolve, 100));

    if (container.offsetHeight) {
      const worker = html2pdf().from(container).set({
        margin: 6,
        filename: `NEET-Counselling-Plan.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          logging: false,
          backgroundColor: '#ffffff',
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      });
      const pdfBlob = await worker.outputPdf('blob');

      if (pdfBlob) {
        const downloadUrl = window.URL.createObjectURL(pdfBlob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = `NEET-Counselling-Plan.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => window.URL.revokeObjectURL(downloadUrl), 1500);
      }
    }

    if (host.parentNode) {
      host.parentNode.removeChild(host);
    }
  } catch (err) {
    console.error('Frontend PDF download error:', err);
  }
}
