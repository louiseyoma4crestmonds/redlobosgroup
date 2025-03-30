import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import UtilityBar from "@/organisms/UtilityBar";
import Heading from "@/atoms/Heading";
import Footer from "@/organisms/Footer";
import logo from "../../public/logo.gif";

function PropertyDetails(): JSX.Element {
  const router = useRouter();
  const { data: session } = useSession();
  const [events, setEvents] = useState([]);
  const [introPage, setIntroPage] = useState<boolean>(true);

  useEffect(() => {
    if (introPage) {
      setIntroPage(true);
      setTimeout(() => {
        setIntroPage(false);
      }, 5000);
    }
  });

  useEffect(() => {
    if (session) {
      fetch("/api/calendar")
        .then((res) => res.json())
        .then((data) => setEvents(data));
    }
  }, [session]);

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
                <span className="text-center">PROPERTY DETAILS</span>
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
              <div className="text-gray1">OVERVIEW</div>
            </div>
          </div>

          <div className="flex flex-col tablet:pt-0 tablet:flex-row tablet:justify-between tablet:gap-x-8 tablet:px-24">
            {events.map((calendarEvent: any) => (
              <div key={calendarEvent.id}>- {calendarEvent.summary}</div>
            ))}
            <iframe
              src="https://calendar.google.com/calendar/embed?src=b3VpbWFzZ2xvYmFsQGdtYWlsLmNvbQ&ctz=UTC"
              style={{ border: "0", width: "80%", height: "80vh" }}
              title="nby"
            />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default PropertyDetails;
