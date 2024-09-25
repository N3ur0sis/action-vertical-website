"use client";

import React, { useEffect, useState } from 'react';
import classNames from 'classnames';

const fetchPageContent = async (slug) => {
  const response = await fetch(`/api/page-content?slug=${slug}`);
  if (response.status === 404) {
    throw new Error('Page not found');
  }
  if (!response.ok) {
    throw new Error('Failed to fetch page content');
  }
  return response.json();
};

const renderSection = (section) => {
  switch (section.contentType) {
    case 'TITLE':
      return (
        <h1 className="text-4xl font-bold text-center my-8">
          {section.content.text}
        </h1>
      );
    case 'TEXT':
      const alignment = section.content.alignment || 'left';
      const textAlignmentClass = {
        left: 'text-left',
        center: 'text-center',
        right: 'text-right',
        justify: 'text-justify',
      }[alignment];

      return (
        <div
          className={classNames(
            'text-lg leading-relaxed my-4 max-w-4xl mx-auto',
            textAlignmentClass
          )}
          dangerouslySetInnerHTML={{ __html: section.content.text }}
        />
      );
    // ... autres cas
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
        // Trier les sections par ordre ici
        const sortedContent = content.sort((a, b) => a.order - b.order);
        setSections(sortedContent);
      } catch (error) {
        if (error.message === 'Page not found') {
          setPageNotFound(true);
        } else {
          console.error('Failed to load page content:', error);
          // Afficher un message d'erreur ou rediriger
        }
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
      {sections.map((section) => (
        <div key={section.id} className="mb-12">
          {renderSection(section)}
        </div>
      ))}
    </div>
  );
};

export default Page;
