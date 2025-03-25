export default defineNuxtRouteMiddleware((to, from)=> {
    const sessionId = localStorage.getItem('session_id');

    // Если пользователь авторизован - перенаправляем его на главную страницу
    if (sessionId) {
        return navigateTo('/')
    }
})