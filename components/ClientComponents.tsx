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

    // console.log(allTags);

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">UI Components ({count})</h1>

            <SearchForm
                components={components}
                setFilteredComponents={setFilteredComponents}
                selectedTags={selectedTags}
                selectedFramework={selectedFramework}
                setSelectedFramework={setSelectedFramework}
                allFrameworks={allFrameworks}
            />

            <h2 className="text-xl font-semibold mb-2">All Tags:</h2>
            <ul className="mb-4">
                {allTags.map((tag) => (
                    <li
                        key={tag}
                        className={`inline-block rounded-full px-3 py-1 text-sm font-semibold mr-2 mb-2 cursor-pointer ${
                            selectedTags.includes(tag)
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-200 text-gray-700'
                        }`}
                        onClick={() => handleTagClick(tag)}
                    >
                        {tag}
                    </li>
                ))}
            </ul>

            <ComponentList filteredComponents={filteredComponents} />
        </div>
    );
}
