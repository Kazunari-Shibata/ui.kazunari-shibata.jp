// app/api/iframe/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id) {
        return new NextResponse('ID is required', { status: 400 });
    }

    const supabase = createClient();
    const { data: ui_component, error } = await supabase
        .from('ui_components')
        .select()
        .eq('id', id)
        .single();

    if (error) {
        return new NextResponse('Error fetching data', { status: 500 });
    }

    if (!ui_component) {
        return new NextResponse('Component not found', { status: 404 });
    }

    const html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${ui_component.name}</title>
            <script src="https://cdn.tailwindcss.com"></script>
            <link href="https://cdn.jsdelivr.net/npm/flowbite@2.5.1/dist/flowbite.min.css" rel="stylesheet" />
        </head>
        <body class="bg-white dark:bg-gray-900 p-5">
            ${ui_component.html}
            <script src="https://cdn.jsdelivr.net/npm/flowbite@2.5.1/dist/flowbite.min.js"></script>
        </body>
        </html>
    `;

    return new NextResponse(html, {
        status: 200,
        headers: { 'Content-Type': 'text/html' },
    });
}
