export interface AddOnBrief {
  id: number;
  title:string;
  image: string;
  description: string;
  btn_text: string;
}

export interface AddOnDetail {
  id: number;
  title: string;
  subtitle_text: string;
  image: string;
  description: string;
}

export const addOnBrief: AddOnBrief[] = [
  {
    id: 1,
    image: "/redlobos-property-stay.webp",
    title:"STAY",
    description: "LONG AND SHORT STAY ACCOMODATION",
    btn_text: "EXPLORE AVAILABLE PROPERTIES",
  },
  {
    id: 2,
    image: "/romantic-dinner.jpg",
    title:"MANAGE",
    description: "PROPERTY & AIR BNB MANAGEMENT",
    btn_text: "CONTACT US",
  },
  {
    id: 3,
    image: "/redlogos-properties-rent.webp",
    title:"RENT",
    description: "RESIDENTIAL TENANCIES",
    btn_text: "CONTACT US",
  },
  {
    id: 4,
    image: "/redlobos-properties-setup.webp",
    title:"SETUPS",
    description: "BIRTHDAY, ROMANTIC DINNER VALENTINE & CURATED EVENTS",
    btn_text: "PLAN YOUR PERFECT SETUP",
  },
  {
    id: 5,
    image: "/redlobos-properties-setup.webp",
    title:"DESIGN and STAGING ",
    description: "PROPERTY, EVENT & CREATIVE STAGING",
    btn_text: "CONTACT US",
  },
  {
    id: 6,
    image: "/podcast-studio.jpg",
    title:"CREATE",
    description: "CONTENT CREATION & PODCAST SETUPS",
    btn_text: "CONTACT US",
  },
  {
    id: 7,
    image: "/proposal-setup.jpg",
    title:"DIGITAL TRAINING PRODUCTS & VIRTUAL TRAINING",
    description: "",
    btn_text: "CONTACT US",
  },
];

export const addOnDetails: AddOnDetail[] = [
  {
    id: 1,
    title: "STAY",
    subtitle_text: "Long and Short Stay Accomodation",
    image: "/redlobos-property-stay.webp",
    description:
      "Enjoy a cozy and intimate date with a warm, romantic atmosphere. With candlelight, rose petals, and a touch of technology, this special evening is designed to be both elegant and relaxing. A perfect setting for us to connect and unwind",
  },
  {
    id: 2,
    title: "MANAGE",
    subtitle_text: "PROPERTY & AIR BNB MANAGEMENT",
    image: "/details-romantic.png",
    description:
      "Enjoy a cozy and intimate date with a warm, romantic atmosphere. With candlelight, rose petals, and a touch of technology, this special evening is designed to be both elegant and relaxing. A perfect setting for us to connect and unwind",
  },
  {
    id: 3,
    title: "RENT",
    subtitle_text: "RESIDENTIAL TENANCIES",
    image: "/redlogos-properties-rent.webp",
    description:
      "Enjoy a cozy and intimate date with a warm, romantic atmosphere. With candlelight, rose petals, and a touch of technology, this special evening is designed to be both elegant and relaxing. A perfect setting for us to connect and unwind",
  },
  {
    id: 4,
    title: "SETUPS",
    subtitle_text: "Romantic Dinner, Birthday, Valentine & Curated Events",
    image: "/redlobos-properties-setup.webp",
    description:
      "Enjoy a cozy and intimate date with a warm, romantic atmosphere. With candlelight, rose petals, and a touch of technology, this special evening is designed to be both elegant and relaxing. A perfect setting for us to connect and unwind",
  },
  {
    id: 5,
    title: "DESIGN and STAGING",
    subtitle_text:
      "Property, Event & Creative Staging",
    image: "/redlobos-properties-setup.webp",
    description:
      "Enjoy a cozy and intimate date with a warm, romantic atmosphere. With candlelight, rose petals, and a touch of technology, this special evening is designed to be both elegant and relaxing. A perfect setting for us to connect and unwind",
  },
  {
    id: 6,
    title: "CREATE",
    subtitle_text:
      "Content Creation & Podcast Setups",
    image: "/podcast-studio.jpg",
    description:
      "Enjoy a cozy and intimate date with a warm, romantic atmosphere. With candlelight, rose petals, and a touch of technology, this special evening is designed to be both elegant and relaxing. A perfect setting for us to connect and unwind",
  },
  {
    id: 7,
    title: "DIGITAL TRAINING",
    subtitle_text:
      "Digital Training Products & Virtual Training",
    image: "/proposal-setup.jpg",
    description:
      "Enjoy a cozy and intimate date with a warm, romantic atmosphere. With candlelight, rose petals, and a touch of technology, this special evening is designed to be both elegant and relaxing. A perfect setting for us to connect and unwind",
  },
];
