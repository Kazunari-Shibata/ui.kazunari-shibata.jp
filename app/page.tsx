import { Metadata } from 'next';
import ClientComponents from '../components/ClientComponents';

export const metadata: Metadata = {
    title: 'UI Components',
    description: 'A list of UI components',
};

async function fetchComponents() {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/getComponents`, {
        cache: 'no-store',
    });
    if (!res.ok) {
        throw new Error('Failed to fetch components');
    }
    return res.json();
}

export default async function ComponentsPage() {
    try {
        const { data: components, count, allTags } = await fetchComponents();
        return (
            <ClientComponents
                initialComponents={components}
                initialCount={count}
                initialAllTags={allTags}
            />
        );
    } catch (error) {
        console.error('Error fetching components:', error);
        return <div>Error: Failed to fetch components</div>;
    }
}
