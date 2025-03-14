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
  data: form.value
};

const login = async () => {
  try {
    const response = await axios.request(loginOptions);
    console.log('Успешный вход:', response.data); // Отладочная информация

    // Сохраняем authToken и session_id в localStorage
    localStorage.setItem('authToken', response.data.authToken);
    localStorage.setItem('session_id', response.data.session_id);
    router.push('/');
  } catch (error: any) {
    console.error('Ошибка при авторизации:', error);
    alert(`Ошибка при авторизации: ${error.response?.data?.message || error.message}`);
  }
};
</script>

<style scoped lang="scss">
@use "@/assets/styles/variables" as v;

.container {
  max-width: 400px;
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

.btn {
  display: block;
  width: 100%;
  padding: 0.75rem;
  color: v.$text-color;
  background-color: v.$primary-color;
  border: none;
  border-radius: 4px;
  text-align: center;
  cursor: pointer;
  margin-bottom: 10px;

  &:hover {
    background-color: v.$primary-color-darker;
  }
}

.link {
  text-decoration: none;
  color: v.$link-color;
}

</style>