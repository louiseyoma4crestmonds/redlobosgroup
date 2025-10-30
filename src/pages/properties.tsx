import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import UtilityBar from "@/organisms/UtilityBar";
import Heading from "@/atoms/Heading";
import Footer from "@/organisms/Footer";
import Button from "@/atoms/Button";
import logo from "../../public/logoAnimation.gif";
import testimony1 from "../../public/property1.jpg";
import { getProperties } from "./api";

function Properties(): JSX.Element {
  const router = useRouter();
  const [introPage, setIntroPage] = useState<boolean>(true);
  const [properties, setProperties] = useState<any>([]);

  useEffect(() => {
    if (introPage) {
      setIntroPage(true);
      setTimeout(() => {
        setIntroPage(false);
      }, 5000);
    }
    getProperties().then((response: any) => {
      setProperties(response.data.data[0]);
    });
  });

  return (
    <div>
      {/* LOGO LOADING SCREEN */}
      <div className={!introPage ? "hidden" : ""}>
        <div className="w-screen h-screen flex place-content-center bg-green1">
          <div className="self-center">
            <Image width={200} height={200} src={logo} />
          </div>
        </div>
      </div>
      {/* END OF LOGO LOADING SCREEN */}

      <div className={introPage ? "hidden" : ""}>
        {/* UTILITY BAR */}
        <div>
          <UtilityBar activeLink="PROPERTIES" />
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

          <div>
            {properties.map((property: any) => (
              <div className="flex flex-col tablet:pt-0 tablet:flex-row tablet:justify-between tablet:gap-x-6 tablet:px-24">
                <div className="self-center basis-4/12">
                  <Image className="rounded-2xl" src={testimony1} />
                </div>
                <div className="self-center basis-7/12 tablet:px-8 text-left">
                  <div className="mt-8 space-y-6">
                    <p>{property.address}</p>

                    <div className="text-3xl font-bold cursor-pointer text-black hover:text-gold">
                      {property.name}
                    </div>

                    <div className="flex gap-x-4">
                      <div>
                        <Button
                          onClick={() => {
                            router.push({
                              pathname: "/propertyDetails",
                              query: { id: property.id },
                            });
                          }}
                          variant="primary"
                        >
                          BOOK NOW
                        </Button>
                      </div>
                      <div>
                        <Button
                          onClick={() => {
                            router.push({
                              pathname: "/propertyDetails",
                              query: { id: property.id },
                            });
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
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Properties;
