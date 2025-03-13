export const Error403 = {
    description: 'Недостаточно прав',
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
                        example: 403,
                    },
                    statusMessage: {
                        type: 'string',
                        example: 'Forbidden',
                    },
                    message: {
                        type: 'string',
                        example: 'Недостаточно прав.',
                    },
                },
            },
        },
    },
};
