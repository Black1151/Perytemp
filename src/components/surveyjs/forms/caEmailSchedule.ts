export const caEmailScheduleJson = {
  pages: [
    {
      name: "email-schedule-customer-options",
      title: "Email Schedule Options",
      elements: [
        {
          type: "boolean",
          name: "isActive",
          minWidth: "256px",
          title: "Active?",
          titleLocation: "top",
          description: "Is this email schedule active?",
          descriptionLocation: "underInput",
          defaultValue: false,
          isRequired: true,
          labelTrue: "Yes",
          labelFalse: "No",
          swapOrder: true,
        },
        {
          type: "text",
          name: "name",
          title: "Schedule Name",
          titleLocation: "top",
          isRequired: true,
          readOnly: true,
          placeholder: "Enter schedule name",
        },
        {
          type: "text",
          name: "customerId",
          title: "Customer",
          titleLocation: "top",
          defaultValueExpression: "{pgv_currentUser.customerId}",
          isRequired: true,
          readOnly: true,
          visible: false,
        },
        {
          type: "dropdown",
          name: "emailTemplateId",
          title: "Email Template",
          titleLocation: "top",
          isRequired: true,
          readOnly: true,
          visible: false,
          placeholder: "Select email template",
          choicesByUrl: {
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/emailTemplate/allBy?selectColumns=id,name&isActive=true`,
            path: "resource",
            valueName: "id",
            titleName: "name",
          },
        },
        {
          type: "text",
          name: "sendTime",
          title: "Send Time between 09:00 and 18:00",
          inputType: "time",
          min: "09:00",
          max: "18:00",
        },
        {
          type: "dropdown",
          name: "frequency",
          title: "Frequency",
          titleLocation: "top",
          isRequired: true,
          placeholder: "Select frequency",
          readOnly: true,
          choices: [
            {
              value: "daily",
              text: "Daily",
            },
            {
              value: "weekly",
              text: "Weekly",
            },
            {
              value: "monthly",
              text: "Monthly",
            },
            {
              value: "one-time",
              text: "One-time",
            },
          ],
        },
        {
          type: "checkbox",
          name: "daysOfWeek",
          title: "Which days of week?",
          isRequired: true,
          visibleIf: "{frequency} = 'Weekly'",
          readOnly: true,
          choices: [
            {
              text: "Monday",
              value: 1,
            },
            {
              text: "Tuesday",
              value: 2,
            },
            {
              text: "Wednesday",
              value: 3,
            },
            {
              text: "Thursday",
              value: 4,
            },
            {
              text: "Friday",
              value: 5,
            },
            {
              text: "Saturday",
              value: 6,
            },
            {
              text: "Sunday",
              value: 7,
            },
          ],
        },
        {
          type: "checkbox",
          name: "daysOfMonth",
          title: "Which days of month?",
          requiredIf: "{lastDayOfMOnth} = false",
          visibleIf: "{frequency} = 'Monthly'",
          readOnly: true,
          colCount: 5,
          choices: [
            {
              text: "1",
              value: "1",
            },
            {
              text: "2",
              value: "2",
            },
            {
              text: "3",
              value: "3",
            },
            {
              text: "4",
              value: "4",
            },
            {
              text: "5",
              value: "5",
            },
            {
              text: "6",
              value: "6",
            },
            {
              text: "7",
              value: "7",
            },
            {
              text: "8",
              value: "8",
            },
            {
              text: "9",
              value: "9",
            },
            {
              text: "10",
              value: "10",
            },
            {
              text: "11",
              value: "11",
            },
            {
              text: "12",
              value: "12",
            },
            {
              text: "13",
              value: "13",
            },
            {
              text: "14",
              value: "14",
            },
            {
              text: "15",
              value: "15",
            },
            {
              text: "16",
              value: "16",
            },
            {
              text: "17",
              value: "17",
            },
            {
              text: "18",
              value: "18",
            },
            {
              text: "19",
              value: "19",
            },
            {
              text: "20",
              value: "20",
            },
            {
              text: "21",
              value: "21",
            },
            {
              text: "22",
              value: "22",
            },
            {
              text: "23",
              value: "23",
            },
            {
              text: "24",
              value: "24",
            },
            {
              text: "25",
              value: "25",
            },
            {
              text: "26",
              value: "26",
            },
            {
              text: "27",
              value: "27",
            },
            {
              text: "28",
              value: "28",
            },
          ],
        },
        {
          type: "boolean",
          name: "lastDayOfMonth",
          minWidth: "256px",
          title: "Last day of month",
          titleLocation: "top",
          defaultValue: false,
          isRequired: true,
          labelTrue: "Yes",
          labelFalse: "No",
          swapOrder: true,
          visibleIf: "{frequency} = 'Monthly'",
        },
        {
          type: "text",
          name: "interval",
          title: "Enter an Interval",
          defaultValue: 0,
          isRequired: true,
          inputType: "number",
          min: 1,
          max: 12,
          description:
            "An interval of 1 would be every week or month, 2 would be every 2 weeks or months etc.",
          descriptionLocation: "underInput",
        },
        {
          type: "text",
          name: "lastSentTime",
          title: "Date and time of the last run",
          defaultValue: 'N/A',
          isRequired: false,
          readOnly: true
        },
        {
          type: "text",
          name: "nextSendTime",
          title: "Date and time of the next run",
          defaultValue: 'N/A',
          isRequired: false,
          startWithNewLine: false,
          readOnly: true
        },
        {
          type: "text",
          name: "emailSendCount",
          title: "Amount of emails sent during the last run",
          isRequired: false,
          readOnly: true
        },
        {
          type: "tagbox",
          name: "userDistGroupNames",
          title: "User Distribution Group Names",
          titleLocation: "top",
          placeholder: "Enter user access group names",
          // isRequired: true,
          readOnly: false,
          choicesByUrl: {
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/userGroup/allBy?customerId={pgv_currentUser.customerId}&isActive=true`,
            path: "resource",
            valueName: "name",
            titleName: "name",
          },
        },
      ],
    },
    {
      name: "parent-email-schedule",
      title: "Parent Email Schedule",
      elements: [
        {
          type: "text",
          name: "parentName",
          title: "Parent Schedule Name",
          titleLocation: "top",
          isRequired: true,
          placeholder: "Enter schedule name",
          readOnly: true
        },
        {
          type: "dropdown",
          name: "parentEmailTemplateId",
          title: "Parent Email Template",
          titleLocation: "top",
          isRequired: true,
          placeholder: "Select Email Template",
          choicesByUrl: {
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/emailTemplate/allBy?selectColumns=id,name&isActive=true`,
            path: "resource",
            valueName: "id",
            titleName: "name",
          },
          readOnly: true
        },
        {
          type: "text",
          name: "parentStartDate",
          title: "Schedule Start Date",
          defaultValueExpression: "today()",
          isRequired: true,
          inputType: "date",
          readOnly: true
        },
        {
          type: "text",
          name: "parentEndDate",
          title: "Schedule End Date",
          defaultValueExpression: "today()",
          isRequired: true,
          inputType: "date",
          startWithNewLine: false,
          readOnly: true
        },
        {
          type: "comment",
          name: "parentTargetCondition",
          title: "Additional Condition that needs to be met",
          titleLocation: "top",
          visible: false,
          isRequired: false,
          placeholder: "Enter target condition",
          autoGrow: true,
          readOnly:true
        },
        {
          type: "dropdown",
          name: "parentDataSourceId",
          title: "Data Source",
          isRequired: false,
          choicesByUrl: {
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/datasource/allBy`,
            path: "resource",
            valueName: "id",
            titleName: "name",
          },
          readOnly: true
        },
        {
          type: "text",
          name: "parentDataSourceParams",
          title: "Data Source Params",
          visibleIf: "{dataSourceId} notempty",
          titleLocation: "top",
          isRequired: false,
          placeholder: "Enter name params needed for the datasource",
          readOnly: true
        },
        {
          type: "boolean",
          name: "parentDataSourceAttach",
          minWidth: "256px",
          title: "Attachment?",
          titleLocation: "top",
          description: "Does this have an attachment to it?",
          descriptionLocation: "underInput",
          defaultValue: false,
          isRequired: true,
          labelTrue: "Yes",
          labelFalse: "No",
          swapOrder: true,
          readOnly: true
        },
        {
          type: "text",
          name: "parentDataSourceFilename",
          title: "Data Source Name",
          titleLocation: "top",
          isRequired: true,
          visibleIf: "{dataSourceAttach}",
          placeholder: "Enter name of file name produced",
          startWithNewLine: false,
          readOnly: true
        },
        {
          type: "boolean",
          name: "parentDataSourceSave",
          minWidth: "256px",
          title: "Does this datasource get saved?",
          titleLocation: "top",
          description: "Does this have an attachment to it?",
          descriptionLocation: "underInput",
          defaultValue: false,
          isRequired: true,
          labelTrue: "Yes",
          labelFalse: "No",
          swapOrder: true,
          readOnly: true
        },
        {
          type: "boolean",
          name: "parentDataSourceXls",
          minWidth: "256px",
          title: "Is this a XLSX?",
          titleLocation: "top",
          defaultValue: false,
          isRequired: true,
          labelTrue: "Yes",
          labelFalse: "No",
          swapOrder: true,
          startWithNewLine: false,
          readOnly: true
        },
        {
          type: "radiogroup",
          name: "parentSecureLoginType",
          title: "Secure Login Type",
          isRequired: false,
          choices: [
            {
              text: "Standard User Login",
              value: 1,
            },
            {
              text: "Guest User",
              value: 2,
            },
            {
              text: "Anonymous",
              value: 3,
            },
          ],
        },
        {
          type: "boolean",
          name: "parentSecureOneTimeLink",
          minWidth: "256px",
          title: "One Time Link?",
          titleLocation: "top",
          defaultValue: false,
          isRequired: false,
          labelTrue: "Yes",
          labelFalse: "No",
          swapOrder: true,
          startWithNewLine: false,
          readOnly: true
        },
      ],
    },
  ],
};
