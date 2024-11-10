import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

type Photo = {
  url: string;
  alt?: string;
};

const PhotoGallery = ({ photos = [] }: { photos: Photo[] }) => {
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
    <div className="w-full">
      <h2 className="text-2xl font-semibold mb-4">Photos</h2>

      {/* Photo Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {photos.map((photo: Photo, index) => (
          <div
            key={index}
            className="relative aspect-[4/3] rounded-lg overflow-hidden cursor-pointer group"
            onClick={() => openModal(index)}
          >
            <img
              src={photo.url || '/api/placeholder/400/300'}
              alt={photo.alt || `Photo ${index + 1}`}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300" />
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedPhoto !== null && (
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
              selectedPhoto === 0 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={selectedPhoto === 0}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={() => navigatePhoto(1)}
            className={`absolute right-4 text-white p-2 hover:bg-white/10 rounded-full ${
              selectedPhoto === photos.length - 1
                ? 'opacity-50 cursor-not-allowed'
                : ''
            }`}
            disabled={selectedPhoto === photos.length - 1}
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Main Image */}
          <div className="flex justify-center items-center max-w-full max-h-[80vh] overflow-hidden">
            <img
              src={photos[selectedPhoto]?.url || '/api/placeholder/800/600'}
              alt={photos[selectedPhoto]?.alt || `Photo ${selectedPhoto + 1}`}
              className="max-w-full max-h-full object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};

const PropertyGallery = () => {
  const samplePhotos = [
    { url: '/propertyImage1.jpeg', alt: 'Living Room' },
    { url: '/propertyImage2.jpeg', alt: 'Kitchen' },
    { url: '/propertyImage3.jpeg', alt: 'Bedroom' },
    { url: '/propertyImage1.jpeg', alt: 'Bathroom' },
  ];

  return (
    <div className="py-10">
      <PhotoGallery photos={samplePhotos} />
    </div>
  );
};

export default PropertyGallery;
