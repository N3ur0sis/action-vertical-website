// app/pages/[slug]/page.tsx

import { notFound } from 'next/navigation';
import prisma from '@/libs/db';
import classNames from 'classnames';

const renderSection = (section) => {
  const { contentType, content } = section;

  switch (contentType) {
    case 'TITLE':
      return (
        <h1 className="text-4xl font-bold text-center my-8">
          {content.text}
        </h1>
      );

    case 'TEXT':
      const alignment = content.alignment || 'left';
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
          dangerouslySetInnerHTML={{ __html: content.text }}
        />
      );

    case 'IMAGE':
      return (
        <img
          src={content.url}
          alt={content.alt || ''}
          className="mx-auto my-8 max-w-full h-auto"
        />
      );

    case 'VIDEO':
      return (
        <div className="video-container my-8">
          <video controls src={content.url} className="mx-auto max-w-full">
            Votre navigateur ne supporte pas la lecture vidéo.
          </video>
        </div>
      );

    case 'BUTTON':
      return (
        <div className="text-center my-8">
          <a
            href={content.url}
            className="inline-block bg-blue-500 text-white px-6 py-3 rounded-full hover:bg-blue-600 transition duration-200"
          >
            {content.label}
          </a>
        </div>
      );

    case 'TABLE':
      const tableData = content.table || [];
      const title = content.title || '';

      if (tableData.length === 0) {
        return null;
      }

      return (
        <div className="overflow-x-auto my-8">
          {title && (
            <h2 className="text-2xl font-bold mb-4 text-center">
              {title}
            </h2>
          )}
          <table className="min-w-full bg-white border border-gray-200">
            <tbody>
              {tableData.map((row, rowIndex) => (
                <tr key={rowIndex} className="even:bg-gray-100">
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex} className="py-2 px-4 border">
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
        <div className="my-8">
          <iframe
            src={content.url}
            width="100%"
            height="600px"
            className="border"
            title="PDF Viewer"
          />
        </div>
      );

    default:
      return null;
  }
};

const Page = async ({ params }) => {
  const { slug } = params;

  // Récupération du contenu de la page depuis la base de données
  const pageContent = await prisma.pageContent.findMany({
    where: { pageSlug: slug },
    orderBy: { order: 'asc' },
  });

  if (!pageContent || pageContent.length === 0) {
    // Si la page n'existe pas, affiche la page 404
    notFound();
  }

  // Désérialisation du contenu JSON
  const parsedContent = pageContent.map((section) => ({
    ...section,
    content: JSON.parse(section.content),
  }));

  return (
    <div className="container mx-auto px-4 py-12">
      {parsedContent.map((section) => (
        <div key={section.id} className="mb-12">
          {renderSection(section)}
        </div>
      ))}
    </div>
  );
};

export default Page;
