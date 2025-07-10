export const recognitionCategoryJson = {
  pages: [
    {
      name: "categoryDetails",
      title: "Catergory Details",
      elements: [
        {
          type: "text",
          name: "name",
          title: "Category Name",
          isRequired: true,
          maxLength: 100,
        },
        {
          type: "comment",
          name: "description",
          title: "Description",
          isRequired: true,
          maxLength: 500,
        },
        {
          type: "text",
          name: "points",
          title: "Receiver Points",
          isRequired: true,
          inputType: "number",
          defaultValue: 0,
          width: "50%"
        },
        {
          type: "text",
          name: "giverPoints",
          title: "Giver Points",
          isRequired: true,
          inputType: "number",
          defaultValue: 0,
          width: "50%",
          startWithNewLine: false,
        },
        {
          type: "boolean",
          name: "isActive",
          title: "Active",
          defaultValue: true,
          labelTrue: "Yes",
          labelFalse: "No",
          swapOrder: true,
          hidden: true,
        },
      ],
    }]
}; 