const API_END_POINT = (process.env.WATI_API_ENDPOINT || 'https://live-mt-server.wati.io/10208179').replace(/\/$/, '');
const rawToken = process.env.WATI_ACCESS_TOKEN || process.env.WATI_BEARER_TOKEN || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6ImNhbXB1c2NvbnRpbmVudHNAZ21haWwuY29tIiwibmFtZWlkIjoiY2FtcHVzY29udGluZW50c0BnbWFpbC5jb20iLCJlbWFpbCI6ImNhbXB1c2NvbnRpbmVudHNAZ21haWwuY29tIiwiYXV0aF90aW1lIjoiMDcvMjcvMjAyNiAxNjoyNzowNSIsInRlbmFudF9pZCI6IjEwMjA4MTc5IiwiZGJfbmFtZSI6Im10LXByb2QtVGVuYW50cyIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IkFETUlOSVNUUkFUT1IiLCJleHAiOjI1MzQwMjMwMDgwMCwiaXNzIjoiQ2xhcmVfQUkiLCJhdWQiOiJDbGFyZV9BSSJ9.8UCa9Jpmy1r3J6TK7aZNfW2YUJYzOHfk8okwpzyRpbU';
const ACCESS_TOKEN = rawToken.startsWith('Bearer ') ? rawToken : `Bearer ${rawToken}`;
const TEMPLATE_NAME = process.env.WATI_TEMPLATE_NAME || 'counselling_kit_to_student';

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
