import LegalPage, { LegalSection } from "./LegalPage";

const sections: LegalSection[] = [
  {
    title: "About these terms",
    content: (
      <p>
        These Terms and Conditions govern your use of the Red Lobos Group
        website and any booking made through it. By using the website or
        submitting a reservation, you confirm that you have read and agree to
        these terms. If you do not agree, please do not use the booking
        service.
      </p>
    ),
  },
  {
    title: "Our accommodation and experiences",
    content: (
      <p>
        Property descriptions, photographs, amenities, capacity, prices, and
        experience details are provided to help you choose a stay. We aim to
        keep them accurate and up to date, but furnishings, layouts, amenities,
        and availability may change. The specific property, dates, guests,
        price, and booking conditions shown in your confirmation form the basis
        of your reservation.
      </p>
    ),
  },
  {
    title: "Eligibility and account security",
    content: (
      <p>
        You must be legally able to enter a contract to make a booking. You
        are responsible for providing accurate information and keeping your
        account login details secure. Please tell us promptly if you discover
        unauthorised use of your account. We may suspend or close an account
        where information is misleading, these terms are breached, or the
        service needs to be protected.
      </p>
    ),
  },
  {
    title: "Making a booking",
    content: (
      <>
        <p>
          A reservation request is not confirmed until payment has been
          successfully completed and we have issued a booking confirmation.
          Dates are subject to availability until that point. We may contact
          you if information is missing or a booking cannot be accepted.
        </p>
        <p>
          You must provide the correct guest count and contact details. The
          person making the booking is responsible for everyone in their party
          and for sharing the relevant property rules with them.
        </p>
      </>
    ),
  },
  {
    title: "Prices and payment",
    content: (
      <>
        <p>
          Prices are shown in the currency displayed at checkout and may
          include the accommodation rate, service fees, taxes, or other
          charges identified before you pay. We take reasonable care to ensure
          pricing is accurate and will contact you if an obvious error affects
          your booking.
        </p>
        <p>
          Payments are processed securely by Stripe. By continuing to checkout,
          you authorise the payment method you provide for the total shown. A
          reservation is not held or confirmed if payment is declined,
          reversed, or remains incomplete.
        </p>
      </>
    ),
  },
  {
    title: "Changes, cancellations, and refunds",
    content: (
      <p>
        The cancellation, change, and refund terms applicable to your
        reservation are the terms shown during checkout or in your booking
        confirmation. If you need to change or cancel, contact us as soon as
        possible at{" "}
        <a
          href="mailto:prisca@redlobosgroup.com"
          className="text-gold hover:underline"
        >
          prisca@redlobosgroup.com
        </a>
        . Any refund will be made to the original payment method where
        possible. We may cancel and refund a booking if a property becomes
        unavailable, unsafe, or materially affected by an error; we will
        explain the available options.
      </p>
    ),
  },
  {
    title: "Check-in, check-out, and property rules",
    content: (
      <ul className="list-disc pl-5 space-y-2">
        <li>Follow the check-in and check-out instructions provided for your stay.</li>
        <li>Only the confirmed number of guests may stay at the property.</li>
        <li>Respect neighbours, building rules, quiet hours, and applicable laws.</li>
        <li>Do not use a property for unlawful activity, parties, or events unless expressly authorised.</li>
        <li>Do not smoke or bring prohibited animals where the property rules do not allow them.</li>
        <li>Leave the property reasonably clean and return keys, access devices, and supplied items.</li>
      </ul>
    ),
  },
  {
    title: "Damage, loss, and additional charges",
    content: (
      <p>
        You are responsible for damage, loss, excessive cleaning, missing
        items, or other costs caused by you or members of your party, except
        for reasonable wear and tear. We may request payment for verified
        costs and will provide details where appropriate. Please report
        problems promptly so we have an opportunity to help.
      </p>
    ),
  },
  {
    title: "Add-on experiences",
    content: (
      <p>
        Add-on experiences are subject to their own availability, timing,
        safety requirements, and any instructions provided by the experience
        provider. An experience may be rescheduled or substituted when needed
        because of safety, supplier, venue, or operational issues. Any
        experience-specific change or cancellation terms shown at booking will
        apply.
      </p>
    ),
  },
  {
    title: "Our responsibilities",
    content: (
      <p>
        We will provide the booking service with reasonable care and skill.
        We are not responsible for events outside our reasonable control,
        including severe weather, government action, utility interruption,
        building emergencies, supplier failure, or other force majeure events.
        Nothing in these terms limits liability that cannot legally be limited,
        including liability for fraud or personal injury caused by negligence.
      </p>
    ),
  },
  {
    title: "Website use and content",
    content: (
      <p>
        You may use the website for genuine personal booking and information
        purposes. Do not interfere with the website, attempt unauthorised
        access, scrape or copy content at scale, upload harmful code, or use
        another person’s information. Our names, branding, text, images, and
        other content belong to us or our licensors and may not be reused
        without permission.
      </p>
    ),
  },
  {
    title: "Privacy",
    content: (
      <p>
        Our{" "}
        <a href="/privacy-policy" className="text-gold hover:underline">
          Privacy Policy
        </a>{" "}
        explains how we process personal information connected with the
        website, accounts, bookings, and support.
      </p>
    ),
  },
  {
    title: "Governing law and contact",
    content: (
      <p>
        These terms are governed by the laws of England and Wales, and the
        courts of England and Wales will have jurisdiction, subject to any
        mandatory consumer rights that apply to you. For questions about a
        booking or these terms, contact Red Lobos Group at
        prisca@redlobosgroup.com or write to 71–75 Shelton Street, Covent
        Garden, London, WC2H 9JQ.
      </p>
    ),
  },
];

export default function TermsAndConditions(): JSX.Element {
  return (
    <LegalPage
      title="Terms & Conditions"
      intro="These terms set out the rules for using the Red Lobos Group website and booking our shortlet properties and curated experiences."
      lastUpdated="27 August 2026"
      sections={sections}
    />
  );
}