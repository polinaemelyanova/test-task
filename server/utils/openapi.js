import { writeFile } from 'fs/promises';
import schemas from '../openapi/schemas';
import responses from '../openapi/responses';

export const openAPIDocument = {
    openapi: '3.0.0',
    info: {
        title: 'Документация API',
        description: 'Документация API тестового задания',
        version: '1.0.0',
    },
    paths: {},
    components: {
        schemas,
        responses,
    },
};

// Функция для регистрации маршрутов в OpenAPI
export function registerRoute(path, method, meta) {
    console.log('Регистрация: ' + path);

    if (!openAPIDocument.paths[path]) {
        openAPIDocument.paths[path] = {};
    }
    openAPIDocument.paths[path][method] = meta;
}

// Функция для записи документа в файл openapi.json
export async function writeOpenAPIDocument() {
    await writeFile(
        './openapi.json',
        JSON.stringify(openAPIDocument, null, 2),
        'utf-8'
    );
}
