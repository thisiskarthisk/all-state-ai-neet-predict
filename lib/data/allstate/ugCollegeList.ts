import { KARNATAKA_UG_COLLEGES, KarnatakaUGCollegeCutoff } from '../KarnatakaState/ugCollegeList';

export const ALL_STATE_EXTRA_UG_COLLEGES: any[] = [
  {
    id: 'aiq-ug-001',
    collegeName: 'All India Institute of Medical Sciences (AIIMS), New Delhi',
    city: 'New Delhi',
    state: 'Delhi',
    collegeType: 'Government',
    course: 'MBBS',
    openingRank: 1,
    closingRank: 55,
    category: 'General (UR)',
  },
  {
    id: 'aiq-ug-002',
    collegeName: 'Maulana Azad Medical College (MAMC), New Delhi',
    city: 'New Delhi',
    state: 'Delhi',
    collegeType: 'Government',
    course: 'MBBS',
    openingRank: 10,
    closingRank: 85,
    category: 'General (UR)',
  },
  {
    id: 'aiq-ug-003',
    collegeName: 'Vardhman Mahavir Medical College (VMMC & Safdarjung Hospital), New Delhi',
    city: 'New Delhi',
    state: 'Delhi',
    collegeType: 'Government',
    course: 'MBBS',
    openingRank: 15,
    closingRank: 110,
    category: 'General (UR)',
  },
  {
    id: 'aiq-ug-004',
    collegeName: 'Jawaharlal Institute of Postgraduate Medical Education and Research (JIPMER), Puducherry',
    city: 'Puducherry',
    state: 'Puducherry',
    collegeType: 'Government',
    course: 'MBBS',
    openingRank: 20,
    closingRank: 280,
    category: 'General (UR)',
  },
  {
    id: 'aiq-ug-005',
    collegeName: 'All India Institute of Medical Sciences (AIIMS), Rishikesh',
    city: 'Rishikesh',
    state: 'Uttarakhand',
    collegeType: 'Government',
    course: 'MBBS',
    openingRank: 100,
    closingRank: 750,
    category: 'General (UR)',
  },
  {
    id: 'aiq-ug-006',
    collegeName: 'All India Institute of Medical Sciences (AIIMS), Bhopal',
    city: 'Bhopal',
    state: 'Madhya Pradesh',
    collegeType: 'Government',
    course: 'MBBS',
    openingRank: 80,
    closingRank: 620,
    category: 'General (UR)',
  },
  {
    id: 'aiq-ug-007',
    collegeName: 'King George’s Medical University (KGMU), Lucknow',
    city: 'Lucknow',
    state: 'Uttar Pradesh',
    collegeType: 'Government',
    course: 'MBBS',
    openingRank: 200,
    closingRank: 1250,
    category: 'General (UR)',
  },
  {
    id: 'aiq-ug-008',
    collegeName: 'Madras Medical College (MMC), Chennai',
    city: 'Chennai',
    state: 'Tamil Nadu',
    collegeType: 'Government',
    course: 'MBBS',
    openingRank: 150,
    closingRank: 980,
    category: 'General (UR)',
  },
  {
    id: 'aiq-ug-009',
    collegeName: 'Seth GS Medical College and KEM Hospital, Mumbai',
    city: 'Mumbai',
    state: 'Maharashtra',
    collegeType: 'Government',
    course: 'MBBS',
    openingRank: 90,
    closingRank: 680,
    category: 'General (UR)',
  },
  {
    id: 'aiq-ug-010',
    collegeName: 'SMS Medical College, Jaipur',
    city: 'Jaipur',
    state: 'Rajasthan',
    collegeType: 'Government',
    course: 'MBBS',
    openingRank: 250,
    closingRank: 1400,
    category: 'General (UR)',
  },
];

export const ALLSTATE_UG_COLLEGES: any[] = [
  ...ALL_STATE_EXTRA_UG_COLLEGES,
  ...KARNATAKA_UG_COLLEGES,
];

export function getMatchingAllStateUGColleges(
  studentRank: number,
  category: string = 'UR',
  course: string = 'MBBS'
) {
  return ALLSTATE_UG_COLLEGES.filter((col: any) => {
    return studentRank <= (col.closingRank || 150000) + 15000;
  });
}
