// TextSection.jsx

import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const TextSection = ({ section, updateSection }) => {
  // État local pour le contenu du texte et l'alignement
  const [content, setContent] = useState(section.content.text || '');
  const [alignment, setAlignment] = useState(section.content.alignment || 'left');

  // Met à jour l'état local lorsque les props changent
  useEffect(() => {
    setContent(section.content.text || '');
    setAlignment(section.content.alignment || 'left');
  }, [section.content]);

  // Gestionnaire de changement de contenu
  const handleContentChange = (value) => {
    setContent(value);
    updateSection({
      ...section.content,
      text: value,
      alignment,
    });
  };

  // Gestionnaire de changement d'alignement
  const handleAlignmentChange = (e) => {
    const newAlignment = e.target.value;
    setAlignment(newAlignment);
    updateSection({
      ...section.content,
      text: content,
      alignment: newAlignment,
    });
  };

  // Configuration des modules de React Quill
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ align: [] }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['blockquote', 'code-block'],
      ['link'],
      ['clean'],
    ],
  };

  // Formats autorisés dans React Quill
  const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'align',
    'list',
    'bullet',
    'blockquote',
    'code-block',
    'link',
  ];

  return (
    <div className="p-4 border rounded bg-gray-50">
      <h3 className="text-lg font-bold mb-4">Modifier le texte</h3>

      {/* Sélecteur d'alignement */}
      <div className="mb-4">
        <label className="block mb-2 font-semibold">Alignement du texte :</label>
        <select
          value={alignment}
          onChange={handleAlignmentChange}
          className="w-full p-2 border rounded"
        >
          <option value="left">Gauche</option>
          <option value="center">Centré</option>
          <option value="right">Droite</option>
          <option value="justify">Justifié</option>
        </select>
      </div>

      {/* Éditeur de texte enrichi */}
      <ReactQuill
        value={content}
        onChange={handleContentChange}
        modules={modules}
        formats={formats}
        theme="snow"
        className="mb-4"
      />
    </div>
  );
};

export default TextSection;
