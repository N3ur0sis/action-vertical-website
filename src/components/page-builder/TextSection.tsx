import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const TextSection = ({ section, updateSection }) => {
  const [content, setContent] = useState('');

  useEffect(() => {
    const initialContent = typeof section.content === 'string'
      ? JSON.parse(section.content).text || ''
      : section.content.text || '';

    setContent(initialContent);
  }, [section.content]);

  const handleChange = (value) => {
    setContent(value);
    updateSection({ text: value });
  };

  return (
    <div className="p-4 border rounded bg-gray-50">
      <h3 className="text-lg font-bold mb-2">Modifier le texte</h3>
      <ReactQuill
        value={content}
        onChange={handleChange}
        theme="snow"
        className="mb-4"
      />
    </div>
  );
};

export default TextSection;
