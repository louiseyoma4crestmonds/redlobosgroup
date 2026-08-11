import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import UtilityBar from "@/organisms/UtilityBar";
import Heading from "@/atoms/Heading";
import Button from "@/atoms/Button";
import Footer from "@/organisms/Footer";

function Contacts(): JSX.Element {
  const navigate = useNavigate();
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
          <UtilityBar activeLink="CONTACTS" />
        </div>
        {/* END OF UTILITY BAR */}
        <div className="px-6 bg-green1 tablet:p-28">
          <div className="text-center pt-12 space-y-3 bg-green1">
            <div>
              <Heading Tag="h1" variant="xxl">
                <span className="text-center">CONTACT US</span>
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
              <div className="text-gray1">CONTACT</div>
            </div>
          </div>

          <div className="text-center py-12 space-y-3 bg-green1">
            <div className="text-gold">MAIN OFFICE</div>
            <div className="uppercase font-bold">
              71-75 Shelton Street, Covent Garden, London, United Kingdom, WC2H
              9JQ
            </div>
            <div className="text-gray1 text">
              <div>prisca@redlobosgroup.com</div>
              <div>+44-7424733629</div>
            </div>
          </div>
          <div className="w-full ">
            <iframe
              title="mappedLocation"
              src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d2482.907826319617!2d-0.12615912340288685!3d51.514907010155014!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sng!4v1692522995835!5m2!1sen!2sng"
              className="w-full h-72 tablet:h-[600px]"
              loading="lazy"
            />
          </div>
          {/* ENQUIRY SECTION */}
          <div className="py-8 px-4 space-y-3 tablet:pt-24">
            <div className="text-center space-y-3 flex place-content-center">
              <div className="w-full space-y-4 tablet:w-6/12">
                <div>LEAVE A MESSAGE</div>
                <div>
                  <Heading Tag="h1" variant="xl">
                    <span className="text-center">
                      LETS MAKE SOMETHING NEW TOGETHER
                    </span>
                  </Heading>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="w-full flex flex-col place-content-center space-y-4 tablet:flex-row tablet:gap-4 tablet:space-y-0">
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                    Your Name
                  </label>
                  <input
                    className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold transition-all"
                    placeholder="Jane Smith"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                    Phone Number
                  </label>
                  <input
                    className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold transition-all"
                    placeholder="+44 7700 000000"
                  />
                </div>
              </div>

              <div className="w-full flex place-content-center">
                <div className="w-full tablet:w-4/12">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                    Message
                  </label>
                  <textarea
                    rows={5}
                    className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold transition-all resize-none"
                    placeholder="Write your message…"
                  />
                </div>
              </div>

              <div className="w-full flex place-content-center gap-2">
                <input
                  type="checkbox"
                  id="terms"
                  className="mt-0.5 accent-gold cursor-pointer"
                />
                <label htmlFor="terms" className="text-sm text-gray-600 cursor-pointer">
                  I accept <span className="font-bold text-gray-800">Terms &amp; Conditions</span>{" "}
                  for processing personal data
                </label>
              </div>

              <div className="w-full flex place-content-center">
                <div className="w-3/5 tablet:w-1/5">
                  <Button variant="primary" width="full">
                    <span className="w-full text-center">SUBMIT</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
          {/* END ENQUIRY SECTION */}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Contacts;
