import React, { useState, useEffect } from 'react';

const TitleSection = ({ section, updateSection }) => {
  const [content, setContent] = useState('');

  useEffect(() => {
    const initialContent = typeof section.content === 'string'
      ? JSON.parse(section.content).text || ''
      : section.content.text || '';

    setContent(initialContent);
  }, [section.content]);

  const handleChange = (e) => {
    const newText = e.target.value;
    setContent(newText);
    updateSection({ text: newText });
  };

  return (
    <div className="p-4 border rounded bg-gray-50">
      <h3 className="text-lg font-bold mb-2">Modifier le titre</h3>
      <input
        type="text"
        value={content}
        onChange={handleChange}
        placeholder="Entrez le titre"
        className="w-full p-2 border rounded"
      />
    </div>
  );
};

export default TitleSection;
