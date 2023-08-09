import Image from "next/image";

import { useEffect, useState } from "react";
import UtilityBar from "@/organisms/UtilityBar";
import Heading from "@/atoms/Heading";
import Button from "@/atoms/Button";
import Footer from "@/organisms/Footer";
import logo from "../../public/logo.gif";
import arrowDown from "../../public/arrowDown.gif";
import firstSittingRoom from "../../public/firstSittingRoom.png";

function Home(): JSX.Element {
  const [introPage, setIntroPage] = useState<boolean>(true);

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

        <div className="px-6 bg-green1">
          <div className="text-center py-12 space-y-6 bg-green1">
            <div>
              <Heading Tag="h1" variant="xxl">
                <span className="text-center">
                  QUICK WAY TO FIND YOUR NEW PROPERTY & NEW FUTURE
                </span>
              </Heading>
            </div>
            <div>
              <p className="text-[#9B9B9B] leading-8">
                Lorel ipsium lorel ipsium Lorel ipsium lorel ipsium Lorel ipsium
                lorel ipsium Lorel ipsium lorel ipsium Lorel ipsium lorel ipsium
              </p>
            </div>
            <div className="w-full flex place-content-center">
              <div className="w-3/5">
                <Button variant="primary" width="full">
                  <span className="w-full text-center">LEARN MORE</span>
                </Button>
              </div>
            </div>
            <div className="cursor-pointer">
              <Image width={50} height={70} src={arrowDown} />
            </div>
            <div className="py-8 space-y-6">
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

              <div className="py-16 space-y-16">
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
                      Lorel ipsium lorel ipsium Lorel ipsium lorel ipsium Lorel
                      ipsium lorel ipsium Lorel ipsium lorel ipsium Lorel ipsium
                      lorel ipsium
                    </p>
                    <p className="text-gold mt-6 cursor-pointer">LEARN MORE</p>
                  </div>
                </div>
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
                        COMMERCIAL DEVELOPMENT
                      </span>
                    </Heading>
                  </div>
                  <div>
                    <p className="text-[#9B9B9B] leading-8">
                      Lorel ipsium lorel ipsium Lorel ipsium lorel ipsium Lorel
                      ipsium lorel ipsium Lorel ipsium lorel ipsium Lorel ipsium
                      lorel ipsium
                    </p>
                    <p className="text-gold mt-6 cursor-pointer">LEARN MORE</p>
                  </div>
                </div>
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
                        INDUSTRIAL DEVELOPMENT
                      </span>
                    </Heading>
                  </div>
                  <div>
                    <p className="text-[#9B9B9B] leading-8">
                      Lorel ipsium lorel ipsium Lorel ipsium lorel ipsium Lorel
                      ipsium lorel ipsium Lorel ipsium lorel ipsium Lorel ipsium
                      lorel ipsium
                    </p>
                    <p className="text-gold mt-6 cursor-pointer">LEARN MORE</p>
                  </div>
                </div>
              </div>
            </div>
            {/* ENQUIRY SECTION */}
            <div className="bg-white rounded-lg py-8 px-4 space-y-4">
              <div>QUICK ENQUIRY</div>
              <div>
                <Heading Tag="h1" variant="lg">
                  <span className="text-center">
                    DO YOU HAVE ANY QUESTION? WE ARE GLAD TO CONSULT YOU AS SOON
                    AS POSSIBLE.
                  </span>
                </Heading>
              </div>
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

              <div className="w-full flex place-content-center">
                <div className="w-3/5">
                  <Button variant="primary" width="full">
                    <span className="w-full text-center">SUBMIT</span>
                  </Button>
                </div>
              </div>

              <div className="flex gap-2 text-left">
                <div>
                  <input type="checkbox" />
                </div>
                <div>
                  I accept <span className="font-bold">Terms & Conditions</span>{" "}
                  for processing personal data
                </div>
              </div>
            </div>
            {/* END ENQUIRY SECTION */}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Home;
