export default defineEventHandler(async (event) => {
    if (!event.context.auth) {
        throw createError({
            statusCode: 401,
            message: 'Пользователь не авторизован.',
            statusMessage: 'Unauthorized',
        });
    }

    return event.context.auth;
});

registerRoute('/api/users/me', 'get', {
    summary: 'Текущий пользователь',
    description: 'Аутентификация пользователя по токену.',
    operationId: 'me',
    tags: ['Пользователи'],
    responses: {
        200: {
            description: 'Успешный ответ',
            content: {
                'application/json': {
                    schema: { $ref: '#/components/schemas/User' },
                },
            },
        },
        401: {
            $ref: '#/components/responses/401',
        },
    },
});
