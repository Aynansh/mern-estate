import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useEmblaCarousel from "embla-carousel-react";
import { MdNavigateBefore, MdNavigateNext } from "react-icons/md"; // Import Material Icons

const Listing = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  const params = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setError(false);
        setLoading(true);
        const listingId = params.listingId;
        const res = await fetch(`/api/listing/get/${listingId}`);
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          console.log(data.message);
          return;
        }
        setListing(data);
        setLoading(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.listingId]);

  const scrollPrev = () => {
    if (emblaApi) emblaApi.scrollPrev();
  };

  const scrollNext = () => {
    if (emblaApi) emblaApi.scrollNext();
  };

  return (
    <main className="relative">
      {loading && <p className="text-center text-2xl my-7">Loading...</p>}
      {error && (
        <p className="text-center text-2xl my-7 text-red-600">
          Something went wrong
        </p>
      )}
      {listing && !loading && !error && (
        <>
          <div className="embla" ref={emblaRef}>
            <div className="embla__container">
              {listing.imageUrls.map((url, index) => (
                <div
                  className="embla__slide"
                  key={index}
                  style={{
                    backgroundImage: `url(${url})`,
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                  }}
                ></div>
              ))}
            </div>
          </div>
          <button
            className="embla__prev absolute top-1/2 left-0 transform -translate-y-1/2 bg-white rounded-full m-2"
            onClick={scrollPrev}
          >
            <MdNavigateBefore size={40} /> {/* Material Icon for "Prev" */}
          </button>
          <button
            className="embla__next absolute top-1/2 right-0 transform -translate-y-1/2  bg-white rounded-full m-2"
            onClick={scrollNext}
          >
            <MdNavigateNext size={40} /> {/* Material Icon for "Next" */}
          </button>
        </>
      )}
    </main>
  );
};

export default Listing;
