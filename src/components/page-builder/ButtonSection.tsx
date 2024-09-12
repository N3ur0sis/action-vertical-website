import React, { useState, useEffect } from 'react';

const ButtonSection = ({ section, updateSection }) => {
  const [label, setLabel] = useState('');
  const [link, setLink] = useState('');

  useEffect(() => {
    const initialContent = typeof section.content === 'string'
      ? JSON.parse(section.content)
      : section.content;

    setLabel(initialContent.label || '');
    setLink(initialContent.link || '');
  }, [section.content]);

  const handleLabelChange = (e) => {
    const newLabel = e.target.value;
    setLabel(newLabel);
    updateSection({ label: newLabel, link });
  };

  const handleLinkChange = (e) => {
    const newLink = e.target.value;
    setLink(newLink);
    updateSection({ label, link: newLink });
  };

  return (
    <div className="p-4 border rounded bg-gray-50">
      <h3 className="text-lg font-bold mb-2">Modifier le bouton</h3>
      <input
        type="text"
        value={label}
        onChange={handleLabelChange}
        placeholder="Label du bouton"
        className="w-full p-2 border rounded mb-2"
      />
      <input
        type="text"
        value={link}
        onChange={handleLinkChange}
        placeholder="Lien du bouton"
        className="w-full p-2 border rounded mb-2"
      />
      <div className="mt-4">
        <a
          href={link || '#'}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          target="_blank"
          rel="noopener noreferrer"
        >
          {label || 'Aperçu du bouton'}
        </a>
      </div>
    </div>
  );
};

export default ButtonSection;
