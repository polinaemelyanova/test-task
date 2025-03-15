<template>
  <div class="container">
    <h1>Главная страница</h1>
    <div v-if="user">
      <p>Добро пожаловать, {{ user.first_name }} {{ user.last_name }} ({{ user.login }})!</p>
      <button @click="logout" class="btn btn-logout">Выход из аккаунта</button>
      <h2>Ваши сессии:</h2>
      <ul class="session-list">
        <li v-for="session in sessions" :key="session.session_id" class="session-item">
          {{ session.name }} - Последнее обновление: {{ session.last_update }}
          <span v-if="session.is_current" class="current-session">Текущая сессия</span>
          <button v-else @click="deleteSession(session.session_id)" class="btn btn-delete">Удалить сессию</button>
        </li>
      </ul>
    </div>
    <div v-else class="not-authorized">
      <p>Вы не авторизованы.</p>
      <router-link to="/login" class="btn">Авторизация</router-link>
      <router-link to="/registration" class="btn">Регистрация</router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

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

const router = useRouter();
const user = ref<User | null>(null);
const sessions = ref<Session[]>([]);


onMounted(async () => {
  try {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      throw new Error('Пользователь не авторизован.');
    }

    // Проверка токена на сервере
    const userResponse = await axios.get<User>('/api/users/me', {
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
    });
    user.value = userResponse.data;

    // Загрузка сессий
    const sessionsResponse = await axios.get<Session[]>('/api/users/sessions', {
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
    });
    sessions.value = sessionsResponse.data;

    console.log(`Current session ID on mount: ${getCurrentSessionId()}`);
  } catch (error) {
    // Если токен недействителен, очистите localStorage и перенаправьте на страницу входа
    localStorage.removeItem('authToken');
    localStorage.removeItem('session_id');
    user.value = null;
    sessions.value = [];
    router.push('/');
  }
});


const deleteSession = async (sessionId: string) => {
  try {
    console.log(`Attempting to delete session with ID: ${sessionId}`);
    await axios.delete(`/api/users/sessions?session_id=${sessionId}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    });
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
    url: '/api/users/logout',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`
    }
  };
  try {
    await axios.request(options);
    user.value = null;
    sessions.value = [];
    localStorage.removeItem('authToken'); // удаление токена после выхода
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

const handleError = (error: any) => {
  if (error.response) {
    alert(`Ошибка: ${error.response.data.message || 'Произошла ошибка'}`);
  } else {
    alert(`Ошибка: ${error.message || 'Произошла ошибка'}`);
  }
  console.error('Error:', error);
};
</script>

<style scoped lang="scss">
@use "@/assets/styles/variables" as v;
@use "@/assets/styles/globals";


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

.current-session {
  color: v.$current-session;
}

.btn {
  width: 50%;
  display: inline-block;
}
.not-authorized {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
