<template>
  <div class="container">
    <h1>Главная страница</h1>
    <LoadingIndicator v-if="isLoading"/>
    <div v-else>
      <div v-if="user">
        <p>Добро пожаловать, {{ user.first_name }} {{ user.last_name }} ({{ user.login }})!</p>
        <button @click="logout" class="btn btn-logout">Выход из аккаунта</button>
        <h2>Ваши сессии:</h2>
        <ul class="session-list">
          <li v-for="session in sessions" :key="session.session_id" class="session-item">
            {{ session.name }} - Последнее обновление: {{ session.last_update }}
            <div class="session-action">
              <span v-if="session.is_current" class="current-session">Текущая сессия</span>
              <button v-else @click="deleteSession(session.session_id)" class="btn btn-delete">Удалить сессию</button>
            </div>
          </li>
        </ul>
      </div>
      <div v-else class="not-authorized">
        <p>Вы не авторизованы.</p>
        <router-link to="/login" class="btn">Авторизация</router-link>
        <router-link to="/registration" class="btn">Регистрация</router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import LoadingIndicator from "@/components/LoadingIndicator.vue"


interface User {
  first_name: string;
  last_name: string;
  login: string;
}

interface Session {
  session_id: string;
  is_current: boolean;
  name: string;
  last_update: string;
}

const isLoading = ref<boolean>(true);
const user = ref<User | null>(null);
const sessions = ref<Session[]>([]);


// Загрузка данных
const loadData = async () => {
  try {
    // Загрузка данных пользователя
    const { data: userResponse } = await useFetch('/api/users/me')
    user.value = userResponse.value

    // Загрузка сессий
    const { data: sessionsResponse } = await useFetch('/api/users/sessions')
    sessions.value = sessionsResponse.value

  } catch (error) {
    // Если сессия недействителена, очищается localStorage и перенаправляет на главную страницу
    console.log("Session is not valid: ", error);
    user.value = null
    sessions.value = []
    // navigateTo('/login');
    handleError(error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(loadData);

// Удаление сессии
const deleteSession = async (sessionId: string) => {
  try {
    await $fetch('/api/users/sessions', {
      method: 'DELETE',
      query: { session_id: sessionId },
    });

    console.log(`Session with ID: ${sessionId} deleted successfully`);

    // Обновление списка сессиий
    sessions.value = sessions.value.filter(session => session.session_id !== sessionId);
  } catch (error) {
    handleError(error);
    console.log("Session is not valid: ", error);
  }
};

const logout = async () => {
  console.log('Logging out...');

  try {
    await $fetch('api/users/logout', {
      method: 'POST'
    });

    user.value = null;
    // sessions.value = [];
    console.log('Logged out successfully. Redirecting to login page.');
    navigateTo('/login');
  } catch (error) {
    handleError(error);
  }
};


const handleError = (error: unknown) => {
  const message = error instanceof Error ? error.message : 'Произошла ошибка';
  alert(`Ошибка: ${message}`);
  console.error(error);
};


</script>

<style scoped lang="scss">
@use "@/assets/styles/variables" as v;
@use "@/assets/styles/globals";
@use "@/assets/styles/helpers/media" as *;

.session-list {
  list-style: none;
  padding: 0;
}

.session-item {
  background-color: white;
  padding: 1rem;
  margin-bottom: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.session-action {
  display: flex;
  align-items: center;
  margin-left: auto; /* Выравниваем элементы справа */
  margin-left: 5px;
  text-align: center;
}

.current-session {
  color: v.$current-session;
  font-size: 14px;
  margin-right: 1rem; /* Отступ между надписью и кнопкой */
}

.btn {
  width: auto; /* Ширина кнопки по содержимому */
  display: inline-block;
}

.btn-delete {
  background-color: v.$red;
  padding: 0.5rem 1rem;
  margin: 0;
  display: inline-block;
  min-width: 150px;

  @include mobile {
    min-width: 80px;
  }

  &:hover {
    background-color: v.$red-darker;
  }
}

.not-authorized {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
