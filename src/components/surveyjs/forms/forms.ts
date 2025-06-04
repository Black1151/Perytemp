export const formsJson = {
  pages: [
    {
      name: "form-creator-admin",
      title: "Form Creator",
      elements: [
        {
          type: "boolean",
          name: "isActive",
          minWidth: "256px",
          title: "Active?",
          titleLocation: "top",
          description: "Is this Form active?",
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
          titleLocation: "top",
          isRequired: true,
          maxLength: 30,
          placeholder: "Enter form name",
        },
        {
          type: "comment",
          name: "description",
          autoGrow: true,
          title: "Description",
          placeholder: "Client description",
        },
        {
          type: "comment",
          name: "jsonFile",
          title: "Survey JSON",
          autoGrow: true,
          validators: [
            {
              type: "expression",
              text: "Must be valid JSON",
              expression: "validateJson({valueJson})",
            },
          ],
        },
      ],
    },
  ],
};
