import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import UtilityBar from "@/organisms/UtilityBar";
import Heading from "@/atoms/Heading";
import Footer from "@/organisms/Footer";
import Button from "@/atoms/Button";
import Modal from "@/molecules/Modal";
import BookingCalendar from "@/molecules/BookingCalendar";
import logo from "../../public/logoAnimation.gif";
import testimony1 from "../../public/property1.jpg";
import { getProperties, getPropertyEvents } from "./api";

function Properties(): JSX.Element {
  const router = useRouter();
  const [introPage, setIntroPage] = useState<boolean>(true);
  const [properties, setProperties] = useState<any>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const [checkInDate, setCheckInDate] = useState<string | null>(null);
  const [checkOutDate, setCheckOutDate] = useState<string | null>(null);
  const [guestCount, setGuestCount] = useState<string>("1");
  const [propertyEvents, setPropertyEvents] = useState<any>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIntroPage(false);
    }, 5000);

    getProperties().then((response: any) => {
      setProperties(response.data.data[0]);
    });

    return () => clearTimeout(timer);
  }, []);

  const handleBookNowClick = (property: any) => {
    setSelectedProperty(property);
    setIsModalOpen(true);
    
    getPropertyEvents(property.id).then((response: any) => {
      setPropertyEvents(response.data.data[0] || []);
    });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCheckInDate(null);
    setCheckOutDate(null);
    setGuestCount("1");
    setPropertyEvents([]);
  };

  const handleMakeReservation = () => {
    console.log("Reservation Details:", {
      property: selectedProperty,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      guests: guestCount,
    });
    handleCloseModal();
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
              <div key={property.id} className="flex flex-col tablet:pt-0 tablet:flex-row tablet:justify-between tablet:gap-x-6 tablet:px-24">
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
                          onClick={() => handleBookNowClick(property)}
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

      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <div className="space-y-6 p-6 max-w-2xl mx-auto">
          <div className="text-center">
            <Heading Tag="h2" variant="lg">
              <span>Book Your Stay</span>
            </Heading>
            {selectedProperty && (
              <p className="text-gray1 mt-2">{selectedProperty.name}</p>
            )}
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

export default Properties;
