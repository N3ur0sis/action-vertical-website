"use client";

import React, { useEffect, useState } from 'react';
import PageBuilder from '@/components/page-builder/page-builder';

const PageEditor = () => {
  const [slug, setSlug] = useState('');
  const [pageContent, setPageContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPageData = async () => {
      try {
        const path = window.location.pathname;
        const slugFromPath = path.split('/').pop(); // Récupère le dernier segment de l'URL
        setSlug(slugFromPath);

        const response = await fetch(`${process.env.NEXT_PUBLIC_VERCEL_URL}/api/page-content?slug=${slugFromPath}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Erreur inconnue');
        }

        const data = await response.json();
        setPageContent(data || []);
      } catch (err) {
        console.error('Erreur lors du chargement de la page :', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPageData();
  }, []);

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (error) {
    return <div className="text-red-500 font-bold">{error}</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">Éditeur de la page : {slug}</h1>
      <PageBuilder pageId={slug} initialSections={pageContent} />
    </div>
  );
};

export default PageEditor;
