interface ServiceDashboardProps {
    resource: {
        serviceComments: serviceComment[];
        serviceStats: serviceStat[];
        highestRatedService: serviceStat[];
        highestResponseService: serviceStat[];
        histogramDataSet: histogramData[];
    }
}

interface serviceComment {
    serviceName: string;
    date: string;
    site: string;
    rating: number;
    comment: string;
    clientName: string;  
}

interface serviceStat {
    monthYear: string;
    serviceName: string;
    avgRating: number;
    totalResponses: number;
    nps: number;
    detractors: number;
    passives: number;
    promoters: number;
}

interface histogramData {
    value: number; // 0-10 x axis
    count: number // y axis
}

export type { ServiceDashboardProps, serviceComment, serviceStat, histogramData };