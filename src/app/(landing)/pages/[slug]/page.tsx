"use client";

import React, { useEffect, useState } from 'react';

const fetchPageContent = async (slug) => {
  const response = await fetch(`/api/page-content?slug=${slug}`);
  if (!response.ok) {
    throw new Error('Failed to fetch page content');
  }
  return response.json();
};

const renderSection = (section) => {
  switch (section.contentType) {
    case 'TITLE':
      return <h1 className="text-4xl font-bold text-center my-8">{section.content.text}</h1>;
    case 'TEXT':
      return <p className="text-lg leading-relaxed text-center my-4 max-w-4xl mx-auto">{section.content.text}</p>;
    case 'IMAGE':
      return (
        <div className="flex justify-center my-8">
          <img
            src={section.content.src}
            alt={section.content.alt || 'Image'}
            className="max-w-[800px] w-full h-auto rounded-lg shadow-lg"
          />
        </div>
      );
    case 'VIDEO':
      return (
        <div className="flex flex-col items-center my-8">
          <video controls className="max-w-[800px] w-full h-auto rounded-lg shadow-lg mb-4">
            <source src={section.content.src} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          {section.content.title && (
            <p className="text-center text-lg mt-2">{section.content.title}</p>
          )}
        </div>
      );
    case 'BUTTON':
      return (
        <div className="flex justify-center my-8">
          <a
            href={section.content.link}
            className="bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600 transition duration-300 ease-in-out"
          >
            {section.content.label}
          </a>
        </div>
      );
    case 'TABLE':
      return (
        <div className="my-8 overflow-x-auto">
          <table className="w-full max-w-4xl mx-auto bg-white shadow-md rounded-lg">
            <tbody>
              {section.content.table.map((row, rowIndex) => (
                <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-gray-100' : 'bg-white'}>
                  {row.map((cell, colIndex) => (
                    <td key={colIndex} className="p-4">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case 'PDF':
      return (
        <div className="flex justify-center my-8">
          <embed src={section.content.src} type="application/pdf" className="w-full max-w-[800px] h-96" />
        </div>
      );
    default:
      return null;
  }
};

const Page = ({ params }) => {
  const { slug } = params;
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageNotFound, setPageNotFound] = useState(false);

  useEffect(() => {
    const loadPageContent = async () => {
      try {
        const content = await fetchPageContent(slug);
        if (content.length === 0) {
          setPageNotFound(true);
        } else {
          setSections(content);
        }
      } catch (error) {
        console.error('Failed to load page content:', error);
        setPageNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    loadPageContent();
  }, [slug]);

  if (loading) {
    return <div className="text-center py-12">Chargement...</div>;
  }

  if (pageNotFound) {
    return <div className="text-center py-12">Page non trouvée</div>;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      {sections
        .sort((a, b) => a.order - b.order) // Trier les sections par leur champ "order"
        .map((section) => (
          <div key={section.id} className="mb-12">
            {renderSection(section)}
          </div>
        ))}
    </div>
  );
};

export default Page;
