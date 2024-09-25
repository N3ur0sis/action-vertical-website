import React, { useState, useEffect, useCallback, useMemo } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const TextSection = ({ section, updateSection }) => {
  // Initialisation du contenu
  const initialContent = useMemo(() => {
    if (typeof section.content === 'string') {
      try {
        const parsedContent = JSON.parse(section.content);
        return parsedContent.text || '';
      } catch (error) {
        console.error('Erreur lors du parsing du contenu :', error);
        return '';
      }
    } else if (section.content && typeof section.content === 'object') {
      return section.content.text || '';
    }
    return '';
  }, [section.content]);

  const [content, setContent] = useState(initialContent);

  // Mettre à jour le contenu si initialContent change
  useEffect(() => {
    setContent(initialContent);
  }, [initialContent]);

  // Gestionnaire de changement de contenu
  const handleChange = useCallback(
    (value) => {
      setContent(value);
      updateSection({ text: value });
    },
    [updateSection]
  );

  // Configuration des modules de React Quill sans images ni vidéos
  const modules = useMemo(
    () => ({
      toolbar: [
        [{ header: [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ align: [] }],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['blockquote', 'code-block'],
        ['link'],
        ['clean'],
      ],
    }),
    []
  );

  const formats = useMemo(
    () => [
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
    ],
    []
  );

  return (
    <div className="p-4 border rounded bg-gray-50">
      <h3 className="text-lg font-bold mb-2">Modifier le texte</h3>
      <ReactQuill
        value={content}
        onChange={handleChange}
        modules={modules}
        formats={formats}
        theme="snow"
        className="mb-4"
      />
    </div>
  );
};

export default TextSection;
