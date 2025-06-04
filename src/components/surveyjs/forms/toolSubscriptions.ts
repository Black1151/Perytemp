export const toolSubscriptionsJson = {
  pages: [
    {
      name: "Tool Customer Form",
      title: "Tool Customer Form",
      elements: [
        {
          type: "boolean",
          name: "isActive",
          minWidth: "256px",
          title: "Is this subscription active?",
          titleLocation: "top",
          defaultValue: true,
          isRequired: true,
          labelTrue: "Yes",
          labelFalse: "No",
          swapOrder: true,
        },
        {
          type: "dropdown",
          name: "toolConfigId",
          title: "Tool Config",
          isRequired: true,
          choicesByUrl: {
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/surveyjs/view?view=vwToolsConfigList`,
            valueName: "id",
            titleName: "name",
          },
        },
        {
          type: "dropdown",
          name: "customerId",
          title: "Customer",
          isRequired: true,
          choicesByUrl: {
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/customer/allBy?parentId=null`,
            path: "resource",
            valueName: "id",
            titleName: "name",
          },
        },
        {
          type: "dropdown",
          name: "subscriptionTypeId",
          title: "Subscription Type",
          isRequired: true,
          choicesByUrl: {
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/subscriptionType/allBy`,
            path: "resource",
            valueName: "id",
            titleName: "name",
          },
        },
        {
          type: "text",
          name: "subStartDate",
          title: "Subscription Start Date",
          isRequired: true,
          inputType: "date",
        },
        {
          type: "text",
          name: "price",
          title: "Price",
          isRequired: true,
          inputType: "number",
        },
      ],
    },
  ],
};
