export const happinessJson = {
  completedHtmlOnCondition: [
    {
      expression: "{happinessScore} < 4",
      html: {
        default: `
<table width=100%>
    <tr>
        <td>
            <center><img src='images/Happiness_Score__Icon_10_100px.png' width='120px'/></center>
        </td>
    <tr>
    <tr>
        <td>
            <center>
                <center><span
                        style='font-size:20.0pt;color:white;line-height:107%;font-family:Metropolis'>Oh really </span>
                    <b><i><span
                            style='font-size:30.0pt;color:white;line-height:107%;font-family:Bonfire'>UNHAPPY!</span></i></b><span> </span><span
                            style='font-size:20.0pt;color:white;line-height:107%;font-family:Metropolis'>What makes you feel like that this week?</span>
                </center>
            </center>
        </td>
    </tr>
</table>
`,
      },
    },
    {
      expression:
        "{happinessScore} = 4 or {happinessScore} = 5 or {happinessScore} = 6",
      html: {
        default: `
<table width=100%><tr><td><center><img src='images/Happiness_Score__Icon_6_100px.png' width='120px' /></center></td><tr><tr><td><center><center><span style='font-size:20.0pt;color:white;line-height:107%;font-family:Metropolis'>So you seem </span> <b><i><span style='font-size:30.0pt;color:white;line-height:107%;font-family:Bonfire'>OK!</span></i></b><span> </span><span style='font-size:20.0pt;color:white;line-height:107%;font-family:Metropolis'> What can we do to up your rating?</span></center></center></td></tr></table>
`,
      },
    },
    {
      expression: "{happinessScore} >= 7",
      html: {
        default: `
<table width=100%><tr><td><center><img src='images/Happiness_Score__Icon_1_100px.png' width='120px' /></center></td><tr><tr><td><center><center><span style='font-size:20.0pt;color:white;line-height:107%;font-family:Metropolis'>Oh really </span> <b><i><span style='font-size:30.0pt;color:white;line-height:107%;font-family:Bonfire'>HAPPY!</span></i></b><span> </span><span style='font-size:20.0pt;color:white;line-height:107%;font-family:Metropolis'>I am so thrilled for you.. What is so good this week?</span></center></center></td></tr></table>
`,
      },
    },
  ],
  pages: [
    {
      name: "page1",
      elements: [
        {
          type: "html",
          name: "happinessTitle",
          startWithNewLine: false,
          html: "<table width = '100%'><tr><td><center><img src='images/Perygon_Happiness_score_icon_festive.png' width='100px' /></center></td></tr><tr><td><center><span style='font-size:20.0pt;color:white;line-height:107%;font-family:Metropolis'>How happy are</span> <b><i><span style='font-size:30.0pt;color:white;line-height:107%;font-family:Bonfire'>YOU</span></i></b><span> </span><span style='font-size:20.0pt;color:white;line-height:107%;font-family:Metropolis'>this week?</span></center></td></tr></table>",
          visibleIf: "1 = 1",
        },
        {
          type: "rating",
          name: "happinessScore",
          title: "",
          maxWidth: "100%",
          description: "1 - Unhappy; 5 - Neutral; 10 - Really Happy!",
          titleLocation: "hidden",
          isRequired: true,
          rateType: "smileys",
          //scaleColorMode: 'colored',
          rateCount: 10,
          rateMax: 10,
          displayMode: "buttons",
          requiredErrorText: "Please select a happiness rating :)",
          minRateDescription: "1 - Unhappy",
          maxRateDescription: "10 - Really Happy!",
          rateDescriptionLocation: "bottom",
        },
        {
          type: "comment",
          name: "comments",
          rows: 2,
          autoGrow: true,
          maxLength: 500,
          minWidth: "256px",
          title: "",
          maxWidth: "100%",
          titleLocation: "hidden",
          isRequired: false,
          placeholder: "Enter comments here to explain your score this week",
        },
        {
          type: "html",
          name: "reallyHappy",
          startWithNewLine: true,
          html: "<table width=100%><tr><td><center><img src='images/really-happy-face.gif' width='120px' /></center></td><tr><tr><td><center><center><span style='font-size:20.0pt;line-height:107%;font-family:Metropolis'>Oh really </span> <b><i><span style='font-size:30.0pt;line-height:107%;font-family:Bonfire'>HAPPY!</span></i></b><span> </span><span style='font-size:20.0pt;line-height:107%;font-family:Metropolis'>I am so thrilled for you.. What is so good this week?</span></center></center></td></tr></table>",
          visibleIf: "{happinessScore} = 0",
        },
        {
          type: "html",
          name: "reallyUnhappy",
          startWithNewLine: true,
          html: "<table width=100%><tr><td><center><img src='images/really-unhappy-face.gif' width='120px' /></center></td><tr><tr><td><center><center><span style='font-size:20.0pt;line-height:107%;font-family:Metropolis'>Oh really </span> <b><i><span style='font-size:30.0pt;line-height:107%;font-family:Bonfire'>UNHAPPY!</span></i></b><span> </span><span style='font-size:20.0pt;line-height:107%;font-family:Metropolis'>What makes you feel like that this week?</span></center></center></td></tr></table>",
          visibleIf: "{happinessScore} = 0",
        },
      ],
    },
  ],
  showPrevButton: false,
  showTOC: false,
  showTitle: false,
  showCompletedPage: true,
  checkErrorsMode: "onValueChanged",
  showQuestionNumbers: "off",
  questionErrorLocation: "bottom",
  completeText: "GO!",
  widthMode: "static",
  width: "800",
};
