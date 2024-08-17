'use client';

import React, { useState, useMemo } from 'react';
import SearchForm from '@/components/SearchForm';
import ComponentList from '@/components/ComponentList';

interface Component {
    id: string;
    name: string;
    framework: string;
    tags: string[];
}

interface ClientComponentsProps {
    initialComponents: Component[];
    initialCount: number;
    initialAllTags: string[];
}

export default function ClientComponents({
    initialComponents,
    initialCount,
    initialAllTags,
}: ClientComponentsProps) {
    const [components] = useState<Component[]>(initialComponents);
    const [filteredComponents, setFilteredComponents] =
        useState<Component[]>(initialComponents);
    const [allTags] = useState<string[]>(initialAllTags);
    const [count] = useState<number>(initialCount);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [selectedFramework, setSelectedFramework] = useState<string>('');

    const allFrameworks = useMemo(() => {
        return Array.from(new Set(components.map((c) => c.framework)));
    }, [components]);

    const handleTagClick = (tag: string) => {
        setSelectedTags((prevTags) =>
            prevTags.includes(tag)
                ? prevTags.filter((t) => t !== tag)
                : [...prevTags, tag]
        );
    };

    return (
        <div>
            <header className="flex items-center justify-between px-5 py-5 w-full  bg-white border-b border-gray-200 dark:border-gray-600 dark:bg-gray-800">
                <div className="w-full m-auto flex justify-between">
                    <div className="flex items-center">
                        <label className="inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                value=""
                                className="sr-only peer"
                                defaultChecked
                            />
                            <div className="relative w-14 h-7 mr-3 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        </label>
                        <h1 className="text-5xl font-extrabold dark:text-white">
                            UI Gallery
                        </h1>
                    </div>
                    <SearchForm
                        components={components}
                        setFilteredComponents={setFilteredComponents}
                        selectedTags={selectedTags}
                        selectedFramework={selectedFramework}
                        setSelectedFramework={setSelectedFramework}
                        allFrameworks={allFrameworks}
                    />
                </div>
            </header>

            <div className="p-5">
                <ul className="mb-4 flex">
                    {allTags.map((tag) => (
                        <li key={tag}>
                            <button
                                className={
                                    selectedTags.includes(tag)
                                        ? 'text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 border font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
                                        : 'py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700'
                                }
                                onClick={() => handleTagClick(tag)}
                            >
                                {tag}
                            </button>
                        </li>
                    ))}
                </ul>
                <ComponentList filteredComponents={filteredComponents} />
            </div>
        </div>
    );
}
