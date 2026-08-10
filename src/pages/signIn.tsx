import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  useSession,
  signIn,
  signOut,
} from "../context/AuthContext";
import UtilityBar from "@/organisms/UtilityBar";
import Heading from "@/atoms/Heading";
import Footer from "@/organisms/Footer";
import Button from "@/atoms/Button";

function SignIn(): JSX.Element {
  const navigate = useNavigate();
  const { data: session } = useSession();
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
          <UtilityBar activeLink="signIn" />
        </div>
        {/* END OF UTILITY BAR */}

        <div className="px-6 bg-green1 space-y-12">
          <div className="text-center pt-12 space-y-3 bg-green1">
            <div>
              <Heading Tag="h1" variant="xxl">
                <span className="text-center">SIGN IN</span>
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
              <div className="text-gray1">SIGN IN</div>
            </div>
          </div>

          <div className="w-full place-content-center flex flex-col tablet:pt-0 tablet:flex-row tablet:justify-between tablet:gap-x-8 tablet:px-24">
            {session ? (
              <>
                <p>Welcome, {session?.user?.name}</p>
                <Button onClick={() => signOut()}>Sign Out</Button>
              </>
            ) : (
              <div className="w-full flex place-content-center pb-16">
                <div>
                  <Button onClick={() => signIn("google")}>
                    Sign In With Google
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default SignIn;
