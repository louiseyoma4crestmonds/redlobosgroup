import { useParams } from "react-router-dom";
import Heading from "@/atoms/Heading";
import Footer from "@/organisms/Footer";
import { useEffect, useState } from "react";
import UtilityBar from "@/organisms/UtilityBar";
import BookingCard from "@/molecules/BookingCard/BookingCard";
import { addOnDetails } from "../../data/addOnData";

export function AddOnDetailsPage(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const [introPage, setIntroPage] = useState<boolean>(true);

  useEffect(() => {
    if (introPage) {
      setIntroPage(true);
      setTimeout(() => setIntroPage(false), 5000);
    }
  });

  const service = addOnDetails.find((item) => item.id === Number(id));

  return (
    <div className="bg-green1 min-h-screen">
      {/* LOGO LOADING SCREEN */}
      <div className={!introPage ? "hidden" : ""}>
        <div className="w-screen h-screen flex place-content-center bg-green1">
          <div className="self-center">
            <img width={200} height={200} src="/logoAnimation.gif" alt="logo" />
          </div>
        </div>
      </div>
      {/* END OF LOGO LOADING SCREEN */}

      <div className={introPage ? "hidden" : ""}>
        {/* UTILITY BAR */}
        <div>
          <UtilityBar activeLink="" />
        </div>
        {/* END OF UTILITY BAR */}
      </div>

      <div className="px-6 tablet:p-20 space-y-8">
        <div className="mb-8 space-y-8">
          <Heading
            Tag="h1"
            variant="sxl"
            className="phone:w-full tablet:w-3/4 mx-auto text-center font-[400] text-7xl phone:text-4xl leading-normal"
          >
            {service?.title.toUpperCase()}
          </Heading>
          <p className="text-red-600 text-center tablet:text-3xl phone:text-xl">
            {service?.subtitle_text}
          </p>
        </div>

        {service?.image && (
          <img
            src={service.image}
            alt={service?.title}
            className="w-full object-cover rounded-2xl shadow-lg"
          />
        )}

        <div className="space-y-2">
          <Heading Tag="h3" className="text-center">
            DESCRIPTION
          </Heading>
          <p className="tablet:text-xl phone:text-sm">{service?.description}</p>
        </div>
      </div>

      <div className="mb-96 mt-10">
        <BookingCard />
      </div>
      <Footer />
    </div>
  );
}

export default AddOnDetailsPage;
