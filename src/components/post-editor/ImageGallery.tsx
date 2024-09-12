import React, { useEffect, useState } from 'react';
import Masonry from 'react-masonry-css';

const ImageGallery = ({ onSelectImage }) => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await fetch('/api/all-images');
        const data = await res.json();
        if (res.ok) {
          setImages(data.images);
        } else {
          console.error('Failed to fetch images:', data.error);
        }
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    fetchImages();
  }, []);

  const handleImageClick = (imageUrl) => {
    if (onSelectImage) {
      onSelectImage(imageUrl);
    }
  };

  const breakpointColumnsObj = {
    default: 3,
    1100: 2,
    700: 1
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        {images.map((image, index) => (
          <div key={index} className="relative overflow-hidden rounded-lg shadow-lg cursor-pointer mb-4">
            <img
              src={image}
              alt={`Gallery Image ${index + 1}`}
              className="w-full h-auto object-cover"
              onClick={() => handleImageClick(image)}
            />
          </div>
        ))}
      </Masonry>
    </div>
  );
};

export default ImageGallery;
