import sessionModel from '~/server/models/session';
import DeviceDetector from 'device-detector-js';
import jwt from 'jsonwebtoken';
import uniqid from 'uniqid';

class SessionService {
    generateTokens(payload) {
        const access_token = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
            expiresIn: '10m',
        });
        const refresh_token = jwt.sign(
            payload,
            process.env.JWT_REFRESH_SECRET,
            {
                expiresIn: '30d',
            }
        );

        const verify_data = jwt.verify(
            refresh_token,
            process.env.JWT_REFRESH_SECRET
        );

        return {
            access_token,
            refresh_token,
            death_date: new Date(verify_data.exp * 1000).toISOString(),
        };
    }

    validateAccessToken(token) {
        try {
            const user_data = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
            return user_data;
        } catch (e) {
            return false;
        }
    }

    async validateRefreshToken(token) {
        try {
            const verify_data = jwt.verify(
                token,
                process.env.JWT_REFRESH_SECRET
            );

            if (!verify_data) return false;

            const token_db = await sessionModel.findOne({ token });

            if (!token_db) return false;

            return verify_data;
        } catch (e) {
            return false;
        }
    }

    async create(user_id, token, death_date, user_agent) {
        if (!user_id || !token || !death_date) return false;

        const data = {
            session_id: uniqid(),
            user_id,
            name: this.getDeviceName(user_agent),
            token,
            death_date: death_date,
            last_update: new Date().toISOString(),
        };

        return await sessionModel.create(data);
    }

    async update(session_id, token, death_date, user_agent) {
        if (!session_id || !token || !death_date) return false;

        const data = {
            name: this.getDeviceName(user_agent),
            token,
            death_date: death_date,
            last_update: new Date().toISOString(),
        };

        return await sessionModel.update(session_id, data);
    }

    async getByID(session_id) {
        const session = await sessionModel.findOne({ session_id });
        return session;
    }

    async getByUser(user_id) {
        const sessions = await sessionModel.findMany({ user_id });

        for (const session of sessions) {
            delete session.token;
        }

        return sessions;
    }

    getDeviceName(user_agent) {
        let name = 'unknown';

        if (user_agent) {
            const deviceDetector = new DeviceDetector();
            const device = deviceDetector.parse(user_agent);

            name =
                device.client?.name +
                (device.os?.name ? ' (' + device.os.name + ')' : '');
        }

        return name;
    }

    async remove(session_id, user_id) {
        const session = await this.getByID(session_id);

        if (!session || session?.user_id != user_id) {
            throw createError({
                statusCode: 403,
                statusMessage: 'Forbidden',
                message: 'Доступ запрещен.',
            });
        }

        await sessionModel.delete(session_id);
    }
}

export default new SessionService();
