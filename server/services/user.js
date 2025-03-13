import userModel from '~/server/models/user';
import sessionService from '~/server/services/session';

import sha256 from 'sha256';

class UserService {
    async registration(user_data) {
        this.validateAuthData(user_data);

        const is_login_free = await userModel.checkLoginAvailability(
            user_data.login
        );

        if (!is_login_free) {
            throw createError({
                statusCode: 409,
                statusMessage: 'Conflict',
                message: `Логин ${user_data.login} уже занят.`,
            });
        }

        user_data.password_hash = sha256(user_data.password);

        delete user_data.password;

        await userModel.create(user_data);
    }

    async login(auth_data, session_id = null, user_agent = '') {
        this.validateAuthData(auth_data);

        const candidate = await userModel.findOne({ login: auth_data.login });
        const password_hash = sha256(auth_data.password);

        if (!candidate || candidate.password_hash != password_hash) {
            throw createError({
                statusCode: 403,
                statusMessage: 'Forbidden',
                message: 'Не верный логин или пароль.',
            });
        }

        delete candidate.password_hash;

        candidate.tokens = sessionService.generateTokens(candidate);

        if (session_id) {
            const session = await sessionService.getByID(session_id);
            if (session) {
                const current_session = await sessionService.update(
                    session_id,
                    candidate.tokens.refresh_token,
                    candidate.tokens.death_date,
                    user_agent
                );

                candidate.session_id = current_session.session_id;
                return candidate;
            }
        }

        const current_session = await sessionService.create(
            candidate.user_id,
            candidate.tokens.refresh_token,
            candidate.tokens.death_date,
            user_agent
        );

        candidate.session_id = current_session.session_id;
        return candidate;
    }

    async auth(access_token, refresh_token, session_id, user_agent) {
        if (!refresh_token || !session_id) return false;

        let user_data = null;

        // Проверка не протухли ли токены
        if (access_token) {
            user_data = sessionService.validateAccessToken(access_token);

            if (user_data) {
                const user = await userModel.findOne({
                    user_id: user_data.user_id,
                });

                if (!user) return false;

                delete user.password_hash;

                return user;
            }
        }

        if (refresh_token) {
            user_data = sessionService.validateRefreshToken(refresh_token);
        }

        if (!user_data) return false;

        const user = await userModel.findOne({
            user_id: user_data.user_id,
        });

        if (!user) return false;

        // Если assess токен протух, но пользователь авторизован создаем новую пару токенов
        const tokens = sessionService.generateTokens(user);

        await sessionService.update(
            session_id,
            tokens.refresh_token,
            tokens.death_date,
            user_agent
        );

        user.session = {
            tokens,
            session_id,
        };

        return user;
    }

    validateAuthData(auth_data) {
        if (!auth_data?.login || !auth_data?.password) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Bad Request',
                message: 'Не указан логин или пароль пользователя.',
            });
        }

        const login_valid_res = validateLogin(auth_data?.login);
        const psw_valid_res = validatePassword(auth_data?.password);

        const validation_messages = [];

        if (!login_valid_res.is_valid)
            validation_messages.push(login_valid_res.message);
        if (!psw_valid_res.is_valid)
            validation_messages.push(psw_valid_res.message);

        if (validation_messages.length > 0) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Bad Request',
                message: validation_messages.join('\n'),
            });
        }
    }

    async logout(session_id, user_id) {
        await sessionService.remove(session_id, user_id);
    }
}

export default new UserService();
