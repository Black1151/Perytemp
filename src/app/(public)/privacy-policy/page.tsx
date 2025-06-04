import React from "react";
import {
  Container,
  Heading,
  Text,
  UnorderedList,
  ListItem,
  Box,
  Stack,
  Table,
  Tbody,
  Tr,
  Td,
} from "@chakra-ui/react";
import PublicLayout from "@/components/public/PublicLayout";
import { LetterFlyIn } from "@/components/animations/text/LetterFlyIn";
import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <PublicLayout>
      <Container maxW="container.lg" py={[4, 8]} px={[2, 4]}>
        {/* MAIN LAYOUT: Two Columns */}
        <Stack direction={["column", "row"]} spacing={8} align="flex-start">
          {/* LEFT COLUMN: Policy Text */}
          <Box flex="1" maxW={"100%"} overflowX={"hidden"}>
            {/* Heading / Dates */}
            <Heading as="h1" size={["xl", "2xl"]} mb={4}>
              Privacy Policy
            </Heading>

            <Text fontWeight="bold">Effective Date: 01/02/2025</Text>
            <Text fontWeight="bold" mb={4}>
              Last Updated: 07/02/2025
            </Text>

            <Text fontSize={["sm", "md"]} mb={4}>
              <strong>Perygon</strong> (&quot;Sedulo&quot;, &quot;we&quot;,
              &quot;us&quot;, or &quot;our&quot;) respects your privacy and is
              committed to protecting your personal information. This Privacy
              Policy explains how we collect, use, disclose, and safeguard your
              information.
            </Text>

            <Text fontSize={["sm", "md"]} mb={4}>
              The General Data Protection Regulation (GDPR) became effective on
              25th May 2018, and all organisations that process personal data
              must ensure they are compliant with the regulations and
              principles.
            </Text>

            <Text fontSize={["sm", "md"]} mb={2}>
              We must make sure that:
            </Text>
            <UnorderedList pl={5} mb={4}>
              <ListItem>
                We are lawful, fair and transparent in the way that data is
                processed.
              </ListItem>
              <ListItem>Personal data is used for a specific purpose.</ListItem>
              <ListItem>We only record the data that is required.</ListItem>
              <ListItem>We have a duty to keep the data accurate.</ListItem>
              <ListItem>Data is only kept for as long as is required.</ListItem>
              <ListItem>All data is stored securely.</ListItem>
            </UnorderedList>

            <Text fontSize={["sm", "md"]} mb={4}>
              This Privacy Policy will detail how we comply with the above
              principles as well as your rights as the data owner.
            </Text>

            {/* WHO ARE WE? */}
            <Heading
              as="h2"
              size={["md", "lg"]}
              mt={6}
              mb={2}
              color={"primary"}
            >
              1. WHO ARE WE?
            </Heading>
            <Text fontSize={["sm", "md"]} mb={2}>
              Sedulo Accountants Limited is a Financial Services Company based
              in the North of England and London. We specialise in providing a
              suite of <strong>Core Services</strong> including but not limited
              to Accountancy and Tax Advisory services along with Payroll,
              Funding and Wealth Management and Business Growth Consultancy.
            </Text>

            <Text fontWeight="bold" mb={2}>
              Our App:
            </Text>
            <UnorderedList pl={5} mb={4}>
              <ListItem>
                <strong>Perygon</strong> is developed and operated by Sedulo
                Accountants Limited, part of the above group, that provides
                business growth tools.
              </ListItem>
            </UnorderedList>

            {/* WHAT DATA DO WE COLLECT */}
            <Heading
              as="h2"
              size={["md", "lg"]}
              mt={6}
              mb={2}
              color={"primary"}
            >
              2. WHAT DATA DO WE COLLECT?
            </Heading>
            <Text fontSize={["sm", "md"]} mb={4}>
              Personal data refers to any data that can be used to identify a
              natural person, and we only process personal information that is
              required for us to carry out our business dealings for the
              customer.
            </Text>
            <Text mt={6} mb={2} fontWeight="bold">
              For Perygon App Users
            </Text>
            <Text fontSize={["sm", "md"]} mb={2}>
              When you use our Apps, we may collect the following types of
              information:
            </Text>

            <Text fontSize={["sm", "md"]} mb={2} fontWeight="bold">
              a) Personal Information
            </Text>
            <UnorderedList pl={5} mb={4}>
              <ListItem fontSize={["sm", "md"]}>
                <strong>SSO Login Data</strong> – If you sign in using Google or
                Microsoft SSO, we may receive your email address, name, and
                profile picture (subject to provider permissions).
              </ListItem>
              <ListItem fontSize={["sm", "md"]}>
                <strong>Email and password </strong> login for the application.
              </ListItem>
              <ListItem fontSize={["sm", "md"]}>
                <strong>Account Details</strong> – Information you provide when
                setting up or managing your profile.
              </ListItem>
              <ListItem fontSize={["sm", "md"]}>
                <strong>Contact Information</strong> – If you provide contact
                details for support or communication.
              </ListItem>
              <ListItem fontSize={["sm", "md"]}>
                <strong>User-Generated Content</strong> – Any data or content
                you voluntarily provide in the App.
              </ListItem>
            </UnorderedList>

            <Text fontSize={["sm", "md"]} mb={2} fontWeight="bold">
              b) Non-Personal Information
            </Text>
            <UnorderedList pl={5} mb={4}>
              <ListItem fontSize={["sm", "md"]}>
                <strong>Device Information</strong> – Including model, operating
                system version, and unique device identifiers.
              </ListItem>
              <ListItem fontSize={["sm", "md"]}>
                <strong>Usage Data</strong> – Information about how you interact
                with our App, such as features used and time spent.
              </ListItem>
              <ListItem fontSize={["sm", "md"]}>
                <strong>Analytics Data</strong> – To improve our services and
                enhance user experience.
              </ListItem>
            </UnorderedList>
            <Text fontSize={["sm", "md"]} mb={2} fontWeight="bold">
              For Core Service Clients
            </Text>
            <Text fontSize={["sm", "md"]} mb={4}>
              Depending on your relationship with us and the services we are
              providing, we may collect a combination of the information
              detailed below (please note this list is not exhaustive):
            </Text>
            <Table style={{ fontSize: "sm" }}>
              <Tbody>
                <Tr>
                  <Td p={[1, 2]}>
                    <Text fontSize={["xs", "sm"]}>Company address</Text>
                  </Td>
                  <Td p={[1, 2]}>
                    <Text fontSize={["xs", "sm"]}>Personal address</Text>
                  </Td>
                  <Td p={[1, 2]}>
                    <Text fontSize={["xs", "sm"]}>NI number</Text>
                  </Td>
                </Tr>
                <Tr>
                  <Td p={[1, 2]}>
                    <Text fontSize={["xs", "sm"]}>Date of birth</Text>
                  </Td>
                  <Td p={[1, 2]}>
                    <Text fontSize={["xs", "sm"]}>
                      Bank account information
                    </Text>
                  </Td>
                  <Td p={[1, 2]}>
                    <Text fontSize={["xs", "sm"]}>Personal/sales invoices</Text>
                  </Td>
                </Tr>
                <Tr>
                  <Td p={[1, 2]}>
                    <Text fontSize={["xs", "sm"]}>Copies of ID</Text>
                  </Td>
                  <Td p={[1, 2]}>
                    <Text fontSize={["xs", "sm"]}>Contact number</Text>
                  </Td>
                  <Td p={[1, 2]}>
                    <Text fontSize={["xs", "sm"]}>Website</Text>
                  </Td>
                </Tr>
                <Tr>
                  <Td p={[1, 2]}>
                    <Text fontSize={["xs", "sm"]}>Email address</Text>
                  </Td>
                  <Td p={[1, 2]}>
                    <Text fontSize={["xs", "sm"]}>Job titles</Text>
                  </Td>
                  <Td p={[1, 2]}>
                    <Text fontSize={["xs", "sm"]}>Salary details</Text>
                  </Td>
                </Tr>
                <Tr>
                  <Td p={[1, 2]}>
                    <Text fontSize={["xs", "sm"]}>
                      Student loan information
                    </Text>
                  </Td>
                  <Td p={[1, 2]}>
                    <Text fontSize={["xs", "sm"]}>Gender</Text>
                  </Td>
                  <Td p={[1, 2]}>
                    <Text fontSize={["xs", "sm"]}>Marital status</Text>
                  </Td>
                </Tr>
                <Tr>
                  <Td p={[1, 2]}>
                    <Text fontSize={["xs", "sm"]}>Nationality</Text>
                  </Td>
                  <Td p={[1, 2]}>
                    <Text fontSize={["xs", "sm"]}>
                      Criminal record information
                    </Text>
                  </Td>
                  <Td p={[1, 2]}>
                    <Text fontSize={["xs", "sm"]}>
                      Personal Assets and liabilities
                    </Text>
                  </Td>
                </Tr>
              </Tbody>
            </Table>

            <Text fontSize={["sm", "md"]} my={4}>
              We process relevant and required information regarding you, your
              company and/or employees to accurately provide services to you.
              The types of information listed above will only be obtained if it
              is directly applicable to your situation and the services
              requested from us.
            </Text>

            <Text fontSize={["sm", "md"]} my={4}>
              To enquire about any personal information we may retain about you,
              please email us at{" "}
              <a href="mailto:gdpr@perygon.co.uk">
                <Text as={"span"} color={"primary"}>
                  gdpr@perygon.co.uk
                </Text>
              </a>
            </Text>

            {/* HOW DO WE COLLECT YOUR DATA */}
            <Heading
              as="h2"
              size={["md", "lg"]}
              mt={6}
              mb={2}
              color={"primary"}
            >
              3. HOW DO WE COLLECT YOUR DATA?
            </Heading>
            <Text fontSize={["sm", "md"]} mb={4}>
              The data we hold is legitimately gained either through direct
              contact with the customer (to ensure accurate and relevant
              information is given with full consent) or through a
              GDPR-compliant third party (e.g., lead generation). We will not
              hold data that has not been scrutinised as GDPR-compliant. Ways we
              collect data include but are not limited to:
            </Text>

            <Text>
              <Text as={"strong"}>For Perygon App users</Text> - Via forms on
              the app we collect data for the following reasons:
            </Text>
            <UnorderedList pl={5} mb={4}>
              <ListItem fontSize={["sm", "md"]}>
                To authenticate users via SSO login (Google/Microsoft) or email
                and password.
              </ListItem>
              <ListItem fontSize={["sm", "md"]}>
                To operate and enhance our App’s features.
              </ListItem>
              <ListItem fontSize={["sm", "md"]}>
                To personalise user experience based on preferences and
                interactions.
              </ListItem>
              <ListItem fontSize={["sm", "md"]}>
                To provide customer support and respond to enquiries.
              </ListItem>
              <ListItem fontSize={["sm", "md"]}>
                To monitor app performance and analyse trends.
              </ListItem>
              <ListItem fontSize={["sm", "md"]}>
                To comply with legal and regulatory obligations.
              </ListItem>
            </UnorderedList>

            <Text fontWeight="bold">For Core Service Clients:</Text>
            <UnorderedList pl={5} mb={4}>
              <ListItem fontSize={["sm", "md"]}>
                Receiving calls from you in relation to any services within your
                business.
              </ListItem>
              <ListItem fontSize={["sm", "md"]}>
                Conducting any relevant service for your business.
              </ListItem>
              <ListItem fontSize={["sm", "md"]}>
                Team members contacting you by means of business development
                activity.
              </ListItem>
              <ListItem fontSize={["sm", "md"]}>
                Attending business networking events with clients.
              </ListItem>
              <ListItem fontSize={["sm", "md"]}>
                When you have been identified as a reference provider.
              </ListItem>
            </UnorderedList>

            {/* WHY DO WE COLLECT YOUR DATA? */}
            <Heading
              as="h2"
              size={["md", "lg"]}
              mt={6}
              mb={2}
              color={"primary"}
            >
              4. WHY DO WE COLLECT YOUR DATA?
            </Heading>
            <Text fontWeight="bold">For Perygon App Users:</Text>
            <Text fontSize={["sm", "md"]} mb={4}>
              To provide a suite of business maturity tools, that require a
              certain level of personalisation and advanced analytics.
            </Text>
            <Text fontWeight="bold">For Core Service Clients:</Text>
            <Text fontSize={["sm", "md"]} mb={4}>
              Our core business activity is to provide clients with financial
              advice and accountancy services. To accomplish this, we gather
              personal information regarding the relevant contact at the
              business including: full name, position within the business, email
              address, phone contact details, and other information freely
              provided by the contact.
            </Text>

            {/* HOW DO WE USE YOUR DATA? */}
            <Heading
              as="h2"
              size={["md", "lg"]}
              mt={6}
              mb={2}
              color={"primary"}
            >
              5. HOW DO WE USE YOUR DATA?
            </Heading>

            <Text fontWeight="bold" mb={2}>
              For Perygon App Users:
            </Text>
            <UnorderedList pl={5} mb={4}>
              <ListItem fontSize={["sm", "md"]}>
                To authenticate users via SSO login (Google/Microsoft).
              </ListItem>
              <ListItem fontSize={["sm", "md"]}>
                To authenticate users via email and password for the
                application.
              </ListItem>
              <ListItem fontSize={["sm", "md"]}>
                To operate and enhance our App’s features.
              </ListItem>
              <ListItem fontSize={["sm", "md"]}>
                To personalise user experience based on preferences and
                interactions.
              </ListItem>
              <ListItem fontSize={["sm", "md"]}>
                To provide customer support and respond to inquiries.
              </ListItem>
              <ListItem fontSize={["sm", "md"]}>
                To monitor app performance and analyse trends.
              </ListItem>
            </UnorderedList>

            <Text fontWeight="bold" mb={2}>
              For Core Service Clients:
            </Text>
            <Text fontSize={["sm", "md"]} mb={4}>
              In order to provide the best service, your data may be used in one
              or more of the following ways:
            </Text>
            <UnorderedList pl={5} mb={4}>
              <ListItem fontSize={["sm", "md"]}>
                Storing and updating your information on our client systems so
                that we can contact you in relation to business activity.
              </ListItem>
              <ListItem fontSize={["sm", "md"]}>
                Making contact in relation to business activity, either by
                portal, email, telephone, or in person.
              </ListItem>
              <ListItem fontSize={["sm", "md"]}>
                Sending marketing information about events we are holding that
                may be of interest to you.
              </ListItem>
              <ListItem fontSize={["sm", "md"]}>
                Sending marketing information in relation to the services we can
                provide.
              </ListItem>
              <ListItem fontSize={["sm", "md"]}>
                Keeping records of conversations, emails, and meetings to refer
                to if needed in relation to any dispute.
              </ListItem>
            </UnorderedList>
            <Text fontSize={["sm", "md"]} mb={4}>
              For some of the above activities, your consent is required. For
              more information on how we get and manage your consent, please
              refer to the <strong>Consent</strong> section below.
            </Text>

            <Heading as="h3" size="md" mt={4} mb={2}>
              Children&apos;s Privacy
            </Heading>
            <Text fontSize={["sm", "md"]} mb={4}>
              Our Apps are not intended for children under 13 years of age. We
              do not knowingly collect personal data from minors.
            </Text>

            {/* WHO DO WE SHARE YOUR DATA WITH? */}
            <Heading
              as="h2"
              size={["md", "lg"]}
              mt={6}
              mb={2}
              color={"primary"}
            >
              6. WHO DO WE SHARE YOUR DATA WITH?
            </Heading>
            <Text fontSize={["sm", "md"]} mb={4}>
              In some circumstances, we may need to share your details with
              third parties for us to be able to provide you with our services.
              This would include:
            </Text>
            <UnorderedList pl={5} mb={4}>
              <ListItem fontSize={["sm", "md"]}>
                Sedulo Member firms and associated trading names.
              </ListItem>
              <ListItem fontSize={["sm", "md"]}>
                Third-Party Services that support us as we provide our services
                (e.g., telecommunication systems, IT support systems, archiving
                services, document production services, Cloud-based software
                systems and hosts, and authentication services such as Google,
                Microsoft, Apple).
              </ListItem>
            </UnorderedList>
            <Text fontSize={["sm", "md"]} mb={4}>
              Sedulo will not transfer the personal information you provide to
              any third parties for their own direct marketing use.
            </Text>

            {/* HOW DO WE SAFEGUARD YOUR DATA? */}
            <Heading
              as="h2"
              size={["md", "lg"]}
              mt={6}
              mb={2}
              color={"primary"}
            >
              7. HOW DO WE SAFEGUARD YOUR DATA?
            </Heading>
            <Text fontSize={["sm", "md"]} mb={4}>
              Your data is of the utmost importance to us and as such we ensure
              all relevant security is in place to keep your data safe and
              protected from any potential threats. For more information on how
              we do this, email our GDPR team,
              <a href="mailto:gdpr@perygon.co.uk">
                <Text as={"strong"} color={"primary"}>
                  {" "}
                  gdpr@perygon.co.uk
                </Text>
              </a>
            </Text>
            <Text fontSize={["sm", "md"]} mb={4}>
              Under our legitimate business interest or for legal obligations,
              certain information has a legal requirement to be kept for a
              predetermined amount of time, regardless of active services
              retained with us:
            </Text>
            <UnorderedList pl={5} mb={4}>
              <ListItem fontSize={["sm", "md"]}>
                HMRC records – 6 years
              </ListItem>
              <ListItem fontSize={["sm", "md"]}>
                Payroll information – 7 years
              </ListItem>
              <ListItem fontSize={["sm", "md"]}>
                Accounts information – 7 years
              </ListItem>
              <ListItem fontSize={["sm", "md"]}>
                Pension transfer – 7 years
              </ListItem>
              <ListItem fontSize={["sm", "md"]}>
                Final salary pension transfer – kept indefinitely
              </ListItem>
              <ListItem fontSize={["sm", "md"]}>
                Perygon App information will be kept for as long as necessary to
                provide our services and to meet any contractual obligations
              </ListItem>
            </UnorderedList>

            {/* YOUR RIGHTS */}
            <Heading
              as="h2"
              size={["md", "lg"]}
              mt={6}
              mb={2}
              color={"primary"}
            >
              8. YOUR RIGHTS
            </Heading>
            <Text fontSize={["sm", "md"]} mb={4}>
              GDPR provides the following rights:
            </Text>

            {/* RIGHT TO BE INFORMED */}
            <Heading as="h3" size="md" mt={4} mb={2}>
              The Right to Be Informed
            </Heading>
            <Text fontSize={["sm", "md"]} mb={4}>
              You have the right to be informed about the collection and use of
              your personal data. All this information is provided by means of
              this Privacy Notice.
            </Text>

            {/* RIGHT OF ACCESS */}
            <Heading as="h3" size="md" mt={4} mb={2}>
              The Right of Access
            </Heading>
            <Text fontSize={["sm", "md"]} mb={4}>
              You have the right to access your personal data and any
              supplementary information. This is known as a Data Subject Access
              Request (DSAR). When received by our designated Data Controller,
              we are legally required to provide this information within one
              month. This information will be provided free of charge unless the
              request is manifestly unfounded or excessive.
            </Text>

            {/* RIGHT TO RECTIFICATION */}
            <Heading as="h3" size="md" mt={4} mb={2}>
              The Right to Rectification
            </Heading>
            <Text fontSize={["sm", "md"]} mb={4}>
              You have the right to have any inaccurate personal data rectified
              if incomplete or incorrect. If we feel the request is manifestly
              unfounded or excessive, particularly if it is repetitive, we can
              charge a fee or refuse the request. If either of these apply, we
              will provide you with our reasons for such action.
            </Text>

            {/* RIGHT TO ERASURE */}
            <Heading as="h3" size="md" mt={4} mb={2}>
              The Right to Erasure
            </Heading>
            <Text fontSize={["sm", "md"]} mb={4}>
              Also known as the right to be forgotten, you have the right to
              have your personal data erased if:
            </Text>
            <UnorderedList pl={5} mb={4}>
              <ListItem fontSize={["sm", "md"]}>
                The data is no longer necessary for the reason it was originally
                collected or processed.
              </ListItem>
              <ListItem fontSize={["sm", "md"]}>
                Your data has been processed for legitimate interest and you
                object to the processing of your data, and we cannot provide an
                overriding legitimate interest to continue processing.
              </ListItem>
              <ListItem fontSize={["sm", "md"]}>
                The data has been processed unlawfully (in breach of GDPR).
              </ListItem>
              <ListItem fontSize={["sm", "md"]}>
                Data must be erased to comply with a legal obligation.
              </ListItem>
            </UnorderedList>
            <Text fontSize={["sm", "md"]} mb={4}>
              If we process your data for one of the following reasons, the
              right to erasure does not apply:
            </Text>
            <UnorderedList pl={5} mb={4}>
              <ListItem fontSize={["sm", "md"]}>
                To exercise the right of freedom of expression and information.
              </ListItem>
              <ListItem fontSize={["sm", "md"]}>
                To comply with a legal obligation.
              </ListItem>
              <ListItem fontSize={["sm", "md"]}>
                For the performance of a task carried out in the public
                interest.
              </ListItem>
              <ListItem fontSize={["sm", "md"]}>
                For archiving purposes in the public interest or statistical
                purposes.
              </ListItem>
              <ListItem fontSize={["sm", "md"]}>
                In the defence of a claim.
              </ListItem>
            </UnorderedList>

            {/* RIGHT TO RESTRICT PROCESSING */}
            <Heading as="h3" size="md" mt={4} mb={2}>
              The Right to Restrict Processing
            </Heading>
            <Text fontSize={["sm", "md"]} mb={4}>
              You have the right to restrict the processing of your data in
              certain circumstances. When processing is restricted we may store
              enough information to ensure future restriction is respected. We
              will stop processing your data if:
            </Text>
            <UnorderedList pl={5} mb={4}>
              <ListItem fontSize={["sm", "md"]}>
                You do not agree with the accuracy of your personal data.
              </ListItem>
              <ListItem fontSize={["sm", "md"]}>
                The data has been unlawfully processed.
              </ListItem>
              <ListItem fontSize={["sm", "md"]}>
                To establish or defend a legal claim.
              </ListItem>
              <ListItem fontSize={["sm", "md"]}>
                You object to our legal ground for processing your data.
              </ListItem>
            </UnorderedList>
            <Text fontSize={["sm", "md"]} mb={4}>
              We can only continue to process your data when the above has been
              resolved, and we will inform you before any restriction is lifted.
            </Text>
            <Text fontSize={["sm", "md"]} mb={4}>
              If your data is restricted it can only be retained if:
            </Text>
            <UnorderedList pl={5} mb={4}>
              <ListItem fontSize={["sm", "md"]}>
                You give your consent to processing.
              </ListItem>
              <ListItem fontSize={["sm", "md"]}>
                It is in defence of a legal claim.
              </ListItem>
              <ListItem fontSize={["sm", "md"]}>
                It is for the protection of another person.
              </ListItem>
              <ListItem fontSize={["sm", "md"]}>
                It is for reasons of important public interest.
              </ListItem>
            </UnorderedList>

            {/* RIGHT TO DATA PORTABILITY */}
            <Heading as="h3" size="md" mt={4} mb={2}>
              The Right to Data Portability
            </Heading>
            <Text fontSize={["sm", "md"]} mb={4}>
              You have the right to transfer your details across different
              services. This right only applies if:
            </Text>
            <UnorderedList pl={5} mb={4}>
              <ListItem fontSize={["sm", "md"]}>
                Data that has been provided to a controller by an individual.
              </ListItem>
              <ListItem fontSize={["sm", "md"]}>
                Processing is based on consent or for the performance of a
                contract.
              </ListItem>
              <ListItem fontSize={["sm", "md"]}>
                Processing is carried out by automated means.
              </ListItem>
            </UnorderedList>
            <Text fontSize={["sm", "md"]} mb={4}>
              When we receive a portability request, we must respond within one
              month of the Data Controller being notified, and no fee is
              applicable. We must provide the information in a structured,
              commonly used, and machine-readable form.
            </Text>

            {/* RIGHT TO OBJECT */}
            <Heading as="h3" size="md" mt={4} mb={2}>
              The Right to Object
            </Heading>
            <Text fontSize={["sm", "md"]} mb={4}>
              You can object to the processing of your data when it is processed
              under one of the following reasons:
            </Text>
            <UnorderedList pl={5} mb={4}>
              <ListItem fontSize={["sm", "md"]}>
                Our legitimate interest.
              </ListItem>
              <ListItem fontSize={["sm", "md"]}>
                Performance of a task in the public interest/exercise of
                official authority.
              </ListItem>
              <ListItem fontSize={["sm", "md"]}>Direct marketing.</ListItem>
              <ListItem fontSize={["sm", "md"]}>
                Processing for scientific/historical research or statistical
                purposes.
              </ListItem>
            </UnorderedList>
            <Text fontSize={["sm", "md"]} mb={4}>
              Within one month of notification of this request, we must stop
              processing your data unless:
            </Text>
            <UnorderedList pl={5} mb={4}>
              <ListItem fontSize={["sm", "md"]}>
                We can demonstrate compelling legitimate grounds for processing
                which override your interest.
              </ListItem>
              <ListItem fontSize={["sm", "md"]}>
                It is being processed for the establishment, exercise, or
                defence of a legal claim.
              </ListItem>
            </UnorderedList>
            <Text fontSize={["sm", "md"]} mb={4}>
              If your data has been shared with a third party and you request
              one of your rights listed above, we will notify them and act upon
              the requirements of your request unless this is not possible or
              involves a disproportionate effort.
            </Text>

            <Text fontSize={["sm", "md"]} mb={4}>
              If you would like to delete your account and associated data
              please follow the instructions here:{" "}
              <Link href={"/delete-my-data"}>
                <Text
                  as={"span"}
                  color={"primary"}
                  fontWeight={"bold"}
                  _hover={{ textDecoration: "underline" }}
                >
                  Delete my data
                </Text>
              </Link>
            </Text>

            {/* CONSENT */}
            <Heading
              as="h2"
              size={["md", "lg"]}
              mt={6}
              mb={2}
              color={"primary"}
            >
              9. CONSENT
            </Heading>
            <Text fontSize={["sm", "md"]} mb={4}>
              As a business, and to comply with Article 6 of GDPR, we have
              agreed that the legal basis for processing your data will be
              (depending on your relationship with us) either &quot;Legitimate
              Interest&quot; or &quot;Contract.&quot; As well as complying with
              GDPR in relation to direct marketing, we must also comply with The
              Privacy and Electronic Communications Regulations (PECR).
            </Text>
            <Text fontSize={["sm", "md"]} mb={4}>
              However, in certain circumstances, we are required to have your
              consent to perform certain activities. This consent can be given
              in the form of an opt-in or soft opt-in option. We must ensure
              your consent is freely given, you understand what you are
              consenting to, and you are able to opt-out or opt-in at any time.
            </Text>
            <Text fontSize={["sm", "md"]} mb={4}>
              You can opt in or out verbally during any client meeting. If you
              have opted in and wish to opt out, you can click the link provided
              in one of our marketing emails or contact us using the methods
              listed below.
            </Text>

            {/* CONTACT DETAILS */}
            <Heading
              as="h2"
              size={["md", "lg"]}
              mt={6}
              mb={2}
              color={"primary"}
            >
              10. CONTACT DETAILS
            </Heading>
            <Text fontSize={["sm", "md"]} mb={4}>
              If you need to contact us for any reason regarding your data, our
              details are:
            </Text>
            <Box mb={4}>
              <Text fontSize={["sm", "md"]}>The Data Controller</Text>
              <Text fontSize={["sm", "md"]}>Sedulo Accountants Limited</Text>
              <Text fontSize={["sm", "md"]}>62-66 Deansgate</Text>
              <Text fontSize={["sm", "md"]}>Manchester</Text>
              <Text fontSize={["sm", "md"]}>M3 2EN</Text>
              <Text fontSize={["sm", "md"]} mt={2}>
                <strong>Contact Number:</strong> 0333 222 444 5
              </Text>
              <Text fontSize={["sm", "md"]} mt={2}>
                <strong>Email:</strong>{" "}
                <a href="mailto:gdpr@perygon.co.uk">
                  <Text as={"span"} color={"primary"}>
                    gdpr@perygon.co.uk
                  </Text>
                </a>
              </Text>
            </Box>
            <Text fontSize={["sm", "md"]} mb={4}>
              Please title any post and/or email “Perygon - In relation to GDPR”
              to ensure it is passed to the correct person. Emails or calls made
              to other employees outside of these methods may not promptly reach
              the Data Controller to issue a response.
            </Text>
          </Box>

          {/* RIGHT COLUMN: Sticky or Branding (Optional) */}
          <Box
            flex="1"
            textAlign="center"
            position="sticky"
            top="1rem"
            display={["none", "none", "none", "block"]}
          >
            <LetterFlyIn
              as="span"
              fontSize="102px"
              fontWeight={200}
              color="primary"
            >
              Your Data
            </LetterFlyIn>
          </Box>
        </Stack>
      </Container>
    </PublicLayout>
  );
}
