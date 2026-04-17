import { useState, useEffect } from 'react'
import img1 from "../assets/images/banner1.jpg";
import img2 from "../assets/images/banner2.jpg";
import img3 from "../assets/images/banner3.jpg";
const Carousel = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(true);
    // const images = [
    //     "https://placehold.co/600x400?text=Slide+1",
    //     "https://placehold.co/600x400?text=Slide+2",
    //     "https://placehold.co/600x400?text=Slide+3",
    //     "https://placehold.co/600x400?text=Slide+4",
    //     "https://placehold.co/600x400?text=Slide+5",
    //     "https://placehold.co/600x400?text=Slide+6",
    // ];
    const images = [img1, img2, img3];
    const extendedImages = [...images, images[0]]; // add first image at the end for seamless transition

    // 👉 Next Slide
    const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1));
    }

    // 👉 Previous Slide
    const prevSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1));
    }

    // 👉 Auto Slide
    useEffect(() => {
        const interval = setInterval(() => {
            nextSlide();
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (currentIndex === images.length) {
            // wait for slide animation to finish
            setTimeout(() => {
                setIsTransitioning(false); // ❌ disable animation
                setCurrentIndex(0);        // jump instantly

                // re-enable animation
                setTimeout(() => {
                    setIsTransitioning(true);
                }, 50);
            }, 500);
        }

        if (currentIndex < 0) {
            setTimeout(() => {
                setIsTransitioning(false);
                setCurrentIndex(images.length - 1);

                setTimeout(() => {
                    setIsTransitioning(true);
                }, 50);
            }, 500);
        }
    }, [currentIndex]);

    return (
        <div className="w-full overflow-hidden relative">

            {/* Slides Wrapper */}
            <div
                className={`flex ${isTransitioning ? "transition-transform duration-500 ease-in-out" : ""}`}
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
                {extendedImages.map((img, index) => (
                    <img
                        key={index}
                        src={img}
                        alt="slide"
                        className="w-full h-100 object-cover shrink-0"
                    />
                ))}
            </div>

            {/* Prev Button */}
            <button
                onClick={prevSlide}
                className="absolute top-1/2 left-4 -translate-y-1/2 
               bg-black/50 text-white p-3 rounded-full 
               hover:bg-black/70 transition"
            >
                ❮
            </button>

            {/* Next Button */}
            <button
                onClick={nextSlide}
                className="absolute top-1/2 right-4 -translate-y-1/2 
               bg-black/50 text-white p-3 rounded-full 
               hover:bg-black/70 transition"
            >
                ❯
            </button>

            {/* Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex">
                {images.map((_, index) => (
                    <span
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`w-3 h-3 mx-1 rounded-full cursor-pointer transition-all ${currentIndex === index ||
                                (currentIndex === images.length && index === 0)
                                ? "bg-white scale-110"
                                : "bg-gray-400"
                            }`}
                    />
                ))}
            </div>

        </div>
    );
}

export default Carousel