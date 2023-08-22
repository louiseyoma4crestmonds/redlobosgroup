import Image from "next/image";
import styled, { keyframes } from "styled-components";
import { slideInRight, slideInLeft, zoomIn } from "react-animations";
import { useEffect, useState } from "react";
import UtilityBar from "@/organisms/UtilityBar";
import Heading from "@/atoms/Heading";
import Button from "@/atoms/Button";
import Footer from "@/organisms/Footer";
import logo from "../../public/logo.gif";
import testimony1 from "../../public/testimonial1.jpg";
import { useRouter } from "next/router";

function Overview(): JSX.Element {
  const router = useRouter();
  const [introPage, setIntroPage] = useState<boolean>(true);

  const zoomInAnimation = keyframes`${zoomIn}`;

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

        <div className="px-6 bg-green1 space-y-12">
          <div className="text-center pt-12 space-y-3 bg-green1">
            <div>
              <Heading Tag="h1" variant="xxl">
                <span className="text-center">OVERVIEW</span>
              </Heading>
            </div>
            <div className="flex gap-2 place-content-center">
              <div
                className="cursor-pointer"
                onClick={() => {
                  router.push({ pathname: "/" });
                }}
              >
                HOME
              </div>
              <div> &gt;</div>
              <div className="text-gray1">OVERVIEW</div>
            </div>
          </div>

          <div className="flex flex-col tablet:pt-0 tablet:flex-row tablet:justify-between tablet:gap-x-8 tablet:px-24">
            <div className="self-center basis-4/12">
              <Image
                className="rounded-2xl"
                src={testimony1}
                height={400}
                width={400}
              />
            </div>
            <div className="self-center basis-8/12 tablet:px-8 text-center">
              <div className="mt-8 space-y-3">
                <p>LEADERSHIP</p>

                <Heading Tag="h1" variant="xl">
                  <span className="text-gold">MEET OUR FOUNDER</span>
                </Heading>

                <div className="text-gray1 leading-8 text-center ">
                  <ZoomInDiv>
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
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Overview;
