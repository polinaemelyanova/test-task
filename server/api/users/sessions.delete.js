import sessionService from '~/server/services/session';

export default defineEventHandler(async (event) => {
    if (!event.context.auth) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Unauthorized',
            message: 'Пользователь не авторизован.',
        });
    }

    const query = getQuery(event);
    console.log(query);

    if (!query?.session_id) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Bad Request',
            message: 'Не указан id сессии.',
        });
    }

    await sessionService.remove(query.session_id, event.context.auth.user_id);
});

registerRoute('/api/users/sessions', 'delete', {
    summary: 'Удаление сессии',
    description: 'Удаляет сессию текущего пользователя.',
    operationId: 'deleteSession',
    tags: ['Сессии'],
    responses: {
        204: {
            description: 'Успешный ответ',
        },
        400: {
            description: 'Ошибка валидации',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            url: {
                                type: 'string',
                                example: '/api/users/sessions',
                            },
                            statusCode: {
                                type: 'integer',
                                example: 400,
                            },
                            statusMessage: {
                                type: 'string',
                                example: 'Bad Request',
                            },
                            message: {
                                type: 'string',
                                example: 'Не указан id сессии.',
                            },
                        },
                    },
                },
            },
        },
        401: {
            $ref: '#/components/responses/401',
        },
        403: {
            description: 'Доступ запрещен',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            url: {
                                type: 'string',
                                example: '/api/users/sessions',
                            },
                            statusCode: {
                                type: 'integer',
                                example: 403,
                            },
                            statusMessage: {
                                type: 'string',
                                example: 'Forbidden',
                            },
                            message: {
                                type: 'string',
                                example: 'Доступ запрещен.',
                            },
                        },
                    },
                },
            },
        },
    },
});
