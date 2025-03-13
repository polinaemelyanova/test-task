import userService from '~/server/services/user';

export default defineEventHandler(async (event) => {
    try {
        const user_data = event.context.auth;
        const session_id = event.context.session_id;

        if (user_data?.user_id && session_id) {
            await userService.logout(session_id, user_data.user_id);
        }

        deleteCookie(event, 'refresh_token');
        deleteCookie(event, 'access_token');
        deleteCookie(event, 'session_id');
    } catch (error) {
        return error;
    }
});

registerRoute('/api/users/logout', 'post', {
    summary: 'Выход из аккаунта',
    description:
        'Разлогинивает текущего пользователя, удаляет сессию и чистит cookie.',
    operationId: 'logout',
    tags: ['Пользователи'],
    responses: {
        204: {
            description: 'Успешный ответ',
        },
    },
});
