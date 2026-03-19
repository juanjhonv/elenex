import React, { useState } from "react";

type ProductGalleryProps = {
  images: string[];
};

const ProductGallery: React.FC<ProductGalleryProps> = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState(images[0] || "");

  const currentIndex = images.indexOf(selectedImage);

  const handleNext = () => {
    const nextIndex = (currentIndex + 1) % images.length;
    setSelectedImage(images[nextIndex]);
  };

  const handlePrev = () => {
    const prevIndex = (currentIndex - 1 + images.length) % images.length;
    setSelectedImage(images[prevIndex]);
  };

  if (!images.length) {
    return (
      <div className="flex items-center justify-center bg-gray-100 rounded-lg h-96 w-full">
        <div className="text-gray-400 text-lg">Sin imagen</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4 w-full h-full sticky top-0">
      {/* Thumbnails Sidebar */}
      <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto max-h-[500px] scrollbar-hide">
        {images.map((image, index) => (
          <div
            key={index}
            onMouseEnter={() => setSelectedImage(image)}
            onClick={() => setSelectedImage(image)}
            className={`cursor-pointer border-2 rounded-md overflow-hidden flex-shrink-0 w-16 h-16 md:w-20 md:h-20 transition-all ${selectedImage === image ? "border-orange-500 shadow-md" : "border-gray-200 hover:border-gray-400"
              }`}
          >
            <img
              src={image}
              alt={`Thumbnail ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      {/* Main Image Display */}
      <div className="flex-1 relative flex items-center justify-center bg-white border border-gray-100 rounded-lg overflow-hidden h-[600px] md:h-[600px] group">
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 [background-color:red] hover:bg-white p-2 rounded-full shadow-md z-10 transition-all text-gray-800"
              aria-label="Previous image"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M15 6l-6 6l6 6" /></svg>
            </button>
            <button
              onClick={handleNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white p-2 rounded-full shadow-md z-10 transition-all text-gray-800"
              aria-label="Next image"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M9 6l6 6l-6 6" /></svg>
            </button>
          </>
        )}
        <img
          src={selectedImage}
          alt="Selected product"
          className="max-w-full max-h-full object-contain p-2 transition-opacity duration-300"
        />
      </div>
    </div>
  );
};

export default ProductGallery;
