import { Metadata } from 'next';
import ClientComponents from '../components/ClientComponents';

export const metadata: Metadata = {
    title: 'UI Gallery',
    description: 'A list of UI',
};

async function fetchComponents() {
    const baseUrl =
        process.env.NODE_ENV === 'production'
            ? 'https://ui-kazunari-shibata-jp.vercel.app'
            : 'http://localhost:3000';

    const res = await fetch(`${baseUrl}/api/getComponents`, {
        cache: 'no-store',
    });
    if (!res.ok) {
        throw new Error('Failed to fetch components');
    }
    return res.json();
}

export default async function Home() {
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
