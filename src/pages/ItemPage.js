import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const ItemPage = () => {
  const { id: listId } = useParams();
  const [taskItems, setTaskItems] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [editItem, setEditItem] = useState(null);
  const [updatedTitle, setUpdatedTitle] = useState('');
  const [updatedPriority, setUpdatedPriority] = useState(false);
  const [updatedStatus, setUpdatedStatus] = useState('PENDENTE'); // Valor inicial atualizado

  useEffect(() => {
    if (!listId) return;
  
    fetch(`http://localhost:8080/taskitems/list/${listId}`)
      .then((response) => {
        if (!response.ok) {
          return response.text().then((text) => {
            throw new Error(`Erro ao buscar itens da lista: ${text}`);
          });
        }
        return response.json();
      })
      .then((data) => setTaskItems(data))
      .catch((error) => {
        console.error(error);
        alert('Erro ao buscar itens da lista');
      });
  }, [listId]);

  const handleAddItem = () => {
    if (newItem.trim() === '') {
      alert('Por favor, insira um título para o item.');
      return;
    }

    fetch('http://localhost:8080/taskitems', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: newItem,
        status: 'PENDENTE', // Atualizado para o valor esperado
        priority: false,
        taskListId: listId
      })
    })
      .then(response => {
        if (!response.ok) {
          return response.text().then(text => {
            throw new Error(`Erro ao adicionar item: ${text}`);
          });
        }
        return response.json();
      })
      .then(item => {
        setTaskItems(prev => [...prev, item]);
        setNewItem('');
      })
      .catch(err => {
        console.error('Erro ao adicionar item:', err);
        alert('Erro ao adicionar item');
      });
  };

  const handleUpdateItem = (itemId) => {
    fetch(`http://localhost:8080/taskitems/${itemId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: updatedTitle,
        status: updatedStatus, // Certifique-se de que este valor corresponde aos valores aceitos pelo enum
        priority: updatedPriority,
        taskListId: listId
      })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Erro ao atualizar item');
        }
        return response.json();
      })
      .then(updatedItem => {
        setTaskItems(prev =>
          prev.map(item => item.id === itemId ? updatedItem : item)
        );
        setEditItem(null);
        setUpdatedTitle('');
        setUpdatedPriority(false);
        setUpdatedStatus('PENDENTE'); // Atualizado para o valor esperado
      })
      .catch(err => console.error('Erro ao atualizar item:', err));
  };

  const handleDeleteItem = (itemId) => {
    if (window.confirm('Tem certeza de que deseja excluir este item?')) {
      fetch(`http://localhost:8080/taskitems/${itemId}`, {
        method: 'DELETE'
      })
        .then(() => {
          setTaskItems(prev =>
            prev.filter(item => item.id !== itemId)
          );
        })
        .catch(err => console.error('Erro ao excluir item:', err));
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Itens da Lista</h1>
      <ul>
        {taskItems.length > 0 ? (
          taskItems.map(item => (
            <li key={item.id} className="mb-2">
              {editItem === item.id ? (
                <div>
                  <input
                    type="text"
                    value={updatedTitle}
                    onChange={(e) => setUpdatedTitle(e.target.value)}
                    className="border p-2 rounded mr-2"
                    placeholder="Título"
                  />
                  <select
                    value={updatedStatus}
                    onChange={(e) => setUpdatedStatus(e.target.value)}
                    className="border p-2 rounded mr-2"
                  >
                    <option value="PENDENTE">Pendente</option>
                    <option value="EM_ANDAMENTO">Em andamento</option>
                    <option value="CONCLUIDO">Concluído</option>
                  </select>
                  <label>
                    <input
                      type="checkbox"
                      checked={updatedPriority}
                      onChange={(e) => setUpdatedPriority(e.target.checked)}
                      className="mr-2"
                    />
                    Prioridade
                  </label>
                  <button onClick={() => handleUpdateItem(item.id)} className="bg-green-500 text-white p-2 rounded">Salvar</button>
                  <button onClick={() => setEditItem(null)} className="bg-gray-500 text-white p-2 rounded">Cancelar</button>
                </div>
              ) : (
                <div>
                  <span>{item.title} - {item.status} - {item.priority ? 'Prioritário' : 'Normal'}</span>
                  <button onClick={() => {
                    setEditItem(item.id);
                    setUpdatedTitle(item.title);
                    setUpdatedPriority(item.priority);
                    setUpdatedStatus(item.status);
                  }} className="bg-yellow-500 text-white p-2 rounded ml-2">Editar</button>
                  <button onClick={() => handleDeleteItem(item.id)} className="bg-red-500 text-white p-2 rounded ml-2">Excluir</button>
                </div>
              )}
            </li>
          ))
        ) : (
          <p>Não há itens nesta lista. Adicione novos itens usando o botão abaixo.</p>
        )}
      </ul>
      <div className="mt-4">
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          className="border p-2 rounded mr-2"
          placeholder="Novo item"
        />
        <button onClick={handleAddItem} className="bg-blue-500 text-white p-2 rounded">Adicionar</button>
      </div>
      <Link to="/" className="text-blue-500 hover:underline mt-4 block">Voltar para Listas</Link>
    </div>
  );
};

export default ItemPage;