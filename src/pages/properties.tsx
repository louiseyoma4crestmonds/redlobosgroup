import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import UtilityBar from "@/organisms/UtilityBar";
import Heading from "@/atoms/Heading";
import Footer from "@/organisms/Footer";
import Button from "@/atoms/Button";
import logo from "../../public/logo.gif";
import testimony1 from "../../public/property1.jpg";
import propertySize from "../../public/houseSize.png";
import price from "../../public/moneyBag.png";
import status from "../../public/status.png";
import propertyType from "../../public/propertyType.png";

function Properties(): JSX.Element {
  const router = useRouter();
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

        <div className="px-6 bg-green1 space-y-12">
          <div className="text-center pt-12 space-y-3 bg-green1">
            <div>
              <Heading Tag="h1" variant="xxl">
                <span className="text-center">PROPERTIES</span>
              </Heading>
            </div>
            <div className="flex gap-2 place-content-center">
              <div
                className="cursor-pointer"
                tabIndex={0}
                role="button"
                onKeyDown={() => {}}
                onClick={() => {
                  router.push({ pathname: "/" });
                }}
              >
                HOME
              </div>
              <div> &gt;</div>
              <div className="text-gray1">PROPERTIES</div>
            </div>
          </div>

          <div className="flex flex-col tablet:pt-0 tablet:flex-row tablet:justify-between tablet:gap-x-6 tablet:px-24">
            <div className="self-center basis-4/12">
              <Image className="rounded-2xl" src={testimony1} />
            </div>
            <div className="self-center basis-7/12 tablet:px-8 text-left">
              <div className="mt-8 space-y-6">
                <p>BALA MD, AR</p>

                <div className="text-3xl font-bold cursor-pointer text-black hover:text-gold">
                  TOURIST BEST FIND IN PORTSMOUTH
                </div>

                <div className="text-black leading-8 text-left ">
                  <div className="grid grid-cols-2 gap-y-8">
                    <div className="flex gap-x-2">
                      <div>
                        <Image src={propertySize} width={62} height={62} />
                      </div>
                      <div>
                        <div>PROPERTY SIZE</div>
                        <div>20,000 SQFT</div>
                      </div>
                    </div>
                    <div className="flex gap-x-2">
                      <div>
                        <Image src={propertyType} width={62} height={62} />
                      </div>
                      <div>
                        <div>STATUS</div>
                        <div>UNDER CONSTRUCTION</div>
                      </div>
                    </div>
                    <div className="flex gap-x-2">
                      <Image src={price} width={62} height={62} />
                      <div>
                        <div>PRICE RANGE</div>
                        <div>$10k - $50k</div>
                      </div>
                    </div>
                    <div className="flex gap-x-2">
                      <div>
                        <Image src={status} width={62} height={62} />
                      </div>
                      <div>
                        <div>TYPE</div>
                        <div>SKY VILLA</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <Button
                    onClick={() => {
                      router.push({ pathname: "/propertyDetails" });
                    }}
                    variant="secondary"
                  >
                    VIEW DETAILS
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col tablet:pt-0 tablet:flex-row tablet:justify-between tablet:gap-x-6 tablet:px-24">
            <div className="self-center basis-4/12">
              <Image className="rounded-2xl" src={testimony1} />
            </div>
            <div className="self-center basis-7/12 tablet:px-8 text-left">
              <div className="mt-8 space-y-6">
                <p>SALA CD, MS</p>

                <div className="text-3xl font-bold cursor-pointer text-black hover:text-gold">
                  CHRMING 3 BED IN PORTSMOUTH
                </div>

                <div className="text-black leading-8 text-left ">
                  <div className="grid grid-cols-2 gap-y-8">
                    <div className="flex gap-x-2">
                      <div>
                        <Image src={propertySize} width={62} height={62} />
                      </div>
                      <div>
                        <div>PROPERTY SIZE</div>
                        <div>20,000 SQFT</div>
                      </div>
                    </div>
                    <div className="flex gap-x-2">
                      <div>
                        <Image src={propertyType} width={62} height={62} />
                      </div>
                      <div>
                        <div>STATUS</div>
                        <div>UNDER CONSTRUCTION</div>
                      </div>
                    </div>
                    <div className="flex gap-x-2">
                      <Image src={price} width={62} height={62} />
                      <div>
                        <div>PRICE RANGE</div>
                        <div>$10k - $50k</div>
                      </div>
                    </div>
                    <div className="flex gap-x-2">
                      <div>
                        <Image src={status} width={62} height={62} />
                      </div>
                      <div>
                        <div>TYPE</div>
                        <div>SKY VILLA</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <Button
                    onClick={() => {
                      router.push({ pathname: "/propertyDetails" });
                    }}
                    variant="secondary"
                  >
                    VIEW DETAILS
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col tablet:pt-0 tablet:flex-row tablet:justify-between tablet:gap-x-6 tablet:px-24">
            <div className="self-center basis-4/12">
              <Image className="rounded-2xl" src={testimony1} />
            </div>
            <div className="self-center basis-7/12 tablet:px-8 text-left">
              <div className="mt-8 space-y-6">
                <p>KALA SD, QS</p>

                <div className="text-3xl font-bold cursor-pointer text-black hover:text-gold">
                  COZY 1 BED CENTRALLY LOCATED STAY IN PORTSMOUTH
                </div>

                <div className="text-black leading-8 text-left ">
                  <div className="grid grid-cols-2 gap-y-8">
                    <div className="flex gap-x-2">
                      <div>
                        <Image src={propertySize} width={62} height={62} />
                      </div>
                      <div>
                        <div>PROPERTY SIZE</div>
                        <div>20,000 SQFT</div>
                      </div>
                    </div>
                    <div className="flex gap-x-2">
                      <div>
                        <Image src={propertyType} width={62} height={62} />
                      </div>
                      <div>
                        <div>STATUS</div>
                        <div>UNDER CONSTRUCTION</div>
                      </div>
                    </div>
                    <div className="flex gap-x-2">
                      <Image src={price} width={62} height={62} />
                      <div>
                        <div>PRICE RANGE</div>
                        <div>$10k - $50k</div>
                      </div>
                    </div>
                    <div className="flex gap-x-2">
                      <div>
                        <Image src={status} width={62} height={62} />
                      </div>
                      <div>
                        <div>TYPE</div>
                        <div>SKY VILLA</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <Button
                    onClick={() => {
                      router.push({ pathname: "/propertyDetails" });
                    }}
                    variant="secondary"
                  >
                    VIEW DETAILS
                  </Button>
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

export default Properties;
