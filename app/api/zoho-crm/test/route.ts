import { createLead } from '@/lib/zoho-crm';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const leadId = await createLead({
    name: 'Karthick',
    email: 'karthick@proflujo.com',
    mobile: '9876543210',
    homeState: 'Tamil Nadu',
    extraFields: {
      College_Name: 'AM Jain',
      Neet_Rank: 15000,
      Platform: 'Web',
      Form_Name: 'CRM Test Route',
    }
  });

  if (!leadId) {
    return NextResponse.json({
      success: false,
      message: 'Failed',
    }, {
      status: 500
    });
  }

  return NextResponse.json({
    success: true,
    message: 'Success',
    data: { leadId },
  });
}
