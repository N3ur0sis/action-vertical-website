"use client";

import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import PageBuilder from '@/components/page-builder/page-builder';

const PageEditor = () => {
  const router = useRouter();
  const [slug, setSlug] = useState('');
  const [pageTitle, setPageTitle] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const path = window.location.pathname;
    const slugFromPath = path.split('/').pop(); // Récupère le dernier segment de l'URL
    setSlug(slugFromPath);
    setPageTitle(slugFromPath.charAt(0).toUpperCase() + slugFromPath.slice(1)); // Définit un titre basé sur le slug
    setLoading(false); // Fin du chargement après avoir défini le slug et le titre
  }, []);

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">{pageTitle}</h1>
      <PageBuilder pageId={slug} />
    </div>
  );
};

export default PageEditor;
