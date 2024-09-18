import React, { useEffect, useState } from 'react';
import { useDrag, useDrop, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { FiEdit, FiTrash, FiPlusCircle } from 'react-icons/fi';

const ItemType = 'NAVBAR_ITEM';

const DraggableItem = ({
  item,
  index,
  moveItem,
  handleDelete,
  startEditing,
  goToPageBuilder,
  addItemToMenu,
  children,
}) => {
  const [, ref] = useDrag({
    type: ItemType,
    item: { id: item.id, index, parentId: item.parentId, type: item.type },
  });

  const [, drop] = useDrop({
    accept: ItemType,
    hover(draggedItem) {
      if (draggedItem.id !== item.id) {
        if (item.type === 'MENU' && draggedItem.type === 'MENU') {
          return; // Empêche les menus d'être imbriqués
        } else if (item.type === 'MENU' && draggedItem.type !== 'MENU' && draggedItem.parentId !== item.id) {
          addItemToMenu(draggedItem.id, item.id);
        } else if (item.type !== 'MENU') {
          moveItem(draggedItem.index, index, item.parentId);
          draggedItem.index = index;
          draggedItem.parentId = item.parentId;
        }
      }
    },
  });

  return (
    <li
      ref={(node) => ref(drop(node))}
      className={`mb-2 p-4 border rounded bg-white shadow ${!item.isActive ? 'opacity-50' : ''}`}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className="font-medium">{item.title.toUpperCase()} - {item.type === 'EXTERNAL_LINK' ? 'LIEN EXTERNE' : item.type}</span>
          <span className={`text-xs ${item.isActive ? 'text-green-600' : 'text-red-600'}`}>
            {item.isActive ? 'Actif' : 'Inactif'}
          </span>
        </div>
        <div className="flex space-x-2">
          {item.type === 'PAGE' && (
            <button onClick={() => goToPageBuilder(item.route)} className="text-blue-500 hover:underline">Page Builder</button>
          )}
          <button onClick={() => startEditing(item)} className="text-blue-500 hover:underline">Modifier</button>
          <button onClick={() => handleDelete(item.id, item.title)} className="text-red-500 hover:underline">Supprimer</button>
        </div>
      </div>
      {children && <ul className="pl-4 mt-2 space-y-2 border-l border-gray-200">{children}</ul>}
    </li>
  );
};

const NavbarManager = ({ showAlert }) => {
  const [navbarItems, setNavbarItems] = useState([]);
  const [newItemTitle, setNewItemTitle] = useState('');
  const [newItemType, setNewItemType] = useState('PAGE');
  const [externalLink, setExternalLink] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [pendingChanges, setPendingChanges] = useState(false);

  useEffect(() => {
    fetch('/api/navbar')
      .then((res) => res.json())
      .then((data) => setNavbarItems(data))
      .catch(() => showAlert('error', 'Erreur lors du chargement des éléments de la navbar.'));
  }, []);

  const moveItem = (fromIndex, toIndex, newParentId) => {
    setNavbarItems((prevItems) => {
      const updatedItems = [...prevItems];
      const [movedItem] = updatedItems.splice(fromIndex, 1);
      movedItem.parentId = newParentId;
      updatedItems.splice(toIndex, 0, movedItem);
      return updatedItems;
    });
    setPendingChanges(true);
  };

  const addItemToMenu = (itemId, menuId) => {
    setNavbarItems((prevItems) => {
      const updatedItems = prevItems.map((item) =>
        item.id === itemId ? { ...item, parentId: menuId } : item
      );
      setPendingChanges(true);
      return updatedItems;
    });
  };

  const handleSaveChanges = () => {
    const orderedItems = navbarItems.map((item, index) => ({
      id: item.id,
      order: index + 1,
      parentId: item.parentId,
    }));

    fetch('/api/navbar', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderedItems),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to save reordered items');
        }
        return res.json();
      })
      .then(() => {
        showAlert('success', 'Réorganisation réussie.');
        setPendingChanges(false);
      })
      .catch(() => showAlert('error', 'Erreur lors de la réorganisation des éléments.'));
  };

  const handleAddOrEditItem = () => {
    const titleExists = navbarItems.some(
      (item) =>
        item.title.toLowerCase() === newItemTitle.toLowerCase() &&
        (!editingItem || item.id !== editingItem.id)
    );

    if (titleExists) {
      showAlert('error', 'Un élément avec ce titre existe déjà.');
      return;
    }

    const method = editingItem ? 'POST' : 'POST';
    const body = {
      id: editingItem?.id,
      title: newItemTitle,
      type: newItemType,
      externalLink: newItemType === 'EXTERNAL_LINK' ? externalLink : null,
      parentId: editingItem?.parentId || null,
      order: editingItem ? editingItem.order : navbarItems.length + 1,
      isActive: isActive,
    };

    fetch('/api/navbar', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to save item');
        }
        return res.json();
      })
      .then(() => {
        fetch('/api/navbar')
          .then((res) => res.json())
          .then((data) => setNavbarItems(data));
        resetForm();
        showAlert('success', editingItem ? 'Élément modifié avec succès.' : 'Élément ajouté avec succès.');
      })
      .catch(() =>
        showAlert('error', `Erreur lors de la ${editingItem ? 'modification' : 'création'} de l'élément.`)
      );
  };

  const handleDeleteItem = (id, title) => {
    fetch('/api/navbar', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, title }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to delete item');
        }
        return res.json();
      })
      .then(() => {
        fetch('/api/navbar')
          .then((res) => res.json())
          .then((data) => setNavbarItems(data));
        showAlert('success', 'Élément supprimé avec succès.');
      })
      .catch(() => showAlert('error', "Erreur lors de la suppression de l'élément."));
  };
  

  const goToPageBuilder = (route) => {
    window.location.href = `/dashboard/page-builder${route}`;
  };

  const resetForm = () => {
    setNewItemTitle('');
    setNewItemType('PAGE');
    setExternalLink('');
    setIsActive(true);
    setEditingItem(null);
  };

  const startEditing = (item) => {
    setEditingItem(item);
    setNewItemTitle(item.title);
    setNewItemType(item.type);
    setExternalLink(item.route);
    setIsActive(item.isActive);
  };

  const renderItems = (items, parentId = null) =>
    items
      .filter((item) => item.parentId === parentId)
      .map((item, index) => (
        <DraggableItem
          key={item.id}
          index={index}
          item={item}
          moveItem={moveItem}
          handleDelete={handleDeleteItem}
          startEditing={startEditing}
          goToPageBuilder={goToPageBuilder}
          addItemToMenu={addItemToMenu}
        >
          {renderItems(items, item.id)}
        </DraggableItem>
      ));

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="space-y-6">
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="Titre"
            value={newItemTitle}
            onChange={(e) => setNewItemTitle(e.target.value)}
            className="border p-2 rounded w-full"
          />
          <select
            value={newItemType}
            onChange={(e) => setNewItemType(e.target.value)}
            className="border p-2 rounded w-full"
          >
            <option value="PAGE">Page</option>
            <option value="MENU">Menu</option>
            <option value="EXTERNAL_LINK">Lien Externe</option>
          </select>
          {newItemType === 'EXTERNAL_LINK' && (
            <input
              type="text"
              placeholder="Lien Externe"
              value={externalLink}
              onChange={(e) => setExternalLink(e.target.value)}
              className="border p-2 rounded w-full"
            />
          )}
          <div className="flex items-center space-x-2">
            <label className="font-medium">Actif</label>
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="h-5 w-5 text-blue-600 rounded"
            />
          </div>
          <button
            onClick={handleAddOrEditItem}
            className="bg-blue-500 text-white p-2 rounded"
          >
            {editingItem ? 'Modifier' : 'Ajouter'}
          </button>
        </div>
        <div className="border p-4 rounded bg-gray-100">
          <h3 className="font-bold text-lg mb-2">Éléments de la navigation</h3>
          <ul>
            {renderItems(navbarItems)}
          </ul>
        </div>
        {pendingChanges && (
          <div>
            <button
              onClick={handleSaveChanges}
              className="bg-green-500 text-white p-2 rounded"
            >
              Sauvegarder les modifications
            </button>
          </div>
        )}
      </div>
    </DndProvider>
  );
};

export default NavbarManager;
