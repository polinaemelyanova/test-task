export const User = {
    type: 'object',
    properties: {
        user_id: {
            type: 'integer',
            example: 1,
        },
        login: {
            type: 'string',
            example: 'ivanov',
        },
        first_name: { type: 'string', example: 'Иван' },
        last_name: {
            type: 'string',
            example: 'Иванов',
        },
    },
};
