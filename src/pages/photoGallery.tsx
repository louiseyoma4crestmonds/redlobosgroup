import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import UtilityBar from "@/organisms/UtilityBar";
import Heading from "@/atoms/Heading";
import Footer from "@/organisms/Footer";
import Button from "@/atoms/Button";
import { getPropertyImages } from "../api";

function PhotoGallery(): JSX.Element {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const [images, setImages] = useState([]);
  const [introPage, setIntroPage] = useState<boolean>(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIntroPage(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (id) {
      getPropertyImages(id).then((response: any) => {
        setImages(response.data.data);
      });
    }
  }, [id]);

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
          <UtilityBar activeLink="PROPERTIES" />
        </div>
        {/* END OF UTILITY BAR */}

        <div className="px-6 bg-green1 space-y-6 pb-12">
          <div className="text-center pt-12 space-y-3 bg-green1">
            <div>
              <Heading Tag="h1" variant="xxl">
                <span className="text-center">PHOTO GALLERY</span>
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
              <div
                className="cursor-pointer"
                tabIndex={0}
                role="button"
                onKeyDown={() => {}}
                onClick={() => {
                  navigate("/properties");
                }}
              >
                PROPERTIES
              </div>
              <div> &gt;</div>
              <div className="text-gray1">GALLERY</div>
            </div>
          </div>

          <div className="w-full flex justify-end">
            <div className="w-full desktop:w-1/4 laptop:w-1/4 tablet:w-1/3">
              <Button
                variant="secondary"
                width="full"
                onClick={() => {
                  navigate(-1);
                }}
              >
                <span className="w-full text-center">BACK TO DETAILS</span>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 tablet:grid-cols-2 laptop:grid-cols-3 desktop:grid-cols-3 gap-4">
            {images.map((image: any, index: number) => (
              <div
                key={index}
                className={`
                  ${index % 7 === 0 || index % 7 === 3 ? "tablet:col-span-2" : ""}
                  ${index % 7 === 0 ? "tablet:row-span-2" : ""}
                `}
              >
                <div
                  style={{
                    backgroundImage: `url("${image.image}")`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                  className={`
                    w-full rounded-lg overflow-hidden
                    ${index % 7 === 0 ? "h-[500px]" : "h-[240px]"}
                  `}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default PhotoGallery;
