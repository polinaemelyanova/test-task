export const Error401 = {
    description: 'Пользователь не авторизован',
    content: {
        'application/json': {
            schema: {
                type: 'object',
                properties: {
                    url: {
                        type: 'string',
                        example: '/api/...',
                    },
                    statusCode: {
                        type: 'integer',
                        example: 401,
                    },
                    statusMessage: {
                        type: 'string',
                        example: 'Unauthorized',
                    },
                    message: {
                        type: 'string',
                        example: 'Пользователь не авторизован.',
                    },
                },
            },
        },
    },
};
