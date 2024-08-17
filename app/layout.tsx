import { GeistSans } from 'geist/font/sans';
import './globals.css';

export const metadata = {
    title: 'Next.js and Supabase Starter Kit',
    description: 'The fastest way to build apps with Next.js and Supabase',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className={`${GeistSans.className} light`}>
            <body>
                <main>{children}</main>
                <script src="https://cdn.jsdelivr.net/npm/flowbite@2.5.1/dist/flowbite.min.js"></script>
            </body>
        </html>
    );
}
