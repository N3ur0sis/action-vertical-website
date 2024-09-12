import React, { useState, useEffect } from 'react';

const VideoSection = ({ section, updateSection }) => {
  const [src, setSrc] = useState('');
  const [title, setTitle] = useState('');

  useEffect(() => {
    const initialContent = typeof section.content === 'string' 
      ? JSON.parse(section.content) 
      : section.content;
    
    setSrc(initialContent.src || '');
    setTitle(initialContent.title || '');
  }, [section.content]);

  const handleSrcChange = (e) => {
    const newSrc = e.target.value;
    setSrc(newSrc);
    updateSection({ src: newSrc, title });
  };

  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    updateSection({ src, title: newTitle });
  };

  return (
    <div>
      <input
        type="text"
        value={src}
        onChange={handleSrcChange}
        placeholder="URL de la vidéo"
        className="w-full p-2 border rounded mb-2"
      />
      <input
        type="text"
        value={title}
        onChange={handleTitleChange}
        placeholder="Titre de la vidéo"
        className="w-full p-2 border rounded mb-2"
      />
      <div className="mt-2">
        <video src={src} title={title} controls className="w-64 h-36" />
      </div>
    </div>
  );
};

export default VideoSection;
