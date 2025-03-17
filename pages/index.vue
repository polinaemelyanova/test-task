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
import {ref, onMounted} from 'vue';
import axios from 'axios';
import {useRouter} from 'vue-router';
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
const router = useRouter();
const user = ref<User | null>(null);
const sessions = ref<Session[]>([]);


onMounted(async () => {
  try {
    const authSession = localStorage.getItem('session_id');
    if (!authSession) {
      console.log('Пользователь не авторизован.');
    }

    // Проверка токена на сервере
    const userResponse = await axios.get<User>('/api/users/me');
    user.value = userResponse.data;

    // Загрузка сессий
    const sessionsResponse = await axios.get<Session[]>('/api/users/sessions');
    sessions.value = sessionsResponse.data;

    console.log(`Current session ID on mount: ${getCurrentSessionId()}`);
  } catch (error) {
    // Если сессия недействителена, очищается localStorage и перенаправляет на главную страницу
    console.log("Session is not valid: ", error);
    localStorage.removeItem('session_id');
    user.value = null;
    sessions.value = [];
    router.push('/');
  } finally {
    isLoading.value = false;
  }
});


const deleteSession = async (sessionId: string) => {
  try {
    console.log(`Attempting to delete session with ID: ${sessionId}`);
    await axios.delete(`/api/users/sessions?session_id=${sessionId}`);
    console.log(`Session with ID: ${sessionId} deleted successfully`);
    sessions.value = sessions.value.filter(session => session.session_id !== sessionId);
  } catch (error) {
    handleError(error);
  }
};

const logout = async () => {
  console.log('Logging out...');
  const options = {
    method: 'POST',
    url: '/api/users/logout'
  };
  try {
    await axios.request(options);
    user.value = null;
    sessions.value = [];
    localStorage.removeItem('session_id'); // удаление session_id после выхода
    console.log('Logged out successfully. Redirecting to login page.');
    router.push('/login');
  } catch (error) {
    handleError(error);
  }
};

const getCurrentSessionId = () => {
  // Метод для получения текущего session_id (например, из cookies или localStorage)
  const sessionId = localStorage.getItem('session_id') || '';
  console.log(`Current session ID: ${sessionId}`);
  return sessionId;
};

const handleError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    // Ошибка от axios
    alert(`Ошибка: ${error.response?.data?.message || 'Произошла ошибка'}`);
  } else if (error instanceof Error) {
    // Ошибка JavaScript (например, TypeError, SyntaxError)
    alert(`Ошибка: ${error.message || 'Произошла ошибка'}`);
  } else {
    // Неизвестная ошибка
    alert('Произошла неизвестная ошибка');
  }
  console.error('Error:', error);
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
