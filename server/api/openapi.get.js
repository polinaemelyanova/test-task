import fs from 'fs/promises';

export default defineEventHandler(async () => {
    if (import.meta.dev) {
        await writeOpenAPIDocument();
    }

    try {
        return await fs.readFile('./openapi.json');
    } catch (error) {
        return openAPIDocument;
    }
});
