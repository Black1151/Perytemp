export const selectItemsJson = {
  pages: [
    {
      name: "select-item-admin",
      title: "Select Item",
      elements: [
        {
          type: "text",
          name: "label",
          title: "Label",
          titleLocation: "top",
          isRequired: true,
          maxLength: 30,
          placeholder: "Enter form name",
        },
        {
          type: "text",
          name: "value",
          startWithNewLine: false,
          isRequired: true,
          title: "Value",
          placeholder: "Value of this selection",
        },
        {
          type: "text",
          name: "type",
          title: "Type",
          isRequired: true,
          placeholder: "Type of item",
        },
        {
          type: "text",
          name: "sortOrder",
          title: "Order",
          isRequired: true,
          placeholder: "Order number",
        },
      ],
    },
  ],
};
