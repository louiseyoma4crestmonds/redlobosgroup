import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import UtilityBar from "@/organisms/UtilityBar";
import Heading from "@/atoms/Heading";
import Footer from "@/organisms/Footer";
import { getPropertyImages } from "../api";

interface PropertyImage {
  id: number;
  image_url: string;
  is_primary: boolean;
}

function PhotoGallery(): JSX.Element {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  const [images, setImages] = useState<PropertyImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(false);
    getPropertyImages(id)
      .then((response: any) => {
        const data = response?.data?.data;
        setImages(Array.isArray(data) ? data : []);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div className="min-h-screen flex flex-col bg-green1">
      <UtilityBar activeLink="PROPERTIES" />

      {/* Header */}
      <div className="text-center pt-12 pb-6 space-y-3 px-6">
        <Heading Tag="h1" variant="xxl">
          <span>PHOTO GALLERY</span>
        </Heading>
        <div className="flex gap-2 place-content-center text-sm">
          <button
            type="button"
            className="hover:text-gold transition-colors"
            onClick={() => navigate("/")}
          >
            HOME
          </button>
          <span>&gt;</span>
          <button
            type="button"
            className="hover:text-gold transition-colors"
            onClick={() => navigate("/properties")}
          >
            PROPERTIES
          </button>
          <span>&gt;</span>
          <button
            type="button"
            className="hover:text-gold transition-colors"
            onClick={() => navigate(-1)}
          >
            DETAILS
          </button>
          <span>&gt;</span>
          <span className="text-gray1">GALLERY</span>
        </div>
      </div>

      <div className="flex-1 px-6 tablet:px-16 desktop:px-24 pb-16 space-y-6">
        {/* Back button */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-2.5 rounded-lg border border-gold text-gold text-sm font-semibold hover:bg-gold hover:text-white transition-colors duration-300"
          >
            ← BACK TO DETAILS
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-32">
            <div className="w-10 h-10 border-2 border-gold border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <p className="text-gray1 text-lg">Could not load photos. Please try again.</p>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-3 rounded-lg bg-gold text-white font-semibold hover:bg-black transition-colors duration-300"
            >
              GO BACK
            </button>
          </div>
        )}

        {/* No images */}
        {!loading && !error && images.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <p className="text-gray1 text-lg">No photos available for this property.</p>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-3 rounded-lg bg-gold text-white font-semibold hover:bg-black transition-colors duration-300"
            >
              GO BACK
            </button>
          </div>
        )}

        {/* Masonry-style grid */}
        {!loading && !error && images.length > 0 && (
          <div className="grid grid-cols-1 tablet:grid-cols-2 laptop:grid-cols-3 desktop:grid-cols-3 gap-4">
            {images.map((image, index) => (
              <div
                key={image.id ?? index}
                className={[
                  index % 7 === 0 || index % 7 === 3 ? "tablet:col-span-2" : "",
                  index % 7 === 0 ? "tablet:row-span-2" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                <img
                  src={image.image_url}
                  alt={`Property photo ${index + 1}`}
                  className={[
                    "w-full rounded-2xl object-cover",
                    index % 7 === 0 ? "h-[500px]" : "h-[240px]",
                  ].join(" ")}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/property1.jpg";
                  }}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default PhotoGallery;
