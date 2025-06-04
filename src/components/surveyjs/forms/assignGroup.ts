export const assignGroupJson = {
  pages: [
    {
      name: "assign-group-details",
      title: "Assign Group",
      elements: [
        {
          type: "dropdown",
          name: "fromCustomerId",
          visibleIf: "{pgv_currentUser.role} = 'PA'",
          readOnly: true,
          placeholder: "Platform",
          title: "Customer",
          choicesByUrl: {
            url: `/api/customer/allBy?parentId=null`,
            path: "resource",
            valueName: "id",
            titleName: "name",
          },
        },
        {
          type: "dropdown",
          name: "toCustomerId",
          visibleIf: "{pgv_currentUser.role} = 'PA'",
          isRequired: true,
          title: "Customer",
          choicesByUrl: {
            url: `/api/customer/allBy?parentId=null`,
            path: "resource",
            valueName: "id",
            titleName: "name",
          },
        },
      ],
    },
  ],
};
