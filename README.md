This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
```
Perygon
├─ .eslintrc.json
├─ .prettierIgnore
├─ azure-pipelines-1.yml
├─ azure-pipelines.yml
├─ docker-compose.dev.yml
├─ docker-compose.yml
├─ Dockerfile
├─ Dockerfile.dev
├─ Dockerfile.local
├─ next.config.mjs
├─ package-lock.json
├─ package.json
├─ public
│  ├─ .well-known
│  │  ├─ apple-app-site-association
│  │  └─ assetlinks.json
│  ├─ app-logos
│  │  └─ recognition-hub-logo.png
│  ├─ assets
│  │  ├─ logo
│  │  │  └─ sedulo-main-logo.png
│  │  ├─ splash-screens
│  │  │  ├─ business-score
│  │  │  │  ├─ base.png
│  │  │  │  ├─ business-score-logo-text.png
│  │  │  │  ├─ centre.png
│  │  │  │  ├─ gauge.png
│  │  │  │  └─ needle.png
│  │  │  ├─ business-score-old
│  │  │  │  ├─ Dial.png
│  │  │  │  ├─ PBSlogo.png
│  │  │  │  └─ WorldClass.png
│  │  │  ├─ client-satisfaction
│  │  │  │  ├─ client-satisfaction-full.png
│  │  │  │  ├─ client-satisfaction-logo-bg.png
│  │  │  │  ├─ client-satisfaction-logo-complete.png
│  │  │  │  ├─ client-satisfaction-logo-text.png
│  │  │  │  └─ client-satisfaction-logo.png
│  │  │  ├─ enps-score
│  │  │  │  ├─ enps-logo-full.png
│  │  │  │  ├─ enps-logo-text.png
│  │  │  │  ├─ enps-logo.webp
│  │  │  │  ├─ enpsLogo.png
│  │  │  │  ├─ enpsLogoBG.png
│  │  │  │  └─ enpsLogoInner.png
│  │  │  ├─ happiness-score
│  │  │  │  ├─ happiness-score-logo-full.png
│  │  │  │  ├─ happiness-score-logo-text.png
│  │  │  │  ├─ logoBG.png
│  │  │  │  └─ logoFace.webp
│  │  │  └─ recognition-hub
│  │  │     ├─ recognition-hub-logo-text.png
│  │  │     ├─ recognition-icon-base.png
│  │  │     ├─ recognition-icon-confetti.png
│  │  │     └─ recognition-icon-recognised.png
│  │  └─ svgRaw
│  │     └─ Happiness Score_White.svg
│  ├─ big-up
│  │  └─ big-up-app-bg.webp
│  ├─ blank-profile-picture.webp
│  ├─ carousel
│  │  ├─ business-score-carousel-bg.webp
│  │  ├─ client-satisfaction-bg.webp
│  │  ├─ enps-carousel-bg.webp
│  │  ├─ happiness-score-carousel-bg.webp
│  │  └─ logos
│  │     ├─ business-score-logo-new.webp
│  │     ├─ client-satisfaction-logo-new.png
│  │     ├─ enps-logo-new.webp
│  │     └─ happiness-score-logo-new.webp
│  ├─ cssPath
│  │  ├─ admin.css
│  │  ├─ client-satisfaction.css
│  │  ├─ enps.css
│  │  └─ happiness.css
│  ├─ faces
│  │  ├─ happiness_score_1.png
│  │  ├─ happiness_score_10.png
│  │  ├─ happiness_score_2.png
│  │  ├─ happiness_score_3.png
│  │  ├─ happiness_score_4.png
│  │  ├─ happiness_score_5.png
│  │  ├─ happiness_score_6.png
│  │  ├─ happiness_score_7.png
│  │  ├─ happiness_score_8.png
│  │  └─ happiness_score_9.png
│  ├─ fonts
│  │  ├─ Bonfire.otf
│  │  ├─ Bonfire.ttf
│  │  └─ Metropolis-Regular.otf
│  ├─ images
│  │  ├─ eNPS
│  │  │  ├─ eNPS_White-on-pink_800x800.png
│  │  │  └─ logo-eNPS-main-splash.gif
│  │  ├─ eNPS-carousel_1920x1080_transparent.png
│  │  ├─ eNPS_logo.png
│  │  ├─ eNPS_White-on-pink_800x800.png
│  │  ├─ Happiness_Score__Icon_10_100px.png
│  │  ├─ Happiness_Score__Icon_1_100px.png
│  │  ├─ Happiness_Score__Icon_6_100px.png
│  │  ├─ icon-192.png
│  │  ├─ icon-512.png
│  │  ├─ marketing
│  │  │  ├─ HappinessMarketing_0.jpg
│  │  │  ├─ HappinessMarketing_1.jpg
│  │  │  ├─ HappinessMarketing_2.jpg
│  │  │  ├─ HappinessMarketing_3.jpg
│  │  │  └─ img.png
│  │  ├─ perygonCheck.svg
│  │  ├─ perygonPinkCheck.ico
│  │  ├─ perygonPinkCheck.svg
│  │  ├─ perygonPinkUndeterminate.svg
│  │  ├─ perygon_full_logo.png
│  │  ├─ Perygon_Happiness_score_icon.png
│  │  └─ Perygon_Happiness_score_icon_festive.png
│  ├─ logoWhole.png
│  ├─ next.svg
│  ├─ perygonSpeechBubble.png
│  ├─ smiley-icon.svg
│  ├─ speechBubblePink.png
│  ├─ styles.css
│  └─ vercel.svg
├─ README.md
├─ src
│  ├─ app
│  │  ├─ (auth)
│  │  │  ├─ activate-account
│  │  │  │  └─ page.tsx
│  │  │  ├─ g-login
│  │  │  │  ├─ GuestLoginClient.tsx
│  │  │  │  └─ page.tsx
│  │  │  ├─ login
│  │  │  │  └─ page.tsx
│  │  │  ├─ password-recovery
│  │  │  │  ├─ page.tsx
│  │  │  │  ├─ PasswordRecoveryModal.tsx
│  │  │  │  └─ PasswordRecoveryPageClient.tsx
│  │  │  ├─ password-reset
│  │  │  │  └─ page.tsx
│  │  │  ├─ profile-setup
│  │  │  │  └─ page.tsx
│  │  │  └─ sign-up
│  │  │     ├─ CompanySignUpForm.tsx
│  │  │     ├─ page.tsx
│  │  │     ├─ SignUpForm.tsx
│  │  │     ├─ SignUpPageClient.tsx
│  │  │     ├─ SignUpSuccessModal.tsx
│  │  │     └─ SignUpTypeSelector.tsx
│  │  ├─ (public)
│  │  │  ├─ delete-my-data
│  │  │  │  └─ page.tsx
│  │  │  ├─ marketing
│  │  │  │  └─ page.tsx
│  │  │  ├─ privacy-policy
│  │  │  │  └─ page.tsx
│  │  │  └─ support
│  │  │     └─ page.tsx
│  │  ├─ (site)
│  │  │  ├─ (admin)
│  │  │  │  ├─ activity
│  │  │  │  │  └─ page.tsx
│  │  │  │  ├─ business-processes
│  │  │  │  │  ├─ create
│  │  │  │  │  │  └─ page.tsx
│  │  │  │  │  ├─ page.tsx
│  │  │  │  │  └─ [uniqueId]
│  │  │  │  │     └─ page.tsx
│  │  │  │  ├─ client-activity
│  │  │  │  │  └─ page.tsx
│  │  │  │  ├─ customers
│  │  │  │  │  ├─ create
│  │  │  │  │  │  └─ page.tsx
│  │  │  │  │  ├─ page.tsx
│  │  │  │  │  └─ [uniqueId]
│  │  │  │  │     └─ page.tsx
│  │  │  │  ├─ dashboard-workflows
│  │  │  │  │  ├─ create
│  │  │  │  │  │  └─ page.tsx
│  │  │  │  │  ├─ page.tsx
│  │  │  │  │  └─ [uniqueId]
│  │  │  │  │     └─ page.tsx
│  │  │  │  ├─ dashboards
│  │  │  │  │  ├─ create
│  │  │  │  │  │  └─ page.tsx
│  │  │  │  │  ├─ page.tsx
│  │  │  │  │  └─ [uniqueId]
│  │  │  │  │     └─ page.tsx
│  │  │  │  ├─ email-schedule
│  │  │  │  │  ├─ AssignSchedule.tsx
│  │  │  │  │  ├─ create
│  │  │  │  │  │  └─ page.tsx
│  │  │  │  │  ├─ page.tsx
│  │  │  │  │  └─ [uniqueId]
│  │  │  │  │     └─ page.tsx
│  │  │  │  ├─ email-secure-link
│  │  │  │  │  ├─ create
│  │  │  │  │  │  └─ page.tsx
│  │  │  │  │  ├─ page.tsx
│  │  │  │  │  └─ [uniqueId]
│  │  │  │  │     └─ page.tsx
│  │  │  │  ├─ email-template
│  │  │  │  │  ├─ create
│  │  │  │  │  │  └─ page.tsx
│  │  │  │  │  ├─ page.tsx
│  │  │  │  │  └─ [uniqueId]
│  │  │  │  │     └─ page.tsx
│  │  │  │  ├─ forms
│  │  │  │  │  ├─ create
│  │  │  │  │  │  └─ page.tsx
│  │  │  │  │  ├─ page.tsx
│  │  │  │  │  └─ [uniqueId]
│  │  │  │  │     └─ page.tsx
│  │  │  │  ├─ grid-test
│  │  │  │  │  └─ page.tsx
│  │  │  │  ├─ layout.tsx
│  │  │  │  ├─ my-company
│  │  │  │  │  └─ page.tsx
│  │  │  │  ├─ my-profile
│  │  │  │  │  └─ page.tsx
│  │  │  │  ├─ option-lists
│  │  │  │  │  ├─ groups
│  │  │  │  │  │  ├─ create
│  │  │  │  │  │  │  └─ page.tsx
│  │  │  │  │  │  └─ [uniqueId]
│  │  │  │  │  │     └─ page.tsx
│  │  │  │  │  ├─ items
│  │  │  │  │  │  ├─ create
│  │  │  │  │  │  │  └─ page.tsx
│  │  │  │  │  │  └─ [uniqueId]
│  │  │  │  │  │     └─ page.tsx
│  │  │  │  │  ├─ lists
│  │  │  │  │  │  ├─ create
│  │  │  │  │  │  │  └─ page.tsx
│  │  │  │  │  │  └─ [uniqueId]
│  │  │  │  │  │     └─ page.tsx
│  │  │  │  │  └─ page.tsx
│  │  │  │  ├─ select-items
│  │  │  │  │  ├─ create
│  │  │  │  │  │  └─ page.tsx
│  │  │  │  │  ├─ page.tsx
│  │  │  │  │  └─ [uniqueId]
│  │  │  │  │     └─ page.tsx
│  │  │  │  ├─ SideBars.tsx
│  │  │  │  ├─ sites
│  │  │  │  │  ├─ create
│  │  │  │  │  │  └─ page.tsx
│  │  │  │  │  ├─ page.tsx
│  │  │  │  │  ├─ SiteLimitReached.tsx
│  │  │  │  │  └─ [uniqueId]
│  │  │  │  │     └─ page.tsx
│  │  │  │  ├─ survey-test
│  │  │  │  │  └─ page.tsx
│  │  │  │  ├─ tags
│  │  │  │  │  ├─ create
│  │  │  │  │  │  └─ page.tsx
│  │  │  │  │  ├─ page.tsx
│  │  │  │  │  └─ [uniqueId]
│  │  │  │  │     └─ page.tsx
│  │  │  │  ├─ teams
│  │  │  │  │  ├─ create
│  │  │  │  │  │  └─ page.tsx
│  │  │  │  │  ├─ page.tsx
│  │  │  │  │  ├─ TeamLimitReached.tsx
│  │  │  │  │  └─ [uniqueId]
│  │  │  │  │     └─ page.tsx
│  │  │  │  ├─ tool-subscriptions
│  │  │  │  │  ├─ create
│  │  │  │  │  │  └─ page.tsx
│  │  │  │  │  ├─ page.tsx
│  │  │  │  │  └─ [uniqueId]
│  │  │  │  │     └─ page.tsx
│  │  │  │  ├─ tools
│  │  │  │  │  ├─ create
│  │  │  │  │  │  └─ page.tsx
│  │  │  │  │  ├─ page.tsx
│  │  │  │  │  └─ [uniqueId]
│  │  │  │  │     └─ page.tsx
│  │  │  │  ├─ user-groups
│  │  │  │  │  ├─ AssignGroupModal.tsx
│  │  │  │  │  ├─ create
│  │  │  │  │  │  └─ page.tsx
│  │  │  │  │  ├─ page.tsx
│  │  │  │  │  ├─ UserGroupDrawerComponent.tsx
│  │  │  │  │  └─ [uniqueId]
│  │  │  │  │     ├─ page.tsx
│  │  │  │  │     ├─ teamFields.ts
│  │  │  │  │     ├─ userFields.ts
│  │  │  │  │     └─ UserGroupTabs.tsx
│  │  │  │  ├─ users
│  │  │  │  │  ├─ create
│  │  │  │  │  │  └─ page.tsx
│  │  │  │  │  ├─ InviteUser.tsx
│  │  │  │  │  ├─ InviteUserLimitReached.tsx
│  │  │  │  │  ├─ page.tsx
│  │  │  │  │  └─ [uniqueId]
│  │  │  │  │     └─ page.tsx
│  │  │  │  └─ workflows
│  │  │  │     ├─ create
│  │  │  │     │  └─ page.tsx
│  │  │  │     ├─ page.tsx
│  │  │  │     └─ [uniqueId]
│  │  │  │        └─ page.tsx
│  │  │  ├─ (apps)
│  │  │  │  ├─ AppMainPage.tsx
│  │  │  │  ├─ business-score
│  │  │  │  │  ├─ BusinessScoreClientInner.tsx
│  │  │  │  │  ├─ BusinessScoreSplashScreen.tsx
│  │  │  │  │  ├─ BusinessScoreSplashScreenOld.tsx
│  │  │  │  │  ├─ dashboard
│  │  │  │  │  │  ├─ layout.tsx
│  │  │  │  │  │  └─ primary
│  │  │  │  │  │     ├─ BusinessScoreDashboard.tsx
│  │  │  │  │  │     └─ page.tsx
│  │  │  │  │  ├─ page.tsx
│  │  │  │  │  └─ workflow
│  │  │  │  │     └─ [workflowInstanceId]
│  │  │  │  │        └─ page.tsx
│  │  │  │  ├─ client-satisfaction
│  │  │  │  │  ├─ ClientSatisfactionSplashScreen.tsx
│  │  │  │  │  ├─ dashboard
│  │  │  │  │  │  ├─ layout.tsx
│  │  │  │  │  │  ├─ my-clients
│  │  │  │  │  │  │  └─ types.ts
│  │  │  │  │  │  ├─ primary
│  │  │  │  │  │  │  ├─ ClientSatisfactionDashboard.tsx
│  │  │  │  │  │  │  ├─ GaugeLinkWrapper.tsx
│  │  │  │  │  │  │  ├─ MoalGridColDefs.ts
│  │  │  │  │  │  │  ├─ page.tsx
│  │  │  │  │  │  │  ├─ ServiceGridColumnDefs.ts
│  │  │  │  │  │  │  ├─ StaffGridColumnDefs.ts
│  │  │  │  │  │  │  └─ types.ts
│  │  │  │  │  │  ├─ service
│  │  │  │  │  │  │  ├─ colDefs.ts
│  │  │  │  │  │  │  ├─ page.tsx
│  │  │  │  │  │  │  ├─ ServicesDashboard.tsx
│  │  │  │  │  │  │  ├─ types.ts
│  │  │  │  │  │  │  └─ typesOLD.ts
│  │  │  │  │  │  └─ Staff
│  │  │  │  │  │     ├─ colDefs.ts
│  │  │  │  │  │     ├─ mockData.ts
│  │  │  │  │  │     ├─ page.tsx
│  │  │  │  │  │     ├─ StaffDashboard.tsx
│  │  │  │  │  │     └─ types.ts
│  │  │  │  │  ├─ page.tsx
│  │  │  │  │  └─ workflow
│  │  │  │  │     └─ [workflowInstanceId]
│  │  │  │  │        └─ page.tsx
│  │  │  │  ├─ DashboardHeader.tsx
│  │  │  │  ├─ enps
│  │  │  │  │  ├─ dashboard
│  │  │  │  │  │  ├─ all
│  │  │  │  │  │  │  ├─ AllEnpsDashboard.tsx
│  │  │  │  │  │  │  └─ page.tsx
│  │  │  │  │  │  └─ layout.tsx
│  │  │  │  │  ├─ EnpsSplashScreen.tsx
│  │  │  │  │  ├─ page.tsx
│  │  │  │  │  └─ workflow
│  │  │  │  │     └─ [workflowInstanceId]
│  │  │  │  │        └─ page.tsx
│  │  │  │  ├─ happiness-score
│  │  │  │  │  ├─ dashboard
│  │  │  │  │  │  ├─ company-dashboard
│  │  │  │  │  │  │  ├─ ManagerDashboard.tsx
│  │  │  │  │  │  │  ├─ ManagerDashboardPageInner.tsx
│  │  │  │  │  │  │  ├─ page.tsx
│  │  │  │  │  │  │  ├─ PeopleList.tsx
│  │  │  │  │  │  │  ├─ StaffHappinessDetailModal.tsx
│  │  │  │  │  │  │  └─ types.ts
│  │  │  │  │  │  ├─ company-stats-dashboard
│  │  │  │  │  │  │  ├─ CompanyBubble.tsx
│  │  │  │  │  │  │  ├─ CompanyHistogram.tsx
│  │  │  │  │  │  │  ├─ CompanyStats.tsx
│  │  │  │  │  │  │  └─ page.tsx
│  │  │  │  │  │  ├─ department-dashboard
│  │  │  │  │  │  │  └─ page.tsx
│  │  │  │  │  │  ├─ layout.tsx
│  │  │  │  │  │  ├─ scores-and-comments
│  │  │  │  │  │  │  ├─ GridColumnDefs.ts
│  │  │  │  │  │  │  ├─ ModalColumnDefs.ts
│  │  │  │  │  │  │  ├─ page.tsx
│  │  │  │  │  │  │  └─ ScoresCommentsDashboard.tsx
│  │  │  │  │  │  ├─ site-department-analysis
│  │  │  │  │  │  │  ├─ page.tsx
│  │  │  │  │  │  │  └─ SiteDepartmentDashboard.tsx
│  │  │  │  │  │  ├─ staff-dashboard
│  │  │  │  │  │  │  ├─ page.tsx
│  │  │  │  │  │  │  └─ StaffDashboardPage.tsx
│  │  │  │  │  │  ├─ staff-stats-dashboard
│  │  │  │  │  │  │  ├─ page.tsx
│  │  │  │  │  │  │  └─ UserDashboard.tsx
│  │  │  │  │  │  └─ team-dashboard
│  │  │  │  │  │     └─ page.tsx
│  │  │  │  │  ├─ HappinessScoreMasonry.tsx
│  │  │  │  │  ├─ HappinessScoreSplashScreen.tsx
│  │  │  │  │  ├─ page.tsx
│  │  │  │  │  ├─ SpeechBubble.tsx
│  │  │  │  │  └─ workflow
│  │  │  │  │     └─ [workflowInstanceId]
│  │  │  │  │        └─ page.tsx
│  │  │  │  ├─ layout.tsx
│  │  │  │  ├─ NewWorkflowLayout.tsx
│  │  │  │  ├─ NoDashboardModal.tsx
│  │  │  │  ├─ tester
│  │  │  │  │  ├─ dashboard
│  │  │  │  │  │  ├─ layout.tsx
│  │  │  │  │  │  └─ primary
│  │  │  │  │  │     ├─ page.tsx
│  │  │  │  │  │     └─ TestDashboard.tsx
│  │  │  │  │  ├─ page.tsx
│  │  │  │  │  └─ workflow
│  │  │  │  │     └─ [workflowInstanceId]
│  │  │  │  │        └─ page.tsx
│  │  │  │  ├─ ToolDashboardLayout.tsx
│  │  │  │  ├─ ToolLandingPageInner.tsx
│  │  │  │  ├─ types.ts
│  │  │  │  ├─ workflow
│  │  │  │  │  └─ [workflowInstanceId]
│  │  │  │  │     └─ page.tsx
│  │  │  │  ├─ WorkflowEngine.tsx
│  │  │  │  └─ WorkflowEngineDebugger.tsx
│  │  │  ├─ (apps-non-standard)
│  │  │  │  ├─ big-up
│  │  │  │  │  ├─ app
│  │  │  │  │  │  └─ page.tsx
│  │  │  │  │  ├─ BigUpSplashScreen.tsx
│  │  │  │  │  ├─ components
│  │  │  │  │  │  ├─ ConfettiWrapper.tsx
│  │  │  │  │  │  ├─ RecognitionHeader.tsx
│  │  │  │  │  │  └─ TeamMemberAutocomplete.tsx
│  │  │  │  │  ├─ hooks
│  │  │  │  │  │  ├─ useBigUpDashboard.ts
│  │  │  │  │  │  ├─ useBigUpUserStats.ts
│  │  │  │  │  │  └─ useRecognitionActions.ts
│  │  │  │  │  ├─ lib
│  │  │  │  │  │  └─ bigUpTabsData.tsx
│  │  │  │  │  ├─ masonry
│  │  │  │  │  │  ├─ BigUpMasonry.tsx
│  │  │  │  │  │  ├─ BigUpStatsCard.tsx
│  │  │  │  │  │  └─ MasonryCardItem.tsx
│  │  │  │  │  ├─ modal
│  │  │  │  │  │  ├─ components
│  │  │  │  │  │  │  └─ BigUpModalContent.tsx
│  │  │  │  │  │  ├─ NewRecognitionModal.tsx
│  │  │  │  │  │  ├─ RecognitionSuccessModal.tsx
│  │  │  │  │  │  └─ SubmitScoreModal.tsx
│  │  │  │  │  ├─ page.tsx
│  │  │  │  │  ├─ tabs
│  │  │  │  │  │  ├─ LeaderBoardTab
│  │  │  │  │  │  │  ├─ LeaderboardCard.tsx
│  │  │  │  │  │  │  └─ LeaderBoardTabContent.tsx
│  │  │  │  │  │  ├─ OtherTabs
│  │  │  │  │  │  │  └─ RecognitionCardList.tsx
│  │  │  │  │  │  └─ PerygonTabs.tsx
│  │  │  │  │  ├─ types.ts
│  │  │  │  │  └─ UserStatsModal.tsx
│  │  │  │  └─ layout.tsx
│  │  │  ├─ (main)
│  │  │  │  ├─ ExternalUserMainClient.tsx
│  │  │  │  ├─ link
│  │  │  │  │  └─ page.tsx
│  │  │  │  ├─ page.tsx
│  │  │  │  └─ register-company
│  │  │  │     ├─ LogoUpload.tsx
│  │  │  │     ├─ page.tsx
│  │  │  │     ├─ RegisterCompany.tsx
│  │  │  │     ├─ success
│  │  │  │     │  ├─ page.tsx
│  │  │  │     │  └─ Success.tsx
│  │  │  │     └─ tool-selection
│  │  │  │        ├─ page.tsx
│  │  │  │        └─ ToolSelection.tsx
│  │  │  ├─ (tool-store)
│  │  │  │  └─ tool-store
│  │  │  │     ├─ BillingCyleToggle.tsx
│  │  │  │     ├─ layout.tsx
│  │  │  │     ├─ LicensePicker.tsx
│  │  │  │     ├─ manage-subscription
│  │  │  │     │  ├─ BasketItemCard.tsx
│  │  │  │     │  ├─ BillingAddressForm.tsx
│  │  │  │     │  ├─ LicenseAmountIndicator.tsx
│  │  │  │     │  ├─ page.tsx
│  │  │  │     │  ├─ ToolInfoCard.tsx
│  │  │  │     │  └─ ToolSelectedIndicators.tsx
│  │  │  │     ├─ MoreToolsComingSoonCard.tsx
│  │  │  │     ├─ my-subscription
│  │  │  │     │  └─ page.tsx
│  │  │  │     ├─ page.tsx
│  │  │  │     ├─ Sidebars.tsx
│  │  │  │     ├─ ToolCard.tsx
│  │  │  │     ├─ ToolStore.tsx
│  │  │  │     └─ useBasket.tsx
│  │  │  ├─ DeveloperBoardOptions.tsx
│  │  │  ├─ layout.tsx
│  │  │  └─ SiteProviders.tsx
│  │  ├─ api
│  │  │  ├─ (admin)
│  │  │  │  ├─ dashboard
│  │  │  │  │  ├─ allBy
│  │  │  │  │  │  └─ route.ts
│  │  │  │  │  └─ route.ts
│  │  │  │  ├─ dashboard-workflow
│  │  │  │  │  ├─ allBy
│  │  │  │  │  │  └─ route.ts
│  │  │  │  │  └─ route.ts
│  │  │  │  └─ datasource
│  │  │  │     └─ allBy
│  │  │  │        └─ route.ts
│  │  │  ├─ (tools)
│  │  │  │  ├─ client-satisfaction
│  │  │  │  │  ├─ my-clients
│  │  │  │  │  │  └─ route.ts
│  │  │  │  │  ├─ services
│  │  │  │  │  │  └─ route.ts
│  │  │  │  │  ├─ staff
│  │  │  │  │  │  └─ route.bak.ts
│  │  │  │  │  └─ summary
│  │  │  │  │     └─ route.ts
│  │  │  │  ├─ dashboards
│  │  │  │  │  └─ route.ts
│  │  │  │  ├─ enps
│  │  │  │  │  └─ dashboards
│  │  │  │  │     └─ company-enps
│  │  │  │  │        └─ route.ts
│  │  │  │  └─ happiness-score
│  │  │  │     └─ dashboards
│  │  │  │        ├─ (depreciated)
│  │  │  │        │  ├─ getCurrentWeekHappinessData
│  │  │  │        │  │  └─ route.ts
│  │  │  │        │  └─ getManagerDashboardData
│  │  │  │        │     └─ route.ts
│  │  │  │        ├─ all-scores
│  │  │  │        │  └─ route.ts
│  │  │  │        ├─ company-happiness
│  │  │  │        │  ├─ fetchFilterGroups.ts
│  │  │  │        │  ├─ getDidNotParticipate.ts
│  │  │  │        │  ├─ getManagerData.ts
│  │  │  │        │  ├─ processResponseData
│  │  │  │        │  │  ├─ helpers
│  │  │  │        │  │  │  ├─ computeWeeklyStats.ts
│  │  │  │        │  │  │  ├─ fetchAndMergeNonParticipants.ts
│  │  │  │        │  │  │  ├─ findEarliestDate.ts
│  │  │  │        │  │  │  └─ groupByWeeks.ts
│  │  │  │        │  │  └─ index.ts
│  │  │  │        │  ├─ route.ts
│  │  │  │        │  ├─ types.ts
│  │  │  │        │  └─ weekUtils.ts
│  │  │  │        ├─ company-stats
│  │  │  │        │  └─ route.ts
│  │  │  │        ├─ historic-line-graph
│  │  │  │        │  └─ route.ts
│  │  │  │        ├─ site-department
│  │  │  │        │  └─ route.ts
│  │  │  │        ├─ user-current-happiness
│  │  │  │        │  └─ route.ts
│  │  │  │        ├─ user-happiness
│  │  │  │        │  └─ route.ts
│  │  │  │        └─ user-stats
│  │  │  │           └─ route.ts
│  │  │  ├─ auth
│  │  │  │  ├─ activate-account
│  │  │  │  │  └─ route.ts
│  │  │  │  ├─ big-up
│  │  │  │  │  ├─ checkUnread
│  │  │  │  │  │  └─ route.ts
│  │  │  │  │  ├─ fetchBigUpDashboardData
│  │  │  │  │  │  └─ route.ts
│  │  │  │  │  ├─ fetchBigUpUserData
│  │  │  │  │  │  └─ route.ts
│  │  │  │  │  ├─ markAsRead
│  │  │  │  │  │  └─ route.ts
│  │  │  │  │  └─ submitBigUp
│  │  │  │  │     └─ route.ts
│  │  │  │  ├─ link-apple-login
│  │  │  │  │  └─ route.ts
│  │  │  │  ├─ password-recovery
│  │  │  │  │  └─ route.ts
│  │  │  │  ├─ password-reset
│  │  │  │  │  └─ route.ts
│  │  │  │  ├─ sign-in
│  │  │  │  │  └─ route.ts
│  │  │  │  ├─ sign-out
│  │  │  │  │  └─ route.ts
│  │  │  │  ├─ sign-up
│  │  │  │  │  └─ route.ts
│  │  │  │  ├─ sign-up-company
│  │  │  │  │  └─ route.ts
│  │  │  │  └─ [...nextauth]
│  │  │  │     └─ route.ts
│  │  │  ├─ basket
│  │  │  │  ├─ checkout
│  │  │  │  │  └─ route.ts
│  │  │  │  ├─ route.tsx
│  │  │  │  ├─ subscription
│  │  │  │  │  └─ route.ts
│  │  │  │  ├─ voucher
│  │  │  │  │  └─ route.ts
│  │  │  │  └─ [toolUId]
│  │  │  │     └─ route.tsx
│  │  │  ├─ businessProcess
│  │  │  │  ├─ allBy
│  │  │  │  │  └─ route.ts
│  │  │  │  └─ route.ts
│  │  │  ├─ checkout
│  │  │  │  └─ route.ts
│  │  │  ├─ crypto
│  │  │  │  ├─ decrypt
│  │  │  │  │  └─ route.ts
│  │  │  │  └─ encrypt
│  │  │  │     └─ route.ts
│  │  │  ├─ customer
│  │  │  │  ├─ allBy
│  │  │  │  │  └─ route.ts
│  │  │  │  ├─ findBy
│  │  │  │  │  └─ route.ts
│  │  │  │  ├─ route.ts
│  │  │  │  └─ uploadPhoto
│  │  │  │     └─ [uniqueId]
│  │  │  │        └─ route.ts
│  │  │  ├─ emailSchedule
│  │  │  │  ├─ allBy
│  │  │  │  │  └─ route.ts
│  │  │  │  └─ route.ts
│  │  │  ├─ emailScheduleCustomerOpt
│  │  │  │  └─ route.ts
│  │  │  ├─ emailSecureLink
│  │  │  │  ├─ allBy
│  │  │  │  │  └─ route.ts
│  │  │  │  └─ route.ts
│  │  │  ├─ emailTemplate
│  │  │  │  ├─ allBy
│  │  │  │  │  └─ route.ts
│  │  │  │  └─ route.ts
│  │  │  ├─ form
│  │  │  │  ├─ allBy
│  │  │  │  │  └─ route.ts
│  │  │  │  └─ route.ts
│  │  │  ├─ guideRead
│  │  │  ├─ optionList
│  │  │  │  ├─ allBy
│  │  │  │  │  └─ route.ts
│  │  │  │  └─ route.ts
│  │  │  ├─ optionListGroup
│  │  │  │  ├─ allBy
│  │  │  │  │  └─ route.ts
│  │  │  │  └─ route.ts
│  │  │  ├─ optionListItem
│  │  │  │  ├─ allBy
│  │  │  │  │  └─ route.ts
│  │  │  │  └─ route.ts
│  │  │  ├─ selectItems
│  │  │  │  ├─ fetchSelectItems
│  │  │  │  │  └─ route.ts
│  │  │  │  └─ fetchTeamsSelectItems
│  │  │  │     ├─ route.ts
│  │  │  │     └─ transformTeams.ts
│  │  │  ├─ site
│  │  │  │  ├─ allBy
│  │  │  │  │  └─ route.ts
│  │  │  │  └─ route.ts
│  │  │  ├─ subscriptionType
│  │  │  │  └─ allBy
│  │  │  │     └─ route.ts
│  │  │  ├─ surveyjs
│  │  │  │  ├─ companyRegistration
│  │  │  │  │  └─ route.ts
│  │  │  │  ├─ forms
│  │  │  │  │  └─ [...endpoint]
│  │  │  │  │     └─ route.ts
│  │  │  │  ├─ postcode
│  │  │  │  │  └─ route.ts
│  │  │  │  ├─ selectItems
│  │  │  │  │  └─ route.ts
│  │  │  │  ├─ test
│  │  │  │  │  └─ route.ts
│  │  │  │  ├─ view
│  │  │  │  │  └─ route.ts
│  │  │  │  ├─ workflows
│  │  │  │  │  └─ route.ts
│  │  │  │  └─ [endpoint]
│  │  │  │     └─ route.ts
│  │  │  ├─ tag
│  │  │  │  └─ route.ts
│  │  │  ├─ tags
│  │  │  │  ├─ addTagToRecord
│  │  │  │  │  └─ route.ts
│  │  │  │  ├─ getTagsAvailableToAddToRecord
│  │  │  │  │  └─ route.ts
│  │  │  │  ├─ getTagsForRecord
│  │  │  │  │  └─ route.ts
│  │  │  │  └─ removeTagFromRecord
│  │  │  │     └─ [tagId]
│  │  │  │        └─ route.ts
│  │  │  ├─ theme
│  │  │  │  └─ getThemesForCustomer
│  │  │  │     └─ route.ts
│  │  │  ├─ toolCategory
│  │  │  │  └─ allBy
│  │  │  │     └─ route.ts
│  │  │  ├─ toolConfig
│  │  │  │  ├─ allBy
│  │  │  │  │  └─ route.ts
│  │  │  │  ├─ check
│  │  │  │  │  └─ route.ts
│  │  │  │  ├─ findBy
│  │  │  │  │  └─ route.ts
│  │  │  │  └─ route.ts
│  │  │  ├─ toolCustomer
│  │  │  │  ├─ allBy
│  │  │  │  │  └─ route.ts
│  │  │  │  └─ route.ts
│  │  │  ├─ user
│  │  │  │  ├─ allBy
│  │  │  │  │  └─ route.ts
│  │  │  │  ├─ getUserMetadata
│  │  │  │  │  └─ route.ts
│  │  │  │  ├─ isProfileRegistered
│  │  │  │  │  └─ route.ts
│  │  │  │  ├─ route.ts
│  │  │  │  ├─ updateUserDetails
│  │  │  │  │  └─ route.ts
│  │  │  │  └─ uploadPhoto
│  │  │  │     └─ [uniqueId]
│  │  │  │        └─ route.ts
│  │  │  ├─ userGroup
│  │  │  │  ├─ allBy
│  │  │  │  │  └─ route.ts
│  │  │  │  ├─ many
│  │  │  │  │  └─ [uniqueId]
│  │  │  │  │     └─ route.ts
│  │  │  │  └─ route.ts
│  │  │  ├─ userGroupPlatform
│  │  │  │  └─ route.ts
│  │  │  ├─ userTeam
│  │  │  │  ├─ allBy
│  │  │  │  │  └─ route.ts
│  │  │  │  └─ route.ts
│  │  │  ├─ workflow
│  │  │  │  ├─ allBy
│  │  │  │  │  └─ route.ts
│  │  │  │  └─ route.ts
│  │  │  └─ workflows
│  │  │     ├─ getForm
│  │  │     │  └─ route.ts
│  │  │     ├─ getFormData
│  │  │     │  └─ route.ts
│  │  │     ├─ getVariables
│  │  │     │  └─ route.ts
│  │  │     ├─ saveWorkflow
│  │  │     │  └─ [businessProcessInstanceId]
│  │  │     │     └─ route.ts
│  │  │     ├─ startWorkflow
│  │  │     │  └─ route.ts
│  │  │     └─ workflowAccess
│  │  │        └─ route.ts
│  │  ├─ apple-icon.png
│  │  ├─ favicon.ico
│  │  ├─ HomePageDemo.tsx
│  │  ├─ layout.tsx
│  │  ├─ manifest.ts
│  │  ├─ not-found.tsx
│  │  ├─ PerygonMainClient.tsx
│  │  ├─ RatingField.tsx
│  │  ├─ ResetPasswordModal.tsx
│  │  └─ ScoreForm.tsx
│  ├─ components
│  │  ├─ AccessDenied.tsx
│  │  ├─ AdminDetailsBanners
│  │  │  ├─ BusinessProcessDetailsBanner.tsx
│  │  │  ├─ CustomerDetailsBanner.tsx
│  │  │  ├─ DashboardBanner.tsx
│  │  │  ├─ DashboardWorkflowBanner.tsx
│  │  │  ├─ EmailScheduleDetailsBanner.tsx
│  │  │  ├─ EmailSecureLinkDetailsBanner.tsx
│  │  │  ├─ EmailTemplateDetailsBanner.tsx
│  │  │  ├─ FormDetailsBanner.tsx
│  │  │  ├─ OptionListDetailsBanner.tsx
│  │  │  ├─ OptionListGroupDetailsBanner.tsx
│  │  │  ├─ OptionListItemDetailsBanner.tsx
│  │  │  ├─ SelectItemDetailsBanner.tsx
│  │  │  ├─ SiteDetailsBanner.tsx
│  │  │  ├─ TagDetailsBanner.tsx
│  │  │  ├─ ToolDetailsBanner.tsx
│  │  │  ├─ ToolSubscriptionDetailsBanner.tsx
│  │  │  ├─ UserDetailsBanner.tsx
│  │  │  ├─ UserGroupDetailsBanner.tsx
│  │  │  ├─ UserTeamDetailsBanner.tsx
│  │  │  └─ WorkflowDetailsBanner.tsx
│  │  ├─ AdminHeader.tsx
│  │  ├─ agCharts
│  │  │  ├─ AgChartComponent.tsx
│  │  │  ├─ AgGaugeComponent.tsx
│  │  │  ├─ HappinessRagBubbleModal.tsx
│  │  │  ├─ HappinessRagHistogramModal.tsx
│  │  │  └─ tooltips
│  │  │     ├─ BubbleScoresTooltipRenderer.ts
│  │  │     ├─ factory
│  │  │     │  └─ createTooltipRenderer.ts
│  │  │     ├─ PieChartTooltipRenderer.ts
│  │  │     ├─ SankeyTooltipRenderer.ts
│  │  │     ├─ ScoreTooltipRenderer.ts
│  │  │     └─ SubmissionsTooltipRenderer.ts
│  │  ├─ agGrids
│  │  │  ├─ CellRenderers
│  │  │  │  ├─ ActionButtonRenderer.tsx
│  │  │  │  ├─ ActivityButtonRenderer.tsx
│  │  │  │  ├─ BusinessProcessRenderer.tsx
│  │  │  │  ├─ ClientSatisfaction
│  │  │  │  │  └─ ScoreRenderer.tsx
│  │  │  │  ├─ ColourCellRenderer.tsx
│  │  │  │  ├─ CommentsCellRenderer.tsx
│  │  │  │  ├─ CustomerRenderer.tsx
│  │  │  │  ├─ EmailScheduleRenderer.tsx
│  │  │  │  ├─ EmailSecureLinkRenderer.tsx
│  │  │  │  ├─ EmailTemplateRenderer.tsx
│  │  │  │  ├─ FormRenderer.tsx
│  │  │  │  ├─ HappinessDifferenceRenderer.tsx
│  │  │  │  ├─ HappinessHistogramRenderer.tsx
│  │  │  │  ├─ HappinessScore
│  │  │  │  │  └─ StaffHappinessDetailsRenderer.tsx
│  │  │  │  ├─ HappinessScoreRenderer.tsx
│  │  │  │  ├─ OptionListGroupsRenderer.tsx
│  │  │  │  ├─ OptionListItemsRenderer.tsx
│  │  │  │  ├─ OptionListsRenderer.tsx
│  │  │  │  ├─ SelectItemRenderer.tsx
│  │  │  │  ├─ SiteLinkRenderer.tsx
│  │  │  │  ├─ StatusBadgeRenderer.tsx
│  │  │  │  ├─ TagRenderer.tsx
│  │  │  │  ├─ TeamCellRenderer.tsx
│  │  │  │  ├─ TeamRenderer.tsx
│  │  │  │  ├─ ToolConfigRenderer.tsx
│  │  │  │  ├─ UserGroupRenderer.tsx
│  │  │  │  ├─ UserRenderer.tsx
│  │  │  │  ├─ UserVerifiedRenderer.tsx
│  │  │  │  └─ WorkflowRenderer.tsx
│  │  │  ├─ CustomGridBottomPagination.tsx
│  │  │  ├─ dataFields
│  │  │  │  ├─ activityFields.ts
│  │  │  │  ├─ businessProcessFields.ts
│  │  │  │  ├─ caEmailScheduleFields.ts
│  │  │  │  ├─ customerFields.ts
│  │  │  │  ├─ dashboardFields.ts
│  │  │  │  ├─ dashboardWorkflowFields.ts
│  │  │  │  ├─ emailScheduleFields.ts
│  │  │  │  ├─ emailSecureLinkFields.ts
│  │  │  │  ├─ emailTemplateFields.ts
│  │  │  │  ├─ formFields.ts
│  │  │  │  ├─ optionListFields.ts
│  │  │  │  ├─ optionListGroupFields.ts
│  │  │  │  ├─ optionListItemFields.ts
│  │  │  │  ├─ selectItemFields.ts
│  │  │  │  ├─ siteFields.ts
│  │  │  │  ├─ tagFields.ts
│  │  │  │  ├─ teamFields.ts
│  │  │  │  ├─ toolFields.ts
│  │  │  │  ├─ toolSubscriptionFields.ts
│  │  │  │  ├─ userFields.ts
│  │  │  │  ├─ userGroupFields.ts
│  │  │  │  ├─ userTeamMembersListFields.ts
│  │  │  │  └─ workflowFields.ts
│  │  │  ├─ DataGrid
│  │  │  │  ├─ CustomGridBottomPaginationLight.tsx
│  │  │  │  ├─ DataGrid.scss
│  │  │  │  └─ DataGridComponentLight.tsx
│  │  │  ├─ DataGridComponent.tsx
│  │  │  ├─ DraggableGridsComponent.tsx
│  │  │  ├─ DraggableNoDataOverlay.tsx
│  │  │  ├─ LoadingOverlay.tsx
│  │  │  ├─ LoadingOverlayPink.tsx
│  │  │  ├─ NoDataOverlay.tsx
│  │  │  ├─ TabbedGrids.tsx
│  │  │  └─ ValueFormatters
│  │  │     ├─ currencyFormatter.ts
│  │  │     ├─ dateFormatter.ts
│  │  │     └─ dateValueFormatter.ts
│  │  ├─ animations
│  │  │  ├─ AnimatedList.tsx
│  │  │  ├─ AnimatedTillNumber.tsx
│  │  │  ├─ confetti
│  │  │  │  ├─ Confetti.tsx
│  │  │  │  ├─ ConfettiAlt.tsx
│  │  │  │  └─ ConfettiCannon.tsx
│  │  │  ├─ glow
│  │  │  │  └─ usePulseGlow.tsx
│  │  │  ├─ ScaleClickable.tsx
│  │  │  ├─ SpringScale.tsx
│  │  │  └─ text
│  │  │     └─ LetterFlyIn.tsx
│  │  ├─ BackButton.tsx
│  │  ├─ Bottombar
│  │  │  ├─ Bottombar.tsx
│  │  │  └─ NavigationBottombar
│  │  │     ├─ BottomNavigationMenuItem.tsx
│  │  │     └─ NavigationBottombar.tsx
│  │  ├─ Buttons
│  │  │  ├─ AddButtonDesktop.tsx
│  │  │  └─ AddButtonMobile.tsx
│  │  ├─ carousel
│  │  │  ├─ Carousel.tsx
│  │  │  ├─ CarouselControls.tsx
│  │  │  ├─ CarouselDisplay.tsx
│  │  │  ├─ CarouselDots.tsx
│  │  │  ├─ CarouselItem.tsx
│  │  │  ├─ CarouselNavigationButton.tsx
│  │  │  ├─ Dot.tsx
│  │  │  └─ FadingBackground.tsx
│  │  ├─ contexts
│  │  │  └─ UnreadRecognitionContext.tsx
│  │  ├─ counter
│  │  │  └─ Counter.tsx
│  │  ├─ forms
│  │  │  ├─ ActivateAccountForm.tsx
│  │  │  ├─ CompanySignUpForm.tsx
│  │  │  ├─ InputField.tsx
│  │  │  ├─ LoginForm.tsx
│  │  │  ├─ LoginFormButtons.tsx
│  │  │  ├─ NewCompanyUserProfileCompletionForm.tsx
│  │  │  ├─ PasswordRecoveryForm.tsx
│  │  │  ├─ PasswordResetForm.tsx
│  │  │  ├─ ProfileCompletionForm.tsx
│  │  │  ├─ SignUpForm.tsx
│  │  │  └─ validationSchema
│  │  │     └─ validationSchema.ts
│  │  ├─ graphs
│  │  │  ├─ AgBarChart.tsx
│  │  │  ├─ BarGraph.tsx
│  │  │  ├─ LineGraph.tsx
│  │  │  └─ LineGraphWIP.tsx
│  │  ├─ layout
│  │  │  ├─ DashboardFilteringDrawer.tsx
│  │  │  ├─ ErrorBox.tsx
│  │  │  ├─ Footer.tsx
│  │  │  ├─ PerygonCard.tsx
│  │  │  ├─ PerygonContainer.tsx
│  │  │  └─ PerygonPageContainer.tsx
│  │  ├─ LoadingBar
│  │  │  └─ LoadingBar.tsx
│  │  ├─ login
│  │  │  ├─ LoginCard.tsx
│  │  │  └─ SignUpCard.tsx
│  │  ├─ Masonry
│  │  │  └─ StatsMasonry
│  │  │     └─ StatBox.tsx
│  │  ├─ modals
│  │  │  ├─ adminModals
│  │  │  │  └─ ManageTagsModal.tsx
│  │  │  ├─ modalBodies
│  │  │  │  └─ ManageTagsModalBody.tsx
│  │  │  ├─ PerygonModal.tsx
│  │  │  ├─ userModal
│  │  │  │  └─ UserModal.tsx
│  │  │  └─ workflowModal
│  │  │     └─ WorkflowModal.tsx
│  │  ├─ NavBar
│  │  │  ├─ components
│  │  │  │  ├─ GreetingText.tsx
│  │  │  │  ├─ LogoDisplay.tsx
│  │  │  │  ├─ ProfileMenu.tsx
│  │  │  │  ├─ PulsatingIcon.tsx
│  │  │  │  ├─ types.ts
│  │  │  │  └─ UserAvatar.tsx
│  │  │  ├─ hooks
│  │  │  │  └─ useNavMenuItems.tsx
│  │  │  └─ NavBar.tsx
│  │  ├─ public
│  │  │  ├─ PublicFooter.tsx
│  │  │  ├─ PublicHeader.tsx
│  │  │  └─ PublicLayout.tsx
│  │  ├─ scaffold
│  │  │  └─ pages
│  │  │     ├─ MainPageClient.ts
│  │  │     └─ MainPageServer.tsx
│  │  ├─ sectionHeader
│  │  │  └─ SectionHeader.tsx
│  │  ├─ Sidebars
│  │  │  ├─ Dashboards Filter
│  │  │  │  ├─ DateFilterComponent.tsx
│  │  │  │  ├─ dateRangeUtils.ts
│  │  │  │  ├─ FilterSidebar.tsx
│  │  │  │  └─ types.ts
│  │  │  ├─ NavigationSidebar
│  │  │  │  ├─ NavigationSidebar.tsx
│  │  │  │  └─ SideBarMenuItem.tsx
│  │  │  ├─ Sidebar.tsx
│  │  │  ├─ useDrawerState.ts
│  │  │  └─ WorkflowSidebar
│  │  │     ├─ WorkflowCompletionBar.tsx
│  │  │     └─ WorkflowSidebar.tsx
│  │  ├─ surveyjs
│  │  │  ├─ AdminFormWrapper.tsx
│  │  │  ├─ FormComponent.tsx
│  │  │  ├─ forms
│  │  │  │  ├─ assignGroup.ts
│  │  │  │  ├─ businessProcess.ts
│  │  │  │  ├─ caEmailSchedule.ts
│  │  │  │  ├─ customer.ts
│  │  │  │  ├─ dashboard.ts
│  │  │  │  ├─ dashboardWorkflow.ts
│  │  │  │  ├─ duplicateCustomerEmailSchedule.ts
│  │  │  │  ├─ emailSchedule.ts
│  │  │  │  ├─ emailSecureLink.ts
│  │  │  │  ├─ emailTemplate.ts
│  │  │  │  ├─ forms.ts
│  │  │  │  ├─ happiness.ts
│  │  │  │  ├─ inviteUser.ts
│  │  │  │  ├─ optionListGroups.ts
│  │  │  │  ├─ optionListItems.ts
│  │  │  │  ├─ optionLists.ts
│  │  │  │  ├─ registerCompany.ts
│  │  │  │  ├─ selectItems.ts
│  │  │  │  ├─ site.ts
│  │  │  │  ├─ tags.ts
│  │  │  │  ├─ tools.ts
│  │  │  │  ├─ toolSubscriptions.ts
│  │  │  │  ├─ user.ts
│  │  │  │  ├─ userGroup.ts
│  │  │  │  ├─ userTeam.ts
│  │  │  │  └─ workflows.ts
│  │  │  ├─ hooks
│  │  │  │  ├─ useAdminFormSubmission.ts
│  │  │  │  ├─ useFormNavigation.ts
│  │  │  │  ├─ useInitialiseForm.ts
│  │  │  │  └─ useWorkflowFormSubmission.ts
│  │  │  ├─ jsPath
│  │  │  │  └─ registerSvgIcons.js
│  │  │  ├─ layout
│  │  │  │  ├─ business-score
│  │  │  │  │  ├─ Layout.tsx
│  │  │  │  │  └─ TopNavigation.tsx
│  │  │  │  ├─ client-satisfaction
│  │  │  │  │  ├─ Layout.tsx
│  │  │  │  │  └─ TopNavigation.tsx
│  │  │  │  ├─ companyRegistration
│  │  │  │  │  └─ Layout.tsx
│  │  │  │  ├─ default
│  │  │  │  │  ├─ BottomNavigation.tsx
│  │  │  │  │  ├─ CustomToggle.tsx
│  │  │  │  │  ├─ Layout.tsx
│  │  │  │  │  ├─ ScrollablePageList.tsx
│  │  │  │  │  ├─ SurveyModal.tsx
│  │  │  │  │  └─ TopNavigation.tsx
│  │  │  │  ├─ enps
│  │  │  │  │  └─ Layout.tsx
│  │  │  │  └─ happiness
│  │  │  │     └─ Layout.tsx
│  │  │  ├─ lib
│  │  │  │  └─ utils.ts
│  │  │  ├─ SurveyNavigationGuard.tsx
│  │  │  ├─ SurveyTestComponent.tsx
│  │  │  ├─ useModal.ts
│  │  │  ├─ utils
│  │  │  │  ├─ checkEqual.js
│  │  │  │  ├─ decodeJson.js
│  │  │  │  ├─ fetchPostcodeData.js
│  │  │  │  ├─ getObjectField.js
│  │  │  │  ├─ getObjectFieldFromDropdown.js
│  │  │  │  ├─ perygonApiRequest.js
│  │  │  │  ├─ perygonArraySum.js
│  │  │  │  ├─ registerFunction.js
│  │  │  │  ├─ setImageField.js
│  │  │  │  └─ validateJson.js
│  │  │  └─ WorkflowFormWrapper.tsx
│  │  ├─ svg
│  │  │  └─ HappinessLogoSvg.tsx
│  │  └─ tags
│  │     ├─ Tag.tsx
│  │     └─ TagsDisplay.tsx
│  ├─ hooks
│  │  ├─ useCarousel.tsx
│  │  ├─ useColor.tsx
│  │  ├─ useFetchClient.ts
│  │  └─ useMediaUploader.ts
│  ├─ lib
│  │  ├─ apiClient.tsx
│  │  ├─ dal.ts
│  │  └─ dashboardUtils.ts
│  ├─ middleware.ts
│  ├─ providers
│  │  ├─ ChakraThemeProvider.tsx
│  │  ├─ NextAuthProvider.tsx
│  │  ├─ Providers.tsx
│  │  ├─ TagsProvider.tsx
│  │  ├─ UserProvider.tsx
│  │  └─ WorkflowProvider.tsx
│  ├─ styles
│  │  ├─ fonts.css
│  │  └─ globals.css
│  ├─ theme
│  │  ├─ agChartStyles.ts
│  │  ├─ agGridStyles.ts
│  │  ├─ scrollBarThemes.ts
│  │  ├─ sjsPath
│  │  │  ├─ admin.ts
│  │  │  ├─ client-satisfaction.ts
│  │  │  ├─ enps.ts
│  │  │  └─ happiness.ts
│  │  └─ themes
│  │     ├─ base-theme
│  │     │  └─ baseTheme.ts
│  │     ├─ clients
│  │     │  ├─ DMR
│  │     │  │  └─ dmrDefaultTheme.ts
│  │     │  └─ prByWhitney
│  │     │     └─ prByWhitneyTheme.ts
│  │     ├─ perygon
│  │     │  ├─ perygonMinimal
│  │     │  │  ├─ colorPalette.ts
│  │     │  │  └─ perygonMinimalDark.ts
│  │     │  ├─ perygonMoonlight
│  │     │  │  ├─ colorPalette.ts
│  │     │  │  └─ perygonMoonlight.ts
│  │     │  ├─ perygonNeonSedulo
│  │     │  │  ├─ colorPalette.ts
│  │     │  │  └─ NeonSeduloTheme.ts
│  │     │  ├─ perygonTheme
│  │     │  │  ├─ colorPalette.ts
│  │     │  │  └─ perygonTheme.ts
│  │     │  └─ perygonThemeBlue
│  │     │     ├─ colorPalette.ts
│  │     │     └─ perygonThemeBlue.ts
│  │     └─ themeRegistry.ts
│  ├─ types
│  │  ├─ form.ts
│  │  ├─ next-auth.d.ts
│  │  ├─ surveyJs.ts
│  │  ├─ types.d.ts
│  │  ├─ user.ts
│  │  └─ workflowEngine.ts
│  └─ utils
│     ├─ constants
│     │  └─ subscriptionLimits.ts
│     ├─ functions
│     │  ├─ utils.ts
│     │  └─ workflow.ts
│     ├─ muiIconMapper.ts
│     └─ style
│        └─ style-utils.tsx
├─ tsconfig.json
└─ web.config

```