import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import useEmblaCarousel from "embla-carousel-react";
import { MdNavigateBefore, MdNavigateNext } from "react-icons/md"; // Import Material Icons
import Autoplay from "embla-carousel-autoplay";
import { Button } from "@/components/ui/button";

const Listing = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ playOnInit: false, delay: 2000 }),
  ]);

  const params = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const onButtonAutoplayClick = useCallback(
    (callback) => {
      const autoplay = emblaApi?.plugins()?.autoplay;
      if (!autoplay) return;

      const resetOrStop =
        autoplay.options.stopOnInteraction === false
          ? autoplay.reset
          : autoplay.stop;

      resetOrStop();
      callback();
    },
    [emblaApi]
  );
  const toggleAutoplay = useCallback(() => {
    const autoplay = emblaApi?.plugins()?.autoplay;
    if (!autoplay) return;

    const playOrStop = autoplay.isPlaying() ? autoplay.stop : autoplay.play;
    playOrStop();
  }, [emblaApi]);

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
  useEffect(() => {
    const autoplay = emblaApi?.plugins()?.autoplay;
    if (!autoplay) return;

    setIsPlaying(autoplay.isPlaying());
    emblaApi
      .on("autoplay:play", () => setIsPlaying(true))
      .on("autoplay:stop", () => setIsPlaying(false))
      .on("reInit", () => setIsPlaying(false));
  }, [emblaApi]);

  const scrollPrev = () => {
    if (emblaApi) {
      emblaApi.scrollPrev();
      if (isPlaying) toggleAutoplay(); // Stop autoplay when clicking "Prev" button
    }
  };

  const scrollNext = () => {
    if (emblaApi) {
      emblaApi.scrollNext();
      if (isPlaying) toggleAutoplay(); // Stop autoplay when clicking "Next" button
    }
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
          <div className="embla relative" ref={emblaRef}>
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
            <div className="button-container absolute top-0 right-0 m-4">
              {/* Position the autoplay button container */}
              {isPlaying && (
                <button
                  onClick={toggleAutoplay}
                  type="button"
                  className="bg-white text-black p-2 rounded-full font-semibold"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    class="w-6 h-6"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M6.75 5.25a.75.75 0 0 1 .75-.75H9a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H7.5a.75.75 0 0 1-.75-.75V5.25Zm7.5 0A.75.75 0 0 1 15 4.5h1.5a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H15a.75.75 0 0 1-.75-.75V5.25Z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </button>
              )}
              {!isPlaying && (
                <button
                  onClick={toggleAutoplay}
                  type="button"
                  className="bg-white text-black p-2 rounded-full font-semibold"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    class="w-6 h-6"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </button>
              )}
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
          </div>
        </>
      )}
    </main>
  );
};

export default Listing;
