export const duplicateCustomerEmailSchedule = {
  pages: [
    {
      name: "duplicate-customer-schedule-details",
      title: "Duplicate Schedule",
      elements: [
        {
          type: "text",
          name: "scheduleId",
          readOnly: true,
          isRequired: true,
          title: "Schedule ID",
        },
        {
          type: "dropdown",
          name: "customerId",
          isRequired: true,
          title: "Customer",
          choicesByUrl: {
            url: `/api/customer/allBy?parentId=null&isActive=true`,
            path: "resource",
            valueName: "id",
            titleName: "name",
          },
        },
      ],
    },
  ],
};
