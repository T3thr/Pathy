import { NextResponse } from 'next/server';
import mongodbConnect from '@/backend/lib/mongodb';
import Project from '@/backend/models/Project';

export async function GET(req, { params }) {
    try {
        await mongodbConnect();
        
        const { projectId } = params;
        
        if (!projectId) {
            return NextResponse.json(
                { error: 'Project ID is required' },
                { status: 400 }
            );
        }

        const project = await Project.findById(projectId);

        if (!project) {
            return NextResponse.json(
                { error: 'Project not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            data: project
        }, { status: 200 });

    } catch (error) {
        console.error('Load project error:', error);
        return NextResponse.json(
            { error: 'Failed to load project' },
            { status: 500 }
        );
    }
}

export async function PUT(req, { params }) {
    try {
        await mongodbConnect();
        
        const { projectId } = params;
        const body = await req.json();
        const { scenes, assets, editorState } = body;

        if (!projectId) {
            return NextResponse.json(
                { error: 'Project ID is required' },
                { status: 400 }
            );
        }

        const project = await Project.findByIdAndUpdate(
            projectId,
            {
                scenes,
                assets,
                editorState,
                updatedAt: new Date()
            },
            { new: true }
        );

        if (!project) {
            return NextResponse.json(
                { error: 'Project not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            message: 'Project updated successfully',
            data: project
        }, { status: 200 });

    } catch (error) {
        console.error('Update project error:', error);
        return NextResponse.json(
            { error: 'Failed to update project' },
            { status: 500 }
        );
    }
}

export async function DELETE(req, { params }) {
    try {
        await mongodbConnect();
        
        const { projectId } = params;

        if (!projectId) {
            return NextResponse.json(
                { error: 'Project ID is required' },
                { status: 400 }
            );
        }

        const project = await Project.findByIdAndDelete(projectId);

        if (!project) {
            return NextResponse.json(
                { error: 'Project not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            message: 'Project deleted successfully'
        }, { status: 200 });

    } catch (error) {
        console.error('Delete project error:', error);
        return NextResponse.json(
            { error: 'Failed to delete project' },
            { status: 500 }
        );
    }
}