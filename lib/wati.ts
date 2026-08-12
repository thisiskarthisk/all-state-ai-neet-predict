const API_END_POINT = (process.env.WATI_API_ENDPOINT || 'https://live-mt-server.wati.io/10208179').replace(/\/$/, '');
const rawToken = process.env.WATI_ACCESS_TOKEN || process.env.WATI_BEARER_TOKEN || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6ImNhbXB1c2NvbnRpbmVudHNAZ21haWwuY29tIiwibmFtZWlkIjoiY2FtcHVzY29udGluZW50c0BnbWFpbC5jb20iLCJlbWFpbCI6ImNhbXB1c2NvbnRpbmVudHNAZ21haWwuY29tIiwiYXV0aF90aW1lIjoiMDcvMjcvMjAyNiAxNjoyNzowNSIsInRlbmFudF9pZCI6IjEwMjA4MTc5IiwiZGJfbmFtZSI6Im10LXByb2QtVGVuYW50cyIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IkFETUlOSVNUUkFUT1IiLCJleHAiOjI1MzQwMjMwMDgwMCwiaXNzIjoiQ2xhcmVfQUkiLCJhdWQiOiJDbGFyZV9BSSJ9.8UCa9Jpmy1r3J6TK7aZNfW2YUJYzOHfk8okwpzyRpbU';
const ACCESS_TOKEN = rawToken.startsWith('Bearer ') ? rawToken : `Bearer ${rawToken}`;
const TEMPLATE_NAME = process.env.WATI_TEMPLATE_NAME || 'counselling_kit_to_student';
const OTP_TEMPLATE_NAME = process.env.WATI_OTP_TEMPLATE_NAME || 'neet_predict_otp_verification';

/**
 * Sends a Counselling Kit PDF link to a student via Wati WhatsApp API
 */
export async function sendMessage(to: string, name: string, fileURL: string) {
  try {
    let cleanPhone = (to || '').replace(/\D/g, '');
    if (cleanPhone.length === 10) {
      cleanPhone = `91${cleanPhone}`;
    }

    // Opt-in contact on WATI to ensure Meta WhatsApp delivery
    try {
      await fetch(`${API_END_POINT}/api/v1/addContact/${cleanPhone}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: ACCESS_TOKEN,
        },
        body: JSON.stringify({
          customParams: [
            { name: 'name', value: name || 'Student' },
            { name: 'pdflink', value: fileURL },
          ],
        }),
      });
    } catch (optErr) {
      console.warn('[WATI Opt-in Warning]:', optErr);
    }

    const url = `${API_END_POINT}/api/v1/sendTemplateMessage?whatsappNumber=${cleanPhone}`;

    const payload = {
      template_name: TEMPLATE_NAME,
      broadcast_name: 'Counselling Kit',
      parameters: [
        {
          name: 'name',
          value: name || 'Student',
        },
        {
          name: 'pdfLink',
          value: fileURL,
        },
        {
          name: 'link',
          value: fileURL,
        },
      ],
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: ACCESS_TOKEN,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (response.ok) {
      console.log('[WATI Success]:', data);
      return { success: true, data };
    } else {
      console.error('[WATI Failed]:', data);
      return { success: false, data };
    }
  } catch (error) {
    console.error('[WATI Error]:', error);
    return { success: false, error: String(error) };
  }
}

export async function sendWhatsAppMsg(to: string, name: string, fileURL: string): Promise<boolean> {
  const result = await sendMessage(to, name, fileURL);
  return result.success;
}

/**
 * Sends a 4-Digit OTP Code via Wati WhatsApp API using template `neet_predict_otp_verification` with variable {{1}}
 */
export async function sendWatiOtp(
  to: string,
  otp: string,
  name: string = 'Student'
): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    let cleanPhone = (to || '').replace(/\D/g, '');
    if (cleanPhone.length === 10) {
      cleanPhone = `91${cleanPhone}`;
    }

    // 1. Opt-in / Add Contact on WATI with custom parameters
    try {
      await fetch(`${API_END_POINT}/api/v1/addContact/${cleanPhone}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: ACCESS_TOKEN,
        },
        body: JSON.stringify({
          customParams: [
            { name: 'name', value: name || 'Student' },
            { name: '1', value: String(otp) },
            { name: 'otp', value: String(otp) },
          ],
        }),
      });
    } catch (optErr) {
      console.warn('[WATI Contact Add Warning]:', optErr);
    }

    // 2. Send Template Message using `neet_predict_otp_verification` with variable {{1}}
    const url = `${API_END_POINT}/api/v1/sendTemplateMessage?whatsappNumber=${cleanPhone}`;

    const payload = {
      template_name: OTP_TEMPLATE_NAME,
      broadcast_name: 'NEET Predict OTP Verification',
      parameters: [
        {
          name: '1',
          value: String(otp),
        },
        {
          name: 'name',
          value: name || 'Student',
        },
      ],
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: ACCESS_TOKEN,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (response.ok && (data.result === true || data.result === 'success' || data.valid === true || response.status === 200)) {
      console.log('[WATI OTP Success]:', data);
      return { success: true, data };
    } else {
      console.error('[WATI OTP Failed]:', data);
      return {
        success: false,
        error: data.info || data.message || 'Failed to deliver WhatsApp message via Wati.',
        data,
      };
    }
  } catch (error: any) {
    console.error('[WATI OTP Error]:', error);
    return { success: false, error: error?.message || 'Server error while sending Wati OTP.' };
  }
}

/**
 * Sends a Template Message for NEET score/rank >= 500000 via Wati WhatsApp API using WATI_SCORE_TEMPLATE_NAME
 */
export async function sendWatiScoreTemplate(
  to: string,
  name: string = 'Student'
): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    let cleanPhone = (to || '').replace(/\D/g, '');
    if (cleanPhone.length === 10) {
      cleanPhone = `91${cleanPhone}`;
    }

    const scoreTemplateName = process.env.WATI_SCORE_TEMPLATE_NAME || 'neet_score_above_5lakh';

    // 1. Opt-in / Add Contact on WATI with ?optedIn=true query parameter & body
    try {
      await fetch(`${API_END_POINT}/api/v1/addContact/${cleanPhone}?optedIn=true`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: ACCESS_TOKEN,
        },
        body: JSON.stringify({
          name: name || 'Student',
          optedIn: true,
          customParams: [
            { name: 'name', value: name || 'Student' },
            { name: '1', value: name || 'Student' },
          ],
        }),
      });

      await fetch(`${API_END_POINT}/api/v1/updateContactAttribute/${cleanPhone}?optedIn=true`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: ACCESS_TOKEN,
        },
        body: JSON.stringify({
          name: name || 'Student',
          optedIn: true,
        }),
      }).catch(() => {});

      await fetch(`${API_END_POINT}/api/v1/updateContactCustomParams/${cleanPhone}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: ACCESS_TOKEN,
        },
        body: JSON.stringify([
          { name: 'name', value: name || 'Student' },
          { name: '1', value: name || 'Student' },
          { name: 'optedIn', value: 'true' },
        ]),
      }).catch(() => {});
    } catch (optErr) {
      console.warn('[WATI Score Contact Add Warning]:', optErr);
    }

    // 2. Send Template Message using WATI_SCORE_TEMPLATE_NAME with dynamic broadcast_name to prevent WATI deduplication on repeat sends
    const url = `${API_END_POINT}/api/v1/sendTemplateMessage?whatsappNumber=${cleanPhone}`;

    const payload = {
      template_name: scoreTemplateName,
      broadcast_name: `NEET Score Above 5 Lakh ${Date.now()}`,
      parameters: [
        {
          name: 'name',
          value: name || 'Student',
        },
        {
          name: '1',
          value: name || 'Student',
        },
      ],
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: ACCESS_TOKEN,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (response.ok && (data.result === true || data.result === 'success' || data.valid === true || response.status === 200)) {
      console.log('[WATI Score Template Success]:', data);
      return { success: true, data };
    } else {
      console.error('[WATI Score Template Failed]:', data);
      return {
        success: false,
        error: data.info || data.message || 'Failed to deliver WhatsApp score template message via Wati.',
        data,
      };
    }
  } catch (error: any) {
    console.error('[WATI Score Template Error]:', error);
    return { success: false, error: error?.message || 'Server error while sending Wati score template.' };
  }
}
