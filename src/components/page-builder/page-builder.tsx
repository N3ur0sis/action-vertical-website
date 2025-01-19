// components/PageBuilder.jsx

'use client';

import React, { useState, useRef, useCallback } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { FiTrash2, FiMove, FiPlus } from 'react-icons/fi';
import TitleSection from './TitleSection';
import ImageSection from './ImageSection';
import TextSection from './TextSection';
import VideoSection from './VideoSection';
import ButtonSection from './ButtonSection';
import TableSection from './TableSection';
import PdfSection from './PdfSection';
import Alert from '../alert';

const ItemType = 'SECTION';

const PageBuilder = ({ pageId, initialSections }) => {
  const [sections, setSections] = useState(initialSections || []);
  const [alert, setAlert] = useState(null);
  const scrollRef = useRef(null);

  const moveSection = useCallback((dragIndex, hoverIndex) => {
    setSections((prevSections) => {
      const updatedSections = [...prevSections];
      const [movedSection] = updatedSections.splice(dragIndex, 1);
      updatedSections.splice(hoverIndex, 0, movedSection);
      return updatedSections;
    });
  }, []);

  const updateSectionContent = useCallback((index, newContent) => {
    setSections((prevSections) => {
      const updatedSections = [...prevSections];
      updatedSections[index] = {
        ...updatedSections[index],
        content: newContent,
      };
      return updatedSections;
    });
  }, []);

  const getSectionComponent = useCallback((type) => {
    switch (type) {
      case 'TITLE':
        return TitleSection;
      case 'IMAGE':
        return ImageSection;
      case 'TEXT':
        return TextSection;
      case 'VIDEO':
        return VideoSection;
      case 'BUTTON':
        return ButtonSection;
      case 'TABLE':
        return TableSection;
      case 'PDF':
        return PdfSection;
      default:
        return () => <div>Type de section inconnu : {type}</div>;
    }
  }, []);

  const renderSection = useCallback(
    (section, index) => {
      const SectionComponent = getSectionComponent(section.contentType);
      const parsedContent =
        typeof section.content === 'string' ? JSON.parse(section.content) : section.content;

      return (
        <DraggableItem
          key={section.id || index}
          index={index}
          moveSection={moveSection}
          type={section.contentType}
        >
          <div className="relative bg-white p-4 rounded-lg shadow-md transition-shadow duration-200 hover:shadow-lg">
            <button
              onClick={() => handleDeleteSection(section.id)}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700 z-10"
              aria-label="Supprimer la section"
            >
              <FiTrash2 size={20} />
            </button>
            <span className="absolute top-2 left-2 text-gray-500 cursor-move">
              <FiMove size={20} />
            </span>
            <SectionComponent
              section={{ ...section, content: parsedContent }}
              updateSection={(newContent) => updateSectionContent(index, newContent)}
            />
            <div className="absolute bottom-2 right-2 text-xs text-gray-400">
              {section.contentType}
            </div>
          </div>
        </DraggableItem>
      );
    },
    [getSectionComponent, moveSection, updateSectionContent]
  );

  const addSection = useCallback(
    async (type) => {
      try {
        const newSection = {
          pageSlug: pageId,
          contentType: type,
          content: {},
          order: sections.length + 1,
        };

        const response = await fetch(`${process.env.NEXT_PUBLIC_VERCEL_URL}/api/page-content`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newSection),
        });

        if (!response.ok) {
          throw new Error("Échec de l'ajout de la section");
        }

        const createdSection = await response.json();
        setSections((prevSections) => [...prevSections, createdSection]);
        setAlert({ type: 'info', message: `${type} ajouté avec succès.` });
      } catch (err) {
        setAlert({ type: 'warning', message: err.message });
      }
    },
    [pageId, sections.length]
  );

  const handleSave = useCallback(async () => {
    try {
      const orderedSections = sections.map((section, index) => ({
        ...section,
        order: index + 1,
      }));

      const response = await fetch(`${process.env.NEXT_PUBLIC_VERCEL_URL}/api/page-content`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderedSections),
      });

      if (!response.ok) {
        throw new Error("Échec de la sauvegarde du contenu");
      }

      setAlert({ type: 'success', message: 'Page enregistrée avec succès' });
    } catch (err) {
      setAlert({ type: 'warning', message: err.message });
    }
  }, [sections]);

  const handleDeleteSection = useCallback(
    async (sectionId) => {
      if (!sectionId) return;

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_VERCEL_URL}/api/page-content`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: sectionId }),
        });

        if (!response.ok) {
          throw new Error("Échec de la suppression de la section");
        }

        setSections((prevSections) =>
          prevSections.filter((section) => section.id !== sectionId)
        );
        setAlert({ type: 'info', message: 'Section supprimée avec succès.' });
      } catch (err) {
        setAlert({ type: 'warning', message: err.message });
      }
    },
    []
  );

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex">
        <Sidebar addSection={addSection} />
        <div
          ref={scrollRef}
          className="flex-1 p-4 overflow-y-auto"
          style={{ maxHeight: '75vh' }}
        >
          {sections.length === 0 ? (
            <div className="text-center py-12">
              <p>Aucune section. Ajoutez-en une pour commencer !</p>
            </div>
          ) : (
            sections.map((section, index) => renderSection(section, index))
          )}
        </div>
        <div className="fixed bottom-0 right-0 p-4 flex justify-center z-10">
          <a
            href={`/pages/${pageId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gray-500 text-white px-6 py-2 mr-4 rounded-full shadow-lg hover:bg-gray-600 transition duration-200"
          >
            Voir la page
          </a>

          <button
            onClick={handleSave}
            className="bg-blue-500 text-white px-6 py-2 rounded-full shadow-lg hover:bg-blue-600 transition duration-200"
          >
            Enregistrer les modifications
          </button>
        </div>
      </div>
      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}
    </DndProvider>
  );
};

const Sidebar = React.memo(({ addSection }) => (
  <div className="w-64 p-4 bg-gray-50 border-r border-gray-200 shadow-lg">
    <h3 className="font-bold text-xl mb-4">Ajouter des éléments</h3>
    <div className="flex flex-col gap-4">
      <AddSectionButton addSection={addSection} type="TITLE" label="Titre" />
      <AddSectionButton addSection={addSection} type="TEXT" label="Texte" />
      <AddSectionButton addSection={addSection} type="IMAGE" label="Image" />
      <AddSectionButton addSection={addSection} type="VIDEO" label="Vidéo" />
      <AddSectionButton addSection={addSection} type="BUTTON" label="Bouton" />
      <AddSectionButton addSection={addSection} type="TABLE" label="Tableau" />
      <AddSectionButton addSection={addSection} type="PDF" label="PDF" />
    </div>
  </div>
));

const AddSectionButton = React.memo(({ addSection, type, label }) => (
  <button
    onClick={() => addSection(type)}
    className="bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold py-2 px-4 rounded-full shadow inline-flex items-center justify-center w-full transition-all duration-200 ease-in-out"
  >
    <FiPlus className="mr-2" size={20} />
    {label}
  </button>
));

const DraggableItem = ({ children, index, moveSection }) => {
  const ref = useRef(null);

  const [{ handlerId }, drop] = useDrop({
    accept: ItemType,
    collect: (monitor) => ({
      handlerId: monitor.getHandlerId(),
    }),
    hover(item, monitor) {
      if (!ref.current) return;

      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) return;

      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      moveSection(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: ItemType,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      className={`mb-4 transform transition-all duration-200 ease-in-out ${
        isDragging ? 'opacity-50 cursor-grabbing' : 'cursor-grab'
      }`}
      data-handler-id={handlerId}
    >
      {children}
    </div>
  );
};

export default PageBuilder;
