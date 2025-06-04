export interface ServiceDashboardProps {
    resource: {
      services: Service[];
      highestRatedServices: number[];
      lowestRatedServices: number[];
      histogramDataSet: HistogramDataPoint[];
    };
  }
  
  export interface Service {
    serviceId: number | null;
    serviceName: string | null;
    avgServiceRating: string | null; // API provides this as a string
    total: number;
    serviceResponse: ServiceResponse[] | null;
    serviceNPS: ServiceNps[];
  }
  
  export interface ServiceResponse {
    comment: string;
    date: string;        // e.g. "2023-07-13 00:00:00"
    rating: number;      // numeric rating
    clientName: string;
    clientId: string;
  }
  
  export interface ServiceNps {
    monthYear: string;   // e.g. "2023-07"
    score: number;
    promoters: number;
    passives: number;
    detractors: number;
    totalResponses: number;
  }
  
  export interface HistogramDataPoint {
    value: number;       // rating value (0, 1, 2, etc.)
    count: number;       // how many times this rating occurs
  }
  