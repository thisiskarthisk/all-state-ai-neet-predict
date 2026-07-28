import { NextRequest, NextResponse } from 'next/server';
import { storeFileToStorage } from '@/lib/ftp';
import { sendMessage } from '@/lib/wati';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    let pdfBuffer: Buffer | null = null;
    let name = 'Student';
    let phone = '';
    let email = '';
    let course = 'MBBS';
    let rank = 'AIR 106';
    let exam = 'NEET UG';
    let category = 'General';
    let homeState = 'Karnataka';

    const contentType = req.headers.get('content-type') || '';

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const pdfFile = formData.get('pdf') as File | null;
      
      if (formData.has('name')) name = (formData.get('name') as string) || name;
      if (formData.has('phone')) phone = (formData.get('phone') as string) || phone;
      if (formData.has('email')) email = (formData.get('email') as string) || email;
      if (formData.has('course')) course = (formData.get('course') as string) || course;
      if (formData.has('rank')) rank = (formData.get('rank') as string) || rank;
      if (formData.has('exam')) exam = (formData.get('exam') as string) || exam;
      if (formData.has('category')) category = (formData.get('category') as string) || category;
      if (formData.has('homeState')) homeState = (formData.get('homeState') as string) || homeState;

      if (pdfFile && typeof pdfFile.arrayBuffer === 'function') {
        const arrayBuf = await pdfFile.arrayBuffer();
        pdfBuffer = Buffer.from(arrayBuf);
      }
    } else {
      const body = await req.json();
      name = body.name || name;
      phone = body.phone || phone;
      email = body.email || email;
      course = body.course || course;
      rank = body.rank || rank;
      exam = body.exam || exam;
      category = body.category || category;
      homeState = body.homeState || homeState;
    }

    if (!phone) {
      return NextResponse.json({ error: 'Phone number is required.' }, { status: 400 });
    }

    // Clean phone number
    let cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length === 10) {
      cleanPhone = `91${cleanPhone}`;
    }

    // // Fallback if no PDF blob was uploaded
    // if (!pdfBuffer || pdfBuffer.length === 0) {
    //   const samplePdfPath = path.join(process.cwd(), 'public', 'assets', 'counselling-kit', 'sample.pdf');
    //   const atlasPdfPath = path.join(process.cwd(), 'public', 'assets', 'counselling-kit', 'The Counselling Atlas.pdf');
    //   if (fs.existsSync(samplePdfPath)) {
    //     pdfBuffer = fs.readFileSync(samplePdfPath);
    //   } else if (fs.existsSync(atlasPdfPath)) {
    //     pdfBuffer = fs.readFileSync(atlasPdfPath);
    //   }
    // }

    const timestamp = Date.now();
    const remoteFileName = `counselling-plan-${timestamp}.pdf`;

    // 1. Upload PDF buffer directly to cPanel FTP server
    let publicCPanelPdfUrl;
    if (pdfBuffer && pdfBuffer.length > 0) {
        publicCPanelPdfUrl = await storeFileToStorage(pdfBuffer, cleanPhone, remoteFileName);
        console.log(`[Generate & Send] Successfully uploaded frontend PDF blob to cPanel: ${publicCPanelPdfUrl}`);
    }

    // 2. Send PDF link to WhatsApp via WATI lib/wati.ts
    const watiResult = await sendMessage(cleanPhone, name, publicCPanelPdfUrl!!);

    return NextResponse.json({
      success: true,
      pdfUrl: publicCPanelPdfUrl,
      phone: cleanPhone,
      watiResult,
    });
  } catch (error: any) {
    console.error('[Generate & Send API Error]:', error);
    return NextResponse.json({ error: error?.message || 'Failed to process request.' }, { status: 500 });
  }
}
