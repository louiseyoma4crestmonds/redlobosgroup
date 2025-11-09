import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import UtilityBar from "@/organisms/UtilityBar";
import Heading from "@/atoms/Heading";
import Footer from "@/organisms/Footer";
import Button from "@/atoms/Button";
import Modal from "@/molecules/Modal";
import BookingCalendar from "@/molecules/BookingCalendar";
import ReserveScheduler from "@/organisms/ReserveScheduler";
import Calendar from "@/organisms/Calendar";
import { getPropertyAmenities, getPropertyImages, getPropertyEvents } from "./api";
import logo from "../../public/logoAnimation.gif";

function PropertyDetails(): JSX.Element {
  const router = useRouter();
  const { data: session } = useSession();
  const [eventz, setEvents] = useState([]);
  const [amenities, setAmenities] = useState([]);
  const [images, setImages] = useState([]);
  const [introPage, setIntroPage] = useState<boolean>(true);
  const [showCalendar, setShowCalendar] = useState<boolean>(false);
  const [showDescriptionModal, setShowDescriptionModal] =
    useState<boolean>(false);
  const [showBookingModal, setShowBookingModal] = useState<boolean>(false);
  const [checkInDate, setCheckInDate] = useState<string | null>(null);
  const [checkOutDate, setCheckOutDate] = useState<string | null>(null);
  const [guestCount, setGuestCount] = useState<string>("1");
  const [propertyEvents, setPropertyEvents] = useState<any>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIntroPage(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (router.isReady && router.query.id) {
      getPropertyAmenities(router.query.id).then((response: any) => {
        setAmenities(response.data.data[0]);
      });
      getPropertyImages(router.query.id).then((response: any) => {
        setImages(response.data.data);
      });
    }
  }, [router.isReady, router.query.id]);

  console.log(eventz);

  useEffect(() => {
    if (session) {
      fetch("/api/calendar")
        .then((res) => res.json())
        .then((data) => setEvents(data));
    }
  }, [session]);

  const handleBookNowClick = () => {
    setShowBookingModal(true);
    
    if (router.query.id) {
      getPropertyEvents(router.query.id).then((response: any) => {
        setPropertyEvents(response.data.data[0] || []);
      });
    }
  };

  const handleCloseBookingModal = () => {
    setShowBookingModal(false);
    setCheckInDate(null);
    setCheckOutDate(null);
    setGuestCount("1");
    setPropertyEvents([]);
  };

  const handleMakeReservation = () => {
    console.log("Reservation Details:", {
      propertyId: router.query.id,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      guests: guestCount,
    });
    handleCloseBookingModal();
  };

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

        <div className="px-6 bg-green1 space-y-4">
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

          {/*
            {events.map((calendarEvent: any) => (
              <div key={calendarEvent.id}>- {calendarEvent.summary}</div>
            ))}
            <iframe
              src="https://calendar.google.com/calendar/embed?src=b3VpbWFzZ2xvYmFsQGdtYWlsLmNvbQ&ctz=UTC"
              style={{ border: "0", width: "80%", height: "80vh" }}
              title="nby"
            />
            */}
          <div className="w-full flex flex-col laptop:flex-row desktop:flex-row phone:gap-y-4 gap-x-4">
            <div className="basis-3/6 phone:w-full">
              {images.map((image: any, index: number) => (
                <div key={index}>
                  {image.primary ? (
                    <div
                      style={{
                        backgroundImage: `url("${image.image}")`,
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "cover",
                        backgroundPositionX: "center",
                      }}
                      className="h-[300px] laptop:h-[420px] desktop:h-[420px] tablet:h-[420px]"
                    />
                  ) : (
                    ""
                  )}
                </div>
              ))}
            </div>
            <div className="basis-3/6 grid grid-cols grid-cols-2  gap-4">
              {images.map((image: any, index: number) => (
                <div key={index} className={image.primary ? "hidden" : ""}>
                  {image.primary === false && index < 5 ? (
                    <div>
                      <div className="basis-3/6 h-[204px]">
                        <div
                          style={{
                            backgroundImage: `url("${image.image}")`,
                            backgroundRepeat: "no-repeat",
                            backgroundSize: "cover",
                            backgroundPositionX: "center",
                          }}
                          className="h-full p-4"
                        />
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="w-full flex flex-row-reverse ">
            <div className="w-full desktop:w-1/4 laptop:w-1/4 tablet:w-1/4">
              <Button
                variant="primary"
                width="full"
                disabled={!router.isReady || !router.query.id}
                onClick={() => {
                  if (router.query.id) {
                    router.push({
                      pathname: "/photoGallery",
                      query: { id: router.query.id },
                    });
                  }
                }}
              >
                <span className="w-full text-center">SHOW ALL PHOTOS</span>
              </Button>
            </div>
          </div>
          <div>
            <div className="text-black">Tourist Best Find in Portsmouth</div>
            <div className="text-black">
              2 Guests - 1 Bedroom - 1 Bath - Water Heater{" "}
            </div>
          </div>
          <hr />
          <div className="py-4 w-full flex tablet:gap-x-12 desktop:gap-x-12 laptop:gap-x-12 tablet:flex-row desktop:flex-row laptop:flex-row phone:flex-col phone:gap-y-8">
            <div className="space-y-4 basis-full tablet:basis-4/6 laptop:basis-4/6 desktop:basis-4/6">
              <div>Description</div>

              <div className="space-y-6">
                <div>
                  The Tourist best find in portsmouth is on the hills of england
                  is the ideal retreat for romantics and nature lovers. On just
                  25 m², a cozy atmosphere awaits you with a bedroom, a small
                  kitchen and a dining area. Enjoy the stunning ocean view from
                  your covered terrace, just a meter from the mountains.
                  Children are very welcome and restaurants and shopping are in
                  the immediate vicinity. Experience unforgettable moments on
                  the Wa ...
                </div>
                <div className="w-full desktop:w-1/4 laptop:w-1/4 tablet:w-1/4">
                  <Button
                    variant="secondary"
                    width="full"
                    onClick={() => setShowDescriptionModal(true)}
                  >
                    <span className="w-full text-center">SHOW MORE</span>
                  </Button>
                </div>
              </div>
            </div>
            <div className="space-y-4 basis-full tablet:basis-2/6 laptop:basis-2/6 desktop:basis-2/6">
              <div>What this place offers</div>
              <div className="grid grid-cols-2">
                {amenities.map((amenity: any, index: number) => (
                  <div key={index}>
                    <div className="flex gap-x-2">
                      <div className="self-center">
                        <Image
                          src={amenity ? amenity.image : ""}
                          width={20}
                          height={20}
                        />
                      </div>
                      <div className="self-center">{amenity.label.name}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <hr />
          <div className="w-full flex place-content-center gap-4 py-8">
            <div className="w-full tablet:w-2/4 desktop:w-2/4 laptop:w-2/4">
              <Button
                variant="primary"
                width="full"
                onClick={handleBookNowClick}
              >
                <span className="w-full text-center">MAKE RESERVATION</span>
              </Button>
            </div>
            <div className="w-full tablet:w-2/4 desktop:w-2/4 laptop:w-2/4">
              <Button
                variant="secondary"
                width="full"
                onClick={() => setShowCalendar(true)}
              >
                <span className="w-full text-center">VIEW CALENDAR</span>
              </Button>
            </div>
          </div>
          <hr />
          <div className="space-y-4 p-4">
            <div>Where you will be</div>
            <div>d</div>
            <div className="rounded-lg">c</div>
          </div>
        </div>
        <div>
          <Calendar isOpen={showCalendar} closeCalendar={setShowCalendar} />
        </div>
      </div>
      <Footer />

      <Modal
        isOpen={showDescriptionModal}
        onClose={() => setShowDescriptionModal(false)}
      >
        <div className="space-y-6 p-4 max-w-3xl">
          <div className="text-center">
            <Heading Tag="h2" variant="lg">
              <span>Full Property Description</span>
            </Heading>
          </div>

          <div className="space-y-4 text-gray-700 leading-7">
            <div className="font-semibold text-black text-xl">
              Tourist Best Find in Portsmouth
            </div>

            <div>
              The Tourist best find in portsmouth is on the hills of England is
              the ideal retreat for romantics and nature lovers. On just 25 m²,
              a cozy atmosphere awaits you with a bedroom, a small kitchen and
              a dining area. Enjoy the stunning ocean view from your covered
              terrace, just a meter from the mountains.
            </div>

            <div>
              Children are very welcome and restaurants and shopping are in the
              immediate vicinity. Experience unforgettable moments on the
              waterfront of Portsmouth, where relaxation and adventure go hand
              in hand.
            </div>

            <div>
              This charming property offers the perfect blend of comfort and
              natural beauty. Wake up to breathtaking views of the English
              countryside and enjoy your morning coffee on the private terrace.
              The compact yet thoughtfully designed space ensures you have
              everything you need for a memorable stay.
            </div>

            <div>
              <strong>Perfect for:</strong>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Romantic getaways</li>
                <li>Solo travelers seeking tranquility</li>
                <li>Nature enthusiasts</li>
                <li>Families with children</li>
              </ul>
            </div>

            <div>
              <strong>Nearby attractions:</strong> Explore local restaurants,
              shopping centers, hiking trails, and scenic viewpoints all within
              easy reach of this beautiful property.
            </div>
          </div>

          <div className="pt-4">
            <Button
              variant="primary"
              width="full"
              onClick={() => setShowDescriptionModal(false)}
            >
              CLOSE
            </Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={showBookingModal} onClose={handleCloseBookingModal}>
        <div className="space-y-6 p-6 max-w-2xl mx-auto">
          <div className="text-center">
            <Heading Tag="h2" variant="lg">
              <span>Book Your Stay</span>
            </Heading>
            <p className="text-gray1 mt-2">Tourist Best Find in Portsmouth</p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select Check-in and Check-out Dates
              </label>
              <BookingCalendar
                events={propertyEvents}
                checkInDate={checkInDate}
                checkOutDate={checkOutDate}
                onCheckInSelect={(date) => setCheckInDate(date)}
                onCheckOutSelect={(date) => setCheckOutDate(date)}
              />
            </div>

            {checkInDate && checkOutDate && (
              <div className="bg-green1 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-600">Check-in</p>
                    <p className="font-semibold">{checkInDate}</p>
                  </div>
                  <div className="text-gray-400">→</div>
                  <div>
                    <p className="text-sm text-gray-600">Check-out</p>
                    <p className="font-semibold">{checkOutDate}</p>
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Guests
              </label>
              <input
                type="number"
                min="1"
                value={guestCount}
                onChange={(e) => setGuestCount(e.target.value)}
                className="w-full rounded-md border border-gray-300 py-3 px-4 text-lg text-gray-700 outline-none focus:ring-1 focus:ring-gold"
              />
            </div>

            <div className="pt-2">
              <Button
                variant="primary"
                width="full"
                onClick={handleMakeReservation}
              >
                MAKE RESERVATION
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default PropertyDetails;
