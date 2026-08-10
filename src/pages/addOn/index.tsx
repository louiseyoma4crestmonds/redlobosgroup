import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import UtilityBar from "@/organisms/UtilityBar";
import Footer from "@/organisms/Footer";
import Heading from "@/atoms/Heading";
import AddOnCard from "@/molecules/AddOnCard/AddOnCard";
import { addOnBrief } from "../../data/addOnData";

export function AddOnService(): JSX.Element {
  const navigate = useNavigate();
  const [introPage, setIntroPage] = useState<boolean>(true);

  useEffect(() => {
    if (introPage) {
      setIntroPage(true);
      setTimeout(() => setIntroPage(false), 5000);
    }
  });

  return (
    <div>
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

      <div className="px-6 bg-green1 tablet:p-28">
        <div className="text-center pt-12 space-y-3 bg-green1">
          <div>
            <Heading Tag="h1" variant="xxl">
              <span className="text-center">ADD ON SERVICES</span>
            </Heading>
          </div>
          <div className="flex gap-2 place-content-center">
            <div
              className="cursor-pointer"
              tabIndex={0}
              role="button"
              onKeyDown={() => {}}
              onClick={() => {
                navigate("/");
              }}
            >
              HOME
            </div>
            <div> &gt;</div>
            <div className="text-gray1">ADD ONS</div>
          </div>
        </div>
      </div>
      {/* End of sub navigation indicator */}

      {/* ADD-ON SERVICES SECTION */}
      <div className="bg-green1 px-6 py-12 tablet:p-28">
        <div className="">
          {addOnBrief?.map(({ image, description, btn_text, id }) => (
            <div className="mb-20 phone:mb-[50px]" key={id}>
              <AddOnCard
                src={image}
                des={description}
                id={id}
                btnText={btn_text}
              />
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default AddOnService;
