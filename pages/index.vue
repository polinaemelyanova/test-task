<template>
  <div class="container">
    <h1>Главная страница</h1>
    <div v-if="user">
      <p>Привет, {{ user.first_name }} {{ user.last_name }} ({{ user.login }})!</p>
      <button @click="logout" class="btn-logout">Выход из аккаунта</button>
      <h2>Ваши сессии:</h2>
      <ul class="session-list">
        <li v-for="session in sessions" :key="session.session_id" class="session-item">
          {{ session.name }} - Последнее обновление: {{ session.last_update }}
          <button v-if="session.session_id !== currentSessionId" @click="deleteSession(session.session_id)" class="btn-delete">Удалить сессию</button>
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
  name: string;
  last_update: string;
}

const router = useRouter();
const user = ref<User | null>(null);
const sessions = ref<Session[]>([]);
const currentSessionId = ref<string | null>(null);

onMounted(async () => {
  try {
    const userResponse = await axios.get<User>('/api/users/me');
    user.value = userResponse.data;

    const sessionsResponse = await axios.get<Session[]>('/api/users/sessions');
    sessions.value = sessionsResponse.data;

    currentSessionId.value = localStorage.getItem('session_id');
    console.log(`Current session ID on mount: ${currentSessionId.value}`);
  } catch (error) {
    handleError(error);
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
    // Если удаляется текущая сессия, выполняем logout
    if (sessionId === currentSessionId.value) {
      console.log(`Current session ID (${currentSessionId.value}) matches deleted session ID. Logging out.`);
      await logout();
    } else {
      sessions.value = sessions.value.filter(session => session.session_id !== sessionId);
    }
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
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
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
  background-color: #fff;
  padding: 1rem;
  margin-bottom: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.btn-delete {
  background-color: #e74c3c;
  color: #fff;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background-color: #c0392b;
  }
}

.btn-logout {
  display: inline-block;
  margin-bottom: 1rem;
  padding: 0.5rem 1rem;
  color: #fff;
  background-color: #e67e22;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background-color: #d35400;
  }
}

.btn {
  display: inline-block;
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  color: #fff;
  background-color: #3498db;
  border: none;
  border-radius: 4px;
  text-decoration: none;
  text-align: center;
  &:hover {
    background-color: #2980b9;
  }
}
</style>