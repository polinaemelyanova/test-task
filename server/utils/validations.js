export function validateLogin(login) {
    const login_reg = /^[a-zA-Z]{5,32}$/;

    if (!login_reg.test(login)) {
        return {
            is_valid: false,
            message:
                'Логин должен содержать от 5 до 32 заглавных или строчных латинских букв.',
        };
    }

    return {
        is_valid: true,
        message: 'Логин соответствует требованиям.',
    };
}

export function validatePassword(password) {
    const password_reg =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':",.<>?]).{8,32}$/;

    if (/\s/.test(password)) {
        return {
            is_valid: false,
            message: 'Пароль не должен содержать пробелов.',
        };
    }

    if (!password_reg.test(password)) {
        return {
            is_valid: false,
            message:
                'Пароль должен содержать от 8 до 32 символов, включая заглавные и строчные латинские буквы, цифры и специальные символы.',
        };
    }

    return {
        is_valid: true,
        message: 'Пароль соответствует требованиям.',
    };
}
