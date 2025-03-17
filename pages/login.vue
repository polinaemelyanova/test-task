<template>
  <div class="container">
    <h1>Авторизация</h1>
    <form @submit.prevent="login">
      <FormInput v-model="form.login" id="login" label="Логин:" required />
      <FormInput v-model="form.password" id="password" label="Пароль:" type="password" required />
      <button type="submit" class="btn">Войти</button>
      <router-link to="/registration" class="link">Регистрация</router-link>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import FormInput from '@/components/FormInput.vue';

interface Form {
  login: string;
  password: string;
}

const router = useRouter();
const form = ref<Form>({
  login: '',
  password: ''
});


const loginOptions = {
  method: 'POST',
  url: '/api/users/login',
  headers: {'Content-Type': 'application/json'},
  data: form.value,
};

const isCurrentSession = {
  sessionId: '',
}


const login = async () => {
  try {
    const response = await axios.request(loginOptions);
    console.log('Успешный вход:', response.data); // Отладочная информация



    const options = {method: 'GET', url: '/api/users/sessions'};


    try {
      const sessions = await axios.request(options);
      console.log('Session data: ', sessions);

      for (const session of sessions.data) {
        if (session.is_current) {
          isCurrentSession.sessionId = session.session_id;
        }

      }

      // Сохраняем session_id в localStorage
      localStorage.setItem('session_id', isCurrentSession.sessionId);
      console.log(localStorage.getItem('session_id'));
    } catch (error) {
      console.error('Ошибка', error);
    }

    router.push('/');
  } catch (error: any) {
    console.error('Ошибка при авторизации:', error);
    alert(`Ошибка при авторизации: ${error.response?.data?.message || error.message}`);
  }
};
</script>

<style scoped lang="scss">
@use "@/assets/styles/variables" as v;
@use "@/assets/styles/globals";

.container {
  max-width: 400px;
}

.btn {
  margin-bottom: 10px;
}

</style>