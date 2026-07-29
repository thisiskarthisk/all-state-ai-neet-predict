import { NextRequest } from 'next/server';
import { LOGGER } from '@/lib/logger';

interface StudentProfile {
  course?: string;
  exam?: string;
  category?: string;
  quota?: string;
  states?: string[] | string;
  rank?: string;
}

interface RequestBody {
  studentProfile?: StudentProfile;
  selectedColleges?: any[];
  name?: string;
  email?: string;
}

export function buildHTML(body: RequestBody): string {
  const { studentProfile = {}, selectedColleges = [], name } = body;
  const generatedAt = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

  const statesDisplay = Array.isArray(studentProfile.states)
    ? (studentProfile.states.length === 0 || studentProfile.states.includes('AI')
        ? 'Karnataka (KA)'
        : studentProfile.states.join(', '))
    : (studentProfile.states || 'Karnataka (KA)');

  const collegesHTML = (selectedColleges || []).length === 0
    ? '<div style="padding:20px;text-align:center;color:#64748b;font-weight:600;font-size:13px;">Karnataka Premier Medical & Dental Colleges</div>'
    : (selectedColleges || []).map((c: any, i: number) => {
        const cName = c.college_name || c.name || `Medical College ${i + 1}`;
        const cState = c.state_name || c.state || 'Karnataka';
        const cCity = c.city_name || c.city || '';
        const cType = c.college_type || c.type || 'Government';
        const cutoff = c.closest_cutoff ? `AIR ~${Math.round(c.closest_cutoff).toLocaleString('en-IN')}` : 'TBA';
        const chance = c.best_chance || 'High';
        const chanceColor = chance === 'High' ? '#16a34a' : chance === 'Medium' ? '#d97706' : '#e11d48';
        const chanceBg = chance === 'High' ? '#f0fdf4' : chance === 'Medium' ? '#fffbeb' : '#fff1f2';

        const events = c.counsellingDetail?.events || c.events || [];
        const eventsList = (events || []).map((ev: any) => {
          const startDate = ev.startDate || ev.date || 'TBA';
          const endDate = ev.endDate ? ` to ${ev.endDate}` : '';
          const status = ev.status || 'Active';
          const statusColor = status.toLowerCase().includes('active') ? '#4f46e5' : '#64748b';

          return `<tr style="border-bottom:1px solid #e2e8f0;">
            <td style="padding:8px 10px;font-weight:700;color:#0f172a;">${ev.event || ev.stage || 'Phase'}</td>
            <td style="padding:8px 10px;color:#4f46e5;font-weight:700;white-space:nowrap;">${startDate}${endDate}</td>
            <td style="padding:8px 10px;color:${statusColor};font-weight:700;text-transform:uppercase;font-size:10px;">${status}</td>
            <td style="padding:8px 10px;color:#475569;font-size:11px;line-height:1.4;">${ev.additionalDetails || ev.description || 'Follow portal instructions for choice entry'}</td>
          </tr>`;
        }).join('');

        return `
          <div style="margin-bottom:20px;padding:16px;border:1px solid #cbd5e1;border-radius:12px;background:#ffffff;page-break-inside:avoid;">
            <table style="width:100%;margin-bottom:10px;border-bottom:1px solid #f1f5f9;padding-bottom:10px;">
              <tr>
                <td style="vertical-align:top;">
                  <span style="display:inline-block;width:22px;height:22px;border-radius:6px;background:#4f46e5;color:#ffffff;text-align:center;line-height:22px;font-weight:800;font-size:11px;margin-right:6px;">${i + 1}</span>
                  <strong style="font-size:14px;color:#0f172a;">${cName}</strong>
                  <div style="font-size:11px;color:#64748b;margin-top:4px;font-weight:600;">
                    ${cCity ? `${cCity}, ` : ''}${cState} &bull; <span style="text-transform:uppercase;">${cType}</span>
                  </div>
                </td>
                <td style="text-align:right;vertical-align:top;width:140px;">
                  <span style="display:inline-block;padding:3px 8px;border-radius:12px;background:${chanceBg};color:${chanceColor};font-size:11px;font-weight:800;border:1px solid ${chanceColor}40;">
                    ${chance} Chance
                  </span>
                  <div style="font-size:11px;font-weight:800;color:#1e293b;margin-top:4px;">Cutoff: ${cutoff}</div>
                </td>
              </tr>
            </table>

            <div style="font-size:11px;font-weight:800;color:#4f46e5;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:6px;">
              Official Counselling Stage &amp; Timeline Schedule:
            </div>

            ${eventsList ? `
              <table style="width:100%;border-collapse:collapse;font-size:11px;">
                <thead>
                  <tr style="background:#f1f5f9;text-align:left;color:#475569;font-size:10px;text-transform:uppercase;">
                    <th style="padding:6px 10px;">Event / Stage</th>
                    <th style="padding:6px 10px;">Dates</th>
                    <th style="padding:6px 10px;">Status</th>
                    <th style="padding:6px 10px;">Instructions &amp; Details</th>
                  </tr>
                </thead>
                <tbody>${eventsList}</tbody>
              </table>
            ` : '<div style="font-size:11px;color:#64748b;font-style:italic;">Counselling Schedule: KEA/MCC Round 1 Choice Filling and Option Entry active on state portal.</div>'}
          </div>
        `;
      }).join('');

  return `<div style="margin:0;padding:20px;font-family:Arial,sans-serif;background:#ffffff;color:#0f172a;width:680px;box-sizing:border-box;">
  
  <!-- Header Banner -->
  <div style="background:#0f172a;border-radius:12px;padding:20px;margin-bottom:20px;color:#ffffff;">
    <div style="font-size:10px;font-weight:800;letter-spacing:0.08em;text-transform:uppercase;color:#818cf8;margin-bottom:6px;">
      Karnataka AI NEET Predictor &bull; Official Report
    </div>
    <h1 style="margin:0;font-size:20px;font-weight:800;">NEET Counselling Strategy &amp; Timeline Report</h1>
    <p style="margin:6px 0 0;font-size:12px;color:#cbd5e1;">
      Prepared for <strong style="color:#ffffff;">${name || 'Medical Student'}</strong> &bull; Rank: <strong style="color:#818cf8;">${studentProfile?.rank || 'AIR 106'}</strong> &bull; Generated ${generatedAt}
    </p>
  </div>

  <!-- Student Admission Profile Card -->
  <div style="border:1px solid #e2e8f0;border-radius:12px;padding:16px;margin-bottom:20px;background:#ffffff;">
    <div style="margin:0 0 12px;font-size:13px;font-weight:800;color:#0f172a;text-transform:uppercase;letter-spacing:0.05em;">
      Student Admission Profile
    </div>
    <table style="width:100%;border-collapse:collapse;font-size:12px;">
      <tr>
        <td style="width:33%;padding:6px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;">
          <div style="font-size:9px;font-weight:800;color:#64748b;text-transform:uppercase;">NEET AIR Rank</div>
          <div style="font-size:12px;font-weight:800;color:#4f46e5;margin-top:2px;">${studentProfile?.rank || 'AIR 106'}</div>
        </td>
        <td style="width:33%;padding:6px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;">
          <div style="font-size:9px;font-weight:800;color:#64748b;text-transform:uppercase;">Target Course</div>
          <div style="font-size:12px;font-weight:800;color:#0f172a;margin-top:2px;">${studentProfile?.course || 'MBBS'}</div>
        </td>
        <td style="width:33%;padding:6px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;">
          <div style="font-size:9px;font-weight:800;color:#64748b;text-transform:uppercase;">NEET Exam</div>
          <div style="font-size:12px;font-weight:800;color:#0f172a;margin-top:2px;">${studentProfile?.exam || 'NEET UG'}</div>
        </td>
      </tr>
      <tr>
        <td style="width:33%;padding:6px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;">
          <div style="font-size:9px;font-weight:800;color:#64748b;text-transform:uppercase;">Category</div>
          <div style="font-size:12px;font-weight:800;color:#0f172a;margin-top:2px;">${studentProfile?.category || 'General / All Categories'}</div>
        </td>
        <td style="width:33%;padding:6px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;">
          <div style="font-size:9px;font-weight:800;color:#64748b;text-transform:uppercase;">Quota</div>
          <div style="font-size:12px;font-weight:800;color:#0f172a;margin-top:2px;">${studentProfile?.quota || 'State / AIQ Quota'}</div>
        </td>
        <td style="width:33%;padding:6px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;">
          <div style="font-size:9px;font-weight:800;color:#64748b;text-transform:uppercase;">Target State</div>
          <div style="font-size:12px;font-weight:800;color:#16a34a;margin-top:2px;">${statesDisplay}</div>
        </td>
      </tr>
    </table>
  </div>

  <!-- Selected Colleges & Counselling Timelines Section -->
  <div style="border:1px solid #e2e8f0;border-radius:12px;padding:16px;margin-bottom:20px;background:#ffffff;">
    <table style="width:100%;margin-bottom:14px;border-bottom:1px solid #f1f5f9;padding-bottom:10px;">
      <tr>
        <td>
          <strong style="font-size:14px;color:#0f172a;">
            Selected Colleges &amp; Counselling Timelines (${(selectedColleges || []).length})
          </strong>
        </td>
        <td style="text-align:right;">
          <span style="font-size:10px;font-weight:700;color:#4f46e5;background:#eep2ff;padding:3px 8px;border-radius:10px;">
            Karnataka KEA &amp; MCC Quota
          </span>
        </td>
      </tr>
    </table>
    ${collegesHTML}
  </div>

  <!-- Footer -->
  <div style="text-align:center;padding:12px;color:#94a3b8;font-size:10px;border-top:1px solid #e2e8f0;">
    <p style="margin:0;font-weight:700;color:#64748b;">Karnataka AI NEET Predictor &bull; Official Medical Admissions Portal</p>
    <p style="margin:2px 0 0;">Report based on official KEA/MCC closing ranks and AI admission timelines.</p>
  </div>
</div>`;
}

export async function generatePDF(req: NextRequest | any): Promise<Buffer | null> {
  return null;
}
