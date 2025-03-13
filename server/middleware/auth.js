import userService from '~/server/services/user';

export default defineEventHandler(async (event) => {
    if (event.path.includes('login')) {
        return;
    }

    event.context.auth = false;

    const access_token = getCookie(event, 'access_token');
    const refresh_token = getCookie(event, 'refresh_token');
    const session_id = getCookie(event, 'session_id');
    const user_agent = getHeaders(event)?.['user-agent'];

    const user = await userService.auth(
        access_token,
        refresh_token,
        session_id,
        user_agent
    );

    if (!user) {
        deleteCookie(event, 'refresh_token');
        deleteCookie(event, 'access_token');
        deleteCookie(event, 'session_id');

        return;
    }

    if (user?.session) {
        setCookie(event, 'refresh_token', user.session.tokens.refresh_token, {
            maxAge: 30 * 24 * 60 * 60,
            httpOnly: true,
            sameSite: false,
        });
        setCookie(event, 'access_token', user.session.tokens.access_token, {
            maxAge: 30 * 60,
            httpOnly: true,
            sameSite: false,
        });
        setCookie(event, 'session_id', user.session.session_id, {
            maxAge: 30 * 24 * 60 * 60,
            httpOnly: true,
            sameSite: false,
        });

        delete user.session;
    }

    event.context.auth = user;
    event.context.session_id = session_id;
});
