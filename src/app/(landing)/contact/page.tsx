import React from "react";

export default function Contact() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-white text-gray-800 px-4">
      <div className="max-w-3xl w-full text-center p-8 rounded-lg shadow-md bg-gray-50">
        <h1 className="text-4xl font-bold mb-6 text-blue-500">Contact</h1>
        <p className="text-lg mb-4">📧 Email: <a href="mailto:actionverticale@gmail.com" className="text-blue-400 underline">actionverticale@gmail.com</a></p>
        <p className="text-lg mb-4">📞 Téléphone: <a href="tel:+33692600389" className="text-blue-400 underline">06 92 60 03 89</a></p>
        <div className="text-left mt-8">
          <h2 className="text-2xl font-semibold mb-4">Adresses:</h2>
          <div className="mb-6">
            <h3 className="font-bold">Siège social:</h3>
            <p>2 B Chemin des Mandarines</p>
            <p>97421, La Rivière</p>
          </div>
          <div>
            <h3 className="font-bold">Structure principale:</h3>
            <p>Gymnase Hegesippe Hoarau</p>
            <p>Rue Sehedic Sery</p>
            <p>97421, La Rivière</p>
          </div>
        </div>
      </div>
    </main>
  );
}