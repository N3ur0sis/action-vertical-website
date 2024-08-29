import React from 'react';
import { FiEye, FiTrash2 } from 'react-icons/fi';

interface TableProps<T> {
  data: T[];
  columns: { key: keyof T; header: string }[];
  onView: (item: T) => void;
  onDelete: (item: T) => void;
}

const Table = <T extends { id: string | number; name: string }>({
  data,
  columns,
  onView,
  onDelete,
}: TableProps<T>) => {
  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th key={column.key as string} scope="col" className="px-6 py-3">
                {column.header}
              </th>
            ))}
            <th scope="col" className="px-6 py-3">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr
              key={item.id}
              className={`${
                index % 2 === 0
                  ? 'bg-white'
                  : 'bg-gray-50'
              } border-b`}
            >
              {columns.map((column) => (
                <td key={column.key as string} className="px-6 py-4">
                  {item[column.key]}
                </td>
              ))}
              <td className="px-6 py-4 flex space-x-4">
                <button
                  onClick={() => onView(item)}
                  className="text-blue-600 hover:underline flex items-center space-x-1"
                >
                  <FiEye />
                  <span>Visualiser</span>
                </button>
                <button
                  onClick={() => onDelete(item)}
                  className="text-red-600 hover:underline flex items-center space-x-1"
                >
                  <FiTrash2 />
                  <span>Supprimer</span>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
