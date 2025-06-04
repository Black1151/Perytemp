export const optionListGroupsJson = {
  elements: [
    {
      type: "boolean",
      name: "isActive",
      minWidth: "256px",
      title: "Active?",
      titleLocation: "top",
      description: "Is this Group active?",
      descriptionLocation: "underInput",
      defaultValue: true,
      isRequired: true,
      labelTrue: "Yes",
      labelFalse: "No",
      swapOrder: true,
    },
    {
      type: "text",
      name: "name",
      title: "Name",
      isRequired: true,
    },
    {
      type: "text",
      name: "description",
      title: "Description",
      isRequired: false,
    },
    {
      type: "dropdown",
      name: "customerId",
      isRequired: true,
      title: "Customer",
      choicesByUrl: {
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/customer/allBy?parentId=null`,
        path: "resource",
        valueName: "id",
        titleName: "name",
      },
    },
  ],
};
