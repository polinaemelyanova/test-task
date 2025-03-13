import sessionService from '~/server/services/session';

export default defineEventHandler(async (event) => {
    if (!event.context.auth) {
        throw createError({
            statusCode: 401,
            message: 'Пользователь не авторизован.',
            statusMessage: 'Unauthorized',
        });
    }

    const sessions = await sessionService.getByUser(event.context.auth.user_id);

    const current_session = sessions.find(
        (session) => session.session_id == event.context.session_id
    );
    current_session.is_current = true;

    return sessions;
});

registerRoute('/api/users/sessions', 'get', {
    summary: 'Список сессий',
    description: 'Получает список сессий текущего пользователя.',
    operationId: 'getSessions',
    tags: ['Сессии'],
    responses: {
        200: {
            description: 'Успешный ответ',
            content: {
                'application/json': {
                    schema: {
                        type: 'array',
                        items: {
                            $ref: '#/components/schemas/Session',
                        },
                    },
                },
            },
        },
        401: {
            $ref: '#/components/responses/401',
        },
    },
});
