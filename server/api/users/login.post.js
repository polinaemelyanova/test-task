import userService from '~/server/services/user';

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event);
        const session_id = getCookie(event, 'session_id');
        const user_agent = getHeader(event, 'user-agent');

        const user = await userService.login(body, session_id, user_agent);

        setCookie(event, 'refresh_token', user.tokens.refresh_token, {
            maxAge: 30 * 24 * 60 * 60,
            httpOnly: true,
            sameSite: false,
        });
        setCookie(event, 'access_token', user.tokens.access_token, {
            maxAge: 30 * 60,
            httpOnly: true,
            sameSite: false,
        });
        setCookie(event, 'session_id', user.session_id, {
            maxAge: 30 * 24 * 60 * 60,
            httpOnly: true,
            sameSite: false,
        });

        delete user.tokens;
        delete user.session_id;

        return user;
    } catch (error) {
        return error;
    }
});

registerRoute('/api/users/login', 'post', {
    summary: 'Логин',
    description: 'Аутентификация пользователя по логину и паролю.',
    operationId: 'login',
    tags: ['Пользователи'],
    requestBody: {
        required: true,
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        login: {
                            type: 'string',
                            example: 'ivanov',
                        },
                        password: { type: 'string', example: 'Pas1234!' },
                    },
                    required: ['login', 'password'],
                },
            },
        },
    },
    responses: {
        200: {
            description: 'Успешный ответ',
            content: {
                'application/json': {
                    schema: { $ref: '#/components/schemas/User' },
                },
            },
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
                                example: '/api/users/login',
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
                                example:
                                    'Не указан логин или пароль пользователя.',
                            },
                        },
                    },
                },
            },
        },
        403: {
            description: 'Не верный логин или пароль',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            url: {
                                type: 'string',
                                example: '/api/users/login',
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
                                example: 'Не верный логин или пароль.',
                            },
                        },
                    },
                },
            },
        },
    },
});
