interface StaffDashboardProps {
    resource: {
        staffComments: staffComment[];
        staffStats: staffStats[];
        highestRatedStaff: staffStats[];
        highestResponseStaff: staffStats[];
        histogramDataSet: histogramData[];
    }
}

interface staffComment {
    staffId: string;
    staffName: string;
    profileImgUrl: string;
    date: string;
    service: string;
    site: string;
    rating: number;
    comment: string;
    clientName: string;  
}

interface staffStats {
    staffId: string;
    staffName: string;
    profileImgUrl: string;
    avgRating: number;
    totalResponses: number;
}

interface histogramData {
    value: number; // 0-10 x axis
    count: number // y axis
}

export type { StaffDashboardProps, staffComment, staffStats, histogramData };
