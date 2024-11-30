// src/app/api/charts_storage_api_version/study_templates/route.js

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
let templates = []; // In-memory storage for templates

export async function POST(request) {
    try {
        const body = await request.json();
        console.log("Request Body: ", body);

        const { user, name, content } = body;

        if (!user || !name || !content) {
            console.error("Missing required fields");
            return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
        }

        const template = { user, name, content };
        templates.push(template);

        return new Response(JSON.stringify({ message: "Template saved successfully", template }), { status: 200 });
    } catch (error) {
        console.error("Error saving template: ", error.message);
        return new Response(JSON.stringify({ error: "Error saving template", details: error.message }), { status: 500 });
    }
}

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const user = searchParams.get('user');

        if (!user) {
            return new Response(JSON.stringify({ error: "Missing required query parameter: user" }), { status: 400 });
        }

        const userTemplates = templates.filter((t) => t.user === user);

        if (!userTemplates.length) {
            return new Response(JSON.stringify({ error: "No templates found for this user" }), { status: 404 });
        }

        return new Response(JSON.stringify(userTemplates), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: "Error loading templates", details: error.message }), { status: 500 });
    }
}


export async function DELETE(request) {
    try {
        const { searchParams } = new URL(request.url);
        const client = searchParams.get('client');
        const user = searchParams.get('user');
        const templateName = searchParams.get('template');

        if (!client || !user || !templateName) {
            return new Response(JSON.stringify({ error: "Missing required query parameters" }), { status: 400 });
        }

        const index = templates.findIndex(
            (t) => t.client === client && t.user === user && t.name === templateName
        );

        if (index === -1) {
            return new Response(JSON.stringify({ error: "Template not found" }), { status: 404 });
        }

        templates.splice(index, 1);

        return new Response(JSON.stringify({ message: "Template deleted successfully" }), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: "Error deleting template", details: error.message }), { status: 500 });
    }
}
