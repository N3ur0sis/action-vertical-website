import React, { useState, useEffect } from 'react';

const TableSection = ({ section, updateSection }) => {
  const [title, setTitle] = useState('');
  const [tableContent, setTableContent] = useState([['']]); // Empty table initially

  useEffect(() => {
    const initialContent = section.content || {};
    setTitle(initialContent.title || '');
    setTableContent(Array.isArray(initialContent.table) ? initialContent.table : [['']]);
  }, [section.content]);

  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    updateSection({ ...section.content, title: newTitle, table: tableContent });
  };

  const handleCellChange = (rowIndex, colIndex, value) => {
    const updatedTableContent = tableContent.map((row, rIdx) =>
      row.map((cell, cIdx) => (rIdx === rowIndex && cIdx === colIndex ? value : cell))
    );
    setTableContent(updatedTableContent);
    updateSection({ ...section.content, title, table: updatedTableContent });
  };

  const addRow = () => {
    const newRow = Array(tableContent[0]?.length || 1).fill(''); // Empty cells in new row
    const updatedTableContent = [...tableContent, newRow];
    setTableContent(updatedTableContent);
    updateSection({ ...section.content, title, table: updatedTableContent });
  };

  const addColumn = () => {
    const updatedTableContent = tableContent.map(row => [...row, '']); // Empty cells in new column
    setTableContent(updatedTableContent);
    updateSection({ ...section.content, title, table: updatedTableContent });
  };

  const deleteRow = (rowIndex) => {
    if (tableContent.length > 1) {
      const updatedTableContent = tableContent.filter((_, rIdx) => rIdx !== rowIndex);
      setTableContent(updatedTableContent);
      updateSection({ ...section.content, title, table: updatedTableContent });
    }
  };

  const deleteColumn = (colIndex) => {
    if (tableContent[0].length > 1) {
      const updatedTableContent = tableContent.map(row => row.filter((_, cIdx) => cIdx !== colIndex));
      setTableContent(updatedTableContent);
      updateSection({ ...section.content, title, table: updatedTableContent });
    }
  };

  return (
    <div className="p-4 border rounded bg-gray-50">
      <h3 className="text-lg font-bold mb-2">Modifier le tableau</h3>

      <input
        type="text"
        value={title}
        onChange={handleTitleChange}
        placeholder="Entrez le titre du tableau"
        className="w-full mb-4 p-2 border rounded"
      />

      <table className="w-full border-collapse">
        <tbody>
          {tableContent.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, colIndex) => (
                <td key={colIndex} className="border p-2">
                  <input
                    type="text"
                    value={cell}
                    onChange={(e) => handleCellChange(rowIndex, colIndex, e.target.value)}
                    className="w-full p-2 border rounded"
                    placeholder={`Cellule ${rowIndex + 1}-${colIndex + 1}`}
                  />
                </td>
              ))}
              <td>
                <button
                  onClick={() => deleteRow(rowIndex)}
                  className="text-red-500 hover:text-red-700"
                >
                  Supprimer ligne
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 flex space-x-4">
        <button
          onClick={addRow}
          className="bg-green-500 text-white px-4 py-2 rounded shadow hover:bg-green-600"
        >
          Ajouter une ligne
        </button>
        <button
          onClick={addColumn}
          className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
        >
          Ajouter une colonne
        </button>
      </div>

      {tableContent[0]?.length > 1 && (
        <div className="mt-4">
          {tableContent[0].map((_, colIndex) => (
            <button
              key={colIndex}
              onClick={() => deleteColumn(colIndex)}
              className="text-red-500 hover:text-red-700 mr-2"
            >
              Supprimer colonne {colIndex + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default TableSection;
