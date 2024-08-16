import React, { useState, useEffect } from 'react';
import Fuse from 'fuse.js';

interface Component {
    id: string;
    name: string;
    framework: string;
    tags: string[];
}

interface SearchFormProps {
    components: Component[];
    setFilteredComponents: React.Dispatch<React.SetStateAction<Component[]>>;
    selectedTags: string[];
    selectedFramework: string;
    setSelectedFramework: React.Dispatch<React.SetStateAction<string>>;
    allFrameworks: string[];
}

const SearchForm: React.FC<SearchFormProps> = ({
    components,
    setFilteredComponents,
    selectedTags,
    selectedFramework,
    setSelectedFramework,
    allFrameworks,
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [fuse, setFuse] = useState<Fuse<Component> | null>(null);

    useEffect(() => {
        const fuseOptions = {
            keys: ['name', 'framework', 'tags'],
            threshold: 0.3,
        };
        setFuse(new Fuse(components, fuseOptions));
    }, [components]);

    useEffect(() => {
        if (!fuse) return;

        let filteredResults = components;

        // Apply framework filtering
        if (selectedFramework) {
            filteredResults = filteredResults.filter(
                (component) => component.framework === selectedFramework
            );
        }

        // Apply tag filtering
        if (selectedTags.length > 0) {
            filteredResults = filteredResults.filter((component) =>
                selectedTags.every((tag) => component.tags.includes(tag))
            );
        }

        // Apply search term filtering
        if (searchTerm !== '') {
            const searchResults = fuse.search(searchTerm);
            filteredResults = searchResults
                .map((result) => result.item)
                .filter((item) => filteredResults.includes(item));
        }

        setFilteredComponents(filteredResults);
    }, [
        searchTerm,
        fuse,
        components,
        setFilteredComponents,
        selectedTags,
        selectedFramework,
    ]);

    return (
        <div className="mb-4 space-y-2">
            <input
                type="text"
                placeholder="Search components..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 border rounded"
            />
            <select
                value={selectedFramework}
                onChange={(e) => setSelectedFramework(e.target.value)}
                className="w-full p-2 border rounded"
            >
                <option value="">All Frameworks</option>
                {allFrameworks.map((framework) => (
                    <option key={framework} value={framework}>
                        {framework}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default SearchForm;
