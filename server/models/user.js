import Model from '~/server/core/model';
import { PrismaClient } from '@prisma/client';

const client = new PrismaClient();
const model = client.users;

class UserModel extends Model {
    constructor() {
        super(model, 'user_id');
    }

    async checkLoginAvailability(login) {
        const user = await model.findFirst({
            where: { login },
        });

        return !Boolean(user);
    }
}

export default new UserModel();
