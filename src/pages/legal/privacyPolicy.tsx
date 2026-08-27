import LegalPage, { LegalSection } from "./LegalPage";

const sections: LegalSection[] = [
  {
    title: "Who we are",
    content: (
      <>
        <p>
          Red Lobos Group provides premium shortlet accommodation and curated
          in-stay experiences across the UK. In this policy, “Red Lobos Group,”
          “we,” “us,” and “our” refer to the service operating this website.
        </p>
        <p>
          For privacy questions, contact us at{" "}
          <a
            href="mailto:prisca@redlobosgroup.com"
            className="text-gold hover:underline"
          >
            prisca@redlobosgroup.com
          </a>
          .
        </p>
      </>
    ),
  },
  {
    title: "Information we collect",
    content: (
      <>
        <p>
          We may collect information you provide when you create an account,
          enquire with us, make a booking, request support, or subscribe to
          updates. This can include your name, email address, contact details,
          booking preferences, guest information, and messages you send us.
        </p>
        <p>
          We also receive booking and payment status information when you use
          our checkout. Card details are entered directly with our payment
          provider and are not stored by Red Lobos Group.
        </p>
        <p>
          When you browse the website, we may collect technical information
          such as your IP address, browser type, device information, and pages
          visited. We use cookies and similar technologies where needed to keep
          the site secure and remember your session.
        </p>
      </>
    ),
  },
  {
    title: "How we use your information",
    content: (
      <ul className="list-disc pl-5 space-y-2">
        <li>To create and manage your customer account.</li>
        <li>To process, confirm, and administer your reservation.</li>
        <li>To send booking confirmations, service messages, and support replies.</li>
        <li>To provide requested add-on experiences and coordinate your stay.</li>
        <li>To process payments, prevent fraud, and protect the website.</li>
        <li>To improve our properties, services, and website experience.</li>
        <li>To send marketing messages where you have agreed to receive them.</li>
      </ul>
    ),
  },
  {
    title: "Payments and service providers",
    content: (
      <p>
        Payments are processed by Stripe. Stripe may collect and process
        payment information under its own privacy policy and security
        standards. We may also use trusted providers for hosting, email
        delivery, authentication, analytics, and property or reservation
        administration. These providers receive only the information needed to
        provide their services and are expected to protect it.
      </p>
    ),
  },
  {
    title: "When we share information",
    content: (
      <p>
        We do not sell your personal information. We may share relevant
        information with service providers who help us operate the booking
        service, with property or experience partners when needed to fulfil
        your reservation, or where required by law, court order, fraud
        prevention, or the protection of our guests and business.
      </p>
    ),
  },
  {
    title: "How long we keep information",
    content: (
      <p>
        We keep account and booking information for as long as needed to
        provide the service, manage your relationship with us, resolve
        disputes, meet legal and accounting obligations, and enforce our
        agreements. When information is no longer needed, we securely delete
        it or anonymise it where appropriate.
      </p>
    ),
  },
  {
    title: "Your choices and rights",
    content: (
      <>
        <p>
          You may update information in your account, unsubscribe from
          marketing emails, or contact us to ask about access, correction,
          deletion, restriction, or portability of your personal information,
          subject to applicable law and legitimate record-keeping requirements.
        </p>
        <p>
          You can unsubscribe from promotional emails using the link in the
          message. Essential service and booking communications will still be
          sent when necessary.
        </p>
      </>
    ),
  },
  {
    title: "Security",
    content: (
      <p>
        We use reasonable technical and organisational measures to protect
        personal information. No online service can guarantee absolute
        security, so please keep your account credentials private and contact
        us promptly if you believe your account has been used without
        permission.
      </p>
    ),
  },
  {
    title: "Children’s privacy",
    content: (
      <p>
        Our booking service is intended for adults who can enter a contract.
        We do not knowingly collect personal information from children without
        appropriate consent. If you believe a child has provided information
        to us, please contact us so we can review and remove it where
        appropriate.
      </p>
    ),
  },
  {
    title: "Changes to this policy",
    content: (
      <p>
        We may update this policy as our services, technology, or legal
        obligations change. The updated version will be posted on this page
        with a new “Last updated” date. Material changes may also be
        communicated through the website or by email where appropriate.
      </p>
    ),
  },
];

export default function PrivacyPolicy(): JSX.Element {
  return (
    <LegalPage
      title="Privacy Policy"
      intro="This Privacy Policy explains how Red Lobos Group collects, uses, stores, and protects information when you browse our website, create an account, contact us, or book a property or experience."
      lastUpdated="27 August 2026"
      sections={sections}
    />
  );
}