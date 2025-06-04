interface MyClientsDashboardProps {
    resource: {
        officeId: string;
        officeName: string;
        serviceId: string;
        serviceName: string;
        myRatings: staffRating[];
        myStats: myStats[];
        myOfficeStats: stats[];
        myServiceStats: stats[];
        myCompanyStats: stats[];
    }
}

interface staffRating {
    clientId: string;
    clientName: string;  
    clientImgUrl: string;
    // companyName: string;
    // companyId: string;
    // companyImgUrl: string;
    date: string;
    rating: number;
    comment: string;
}

interface stats {
    monthYear: string;
    avgRating: number;
    totalResponses: number;
}

interface myStats {
    monthYear: string;
    avgRating: number;
    nps: number;
    detractors: number;
    passives: number;
    promoters: number;
    totalResponses: number;
}

export type { MyClientsDashboardProps, staffRating }