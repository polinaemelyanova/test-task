<template>
  <div class="container">
    <h1>Главная страница</h1>
    <div v-if="user">
      <p>Добро пожаловать, {{ user.first_name }} {{ user.last_name }} ({{ user.login }})!</p>
      <button @click="logout" class="btn-logout">Выход из аккаунта</button>
      <h2>Ваши сессии:</h2>
      <ul class="session-list">
        <li v-for="session in sessions" :key="session.session_id" class="session-item">
          {{ session.name }} - Последнее обновление: {{ session.last_update }}
          <span v-if="session.is_current" class="current-session">Текущая сессия</span>
          <button v-else @click="deleteSession(session.session_id)" class="btn-delete">Удалить сессию</button>
        </li>
      </ul>
    </div>
    <div v-else>
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
const currentSessionId = ref<string | null>(null);


const userOptions = {
  method: 'GET',
  url: 'http://localhost:3000/api/users/me'
};

const sessionOptions = {
  method: 'GET',
  url: '/api/users/sessions'
};

onMounted(async () => {
  try {
    const userResponse = await axios.request<User>(userOptions);
    user.value = userResponse.data;
    console.log(userResponse.data);

    const sessionsResponse = await axios.request<Session[]>(sessionOptions);
    sessions.value = sessionsResponse.data;
    console.log(sessionsResponse.data);
    currentSessionId.value = localStorage.getItem('session_id');
    console.log(`Current session ID on mount: ${currentSessionId.value}`);

    console.log(`Current session ID on mount: ${getCurrentSessionId()}`);
  } catch (error: any) {
    console.error(error);
    console.error('Ответ сервера:', error.response?.data); // Выводим ответ сервера
    handleError(error);
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

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background-color: v.$light-background;
  border-radius: 8px;
  box-shadow: 0 0 10px v.$shadow-color;
}

h1 {
  text-align: center;
  margin-bottom: 2rem;
}

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

.btn-delete {
  background-color: #e74c3c; // Replace with variable if you have one for this color
  color: v.$text-color;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #c0392b; // Replace with variable if you have one for this color
  }
}

.btn-logout {
  display: inline-block;
  margin-bottom: 1rem;
  padding: 0.5rem 1rem;
  color: v.$text-color;
  background-color: #e67e22; // Replace with variable if you have one for this color
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #d35400; // Replace with variable if you have one for this color
  }
}

.btn {
  display: inline-block;
  margin-top: 1rem;
  margin-right: 10px;
  padding: 0.5rem 1rem;
  color: v.$text-color;
  background-color: v.$primary-color;
  border: none;
  border-radius: 4px;
  text-decoration: none;
  text-align: center;

  &:hover {
    background-color: v.$primary-color-darker;
  }
}
</style>
