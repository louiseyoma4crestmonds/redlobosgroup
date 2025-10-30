import romantic from "../../public/romantic-dinner.jpg";
import professional from "../../public/podcast-studio.jpg";
import proposal from "../../public/proposal-setup.jpg";
import paint from "../../public/paint-and-sip-event.jpg";
import details_romantic from "../../public/details-romantic.png";
import details_content from "../../public/home-studio.webp";
import details_proposal from "../../public/proposal-setup-2.jpg";
import details_paint_sip from "../../public/Paint+and+sip+slider.jpg";
import { StaticImageData } from "next/image";

export interface AddOnBrief {
  id: number;
  image: StaticImageData;
  description: string;
  btn_text: string;
}

export interface AddOnDetail {
  id: number;
  title: string;
  subtitle_text: string;
  image: StaticImageData;
  description: string;
}

export const addOnBrief: AddOnBrief[] = [
  {
    id: 1,
    image: romantic,
    description: "ROMANTIC DINNERS & VALENTINE STAY SETUPS",
    btn_text: "CREATE YOUR PERFECT NIGHT",
  },
  {
    id: 2,
    image: professional,
    description: "PROFESSIONAL SETUPS FOR CONTENT CREATION & PODCASTS",
    btn_text: "SCHEDULE YOUR SESSION",
  },
  {
    id: 3,
    image: proposal,
    description: "CURATED PROPOSAL SETUPS",
    btn_text: "SCHEDULE YOUR SESSION",
  },
  {
    id: 4,
    image: paint,
    description: "FUN PAINT AND SIP EVENTS",
    btn_text: "JOIN THE FUN",
  },
];

export const addOnDetails: AddOnDetail[] = [
  {
    id: 1,
    title: "Romantic Stay Setup For You",
    subtitle_text: "Let's plan a romantic night together",
    image: details_romantic,
    description:
      "Enjoy a cozy and intimate date with a warm, romantic atmosphere. With candlelight, rose petals, and a touch of technology, this special evening is designed to be both elegant and relaxing. A perfect setting for us to connect and unwind",
  },
  {
    id: 2,
    title: "Setups for Content Creation & Podcasts",
    subtitle_text: "Come and let us help bring your story to life",
    image: details_content,
    description:
      "Enjoy a cozy and intimate date with a warm, romantic atmosphere. With candlelight, rose petals, and a touch of technology, this special evening is designed to be both elegant and relaxing. A perfect setting for us to connect and unwind",
  },
  {
    id: 3,
    title: "Curated Proposal Setups",
    subtitle_text: "Let's pop that question in unforgettable style",
    image: details_proposal,
    description:
      "Enjoy a cozy and intimate date with a warm, romantic atmosphere. With candlelight, rose petals, and a touch of technology, this special evening is designed to be both elegant and relaxing. A perfect setting for us to connect and unwind",
  },
  {
    id: 4,
    title: "Fun Paint and Sip Events",
    subtitle_text:
      "Unleash your inner artist with a glass of wine and brush in hand",
    image: details_paint_sip,
    description:
      "Enjoy a cozy and intimate date with a warm, romantic atmosphere. With candlelight, rose petals, and a touch of technology, this special evening is designed to be both elegant and relaxing. A perfect setting for us to connect and unwind",
  },
];
