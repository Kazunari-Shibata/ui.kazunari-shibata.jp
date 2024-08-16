import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: NextRequest) {
    const supabase = createClient();
    try {
        // Fetch all tags to create a lookup map
        const { data: tagData, error: tagError } = await supabase
            .from('ui_tags')
            .select('id, name');

        if (tagError) throw tagError;

        const tagMap = new Map(tagData.map((tag) => [tag.id, tag.name]));

        // Fetch all frameworks to create a lookup map
        const { data: frameworkData, error: frameworkError } = await supabase
            .from('ui_frameworks')
            .select('id, name');

        if (frameworkError) throw frameworkError;

        const frameworkMap = new Map(
            frameworkData.map((framework) => [framework.id, framework.name])
        );

        // Fetch components with their associated tags
        const { data, error, count } = await supabase
            .from('ui_components')
            .select(
                `
                *,
                ui_tag_manager!inner(tag)
            `,
                { count: 'exact' }
            );

        if (error) throw error;

        // Format the data, replacing tag IDs with names and framework ID with framework name
        const formattedData = data.map((component) => ({
            ...component,
            tags: component.ui_tag_manager.map(
                (t: { tag: string }) => tagMap.get(t.tag) || t.tag
            ),
            framework:
                frameworkMap.get(component.framework) || component.framework,
            ui_tag_manager: undefined,
        }));

        // Get all unique tag names
        const allTags = Array.from(
            new Set(formattedData.flatMap((component) => component.tags))
        );

        return NextResponse.json({ count, allTags, data: formattedData });
    } catch (error) {
        console.error('Error fetching components:', error);
        return NextResponse.json(
            { error: 'Failed to fetch components' },
            { status: 500 }
        );
    }
}
