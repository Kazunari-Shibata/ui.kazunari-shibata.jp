// app/aip / getComponents / route.ts;
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: NextRequest) {
    const supabase = createClient();
    const { searchParams } = new URL(request.url);
    const tags = searchParams.get('tags');

    try {
        let query = supabase.from('ui_components').select(
            `
                *,
                ui_tag_manager!inner(tag)
            `,
            { count: 'exact' }
        );

        if (tags) {
            const tagList = tags.split(',');
            const tagQueries = tagList.map((tag) =>
                supabase
                    .from('ui_tag_manager')
                    .select('component')
                    .eq('tag', tag)
            );

            const tagResults = await Promise.all(tagQueries);
            const commonComponentIds = tagResults.reduce((acc, result) => {
                const componentIds =
                    result.data?.map((item) => item.component) || [];
                return acc.length === 0
                    ? componentIds
                    : acc.filter((id) => componentIds.includes(id));
            }, []);

            if (commonComponentIds.length > 0) {
                query = query.in('id', commonComponentIds);
            } else {
                return NextResponse.json({ data: [], count: 0, allTags: [] });
            }
        }

        const { data, error, count } = await query;

        if (error) throw error;

        // タグの情報を整形し、不要な構造を除去
        const formattedData = data.map((component) => ({
            ...component,
            tags: component.ui_tag_manager.map((t) => t.tag),
            ui_tag_manager: undefined, // この行で不要なui_tag_manager構造を除去
        }));

        // すべての一意なタグを取得
        const allTags = Array.from(
            new Set(formattedData.flatMap((component) => component.tags))
        );

        return NextResponse.json({ data: formattedData, count, allTags });
    } catch (error) {
        console.error('Error fetching components:', error);
        return NextResponse.json(
            { error: 'Failed to fetch components' },
            { status: 500 }
        );
    }
}
