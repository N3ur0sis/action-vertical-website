'use client'

import React, { useEffect, useState, useRef, memo } from 'react';
import { useDrag, useDrop, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const ItemType = 'NAVBAR_ITEM';

const generateRouteFromTitle = (title) => {
  return (
    '/' + title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')
  );
};

const DraggableItem = memo(
  ({
    item,
    moveItem,
    handleDelete,
    startEditing,
    goToPageBuilder,
    addItemToMenu,
    handleDragStart,
    resetNavbarItems,
    children,
  }) => {
    const ref = useRef(null);

    const [{ isOverCurrent }, drop] = useDrop({
      accept: ItemType,
      canDrop: (draggedItem) => {
        if (item.type === 'MENU' && draggedItem.type === 'MENU') return false;
        if (draggedItem.id === item.id) return false;
        return true;
      },
      hover(draggedItem, monitor) {
        if (!ref.current) return;
        if (draggedItem.id === item.id) return;

        const hoverBoundingRect = ref.current.getBoundingClientRect();
        const clientOffset = monitor.getClientOffset();
        const hoverMiddleY =
          (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
        const hoverClientY = clientOffset.y - hoverBoundingRect.top;
        const isAbove = hoverClientY < hoverMiddleY;

        if (item.type === 'MENU' && draggedItem.type !== 'MENU') {
          if (draggedItem.parentId !== item.id) {
            addItemToMenu(draggedItem.id, item.id);
            monitor.getItem().parentId = item.id;
          }
        } else {
          moveItem(draggedItem.id, item.id, isAbove);
          monitor.getItem().parentId = item.parentId;
        }
      },
      collect: (monitor) => ({
        isOverCurrent: monitor.isOver({ shallow: true }),
      }),
    });

    const [{ isDragging }, drag, preview] = useDrag({
      type: ItemType,
      item: () => {
        handleDragStart();
        return { id: item.id, type: item.type, parentId: item.parentId };
      },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
      end: (draggedItem, monitor) => {
        if (!monitor.didDrop()) {
          resetNavbarItems();
        }
      },
    });

    drag(drop(ref));

    return (
      <li
        ref={ref}
        className={`mb-2 p-4 border rounded bg-white shadow-sm transform transition-transform duration-200 ${
          !item.isActive ? 'opacity-50' : ''
        } ${isDragging ? 'opacity-25' : ''} ${
          isOverCurrent ? 'bg-blue-50 scale-105' : ''
        } hover:bg-gray-100`}
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="font-medium">
              {item.title.toUpperCase()} -{' '}
              {item.type === 'EXTERNAL_LINK' ? 'LIEN EXTERNE' : item.type}
            </span>
            <span
              className={`text-xs ${
                item.isActive ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {item.isActive ? 'Actif' : 'Inactif'}
            </span>
          </div>
          <div className="flex space-x-2">
            {item.type === 'PAGE' && (
              <button
                onClick={() => goToPageBuilder(item.route)}
                className="text-blue-500 hover:underline"
              >
                Page Builder
              </button>
            )}
            <button
              onClick={() => startEditing(item)}
              className="text-blue-500 hover:underline"
            >
              Modifier
            </button>
            <button
              onClick={() => handleDelete(item)}
              className="text-red-500 hover:underline"
            >
              Supprimer
            </button>
          </div>
        </div>
        {React.Children.count(children) > 0 && (
          <ul className="pl-4 mt-2 space-y-2 border-l border-gray-200">
            {children}
          </ul>
        )}
      </li>
    );
  }
);

const RootDropZone = memo(({ moveItemToRoot, children }) => {
  const ref = useRef(null);

  const [{ isOverCurrent }, drop] = useDrop({
    accept: ItemType,
    drop: (draggedItem, monitor) => {
      if (!monitor.didDrop()) {
        moveItemToRoot(draggedItem.id);
        monitor.getItem().parentId = null;
      }
    },
    collect: (monitor) => ({
      isOverCurrent: monitor.isOver({ shallow: true }),
    }),
  });

  drop(ref);

  return (
    <div
      ref={ref}
      className={`min-h-[150px] p-4 border-dashed border-2 rounded transition-colors duration-200 ${
        isOverCurrent ? 'border-blue-400 bg-blue-50' : 'border-gray-300'
      }`}
    >
      {React.Children.count(children) > 0 ? (
        <ul>{children}</ul>
      ) : (
        <div className="text-center text-gray-500">
          Aucun élément dans la racine. Glissez des éléments ici.
        </div>
      )}
    </div>
  );
});

const NavbarManager = ({ showAlert }) => {
  const [navbarItems, setNavbarItems] = useState([]);
  const [initialNavbarItems, setInitialNavbarItems] = useState([]);
  const [newItemTitle, setNewItemTitle] = useState('');
  const [newItemType, setNewItemType] = useState('PAGE');
  const [externalLink, setExternalLink] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [pendingChanges, setPendingChanges] = useState(false);

  useEffect(() => {
    fetchNavbarItems();
  }, []);

  const fetchNavbarItems = () => {
    fetch(`${process.env.NEXT_PUBLIC_VERCEL_URL}/api/navbar`)
      .then((res) => res.json())
      .then((data) => {
        setNavbarItems(data);
        setInitialNavbarItems(JSON.parse(JSON.stringify(data)));
      })
      .catch(() =>
        showAlert(
          'error',
          'Erreur lors du chargement des éléments de la navbar.'
        )
      );
  };

  const handleDragStart = () => {
    setInitialNavbarItems(JSON.parse(JSON.stringify(navbarItems)));
  };

  const resetNavbarItems = () => {
    setNavbarItems(initialNavbarItems);
    setPendingChanges(false);
  };

  const moveItem = (draggedItemId, hoverItemId, isAbove) => {
    setNavbarItems((prevItems) => {
      const draggedIndex = prevItems.findIndex(
        (item) => item.id === draggedItemId
      );
      const hoverIndex = prevItems.findIndex(
        (item) => item.id === hoverItemId
      );

      if (draggedIndex === -1 || hoverIndex === -1) return prevItems;

      const draggedItem = { ...prevItems[draggedIndex] };
      const hoverItem = prevItems[hoverIndex];

      // Empêcher les menus d'être imbriqués dans d'autres menus
      if (hoverItem.type === 'MENU' && draggedItem.type === 'MENU') {
        return prevItems;
      }

      // Mettre à jour parentId pour correspondre à celui de l'élément survolé
      draggedItem.parentId = hoverItem.parentId;

      const updatedItems = [...prevItems];
      // Retirer l'élément déplacé
      updatedItems.splice(draggedIndex, 1);
      // Calculer le nouvel index après le retrait
      let newIndex = updatedItems.findIndex(
        (item) => item.id === hoverItemId
      );
      if (!isAbove) {
        newIndex += 1;
      }
      // Insérer l'élément déplacé à la nouvelle position
      updatedItems.splice(newIndex, 0, draggedItem);

      return updatedItems;
    });
    setPendingChanges(true);
  };

  const addItemToMenu = (itemId, menuId) => {
    setNavbarItems((prevItems) => {
      const item = prevItems.find((i) => i.id === itemId);
      // Empêcher les menus d'être imbriqués dans des menus
      if (item.type === 'MENU') return prevItems;

      const updatedItems = prevItems.map((i) =>
        i.id === itemId ? { ...i, parentId: menuId } : i
      );
      return updatedItems;
    });
    setPendingChanges(true);
  };

  const moveItemToRoot = (itemId) => {
    setNavbarItems((prevItems) => {
      const updatedItems = prevItems.map((item) =>
        item.id === itemId ? { ...item, parentId: null } : item
      );
      return updatedItems;
    });
    setPendingChanges(true);
  };

  const handleSaveChanges = () => {
    const orderedItems = navbarItems.map((item, index) => ({
      id: item.id,
      order: index + 1,
      parentId: item.parentId,
    }));

    fetch(`${process.env.NEXT_PUBLIC_VERCEL_URL}/api/navbar`, {
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
        fetchNavbarItems(); // Rafraîchir les données après la sauvegarde
      })
      .catch(() =>
        showAlert('error', 'Erreur lors de la réorganisation des éléments.')
      );
  };

  const handleAddOrEditItem = (e) => {
    e.preventDefault();

    const body = {
      id: editingItem?.id,
      title: newItemTitle,
      type: newItemType,
      route:
        newItemType === 'PAGE'
          ? generateRouteFromTitle(newItemTitle)
          : externalLink,
      externalLink: newItemType === 'EXTERNAL_LINK' ? externalLink : null,
      parentId: editingItem?.parentId || null,
      order: editingItem ? editingItem.order : navbarItems.length + 1,
      isActive: isActive,
    };

    const method = editingItem ? 'PUT' : 'POST';

    fetch(`${process.env.NEXT_PUBLIC_VERCEL_URL}/api/navbar`, {
      method: method,
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
        resetForm();
        showAlert(
          'success',
          editingItem
            ? 'Élément modifié avec succès.'
            : 'Élément ajouté avec succès.'
        );
        fetchNavbarItems(); // Rafraîchir les données après l'ajout ou la modification
      })
      .catch(() =>
        showAlert(
          'error',
          `Erreur lors de la ${
            editingItem ? 'modification' : 'création'
          } de l'élément.`
        )
      );
  };

  const handleDeleteItem = (item) => {
    if (
      !window.confirm(
        `Voulez-vous vraiment supprimer l'élément "${item.title}" ?`
      )
    ) {
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_VERCEL_URL}/api/navbar`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: item.id }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to delete item');
        }
        return res.json();
      })
      .then(() => {
        showAlert('success', 'Élément supprimé avec succès.');
        fetchNavbarItems(); // Rafraîchir les données après la suppression
      })
      .catch(() =>
        showAlert('error', "Erreur lors de la suppression de l'élément.")
      );
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
    setExternalLink(item.externalLink || '');
    setIsActive(item.isActive);
  };

  const renderItems = (items, parentId = null) =>
    items
      .filter((item) => item.parentId === parentId)
      .map((item) => (
        <DraggableItem
          key={item.id}
          item={item}
          moveItem={moveItem}
          handleDelete={handleDeleteItem}
          startEditing={startEditing}
          goToPageBuilder={goToPageBuilder}
          addItemToMenu={addItemToMenu}
          handleDragStart={handleDragStart}
          resetNavbarItems={resetNavbarItems}
        >
          {renderItems(items, item.id)}
        </DraggableItem>
      ));

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="space-y-6">
        <form
          onSubmit={handleAddOrEditItem}
          className="flex flex-wrap items-center space-x-4"
        >
          <input
            type="text"
            placeholder="Titre"
            value={newItemTitle}
            onChange={(e) => setNewItemTitle(e.target.value)}
            className="border p-2 rounded w-full md:w-auto"
            required
          />
          <select
            value={newItemType}
            onChange={(e) => setNewItemType(e.target.value)}
            className="border p-2 rounded w-full md:w-auto"
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
              className="border p-2 rounded w-full md:w-auto"
              required
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
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            {editingItem ? 'Modifier' : 'Ajouter'}
          </button>
          {editingItem && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
            >
              Annuler
            </button>
          )}
        </form>
        <div className="border p-4 rounded bg-gray-100">
          <h3 className="font-bold text-lg mb-2">Éléments de la navigation</h3>
          <RootDropZone moveItemToRoot={moveItemToRoot}>
            {navbarItems.length > 0 ? (
              <ul>{renderItems(navbarItems)}</ul>
            ) : (
              <div className="text-center text-gray-500">
                Aucun élément dans la navigation. Ajoutez-en pour commencer.
              </div>
            )}
          </RootDropZone>
        </div>
        {pendingChanges && (
          <div className="text-right">
            <button
              onClick={handleSaveChanges}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
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
