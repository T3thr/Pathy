import { NextResponse } from 'next/server';
import mongodbConnect from '@/lib/mongodb';
import Project from '@/models/Project';

export async function POST(req) {
    try {
        await mongodbConnect();
        
        const body = await req.json();
        const { userId, scenes, assets, editorState } = body;

        if (!userId) {
            return NextResponse.json(
                { error: 'User ID is required' },
                { status: 400 }
            );
        }

        // Create new project or update existing one
        const project = await Project.findOneAndUpdate(
            { userId }, // find by userId
            {
                userId,
                scenes,
                assets,
                editorState,
                updatedAt: new Date()
            },
            {
                upsert: true, // create if doesn't exist
                new: true, // return the updated document
                setDefaultsOnInsert: true // set default values if creating new document
            }
        );

        return NextResponse.json({
            message: 'Project saved successfully',
            data: project
        }, { status: 200 });

    } catch (error) {
        console.error('Save project error:', error);
        return NextResponse.json(
            { error: 'Failed to save project' },
            { status: 500 }
        );
    }
}