export const Session = {
    type: 'object',
    properties: {
        session_id: {
            type: 'string',
            example: 'plih038xsm7w2x09n',
        },
        user_id: {
            type: 'integer',
            example: 1,
        },
        name: {
            type: 'string',
            example: 'Firefox (GNU/Linux)',
        },
        death_date: {
            type: 'date',
            example: '2025-04-04T15:35:03.000Z',
        },
        last_update: {
            type: 'date',
            example: '2025-03-05T15:35:03.818Z',
        },
    },
};
