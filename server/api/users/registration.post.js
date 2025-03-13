import userService from '~/server/services/user';

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event);
        await userService.registration(body);
    } catch (error) {
        return error;
    }
});

registerRoute('/api/users/registration', 'post', {
    summary: 'Регистрация',
    description: 'Регистрация пользователя.',
    operationId: 'registration',
    tags: ['Пользователи'],
    requestBody: {
        required: true,
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        first_name: {
                            type: 'string',
                            example: 'Иван',
                        },
                        last_name: {
                            type: 'string',
                            example: 'Иванов',
                        },
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
                                example: '/api/users/registration',
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
        409: {
            description: 'Логин занят',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            url: {
                                type: 'string',
                                example: '/api/users/registration',
                            },
                            statusCode: {
                                type: 'integer',
                                example: 409,
                            },
                            statusMessage: {
                                type: 'string',
                                example: 'Conflict',
                            },
                            message: {
                                type: 'string',
                                example: 'Логин ivanov уже занят.',
                            },
                        },
                    },
                },
            },
        },
    },
});
