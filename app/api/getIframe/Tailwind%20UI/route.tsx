import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import fs from 'fs';
import path from 'path';

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

    // HTMLテンプレートを読み込む
    const templatePath = path.join(
        process.cwd(),
        'app',
        'api',
        'getIframe',
        'Tailwind%20UI',
        'route.html'
    );
    let html;
    try {
        html = fs.readFileSync(templatePath, 'utf-8');
    } catch (err) {
        return new NextResponse('Error reading HTML template', { status: 500 });
    }

    // プレースホルダーを置換
    html = html.replace('{{COMPONENT_NAME}}', ui_component.name);
    html = html.replace('{{COMPONENT_HTML}}', ui_component.html);

    return new NextResponse(html, {
        status: 200,
        headers: { 'Content-Type': 'text/html' },
    });
}
