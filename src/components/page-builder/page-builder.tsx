import React, { useEffect, useState, useRef, useCallback } from 'react';
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
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const ItemType = 'SECTION';

const PageBuilder = ({ pageId }) => {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    loadSections();
  }, [pageId]);

  const loadSections = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/page-content?slug=${pageId}`);
      if (!response.ok) {
        throw new Error("Échec du chargement du contenu de la page");
      }
      const data = await response.json();
      setSections(data);
    } catch (err) {
      setAlert({ type: 'warning', message: err.message });
    } finally {
      setLoading(false);
    }
  }, [pageId]);

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

        const response = await fetch('/api/page-content', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newSection),
        });

        if (!response.ok) {
          throw new Error("Échec de l'ajout de la section");
        }

        await loadSections();
        setAlert({ type: 'info', message: `${type} ajouté avec succès.` });
      } catch (err) {
        setAlert({ type: 'warning', message: err.message });
      }
    },
    [loadSections, pageId, sections.length]
  );

  const handleSave = useCallback(async () => {
    try {
      const orderedSections = sections.map((section, index) => ({
        ...section,
        order: index + 1,
      }));

      const response = await fetch('/api/page-content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderedSections),
      });

      if (!response.ok) {
        throw new Error("Échec de la sauvegarde du contenu");
      }

      setAlert({ type: 'success', message: 'Page enregistrée avec succès' });
      await loadSections();
    } catch (err) {
      setAlert({ type: 'warning', message: err.message });
    }
  }, [sections, loadSections]);

  const handleDeleteSection = useCallback(
    async (sectionId) => {
      if (!sectionId) return;

      try {
        const response = await fetch('/api/page-content', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: sectionId }),
        });

        if (!response.ok) {
          throw new Error("Échec de la suppression de la section");
        }

        await loadSections();
        setAlert({ type: 'info', message: 'Section supprimée avec succès.' });
      } catch (err) {
        setAlert({ type: 'warning', message: err.message });
      }
    },
    [loadSections]
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
          {loading ? (
            <Skeleton count={5} height={150} className="mb-4" />
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

      // Détermine les coordonnées du rectangle de l'élément survolé
      const hoverBoundingRect = ref.current.getBoundingClientRect();

      // Calcule la position verticale du milieu de l'élément survolé
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // Calcule la position du curseur
      const clientOffset = monitor.getClientOffset();

      // Calcule la position du curseur par rapport au haut de l'élément survolé
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      // Déplace l'élément seulement si le curseur a dépassé la moitié de l'élément survolé
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      // Effectue le déplacement
      moveSection(dragIndex, hoverIndex);

      // Met à jour l'index de l'élément déplacé
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
