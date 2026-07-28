import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, mobileNo, studentProfile, selectedColleges, type } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email address is required.' }, { status: 400 });
    }

    if (!mobileNo) {
      return NextResponse.json({ error: 'Mobile number is required.' }, { status: 400 });
    }

    const host = (process.env.SMTP_HOST || 'smtp.gmail.com').trim();
    const port = parseInt((process.env.SMTP_PORT || '587').trim());
    const user = (process.env.SMTP_USER || '').trim();
    const pass = (process.env.SMTP_PASS || '').trim();
    const adminEmail = (process.env.ADMIN_EMAIL || user || 'admin@campuscontinents.com').trim();

    const requestedAt = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

    // Handle normal outside expert help (simple name + email booking)
    if (type === 'simple' || (!selectedColleges && !studentProfile)) {
      if (user && pass) {
        try {
          const transporter = nodemailer.createTransport({ host, port, secure: port === 465, auth: { user, pass } });

          // Admin Mail
          await transporter.sendMail({
            from: `"Campus Continents" <${user}>`,
            to: adminEmail,
            subject: `thank for book ${name || 'User'}`,
            html: `
              <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:28px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:16px;">
                <p style="color:#475569;font-size:14px;">A new expert consultation request has been submitted.</p>
                <div style="background:#fff;padding:16px;border-radius:12px;border:1px solid #e2e8f0;margin-top:16px;">
                  <p style="margin:0 0 8px;font-size:13px;color:#334155;"><strong>Name:</strong> ${name || 'Not provided'}</p>
                  <p style="margin:0 0 8px;font-size:13px;color:#334155;"><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
                  <p style="margin:0 0 8px;font-size:13px;color:#334155;"><strong>Mobile Number:</strong> <a href="tel:${mobileNo}">${mobileNo}</a></p>
                  <p style="margin:0;font-size:13px;color:#334155;"><strong>Session Booking Date & Time:</strong> ${requestedAt}</p>
                </div>
              </div>
            `,
          });

          // Student Mail
          await transporter.sendMail({
            from: `"Campus Continents" <${user}>`,
            to: email,
            subject: 'Thanks you for the Confirm',
            html: `
              <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:28px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:16px;">
                <div style="background:linear-gradient(135deg,#10b981,#059669);border-radius:12px;padding:20px;color:#fff;margin-bottom:20px;text-align:center;">
                  <h2 style="margin:0;font-size:20px;">Thanks you for the Confirm</h2>
                  <p style="margin:6px 0 0;opacity:0.9;font-size:12px;">Campus Continents Medical Admissions</p>
                </div>
                <p style="color:#0f172a;font-size:14px;font-weight:bold;">Dear ${name || 'Student'},</p>
                <p style="color:#475569;font-size:13px;line-height:1.7;">Your booking is confirmed! Our admission experts will reach out to you within 24 hours.</p>
                <p style="color:#475569;font-size:13px;line-height:1.7;margin-top:20px;">Best regards,<br/><strong style="color:#0f172a;">Campus Continents</strong></p>
              </div>
            `,
          });
        } catch (emailErr) {
          console.error('[send-email simple] Error:', emailErr);
        }
      }

      return NextResponse.json({ message: 'your booking confirm' }, { status: 200 });
    }

    // Handle full counselling details email (from Counselling Page)
    const collegeListHTML = (selectedColleges || []).map((c: any, i: number) => {
      const cName = c.college_name || c.name || `Medical College ${i + 1}`;
      const cState = c.state_name || c.state || 'Karnataka';
      const cType = c.college_type || c.type || 'Government';
      const chance = c.best_chance || 'High';

      const rawEvents = c.counsellingDetail?.events || c.events || [];
      const eventsList = (Array.isArray(rawEvents) && rawEvents.length > 0 ? rawEvents : [
        { stage: 'KEA UG NEET Registration and Document Verification', startDate: '12/Aug/2026', endDate: '20/Aug/2026', additionalDetails: 'Online registration & original document verification at designated centers' },
        { stage: 'Choice Filling & Option Entry', startDate: '22/Aug/2026', endDate: '27/Aug/2026', additionalDetails: 'Enter and lock preferred medical college priority choices' },
        { stage: 'Round 1 Seat Allotment Result', startDate: '30/Aug/2026', endDate: '30/Aug/2026', additionalDetails: 'Official seat allotment published on KEA/MCC portal' },
        { stage: 'Physical Reporting & Admission', startDate: '01/Sep/2026', endDate: '06/Sep/2026', additionalDetails: 'Report to allotted college with fee payment & original certificates' }
      ]).map((ev: any) => {
        const stageName = ev.event || ev.stage || 'Phase';
        const startDate = ev.startDate || ev.date || 'TBA';
        const endDateStr = ev.endDate ? ` | End: ${ev.endDate}` : '';
        const details = ev.additionalDetails || ev.description || '';

        return `<li style="margin-bottom:8px;color:#334155;font-size:12px;line-height:1.5;">
          <strong style="color:#0f172a;">${stageName}</strong>
          <span style="color:#059669;font-weight:700;"> (Start: ${startDate}${endDateStr})</span>
          ${details ? ` — <span style="color:#64748b;">${details}</span>` : ''}
        </li>`;
      }).join('');

      return `
        <div style="margin-bottom:16px; padding:16px; border:1px solid #e2e8f0; border-radius:12px; background:#fff;">
          <h4 style="margin:0 0 6px; color:#0f172a; font-size:14px; font-weight:700;">${i + 1}. ${cName} (${cState})</h4>
          <p style="margin:0 0 10px; font-size:11px; color:#64748b; font-weight:600;">${cType} &bull; <span style="color:#16a34a;font-weight:700;">${chance} Chance</span></p>
          <p style="margin:0 0 8px; font-size:12px; font-weight:700; color:#4f46e5; text-transform:uppercase; letter-spacing:0.03em;">Actual Counselling Schedule:</p>
          <ul style="margin:0; padding-left:18px; font-size:12px; color:#475569; line-height:1.6;">${eventsList}</ul>
        </div>
      `;
    }).join('');

    const profileHTML = studentProfile ? `
      <div style="background:#fff; padding:14px; border-radius:12px; border:1px solid #e2e8f0; margin-bottom:16px;">
        <h4 style="margin:0 0 8px; color:#0f172a; font-size:13px;">Student Admission Profile</h4>
        <p style="margin:0 0 4px; font-size:12px; color:#334155;"><strong>NEET Rank:</strong> AIR ${studentProfile.rank || '—'}</p>
        <p style="margin:0 0 4px; font-size:12px; color:#334155;"><strong>Course:</strong> ${studentProfile.course || '—'}</p>
        <p style="margin:0 0 4px; font-size:12px; color:#334155;"><strong>Exam:</strong> ${studentProfile.exam || '—'}</p>
        <p style="margin:0 0 4px; font-size:12px; color:#334155;"><strong>Category:</strong> ${studentProfile.category || '—'}</p>
        <p style="margin:0; font-size:12px; color:#334155;"><strong>States:</strong> ${Array.isArray(studentProfile.states) ? studentProfile.states.join(', ') : studentProfile.states || 'All India'}</p>
      </div>
    ` : '';

    if (user && pass) {
      try {
        const transporter = nodemailer.createTransport({ host, port, secure: port === 465, auth: { user, pass } });

        // Admin Mail
        await transporter.sendMail({
          from: `"Campus Continents" <${user}>`,
          to: adminEmail,
          subject: `Counselling Kit Delivered to ${name || 'a User'}`,
          html: `
            <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:28px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:16px;">
              <p style="color:#475569;font-size:13px;">A student has received their counselling kit for the requested colleges. Below is the copy of information shared to them.</p>
              
              <div style="background:#fff;padding:14px;border-radius:12px;border:1px solid #e2e8f0;margin-bottom:16px;">
                <p style="margin:0 0 6px;font-size:12px;color:#334155;"><strong>Name:</strong> ${name || 'Not provided'}</p>
                <p style="margin:0 0 6px;font-size:12px;color:#334155;"><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
                <p style="margin:0 0 8px;font-size:13px;color:#334155;"><strong>Mobile Number:</strong> <a href="tel:${mobileNo}">${mobileNo}</a></p>
                <p style="margin:0;font-size:12px;color:#334155;"><strong>Date & Time:</strong> ${requestedAt}</p>
              </div>

              ${profileHTML}

              <h3 style="color:#4f46e5;margin-top:20px;margin-bottom:12px;font-size:15px;">Counselling Data</h3>
              ${collegeListHTML || '<p style="color:#64748b;font-size:12px;">No colleges selected.</p>'}
            </div>
          `,
        });

        // Student Mail
        await transporter.sendMail({
          from: `"Campus Continents" <${user}>`,
          to: email,
          subject: 'Your NEET Counselling Kit',
          html: `
            <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:28px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:16px;">
              <div style="background:linear-gradient(135deg,#10b981,#059669);border-radius:12px;padding:24px;color:#fff;margin-bottom:20px;text-align:center;">
                <h1 style="margin:0;font-size:22px;">NEET Counselling Kit</h1>
                <p style="margin:6px 0 0;opacity:0.9;font-size:13px;">Campus Continents Medical Admissions</p>
              </div>

              <p style="color:#0f172a;font-size:14px;font-weight:bold;">Dear ${name || 'Student'},</p>
              <p style="color:#475569;font-size:13px;line-height:1.7;">Please find your official NEET Counselling & Timeline report for your target medical colleges below.</p>

              ${profileHTML}

              <h3 style="color:#059669;margin-top:20px;margin-bottom:12px;font-size:15px;">Selected Colleges &amp; Counselling Timelines</h3>
              ${collegeListHTML || '<p style="color:#64748b;font-size:12px;">No colleges selected.</p>'}

              <p style="color:#475569;font-size:13px;line-height:1.7;margin-top:24px;">Best regards,<br/><strong style="color:#0f172a;">Campus Continents</strong></p>
            </div>
          `,
        });
      } catch (emailErr) {
        console.error('[send-email full] Error:', emailErr);
      }
    }

    return NextResponse.json({ message: 'Request submitted successfully.' }, { status: 200 });
  } catch (error: any) {
    console.error('[send-email] API Error:', error);
    return NextResponse.json({ error: 'Failed to send email request.' }, { status: 500 });
  }
}
