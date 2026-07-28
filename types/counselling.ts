export interface CollegeCutoff {
  course_name: string;
  category_name: string;
  closing_rank: number;
}

export interface StateAuthorityDetails {
  authority: string;
  organization: string;
  ugPortal: string;
  pgPortal: string;
  officialWebsite: string;
  registrationPortal?: string;
  counsellingPortal: string;
  notificationPage: string;
  quotaType: string;
  notes?: string;
}

export interface SelectedCollege {
  college_id: number | string;
  college_name: string;
  state_name: string;
  city_name?: string;
  college_type: string;
  best_chance?: string;
  closest_cutoff?: number;
  cutoffs?: CollegeCutoff[];
  officialWebsite?: string;
  authorityInfo?: StateAuthorityDetails | null;
  counsellingDetail?: {
    type?: string;
    events?: Array<{
      date?: string;
      startDate?: string;
      endDate?: string;
      event: string;
      status?: string;
      additionalDetails?: string;
    }>;
  };
}

export interface StudentProfile {
  course: string;
  exam: string;
  category: string;
  quota: string;
  states: string[] | string;
  rank: string;
}

export interface TimelineStep {
  title: string;
  date?: string;
  status: 'completed' | 'current' | 'upcoming' | 'to_be_announced';
  description?: string;
}
