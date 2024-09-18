import React, { useState, useEffect } from 'react';

const PdfSection = ({ section, updateSection }) => {
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
        placeholder="URL du PDF"
        className="w-full p-2 border rounded mb-2"
      />
      <div className="mt-2">
        <iframe src={src} title="Aperçu PDF" className="w-64 h-64" />
      </div>
    </div>
  );
};

export default PdfSection;
