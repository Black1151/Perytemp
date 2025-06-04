export const inviteUserJson = {
  pages: [
    {
      name: "invite-user-details",
      title: "Invite User",
      elements: [
        {
          type: "text",
          name: "customerId",
          visible: false,
          defaultValueExpression: "{pgv_currentUser.customerId}",
          readOnly: true,
        },
        {
          type: "dropdown",
          name: "customerId",
          visibleIf: "{pgv_currentUser.role} = 'PA'",
          isRequired: true,
          title: "Customer",
          choicesByUrl: {
            url: `/api/surveyjs/view?view=vwInviteUserCustomersList`,
            valueName: "custId",
            titleName: "custName",
          },
        },
        {
          type: "text",
          name: "email",
          inputType: "email",
          title: "Email",
          titleLocation: "top",
          isRequired: true,
          placeholder: "Enter the email of the user",
        },
      ],
    },
  ],
};
