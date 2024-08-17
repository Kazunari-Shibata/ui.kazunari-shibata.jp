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
        <form className="flex flex-1 max-w-screen-md ml-4">
            <div className="flex-1">
                <div>
                    <label
                        htmlFor="default-search"
                        className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
                    >
                        Search
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                            <svg
                                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                                />
                            </svg>
                        </div>
                        <input
                            type="search"
                            id="default-search"
                            className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Search components..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>
            <select
                value={selectedFramework}
                onChange={(e) => setSelectedFramework(e.target.value)}
                className="block w-full max-w-44 px-4 py-3 ml-3 text-base text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            >
                <option value="">All Frameworks</option>
                {allFrameworks.map((framework) => (
                    <option key={framework} value={framework}>
                        {framework}
                    </option>
                ))}
            </select>
        </form>
    );
};

export default SearchForm;
