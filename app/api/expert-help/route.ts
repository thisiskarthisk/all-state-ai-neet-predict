import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required.' }, { status: 400 });
    }

    const studentName = name || 'Student';

    const host = (process.env.SMTP_HOST || 'smtp.gmail.com').trim();
    const port = parseInt((process.env.SMTP_PORT || '587').trim());
    const user = (process.env.SMTP_USER || '').trim();
    const pass = (process.env.SMTP_PASS || '').trim();
    const adminEmail = (process.env.ADMIN_EMAIL || user).trim();

    if (user && pass) {
      const transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass },
      });

      const requestedAt = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

      // --- Admin notification email ---
      await transporter.sendMail({
        from: `"Campus Continents Alerts" <${user}>`,
        to: adminEmail,
        subject: '🚀 New Free Counselling Booking Request',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>New Counselling Booking</title>
          </head>
          <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; padding: 40px 16px;">
              <tr>
                <td align="center">
                  <table role="presentation" width="100%" max-width="560" style="max-width: 560px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
                    
                    <!-- Header Banner -->
                    <tr>
                      <td style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 32px; text-align: center;">
                        <div style="display: inline-block; background-color: rgba(255,255,255,0.1); padding: 12px; border-radius: 16px; margin-bottom: 12px;">
                          <span style="font-size: 28px; line-height: 1;">🚀</span>
                        </div>
                        <h1 style="margin: 0; color: #ffffff; font-size: 20px; font-weight: 800; tracking-style: tight; text-transform: uppercase; letter-spacing: 0.05em;">Campus Continents</h1>
                        <p style="margin: 4px 0 0 0; color: #94a3b8; font-size: 13px; font-weight: 500;">Internal Alert System</p>
                      </td>
                    </tr>

                    <!-- Body Content -->
                    <tr>
                      <td style="padding: 40px 32px 32px 32px;">
                        <h2 style="margin: 0 0 12px 0; color: #0f172a; font-size: 22px; font-weight: 700;">New Lead Generated</h2>
                        <p style="margin: 0 0 24px 0; color: #475569; font-size: 15px; line-height: 1.6;">A student has just requested a free expert medical admission counselling session. Here are the configuration details:</p>
                        
                        <!-- Details Card -->
                        <div style="background-color: #f1f5f9; border-radius: 16px; padding: 20px; margin-bottom: 28px;">
                          <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                            <tr>
                              <td style="padding: 8px 0; font-size: 14px; font-weight: 600; color: #64748b; width: 35%;">Student Name</td>
                              <td style="padding: 8px 0; font-size: 14px; font-weight: 700; color: #0f172a;">${studentName}</td>
                            </tr>
                            <tr>
                              <td style="padding: 8px 0; font-size: 14px; font-weight: 600; color: #64748b; border-top: 1px solid #e2e8f0;">Email Address</td>
                              <td style="padding: 8px 0; font-size: 14px; font-weight: 700; color: #4f46e5; border-top: 1px solid #e2e8f0;">
                                <a href="mailto:${email}" style="color: #4f46e5; text-decoration: none;">${email}</a>
                              </td>
                            </tr>
                            <tr>
                              <td style="padding: 8px 0; font-size: 14px; font-weight: 600; color: #64748b; border-top: 1px solid #e2e8f0;">Timestamp</td>
                              <td style="padding: 8px 0; font-size: 14px; font-weight: 500; color: #334155; border-top: 1px solid #e2e8f0;">${requestedAt}</td>
                            </tr>
                          </table>
                        </div>

                        <!-- Action CTA Button -->
                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                          <tr>
                            <td align="center">
                              <a href="mailto:${email}?subject=Campus Continents Counselling Follow-up" style="display: inline-block; background-color: #4f46e5; color: #ffffff; font-size: 14px; font-weight: 700; text-decoration: none; padding: 14px 28px; border-radius: 12px; box-shadow: 0 4px 12px rgba(79, 70, 229, 0.2);">
                                Initiate Response Email
                              </a>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>

                    <!-- Footer Warning -->
                    <tr>
                      <td style="padding: 0 32px 32px 32px; text-align: center;">
                        <div style="border-top: 1px solid #e2e8f0; padding-top: 20px;">
                          <p style="margin: 0; font-size: 12px; color: #94a3b8; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">⚡ Action SLA Required: Respond within 24 Hours</p>
                        </div>
                      </td>
                    </tr>

                  </table>
                </td>
              </tr>
            </table>
          </body>
          </html>
        `,
      });

      // --- Student confirmation email ---
      await transporter.sendMail({
        from: `"Campus Continents" <${user}>`,
        to: email,
        subject: '🎓 Your Free Counselling Session is Booked!',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Counselling Session Confirmed</title>
          </head>
          <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; padding: 40px 16px;">
              <tr>
                <td align="center">
                  <table role="presentation" width="100%" max-width="560" style="max-width: 560px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
                    
                    <!-- Header Accent Gradient -->
                    <tr>
                      <td style="background: linear-gradient(135deg, #4f46e5 0%, #3730a3 100%); padding: 40px 32px; text-align: center;">
                        <div style="display: inline-block; background-color: rgba(255,255,255,0.15); padding: 14px; border-radius: 20px; margin-bottom: 16px; backdrop-filter: blur(4px);">
                          <span style="font-size: 32px; line-height: 1;">🎓</span>
                        </div>
                        <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 800; letter-spacing: -0.02em;">Booking Confirmed!</h1>
                        <p style="margin: 6px 0 0 0; color: #c7d2fe; font-size: 14px; font-weight: 500;">Campus Continents Medical Admissions</p>
                      </td>
                    </tr>

                    <!-- Main Core Content -->
                    <tr>
                      <td style="padding: 40px 32px 32px 32px;">
                        <p style="margin: 0 0 16px 0; color: #0f172a; font-size: 16px; font-weight: 700;">Dear ${studentName},</p>
                        <p style="margin: 0 0 28px 0; color: #475569; font-size: 15px; line-height: 1.6;">
                          Thank you for registering for a free strategy session with us. Our elite panel of medical admission strategists has been assigned to your case file to maximize your choice-filling strategy for the upcoming NEET cycle.
                        </p>
                        
                        <!-- Dynamic Next Steps Box -->
                        <div style="background: linear-gradient(180deg, #f0f9ff 0%, #e0f2fe 100%); border: 1px solid #bae6fd; border-radius: 16px; padding: 24px; margin-bottom: 28px;">
                          <strong style="display: block; font-size: 14px; font-weight: 800; color: #0369a1; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 16px;">What happens next?</strong>
                          
                          <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                            <tr>
                              <td valign="top" style="padding-bottom: 12px; font-size: 16px; width: 24px; color: #0284c7;">✓</td>
                              <td style="padding-bottom: 12px; padding-left: 8px; font-size: 14px; color: #0f172a; font-weight: 500; line-height: 1.4;">
                                <strong>Profile Evaluation:</strong> An advisor reviews your current score metrics & target preferences.
                              </td>
                            </tr>
                            <tr>
                              <td valign="top" style="padding-bottom: 12px; font-size: 16px; width: 24px; color: #0284c7;">✓</td>
                              <td style="padding-bottom: 12px; padding-left: 8px; font-size: 14px; color: #0f172a; font-weight: 500; line-height: 1.4;">
                                <strong>Direct Outreach:</strong> We will reach out to schedule a private video or voice consult within 24 hours.
                              </td>
                            </tr>
                            <tr>
                              <td valign="top" style="font-size: 16px; width: 24px; color: #0284c7;">✓</td>
                              <td style="padding-left: 8px; font-size: 14px; color: #0f172a; font-weight: 500; line-height: 1.4;">
                                <strong>Strategic Roadmap:</strong> We build an exact path mapping state/all-India quota opportunities.
                              </td>
                            </tr>
                          </table>
                        </div>

                        <p style="margin: 0; font-size: 14px; color: #64748b; line-height: 1.6;">
                          Best regards,<br/>
                          <strong style="color: #0f172a; font-weight: 700;">Campus Continents Team</strong>
                        </p>
                      </td>
                    </tr>

                    <!-- Safe Minimalist Footer -->
                    <tr>
                      <td style="background-color: #f8fafc; padding: 24px 32px; text-align: center; border-top: 1px solid #e2e8f0;">
                        <p style="margin: 0; font-size: 12px; color: #94a3b8;">
                          You are receiving this operational email because you requested admissions counselling support.
                        </p>
                      </td>
                    </tr>

                  </table>
                </td>
              </tr>
            </table>
          </body>
          </html>
        `,
      });

      console.log(`[SMTP] Counselling booking emails sent — Admin: ${adminEmail}, Student: ${email}`);
    } else {
      console.warn('[SMTP] SMTP_USER or SMTP_PASS not set. Email sending skipped.');
    }

    return NextResponse.json({ message: 'Counselling session booked successfully.' }, { status: 200 });
  } catch (error: any) {
    console.error('Expert Help API Error:', error);
    return NextResponse.json({ error: 'Failed to submit request. Please try again.' }, { status: 500 });
  }
}