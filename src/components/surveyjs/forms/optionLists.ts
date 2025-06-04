export const optionListJson = {
  pages: [
    {
      name: "optionList",
      title: "List Descriptions",
      elements: [
        {
          type: "boolean",
          name: "isActive",
          minWidth: "256px",
          title: "Active?",
          titleLocation: "top",
          description: "Is this List active?",
          descriptionLocation: "underInput",
          defaultValue: true,
          isRequired: true,
          labelTrue: "Yes",
          labelFalse: "No",
          swapOrder: true,
        },
        {
          type: "boolean",
          name: "isEditableByCustomer",
          minWidth: "256px",
          title: "Customer Editable?",
          titleLocation: "top",
          description: "Is this Editable by Customer?",
          descriptionLocation: "underInput",
          defaultValue: false,
          isRequired: true,
          startWithNewLine: false,
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
          type: "comment",
          name: "description",
          title: "Description",
          isRequired: true,
        },
        {
          type: "dropdown",
          name: "optionListGroupId",
          title: "Option List Group",
          choicesByUrl: {
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/optionListGroup/allBy`,
            path: "resource",
            valueName: "id",
            titleName: "name",
          },
        },
      ],
    },
    {
      name: "optionList-items-matrix",
      title: "List Items",
      elements: [
        {
          type: "matrixdynamic",
          name: "optionListItems",
          title: "Option List Items",
          rowCount: 0,
          allowRowsDragAndDrop: true,
          detailPanelShowOnAdding: true,
          detailPanelMode: "underRowSingle",
          allowRemoveRows: false,
          addRowText: "Add another list item",
          columns: [
            {
              cellType: "text",
              name: "id",
              title: "ID",
              readOnly: true,
              width: "50px",
            },
            {
              cellType: "text",
              name: "value1",
              title: "value1",
              isRequired: true,
            },
            {
              cellType: "text",
              name: "value2",
              title: "value2",
              isRequired: true,
            },
            {
              cellType: "text",
              inputType: "number",
              min: 0,
              name: "orderNumber",
              title: "Order",
              validators: [
                {
                  type: "numeric",
                  text: "Order number must be a valid number",
                },
              ],
            },
          ],
          detailElements: [
            {
              type: "text",
              name: "value3",
              title: "Value 3",
            },
            {
              type: "text",
              name: "value4",
              title: "Value 4",
              startWithNewLine: false,
            },
            {
              type: "text",
              name: "value5",
              title: "Value 5",
            },
            {
              type: "text",
              name: "imageURL",
              title: "Image URL",
              startWithNewLine: false,
            },
            {
              type: "comment",
              name: "valueJson",
              title: "Value Json",
              validators: [
                {
                  type: "expression",
                  text: "Must be valid JSON",
                  expression: "validateJson({row.valueJson})",
                },
              ],
            },
            {
              type: "text",
              name: "listId",
              visible: false,
            },
          ],
        },
      ],
    },
  ],
};
