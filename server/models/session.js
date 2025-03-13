import Model from '~/server/core/model';
import { PrismaClient } from '@prisma/client';

const client = new PrismaClient();
const model = client.sessions;

class SessionModel extends Model {
    constructor() {
        super(model, 'session_id');
    }
}

export default new SessionModel();
