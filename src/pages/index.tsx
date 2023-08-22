import Image from "next/image";
import styled, { keyframes } from "styled-components";
import { slideInRight, slideInLeft, zoomIn } from "react-animations";

import { useEffect, useState } from "react";
import UtilityBar from "@/organisms/UtilityBar";
import Heading from "@/atoms/Heading";
import Button from "@/atoms/Button";
import Footer from "@/organisms/Footer";
import logo from "../../public/logo.gif";
import arrowDown from "../../public/arrowDown.gif";
import firstSittingRoom from "../../public/firstSittingRoom.png";
import testimony1 from "../../public/testimonial1.jpg";
import commercialDevelopment from "../../public/commercialDevelopment.jpg";
import industrialDevelopment from "../../public/industrialDevelopment.jpg";
import firstImage from "../../public/firstImage.jpg";
import secondImage from "../../public/secondImage.jpg";

import { useRouter } from "next/router";

function Home(): JSX.Element {
  const router = useRouter();
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
  });

  return (
    <div>
      {/* LOGO LOADING SCREEN */}
      <div className={!introPage ? "hidden" : ""}>
        <div className="w-screen h-screen flex place-content-center bg-redLobosBackground">
          <div className="self-center">
            <Image width={500} height={500} src={logo} />
          </div>
        </div>
      </div>
      {/* END OF LOGO LOADING SCREEN */}

      <div className={introPage ? "hidden" : ""}>
        {/* UTILITY BAR */}
        <div>
          <UtilityBar />
        </div>
        {/* END OF UTILITY BAR */}

        <div className="px-6 bg-green1 tablet:px-28">
          <audio autoPlay>
            <source src="/audio.mp3" type="audio/ogg" />
            <source src="/audio.mp3" type="audio/mpeg" />
            Unsuported Audio by Browser
          </audio>
          <div className="space-y-8 text-center py-12 tablet:space-y-48 bg-green1  ">
            <div className="tablet:flex place-content-center ">
              <div className="hidden tablet:block tablet:h-[100px] w-3/12  absolute left-0">
                <SlideInLeftDiv>
                  <Image className="rounded-lg" src={firstImage} />
                </SlideInLeftDiv>
              </div>

              <div className="tablet:w-6/12 space-y-12 tablet:mt-24">
                <div>
                  <ZoomInDiv>
                    <Heading Tag="h1" variant="lg">
                      <span className="text-center">
                        QUICK WAY TO FIND YOUR NEW PROPERTY & NEW FUTURE
                      </span>
                    </Heading>
                  </ZoomInDiv>
                </div>

                <div>
                  <ZoomInDiv>
                    <p className="text-gray1 leading-8">
                      Lorel ipsium lorel ipsium Lorel ipsium lorel ipsium Lorel
                      ipsium lorel ipsium Lorel ipsium lorel ipsium Lorel ipsium
                      lorel ipsium
                    </p>
                  </ZoomInDiv>
                </div>
                <div className="w-full flex place-content-center">
                  <div className="w-3/5">
                    <Button
                      variant="primary"
                      width="full"
                      onClick={() => {
                        router.push({ pathname: "/mission" });
                      }}
                    >
                      <span
                        className="w-full text-center"
                        onClick={() => {
                          router.push({ pathname: "/mission" });
                        }}
                      >
                        LEARN MORE
                      </span>
                    </Button>
                  </div>
                </div>
                <div className="cursor-pointer">
                  <Image width={50} height={70} src={arrowDown} />
                </div>
              </div>
              <div className="hidden tablet:block h-[100px] w-3/12   absolute right-0 mt-[100px]">
                <SlideInRightDiv>
                  <Image className="rounded-lg" src={secondImage} />
                </SlideInRightDiv>
              </div>
            </div>

            <div className="spce-y-8">
              <div className=" py-8 space-y-6">
                <div className="tablet:flex tablet:place-content-center">
                  <div className="w-full space-y-4 tablet:w-8/12">
                    <div>WHAT WE DO</div>
                    <div>
                      <Heading Tag="h1" variant="lg">
                        <span className="text-center">
                          CREATING A GREAT TOMORROW FOR EVERYONE
                        </span>
                      </Heading>
                    </div>
                  </div>
                </div>

                <div className="py-16 space-y-16 tablet:flex tablet:gap-x-4 tablet:space-y-0 ">
                  <div className="space-y-4">
                    <div>
                      <Image
                        className="rounded-full"
                        width={200}
                        height={200}
                        src={firstSittingRoom}
                      />
                    </div>
                    <div>
                      <Heading Tag="h1" variant="md">
                        <span className="text-center">
                          RESIDENTIAL DEVELOPMENT
                        </span>
                      </Heading>
                    </div>
                    <div>
                      <p className="text-[#9B9B9B] leading-8">
                        Lorel ipsium lorel ipsium Lorel ipsium lorel ipsium
                        Lorel ipsium lorel ipsium Lorel ipsium lorel ipsium
                        Lorel ipsium lorel ipsium
                      </p>
                      <p
                        className="text-gold mt-6 cursor-pointer"
                        onClick={() => {
                          router.push({ pathname: "/mission" });
                        }}
                      >
                        LEARN MORE
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Image
                        className="rounded-full"
                        width={200}
                        height={200}
                        src={commercialDevelopment}
                      />
                    </div>
                    <div>
                      <Heading Tag="h1" variant="md">
                        <span className="text-center">
                          COMMERCIAL DEVELOPMENT
                        </span>
                      </Heading>
                    </div>
                    <div>
                      <p className="text-[#9B9B9B] leading-8">
                        Lorel ipsium lorel ipsium Lorel ipsium lorel ipsium
                        Lorel ipsium lorel ipsium Lorel ipsium lorel ipsium
                        Lorel ipsium lorel ipsium
                      </p>
                      <p
                        className="text-gold mt-6 cursor-pointer"
                        onClick={() => {
                          router.push({ pathname: "/mission" });
                        }}
                      >
                        LEARN MORE
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Image
                        className="rounded-full"
                        width={200}
                        height={200}
                        src={industrialDevelopment}
                      />
                    </div>
                    <div>
                      <Heading Tag="h1" variant="md">
                        <span className="text-center">
                          INDUSTRIAL DEVELOPMENT
                        </span>
                      </Heading>
                    </div>
                    <div>
                      <p className="text-[#9B9B9B] leading-8">
                        Lorel ipsium lorel ipsium Lorel ipsium lorel ipsium
                        Lorel ipsium lorel ipsium Lorel ipsium lorel ipsium
                        Lorel ipsium lorel ipsium
                      </p>
                      <p
                        className="text-gold mt-6 cursor-pointer"
                        onClick={() => {
                          router.push({ pathname: "/mission" });
                        }}
                      >
                        LEARN MORE
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="py- space-y-6">
                <div className="tablet:flex tablet:place-content-center">
                  <div className="w-full space-y-4 tablet:w-8/12">
                    <div>TESTIMONIALS</div>
                    <div>
                      <Heading Tag="h1" variant="lg">
                        <span className="text-center">
                          TRUSTED BY THOUSANDS OF OUR CUSTOMERS
                        </span>
                      </Heading>
                    </div>
                  </div>
                </div>

                <div className="py-16 space-y-16 tablet:flex tablet:gap-x-4 tablet:space-y-0 tablet:px-24 ">
                  <div>
                    <Image
                      className="rounded-full"
                      width={100}
                      height={100}
                      src={testimony1}
                    />

                    <div className="border rounded-lg p-4">
                      <p className="text-sm text-[#9B9B9B] leading-8">
                        <span className="text-4xl text-gold">,,</span>
                        Lorel ipsium lorel ipsium Lorel ipsium lorel ipsium
                        Lorel ipsium lorel ipsium Lorel ipsium lorel ipsium
                        Lorel ipsium lorel ipsium
                        <span className="text-4xl text-gold">,,</span>
                      </p>
                    </div>
                  </div>
                  <div>
                    <Image
                      className="rounded-full"
                      width={100}
                      height={100}
                      src={testimony1}
                    />

                    <div className="border rounded-lg p-4">
                      <p className="text-sm text-[#9B9B9B] leading-8">
                        <span className="text-4xl text-gold">,,</span>
                        Lorel ipsium lorel ipsium Lorel ipsium lorel ipsium
                        Lorel ipsium lorel ipsium Lorel ipsium lorel ipsium
                        Lorel ipsium lorel ipsium
                        <span className="text-4xl text-gold">,,</span>
                      </p>
                    </div>
                  </div>
                  <div>
                    <Image
                      className="rounded-full"
                      width={100}
                      height={100}
                      src={testimony1}
                    />

                    <div className="border rounded-lg p-4">
                      <p className="text-sm text-[#9B9B9B] leading-8">
                        <span className="text-4xl text-gold">,,</span>
                        Lorel ipsium lorel ipsium Lorel ipsium lorel ipsium
                        Lorel ipsium lorel ipsium Lorel ipsium lorel ipsium
                        Lorel ipsium lorel ipsium
                        <span className="text-4xl text-gold">,,</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              {/* ENQUIRY SECTION */}
              <div className="bg-white rounded-lg py-8 px-4 space-y-4 tablet:p-24">
                <div>QUICK ENQUIRY</div>
                <div>
                  <Heading Tag="h1" variant="md">
                    <span className="text-center">
                      DO YOU HAVE ANY QUESTION? WE ARE GLAD TO CONSULT YOU AS
                      SOON AS POSSIBLE.
                    </span>
                  </Heading>
                </div>
                <div className="flex flex-col space-y-4 tablet:space-y-0 tablet:flex-row place-content-center gap-x-4">
                  <div className="">
                    <input
                      className="rounded border border-black py-2 px-4 outline-none"
                      placeholder="Your name"
                    />
                  </div>

                  <div className="">
                    <input
                      className="rounded border border-black py-2 px-4 outline-none"
                      placeholder="Phone number"
                    />
                  </div>
                </div>

                <div className="w-full flex place-content-center">
                  <div className="w-3/5 tablet:w-1/5">
                    <Button variant="primary" width="full">
                      <span className="w-full text-center">SUBMIT</span>
                    </Button>
                  </div>
                </div>

                <div className="flex gap-2 text-left tablet:place-content-center">
                  <div>
                    <input type="checkbox" />
                  </div>
                  <div>
                    I accept{" "}
                    <span className="font-bold">Terms & Conditions</span> for
                    processing personal data
                  </div>
                </div>
              </div>
              {/* END ENQUIRY SECTION */}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Home;
