import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import UtilityBar from "@/organisms/UtilityBar";
import Footer from "@/organisms/Footer";
import Heading from "@/atoms/Heading";

export interface LegalSection {
  title: string;
  content: ReactNode;
}

interface LegalPageProps {
  title: string;
  intro: string;
  lastUpdated: string;
  sections: LegalSection[];
}

export default function LegalPage({
  title,
  intro,
  lastUpdated,
  sections,
}: LegalPageProps): JSX.Element {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-green1">
      <UtilityBar activeLink="" />

      <header className="text-center pt-12 pb-8 px-6">
        <Heading Tag="h1" variant="xxl">
          <span>{title}</span>
        </Heading>
        <div className="flex items-center justify-center gap-2 text-sm mt-3">
          <button
            type="button"
            className="hover:text-gold transition-colors"
            onClick={() => navigate("/")}
          >
            HOME
          </button>
          <span>&gt;</span>
          <span className="text-gray1">{title.toUpperCase()}</span>
        </div>
      </header>

      <main className="flex-1 px-6 tablet:px-16 desktop:px-24 pb-20">
        <article className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 px-6 py-8 tablet:px-12 tablet:py-12">
          <div className="border-b border-gray-100 pb-8 mb-8">
            <p className="text-sm text-gray-500 leading-7">{intro}</p>
            <p className="text-xs text-gray-400 mt-4">
              Last updated: {lastUpdated}
            </p>
          </div>

          <div className="space-y-9">
            {sections.map((section, index) => (
              <section key={section.title} aria-labelledby={`legal-section-${index}`}>
                <h2
                  id={`legal-section-${index}`}
                  className="text-xl font-semibold text-gray-900 mb-3"
                >
                  {index + 1}. {section.title}
                </h2>
                <div className="text-sm text-gray-600 leading-7 space-y-3">
                  {section.content}
                </div>
              </section>
            ))}
          </div>

          <div className="mt-10 pt-7 border-t border-gray-100">
            <button
              type="button"
              onClick={() => navigate("/properties")}
              className="inline-flex rounded-lg bg-gold px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-black"
            >
              BROWSE PROPERTIES
            </button>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}