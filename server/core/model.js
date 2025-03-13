/**
 * Базовый класс модели.
 *
 * @param { Object } model - модель призмы.
 *
 */
class Model {
    prisma_model;

    /**
     * @param { Object } model - модель призмы.
     * @param { String } model_id - название поля id.
     */
    constructor(model, model_id = 'id') {
        if (!model) {
            throw new Error('Не указана модель призмы.');
        }

        this.prisma_model = model;
        this.model_id = model_id;
    }

    /**
     * Создает запись.
     *
     * @param { Object } data           - поля со значениями для создания записи.
     * @param { Array }  selected_field - поля для вывода.
     */
    async create(data, selected_field = []) {
        return await this.prisma_model.create({
            select: this.getSelect(selected_field),
            data: this.clearFields(data),
        });
    }

    /**
     * Возвращает запись с учетом фильтров.
     *
     * @param { Object } filters        - поля со значениями для фильтрации.
     * @param { Array }  selected_field - поля для вывода.
     */
    async findOne(filters, selected_field = []) {
        return await this.prisma_model.findFirst({
            select: this.getSelect(selected_field),
            where: { ...filters },
        });
    }

    /**
     * Удаляет запись по id.
     *
     * @param { Number | String } id             - id записи.
     * @param { Array }  selected_field - поля для вывода.
     */
    async delete(id, selected_field = []) {
        return await this.prisma_model.delete({
            select: this.getSelect(selected_field),
            where: { [this.model_id]: id },
        });
    }

    /**
     * Обновляет запись по id.
     *
     * @param { Number } id             - id записи.
     * @param { Object } data           - поля со значениями для обновления записи.
     * @param { Array }  selected_field - поля для вывода.
     */
    async update(id, data, selected_field = []) {
        return await this.prisma_model.update({
            select: this.getSelect(selected_field),
            data: this.clearFields(data),
            where: { [this.model_id]: id },
        });
    }

    /**
     * Возвращает записи с учетом фильтров.
     *
     * @param { Object } filters        - поля со значениями для фильтрации.
     * @param { Array }  selected_field - поля для вывода.
     */
    async findMany(filters, selected_field = []) {
        return await this.prisma_model.findMany({
            select: this.getSelect(selected_field),
            where: { ...filters },
        });
    }

    /**
     * Чистит поля для вывода в соответствии с моделью.
     *
     * @param { Array } fields - поля для вывода.
     */
    getSelect(fields = []) {
        const default_fields = {};

        Object.keys(this.prisma_model.fields).forEach((key) => {
            default_fields[key] = true;
        });

        const result = {};

        if (fields.length > 0) {
            Object.keys(default_fields).forEach((key) => {
                if (fields.includes(key)) {
                    result[key] = true;
                }
            });
        }

        if (Object.keys(result).length > 0) {
            return result;
        } else {
            return default_fields;
        }
    }

    /**
     * Чистит поля в соответствии с полями модели.
     *
     * @param { Object } fields - объект с полями.
     *
     * @returns { Object } - объект с очищенными полями.
     */
    clearFields(fields = {}) {
        const result = {};

        for (const key in fields) {
            if (this.prisma_model.fields[key]) {
                result[key] = fields[key];
            }
        }

        return result;
    }
}

export default Model;
