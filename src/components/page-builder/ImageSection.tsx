import React, { useState, useEffect } from 'react';

const ImageSection = ({ section, updateSection }) => {
  const [src, setSrc] = useState('');

  useEffect(() => {
    const initialContent = typeof section.content === 'string' 
      ? JSON.parse(section.content) 
      : section.content;
    
    setSrc(initialContent.src || '');
  }, [section.content]);

  const handleSrcChange = (e) => {
    const newSrc = e.target.value;
    setSrc(newSrc);
    updateSection({ src: newSrc });
  };


  return (
    <div>
      <input
        type="text"
        value={src}
        onChange={handleSrcChange}
        placeholder="URL de l'image"
        className="w-full p-2 border rounded mb-2"
      />

      <div className="mt-2">
        <img src={src} alt={alt} className="w-32 h-32 object-cover" />
      </div>
    </div>
  );
};

export default ImageSection;
