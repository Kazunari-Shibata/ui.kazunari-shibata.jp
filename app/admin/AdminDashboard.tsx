'use client';

import { useState } from 'react';

function AdminDashboard({ initialComponents, initialFrameworks, initialTags }) {
    const [activeSection, setActiveSection] = useState('components');
    const [editingItem, setEditingItem] = useState(null);
    const [editedData, setEditedData] = useState({});
    const [components, setComponents] = useState(initialComponents);
    const [frameworks, setFrameworks] = useState(initialFrameworks);
    const [tags, setTags] = useState(initialTags);

    const handleEdit = (item) => {
        setEditingItem(item);
        setEditedData(item);
    };

    const handleChange = (e) => {
        setEditedData({ ...editedData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        try {
            const response = await fetch('/api/updateData', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    section: activeSection,
                    data: editedData,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to update data');
            }

            const result = await response.json();

            // Update local state
            switch (activeSection) {
                case 'components':
                    setComponents(
                        components.map((item) =>
                            item.id === editedData.id ? editedData : item
                        )
                    );
                    break;
                case 'frameworks':
                    setFrameworks(
                        frameworks.map((item) =>
                            item.id === editedData.id ? editedData : item
                        )
                    );
                    break;
                case 'tags':
                    setTags(
                        tags.map((item) =>
                            item.id === editedData.id ? editedData : item
                        )
                    );
                    break;
            }

            setEditingItem(null);
            alert('Data updated successfully');
        } catch (error) {
            console.error('Error updating data:', error);
            alert('Failed to update data');
        }
    };

    const renderEditForm = (item, columns) => (
        <tr>
            {columns.map((column) => (
                <td key={column} className="px-6 py-4 whitespace-nowrap">
                    <input
                        type="text"
                        name={column}
                        value={editedData[column] || ''}
                        onChange={handleChange}
                        className="border rounded px-2 py-1 w-full"
                    />
                </td>
            ))}
            <td className="px-6 py-4 whitespace-nowrap">
                <button
                    onClick={handleSave}
                    className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                >
                    Save
                </button>
                <button
                    onClick={() => setEditingItem(null)}
                    className="bg-gray-300 px-2 py-1 rounded"
                >
                    Cancel
                </button>
            </td>
        </tr>
    );

    const renderTable = (data, columns) => {
        if (!data || data.length === 0) {
            return <p className="p-4 text-gray-500">No data available.</p>;
        }

        return (
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        {columns.map((column) => (
                            <th
                                key={column}
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                                {column}
                            </th>
                        ))}
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {data.map((item) =>
                        editingItem === item ? (
                            renderEditForm(item, columns)
                        ) : (
                            <tr key={item.id}>
                                {columns.map((column) => (
                                    <td
                                        key={column}
                                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                                    >
                                        {item[column] !== undefined
                                            ? String(item[column])
                                            : ''}
                                    </td>
                                ))}
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button
                                        onClick={() => handleEdit(item)}
                                        className="text-indigo-600 hover:text-indigo-900"
                                    >
                                        Edit
                                    </button>
                                </td>
                            </tr>
                        )
                    )}
                </tbody>
            </table>
        );
    };

    const renderContent = () => {
        switch (activeSection) {
            case 'components':
                return renderTable(components, [
                    'id',
                    'name',
                    'created_at',
                    'url',
                    'framework',
                ]);
            case 'frameworks':
                return renderTable(frameworks, ['id', 'name']);
            case 'tags':
                return renderTable(tags, ['id', 'name', 'created_at']);
            default:
                return null;
        }
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* サイドメニュー */}
            <div className="w-64 bg-white shadow-md">
                <nav className="mt-5">
                    {['Components', 'Frameworks', 'Tags'].map((item) => (
                        <a
                            key={item}
                            href="#"
                            className={`block py-2 px-4 text-sm ${
                                activeSection === item.toLowerCase()
                                    ? 'bg-gray-200'
                                    : ''
                            }`}
                            onClick={() => setActiveSection(item.toLowerCase())}
                        >
                            {item}
                        </a>
                    ))}
                </nav>
            </div>

            {/* メインコンテンツ */}
            <div className="flex-1 p-10 overflow-auto">
                <h1 className="text-2xl font-bold mb-5">Admin Dashboard</h1>
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;
