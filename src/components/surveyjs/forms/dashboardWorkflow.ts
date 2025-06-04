export const dashboardWorkflowJson = {
  pages: [
    {
      name: "dashboard-workflow-info",
      title: "Dashboard Workflow",
      elements: [
        {
          type: "dropdown",
          name: "dashboardId",
          title: "Dashboard ID",
          isRequired: true,
          choicesByUrl: {
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/dashboard/allBy`,
            path: "resource",
            valueName: "id",
            titleName: "name",
          },
        },
        {
          type: "dropdown",
          name: "workflowId",
          title: "Workflow ID",
          isRequired: true,
          choicesByUrl: {
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/workflow/allBy`,
            path: "resource",
            valueName: "id",
            titleName: "name",
          },
        },
        {
          type: "text",
          name: "dashboardOrder",
          width: "50%",
          title: "Dashboard Order",
          titleLocation: "top",
          isRequired: true,
          inputType: "number",
          placeholder: "Enter the order of the dashboard",
        },
      ],
    },
  ],
};
