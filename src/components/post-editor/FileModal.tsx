"use client";

import React from "react";
import { Dialog, Transition } from "@headlessui/react";
import { FiX } from "react-icons/fi";

export default function FileModal({ isOpen, onClose, files, searchQuery, setSearchQuery, handleInsertMedia }) {
  const filteredFiles = files.filter((file) =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Transition appear show={isOpen} as={React.Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={React.Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <div className={`fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center sm:ml-[256px] sm:ml-0`}>
            <Dialog.Panel className="w-full max-w-4xl max-h-[80vh] transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
              <div className="sticky top-0 bg-white z-10 p-4 flex justify-between items-center border-b border-gray-200">
                <Dialog.Title className="text-lg font-medium leading-6 text-gray-900">
                  Insérer un fichier ou une vidéo
                </Dialog.Title>
                <button
                  type="button"
                  className="text-gray-500 hover:text-gray-700"
                  onClick={onClose}
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6 overflow-y-auto">
                <input
                  type="text"
                  placeholder="Rechercher un fichier..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full mb-2 p-2 border border-gray-300 rounded-md"
                />
                <div className="max-h-40 overflow-y-auto">
                  <table className="min-w-full bg-white">
                    <thead>
                      <tr>
                        <th className="py-2 px-4 border-b">Nom du fichier</th>
                        <th className="py-2 px-4 border-b">Type</th>
                        <th className="py-2 px-4 border-b">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredFiles.map((file) => (
                        <tr key={file.name} className="hover:bg-gray-100">
                          <td className="py-2 px-4 border-b truncate">{file.name}</td>
                          <td className="py-2 px-4 border-b">{file.type}</td>
                          <td className="py-2 px-4 border-b">
                            <button
                              className="bg-blue-500 text-white py-1 px-3 rounded"
                              onClick={() => handleInsertMedia(`/files/${file.name}`)}
                            >
                              Insérer
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </Dialog.Panel>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
}
