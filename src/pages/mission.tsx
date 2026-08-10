import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import { slideInRight, slideInLeft, zoomIn } from "react-animations";
import UtilityBar from "@/organisms/UtilityBar";
import Heading from "@/atoms/Heading";
import Footer from "@/organisms/Footer";

function Mission(): JSX.Element {
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
      }, 5000);
    }
  }, [setIntroPage]);

  return (
    <div>
      {/* LOGO LOADING SCREEN */}
      <div className={!introPage ? "hidden" : ""}>
        <div className="w-screen h-screen flex place-content-center bg-redLobosBackground">
          <div className="self-center">
            <img width={500} height={500} src="/logoAnimation.gif" alt="logo" />
          </div>
        </div>
      </div>
      {/* END OF LOGO LOADING SCREEN */}

      <div className={introPage ? "hidden" : ""}>
        {/* UTILITY BAR */}
        <div>
          <UtilityBar activeLink="mission" />
        </div>
        {/* END OF UTILITY BAR */}
        <div className="px-6 bg-green1 space-y-12">
          <div className="text-center pt-12 space-y-3 bg-green1">
            <div>
              <Heading Tag="h1" variant="xxl">
                <span className="text-center">OUR MISSION</span>
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
              <div className="text-gray1">MISSION</div>
            </div>
          </div>
          <div className="flex flex-col tablet:pt-12 tablet:flex-row tablet:justify-between tablet:gap-8 tablet:px-24">
            <div className="self-center basis-6/12">
              <SlideInLeftDiv>
                <img
                  className="rounded-2xl"
                  src="/mission.jpg"
                  height={900}
                  width={800}
                  alt="Mission"
                />
              </SlideInLeftDiv>
            </div>
            <div className="self-center basis-6/12 tablet:px-8 text-center">
              <div className="mt-8 space-y-3">
                <ZoomInDiv>
                  <p>OUR MISSION</p>
                </ZoomInDiv>

                <ZoomInDiv>
                  <Heading Tag="h1" variant="xl">
                    <span className="text-gold">
                      TO BE THE MOST TRUSTED NAME IN REAL ESTATE GLOBALLY
                    </span>
                  </Heading>
                </ZoomInDiv>

                <div className="text-gray1 leading-8 text-left tablet:text-center ">
                  <ZoomInDiv>
                    <p>
                      Lorel ipsium lorel ipsium Lorel ipsium lorel ipsium Lorel
                      ipsium lorel ipsium Lorel ipsium lorel ipsium Lorel ipsium
                      lorel ipsium
                    </p>
                    <p>
                      Lorel ipsium lorel ipsium Lorel ipsium lorel ipsium Lorel
                      ipsium lorel ipsium Lorel ipsium lorel ipsium Lorel ipsium
                      lorel ipsium
                    </p>
                  </ZoomInDiv>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col tablet:pt-12 tablet:flex-row tablet:flex-row-reverse tablet:justify-between tablet:gap-8 tablet:px-24">
            <div className="self-center basis-6/12">
              <SlideInRightDiv>
                <img
                  className="rounded-2xl"
                  src="/vision.jpg"
                  height={900}
                  width={800}
                  alt="Vision"
                />
              </SlideInRightDiv>
            </div>
            <div className="self-center basis-6/12 tablet:px-8 text-center">
              <div className="mt-8 space-y-3">
                <ZoomInDiv>
                  <p>OUR VISION</p>
                </ZoomInDiv>

                <ZoomInDiv>
                  <Heading Tag="h1" variant="xl">
                    <span className="text-gold">
                      CREATING A GREAT TOMORROW FOR EVERYONE
                    </span>
                  </Heading>
                </ZoomInDiv>

                <div className="text-gray1 leading-8 text-left tablet:text-center ">
                  <ZoomInDiv>
                    <p>
                      Lorel ipsium lorel ipsium Lorel ipsium lorel ipsium Lorel
                      ipsium lorel ipsium Lorel ipsium lorel ipsium Lorel ipsium
                      lorel ipsium
                    </p>
                    <p>
                      Lorel ipsium lorel ipsium Lorel ipsium lorel ipsium Lorel
                      ipsium lorel ipsium Lorel ipsium lorel ipsium Lorel ipsium
                      lorel ipsium
                    </p>
                  </ZoomInDiv>
                </div>
              </div>
            </div>
          </div>

          <div className="py-8 space-y-6 text-center">
            <div className="space-y-4">
              <div>WHAT WE DO</div>
              <div>
                <Heading Tag="h1" variant="lg">
                  <span className="text-center">
                    CREATING A GREAT TOMORROW FOR EVERYONE
                  </span>
                </Heading>
              </div>
            </div>

            <div className="py-16 space-y-16 tablet:flex tablet:gap-x-4 tablet:space-y-0 ">
              <div className="space-y-4">
                <div>
                  <img
                    className="rounded-full"
                    width={200}
                    height={200}
                    src="/firstSittingRoom.png"
                    alt="Residential"
                  />
                </div>
                <div>
                  <Heading Tag="h1" variant="md">
                    <span className="text-center">RESIDENTIAL DEVELOPMENT</span>
                  </Heading>
                </div>
                <div>
                  <p className="text-[#9B9B9B] leading-8">
                    Lorel ipsium lorel ipsium Lorel ipsium lorel ipsium Lorel
                    ipsium lorel ipsium Lorel ipsium lorel ipsium Lorel ipsium
                    lorel ipsium
                  </p>
                  <div
                    className="text-gold mt-6 cursor-pointer"
                    tabIndex={0}
                    role="button"
                    onKeyDown={() => {}}
                    onClick={() => {
                      navigate("/mission");
                    }}
                  >
                    LEARN MORE
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <img
                    className="rounded-full"
                    width={200}
                    height={200}
                    src="/commercialDevelopment.jpg"
                    alt="Commercial"
                  />
                </div>
                <div>
                  <Heading Tag="h1" variant="md">
                    <span className="text-center">COMMERCIAL DEVELOPMENT</span>
                  </Heading>
                </div>
                <div>
                  <p className="text-[#9B9B9B] leading-8">
                    Lorel ipsium lorel ipsium Lorel ipsium lorel ipsium Lorel
                    ipsium lorel ipsium Lorel ipsium lorel ipsium Lorel ipsium
                    lorel ipsium
                  </p>
                  <div
                    className="text-gold mt-6 cursor-pointer"
                    tabIndex={0}
                    role="button"
                    onKeyDown={() => {}}
                    onClick={() => {
                      navigate("/mission");
                    }}
                  >
                    LEARN MORE
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <img
                    className="rounded-full"
                    width={200}
                    height={200}
                    src="/industrialDevelopment.jpg"
                    alt="Industrial"
                  />
                </div>
                <div>
                  <Heading Tag="h1" variant="md">
                    <span className="text-center">INDUSTRIAL DEVELOPMENT</span>
                  </Heading>
                </div>
                <div>
                  <p className="text-[#9B9B9B] leading-8">
                    Lorel ipsium lorel ipsium Lorel ipsium lorel ipsium Lorel
                    ipsium lorel ipsium Lorel ipsium lorel ipsium Lorel ipsium
                    lorel ipsium
                  </p>
                  <div
                    className="text-gold mt-6 cursor-pointer"
                    tabIndex={0}
                    role="button"
                    onKeyDown={() => {}}
                    onClick={() => {
                      navigate("/mission");
                    }}
                  >
                    LEARN MORE
                  </div>
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

export default Mission;
