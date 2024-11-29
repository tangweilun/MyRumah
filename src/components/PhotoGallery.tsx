import React, { useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

const PropertyGallery = ({ photos = [] }: { photos: string[] }) => {
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);

  const openModal = (index: number) => {
    setSelectedPhoto(index);
  };

  const closeModal = () => {
    setSelectedPhoto(null);
  };

  const navigatePhoto = (direction: number) => {
    if (selectedPhoto !== null) {
      const newIndex = selectedPhoto + direction;
      if (newIndex >= 0 && newIndex < photos.length) {
        setSelectedPhoto(newIndex);
      }
    }
  };

  return (
    <div className="w-full py-4">
      <h2 className="text-2xl font-semibold mb-4">Photos</h2>

      {/* Photo Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {photos.map((photo: string, index) => (
          <div
            key={index}
            className="relative aspect-[4/3] rounded-lg overflow-hidden cursor-pointer group"
            onClick={() => openModal(index)}
          >
            {photo ? (
              <Image
                src={`data:image/jpeg;base64,${Buffer.from(photo).toString(
                  "base64"
                )}`}
                alt={`Photo ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                width={400}
                height={300}
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <span>No Image</span>
              </div>
            )}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300" />
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedPhoto !== null && photos[selectedPhoto] && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90">
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 text-white p-2 hover:bg-white/10 rounded-full"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Navigation Buttons */}
          <button
            onClick={() => navigatePhoto(-1)}
            className={`absolute left-4 text-white p-2 hover:bg-white/10 rounded-full ${
              selectedPhoto === 0 ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={selectedPhoto === 0}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={() => navigatePhoto(1)}
            className={`absolute right-4 text-white p-2 hover:bg-white/10 rounded-full ${
              selectedPhoto === photos.length - 1
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
            disabled={selectedPhoto === photos.length - 1}
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Main Image */}
          <div className="flex justify-center items-center max-w-full max-h-[80vh] overflow-hidden">
            <Image
              src={`data:image/jpeg;base64,${Buffer.from(
                photos[selectedPhoto]
              ).toString("base64")}`}
              alt={`Photo ${selectedPhoto + 1}`}
              className="max-w-full max-h-full object-contain"
              width={800}
              height={600}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyGallery;
