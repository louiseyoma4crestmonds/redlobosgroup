import styled, { keyframes } from "styled-components";
import { slideInRight, slideInLeft, zoomIn } from "react-animations";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import UtilityBar from "@/organisms/UtilityBar";
import Heading from "@/atoms/Heading";
import Button from "@/atoms/Button";
import Footer from "@/organisms/Footer";
import AddOnCard from "@/molecules/AddOnCard/AddOnCard";
import { addOnBrief } from "../data/addOnData";

function Home(): JSX.Element {
  const navigate = useNavigate();
  const [introPage, setIntroPage] = useState<boolean>(true);

  const slideInRightAnimation = keyframes`${slideInRight}`;
  const slideInLeftAnimation = keyframes`${slideInLeft}`;
  const zoomInAnimation = keyframes`${zoomIn}`;

  const SlideInRightDiv = styled.div`
    animation: 3s ${slideInRightAnimation};
  `;
  const SlideInLeftDiv = styled.div`
    animation: 3s ${slideInLeftAnimation};
  `;
  const ZoomInDiv = styled.div`
    animation: 3s ${zoomInAnimation};
  `;

  useEffect(() => {
    if (introPage) {
      setIntroPage(true);
      setTimeout(() => {
        setIntroPage(false);
      }, 3000);
    }
  }, [introPage]);

  return (
    <div>
      {/* LOGO LOADING SCREEN */}
      <div className={!introPage ? "hidden" : ""}>
        <div className="w-screen h-screen flex place-content-center bg-green1">
          <div className="self-center">
            <img alt="logo" width={200} height={200} src="/logoAnimation.gif" />
          </div>
        </div>
      </div>
      {/* END OF LOGO LOADING SCREEN */}

      <div className={introPage ? "hidden" : ""}>
        {/* UTILITY BAR */}
        <div>
          <UtilityBar activeLink="HOME" />
        </div>
        {/* END OF UTILITY BAR */}

        <div className="px-6 bg-green1 tablet:px-28">
          <div className="space-y-8 text-center py-12 tablet:space-y-48 bg-green1  ">
            <div className="tablet:flex place-content-center ">
              <div className="hidden tablet:block tablet:h-[100px] w-3/12  absolute left-0">
                <SlideInLeftDiv>
                  <img className="rounded-lg" src="/firstImage.jpg" alt="First" />
                </SlideInLeftDiv>
              </div>

              <div className="tablet:w-6/12 space-y-12 tablet:mt-24">
                <div>
                  <ZoomInDiv>
                    <Heading Tag="h1" variant="lg">
                      <span className="text-center">
                        SERVICE ACCOMMODATION &amp; PROPERTY DEVELOPMENT
                      </span>
                    </Heading>
                  </ZoomInDiv>
                </div>

                <div>
                  <ZoomInDiv>
                    <p className="text-gray1 leading-8">
                      Red Lobos group ltd provides accommodation for long and
                      short business trips, tourist, families, English Summer
                      holiday school for students, tailored holiday experience,
                      relocators.
                    </p>
                  </ZoomInDiv>
                </div>
                <div className="w-full flex place-content-center">
                  <div className="w-3/5">
                    <Button
                      variant="gold"
                      width="full"
                      onClick={() => {
                        navigate("/properties");
                      }}
                    >
                      <span
                        className="w-full text-center"
                        tabIndex={0}
                        role="button"
                        onKeyDown={() => {}}
                        onClick={() => {
                          navigate("/properties");
                        }}
                      >
                        BOOK NOW
                      </span>
                    </Button>
                  </div>
                </div>
                <div className="cursor-pointer">
                  <img width={50} height={70} src="/arrowDown.gif" alt="scroll down" />
                </div>
              </div>
              <div className="hidden tablet:block h-[100px] w-3/12   absolute right-0 mt-[100px]">
                <SlideInRightDiv>
                  <img className="rounded-lg" src="/secondImage.jpg" alt="Second" />
                </SlideInRightDiv>
              </div>
            </div>

            <div className="spce-y-8">
              <div className="py-8 space-y-6">
                <div className="tablet:flex tablet:place-content-center">
                  <div className="w-full space-y-4 tablet:w-8/12">
                    <div>OUR ADD-ON SERVICES</div>
                    <div>
                      <Heading Tag="h1" variant="lg">
                        <span className="text-center">
                          ENHANCE YOUR EXPERIENCE WITH OUR SPECIAL SERVICES
                        </span>
                      </Heading>
                    </div>
                  </div>
                </div>

                <div className="py-16 space-y-16">
                  {addOnBrief?.map(({ image, description, btn_text, id }) => (
                    <div key={id}>
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
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Home;
