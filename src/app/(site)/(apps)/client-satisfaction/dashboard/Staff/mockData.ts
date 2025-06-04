import { StaffDashboardProps } from "./types"; 

const mockStaffDashboardData: StaffDashboardProps = {
  resource: {
    staffComments: [
      {
        staffId: "staff-001",
        staffName: "John Doe",
        profileImgUrl:
          "https://example.com/profiles/john-doe.jpg",
        date: "2025-04-10",
        service: "Hair Styling",
        site: "Downtown Salon",
        rating: 9,
        comment: "Great experience, very professional!",
        clientName: "Alice Gray",
      },
      {
        staffId: "staff-002",
        staffName: "Jane Smith",
        profileImgUrl:
          "https://example.com/profiles/jane-smith.jpg",
        date: "2025-04-11",
        service: "Massage",
        site: "Spa & Wellness Center",
        rating: 8,
        comment: "Loved it, but the wait time was a bit long.",
        clientName: "Bob Jenkins",
      },
    ],

    staffStats: [
      {
        staffId: "staff-001",
        staffName: "John Doe",
        profileImgUrl:
          "https://example.com/profiles/john-doe.jpg",
        avgRating: 8.7,
        totalResponses: 24,
      },
      {
        staffId: "staff-002",
        staffName: "Jane Smith",
        profileImgUrl:
          "https://example.com/profiles/jane-smith.jpg",
        avgRating: 8.9,
        totalResponses: 18,
      },
      {
        staffId: "staff-003",
        staffName: "Samuel Lee",
        profileImgUrl:
          "https://example.com/profiles/samuel-lee.jpg",
        avgRating: 9.2,
        totalResponses: 15,
      },
    ],

    highestRatedStaff: [
      {
        staffId: "staff-003",
        staffName: "Samuel Lee",
        profileImgUrl:
          "https://example.com/profiles/samuel-lee.jpg",
        avgRating: 9.2,
        totalResponses: 15,
      },
      {
        staffId: "staff-002",
        staffName: "Jane Smith",
        profileImgUrl:
          "https://example.com/profiles/jane-smith.jpg",
        avgRating: 8.9,
        totalResponses: 18,
      },
    ],

    highestResponseStaff: [
      {
        staffId: "staff-001",
        staffName: "John Doe",
        profileImgUrl:
          "https://example.com/profiles/john-doe.jpg",
        avgRating: 8.7,
        totalResponses: 24,
      },
      {
        staffId: "staff-002",
        staffName: "Jane Smith",
        profileImgUrl:
          "https://example.com/profiles/jane-smith.jpg",
        avgRating: 8.9,
        totalResponses: 18,
      },
    ],

    histogramDataSet: [
      { value: 0, count: 1 },
      { value: 1, count: 0 },
      { value: 2, count: 2 },
      { value: 3, count: 1 },
      { value: 4, count: 3 },
      { value: 5, count: 2 },
      { value: 6, count: 4 },
      { value: 7, count: 5 },
      { value: 8, count: 3 },
      { value: 9, count: 2 },
      { value: 10, count: 1 },
    ],
  },
};

export default mockStaffDashboardData;
