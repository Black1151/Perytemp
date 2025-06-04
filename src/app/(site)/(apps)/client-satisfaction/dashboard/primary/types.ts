import { Histogram } from "perf_hooks";

export interface clientSatisfactionDashboardResponse {
  resource: {
    kpi: kpiData;
    nps: npsScore[];
    topStaffByRating: staffRating[];
    topStaffByCount: staffRating[];
    staffComments: staffComment[];
    serviceComments: serviceComment[];
    companyComments: companyComment[];
    histogramDataSet: histogramData[];
  };
}

export interface kpiData {
  avgStaffRating: number;
  avgServiceRating: number;
  avgOverallRating: number;
  nps: number;
  feedbackCount: number;
}

export interface npsScore {
  score: number;
  detractors: number;
  passives: number;
  promoters: number;
  totalResponses: number;
  monthYear: string;
}

export interface staffRating {
  staffId: string;
  staffName: string;
  profileImgUrl: string;
  positiveCount: number;
  neutralCount: number;
  negativeCount: number;
  totalResponses: number;
  avgRating: number;
}

export interface staffComment {
  staffId: string;
  staffName: string;
  staffImgUrl: string;
  comment: string;
  site: string;
  date: string;
  clientId: string;
  clientName: string;
  rating: number;
}

export interface serviceRating {
  serviceId: string;
  serviceName: string;
  positiveCount: number;
  neutralCount: number;
  negativeCount: number;
  avgRating: number;
  monthYear: string;
}

export interface serviceComment {
  serviceId: string;
  serviceName: string;
  comment: string;
  date: string;
  clientId: string;
  clientName: string;
  rating: number;
}

export interface npsData {
  scores: npsScore[];
}

export interface companyComment {
  comment: string;
  date: string;
  clientId: string;
  clientName: string;
  rating: number;
}

interface histogramData {
  value: number; // 0-10 x axis
  count: number; // y axis
}
