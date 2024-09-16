import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const ListPage = () => {
    const [taskLists, setTaskLists] = useState([]);
    const [newListName, setNewListName] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [editingListId, setEditingListId] = useState(null);
    const [editedListName, setEditedListName] = useState('');

    useEffect(() => {
        fetch('http://localhost:8080/tasklists')
            .then(response => response.json())
            .then(data => setTaskLists(data))
            .catch(err => console.error('Erro ao buscar listas:', err));
    }, []);

    const handleCreateList = () => {
        if (newListName.trim() === '') {
            alert('Por favor, insira um nome para a nova lista.');
            return;
        }

        fetch('http://localhost:8080/tasklists', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: newListName })
        })
            .then(response => response.json())
            .then(newList => {
                setTaskLists(prevLists => [...prevLists, newList]);
                setNewListName('');
                setIsCreating(false);
            })
            .catch(err => console.error('Erro ao criar lista:', err));
    };

    const handleEditList = (listId) => {
        if (editedListName.trim() === '') {
            alert('Por favor, insira um nome para a lista.');
            return;
        }

        fetch(`http://localhost:8080/tasklists/${listId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: editedListName })
        })
            .then(response => response.json())
            .then(updatedList => {
                setTaskLists(prevLists =>
                    prevLists.map(list =>
                        list.id === listId ? updatedList : list
                    )
                );
                setEditingListId(null);
                setEditedListName('');
            })
            .catch(err => console.error('Erro ao atualizar lista:', err));
    };

    const handleDeleteList = (listId) => {
        if (window.confirm('Tem certeza de que deseja excluir esta lista?')) {
            fetch(`http://localhost:8080/tasklists/${listId}`, {
                method: 'DELETE'
            })
                .then(() => {
                    setTaskLists(prevLists =>
                        prevLists.filter(list => list.id !== listId)
                    );
                })
                .catch(err => console.error('Erro ao excluir lista:', err));
        }
    };

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Listas de Tarefas</h1>
            {isCreating ? (
                <div className="mb-4">
                    <input
                        type="text"
                        value={newListName}
                        onChange={(e) => setNewListName(e.target.value)}
                        className="border p-2 rounded mr-2"
                        placeholder="Nome da nova lista"
                    />
                    <button onClick={handleCreateList} className="bg-blue-500 text-white p-2 rounded">Criar</button>
                    <button onClick={() => setIsCreating(false)} className="bg-gray-500 text-white p-2 rounded ml-2">Cancelar</button>
                </div>
            ) : (
                <button onClick={() => setIsCreating(true)} className="bg-blue-500 text-white p-2 rounded mb-4">Criar Nova Lista</button>
            )}
            {taskLists.length > 0 ? (
                <ul>
                    {taskLists.map((list) => (
                        <li key={list.id} className="mb-2 flex items-center">
                            {editingListId === list.id ? (
                                <div className="flex items-center">
                                    <input
                                        type="text"
                                        value={editedListName}
                                        onChange={(e) => setEditedListName(e.target.value)}
                                        className="border p-2 rounded mr-2"
                                        placeholder="Nome da lista"
                                    />
                                    <button onClick={() => handleEditList(list.id)} className="bg-green-500 text-white p-2 rounded mr-2">Salvar</button>
                                    <button onClick={() => setEditingListId(null)} className="bg-gray-500 text-white p-2 rounded">Cancelar</button>
                                </div>
                            ) : (
                                <div className="flex items-center">
                                    <Link to={`/list/${list.id}`} className="text-blue-500 hover:underline mr-4">{list.name}</Link>
                                    <button onClick={() => {
                                        setEditingListId(list.id);
                                        setEditedListName(list.name);
                                    }} className="bg-yellow-500 text-white p-2 rounded mr-2">Editar</button>
                                    <button onClick={() => handleDeleteList(list.id)} className="bg-red-500 text-white p-2 rounded">Excluir</button>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Não há listas. Crie uma nova lista usando o botão acima.</p>
            )}
        </div>
    );
};

export default ListPage;