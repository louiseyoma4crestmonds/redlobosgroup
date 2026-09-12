import styled, { keyframes } from "styled-components";
import { slideInRight, slideInLeft, zoomIn } from "react-animations";
import { useNavigate } from "react-router-dom";
import { Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import UtilityBar from "@/organisms/UtilityBar";
import Heading from "@/atoms/Heading";
import Button from "@/atoms/Button";
import Footer from "@/organisms/Footer";
import AddOnCard from "@/molecules/AddOnCard/AddOnCard";
import { addOnBrief } from "../data/addOnData";

function Home(): JSX.Element {
  const navigate = useNavigate();
  const [introPage, setIntroPage] = useState<boolean>(true);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [audioBlocked, setAudioBlocked] = useState(false);

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
      const introTimer = setTimeout(() => {
        setIntroPage(false);
      }, 700);

      return () => clearTimeout(introTimer);
    }
  }, [introPage]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.35;

    const removeInteractionListeners = () => {
      window.removeEventListener("pointerdown", handleInteraction);
      window.removeEventListener("keydown", handleInteraction);
    };

    const attemptPlay = async () => {
      try {
        await audio.play();
        setIsAudioPlaying(true);
        setAudioBlocked(false);
        removeInteractionListeners();
      } catch {
        // Browsers may block unmuted autoplay until the visitor interacts.
        setAudioBlocked(true);
      }
    };

    const handleInteraction = () => {
      void attemptPlay();
    };

    void attemptPlay();
    window.addEventListener("pointerdown", handleInteraction);
    window.addEventListener("keydown", handleInteraction);

    return () => {
      removeInteractionListeners();
      audio.pause();
      audio.currentTime = 0;
    };
  }, []);

  const toggleAudio = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      audio
        .play()
        .then(() => {
          setIsAudioPlaying(true);
          setAudioBlocked(false);
        })
        .catch(() => setAudioBlocked(true));
    } else {
      audio.pause();
      setIsAudioPlaying(false);
    }
  };

  return (
    <div>
      <audio
        ref={audioRef}
        src="/landing-audio.mp3"
        autoPlay
        loop
        preload="auto"
        aria-hidden="true"
      />

      <button
        type="button"
        onClick={toggleAudio}
        aria-label={
          isAudioPlaying
            ? "Mute landing page audio"
            : "Enable landing page audio"
        }
        title={
          audioBlocked && !isAudioPlaying
            ? "Click to enable sound"
            : isAudioPlaying
              ? "Mute sound"
              : "Play sound"
        }
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-gold px-4 py-3 text-sm font-semibold text-white shadow-lg transition-colors hover:bg-black"
      >
        {isAudioPlaying ? (
          <>
            <VolumeX className="h-4 w-4" aria-hidden="true" />
            <span>Mute</span>
          </>
        ) : (
          <>
            <Volume2 className="h-4 w-4" aria-hidden="true" />
            <span>{audioBlocked ? "Enable sound" : "Play sound"}</span>
          </>
        )}
      </button>

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
                  <img
                    className="rounded-lg"
                    src="/firstImage-optimized.webp"
                    alt="Premium Red Lobos shortlet accommodation"
                    loading="lazy"
                    decoding="async"
                  />
                </SlideInLeftDiv>
              </div>

              <div className="tablet:w-6/12 space-y-12 tablet:mt-24">
                <div>
                  <ZoomInDiv>
                    <Heading Tag="h1" variant="lg">
                      <span className="text-center">
                        HOSPITALITY, PROPERTY & LIFESTYLE SERVICES
                      </span>
                    </Heading>
                  </ZoomInDiv>
                </div>

                <div>
                  <ZoomInDiv>
                    <p className="text-gray1 leading-8">
                      Red Lobos Group Ltd provides tailored hospitality and property solutions, 
                      from short and long-stay accommodation and property management to interior 
                      styling, curated experiences and creative spaces.
                    </p>
                  </ZoomInDiv>
                </div>
                <div className="w-full flex place-content-center">
                  <div className="w-3/5">
                    <Button
                      variant="secondary"
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
              </div>
              <div className="hidden tablet:block h-[100px] w-3/12   absolute right-0 mt-[100px]">
                <SlideInRightDiv>
                  <img
                    className="rounded-lg"
                    src="/secondImage-optimized.webp"
                    alt="Modern serviced accommodation living space"
                    loading="lazy"
                    decoding="async"
                  />
                </SlideInRightDiv>
              </div>
            </div>

            <div className="spce-y-8">
              <div className="py-8 space-y-6">
                <div className="tablet:flex tablet:place-content-center">
                  <div className="w-full space-y-4 tablet:w-8/12">
                    <div />
                    <div>
                      <Heading Tag="h2" variant="lg">
                        <span className="text-center">
                          ENHANCE YOUR EXPERIENCE WITH OUR SPECIAL SERVICES
                        </span>
                      </Heading>
                    </div>
                  </div>
                </div>

                <div className="py-16 space-y-16">
                  {addOnBrief?.map(({ image, description, btn_text, id, title }) => (
                    <div key={id}>
                      <AddOnCard
                        src={image}
                        title={title}
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
