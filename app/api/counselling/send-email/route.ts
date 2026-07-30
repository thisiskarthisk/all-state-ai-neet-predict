import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, mobileNo, homeState, studentProfile, selectedColleges, type } = body;

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
            subject: `Student Admission Profile - ${name || 'User'}`,
            html: `
              <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:28px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:16px;">
                <p style="color:#475569;font-size:14px;">A new consultation request has been submitted.</p>
                <div style="background:#fff;padding:16px;border-radius:12px;border:1px solid #e2e8f0;margin-top:16px;">
                  <p style="margin:0 0 8px;font-size:13px;color:#334155;"><strong>Name:</strong> ${name || 'Not provided'}</p>
                  <p style="margin:0 0 8px;font-size:13px;color:#334155;"><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
                  <p style="margin:0 0 8px;font-size:13px;color:#334155;"><strong>Mobile Number:</strong> <a href="tel:${mobileNo}">${mobileNo}</a></p>
                  <p style="margin:0;font-size:13px;color:#334155;"><strong>Booking Date & Time:</strong> ${requestedAt}</p>
                </div>
              </div>
            `,
          });

          // Student Mail
          await transporter.sendMail({
            from: `"Campus Continents" <${user}>`,
            to: email,
            subject: 'Student Admission Profile Confirmation',
            html: `
              <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:28px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:16px;">
                <div style="background:linear-gradient(135deg,#10b981,#059669);border-radius:12px;padding:20px;color:#fff;margin-bottom:20px;text-align:center;">
                  <h2 style="margin:0;font-size:20px;">Student Admission Profile Confirmation</h2>
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

    // Extract preferred college names only
    let preferredCollegesList: string[] = [];

    if (studentProfile?.preferredColleges) {
      preferredCollegesList = String(studentProfile.preferredColleges)
        .split(',')
        .map((c) => c.trim())
        .filter(Boolean);
    } else if (Array.isArray(selectedColleges) && selectedColleges.length > 0) {
      preferredCollegesList = selectedColleges
        .map((c: any) => c.college_name || c.name || '')
        .map((s: string) => s.trim())
        .filter(Boolean);
    }

    const collegeNamesHTML =
      preferredCollegesList.length > 0
        ? preferredCollegesList
            .map(
              (colName) =>
                `<li style="margin-bottom:6px;color:#0f172a;font-size:13px;font-weight:600;">${colName}</li>`
            )
            .join('')
        : '<li style="color:#64748b;font-size:13px;">None specified</li>';

    const hState = homeState || studentProfile?.homeState || studentProfile?.states || 'Not provided';

    const profileHTML = `
      <div style="background:#fff; padding:16px; border-radius:12px; border:1px solid #e2e8f0; margin-bottom:16px;">
        <h4 style="margin:0 0 10px; color:#4f46e5; font-size:14px; font-weight:700;">Student Admission Profile</h4>
        <p style="margin:0 0 6px; font-size:13px; color:#334155;"><strong>Full Name:</strong> ${name || 'Not provided'}</p>
        <p style="margin:0 0 6px; font-size:13px; color:#334155;"><strong>Email:</strong> ${email}</p>
        <p style="margin:0 0 6px; font-size:13px; color:#334155;"><strong>Mobile Number:</strong> ${mobileNo}</p>
        <p style="margin:0 0 6px; font-size:13px; color:#334155;"><strong>Home State:</strong> ${hState}</p>
        <p style="margin:0 0 6px; font-size:13px; color:#334155;"><strong>NEET Rank:</strong> AIR ${studentProfile?.rank || '—'}</p>
        <p style="margin:0 0 6px; font-size:13px; color:#334155;"><strong>Course:</strong> ${studentProfile?.course || '—'}</p>
        <p style="margin:0 0 6px; font-size:13px; color:#334155;"><strong>Exam:</strong> ${studentProfile?.exam || '—'}</p>
        <p style="margin:0; font-size:13px; color:#334155;"><strong>Category:</strong> ${studentProfile?.category || '—'}</p>
      </div>

      <div style="background:#fff; padding:16px; border-radius:12px; border:1px solid #e2e8f0;">
        <h4 style="margin:0 0 10px; color:#059669; font-size:14px; font-weight:700;">Preferred Colleges</h4>
        <ol style="margin:0; padding-left:20px; font-size:13px; color:#334155; line-height:1.6;">
          ${collegeNamesHTML}
        </ol>
      </div>
    `;

    if (user && pass) {
      try {
        const transporter = nodemailer.createTransport({ host, port, secure: port === 465, auth: { user, pass } });

        // Admin Mail
        await transporter.sendMail({
          from: `"Campus Continents" <${user}>`,
          to: adminEmail,
          subject: `Student Admission Profile - ${name || 'Student'}`,
          html: `
            <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:28px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:16px;">
              <p style="color:#475569;font-size:13px;">A new Student Admission Profile lead submission has been received.</p>
              
              <div style="background:#fff;padding:14px;border-radius:12px;border:1px solid #e2e8f0;margin-bottom:16px;">
                <p style="margin:0 0 6px;font-size:12px;color:#334155;"><strong>Name:</strong> ${name || 'Not provided'}</p>
                <p style="margin:0 0 6px;font-size:12px;color:#334155;"><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
                <p style="margin:0 0 8px;font-size:13px;color:#334155;"><strong>Mobile Number:</strong> <a href="tel:${mobileNo}">${mobileNo}</a></p>
                <p style="margin:0;font-size:12px;color:#334155;"><strong>Date & Time:</strong> ${requestedAt}</p>
              </div>

              ${profileHTML}
            </div>
          `,
        });

        // Student Mail
        await transporter.sendMail({
          from: `"Campus Continents" <${user}>`,
          to: email,
          subject: 'Student Admission Profile',
          html: `
            <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:28px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:16px;">
              <div style="background:linear-gradient(135deg,#10b981,#059669);border-radius:12px;padding:24px;color:#fff;margin-bottom:20px;text-align:center;">
                <h1 style="margin:0;font-size:22px;">Student Admission Profile</h1>
                <p style="margin:6px 0 0;opacity:0.9;font-size:13px;">Campus Continents Medical Admissions</p>
              </div>

              <p style="color:#0f172a;font-size:14px;font-weight:bold;">Dear ${name || 'Student'},</p>
              <p style="color:#475569;font-size:13px;line-height:1.7;">Thank you for sharing your admission profile and preferred colleges. Below is a copy of your submitted details:</p>

              ${profileHTML}

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
