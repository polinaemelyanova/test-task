<template>
  <div class="container">
    <h1>Регистрация</h1>
    <form @submit.prevent="register">
      <FormInput v-model="form.first_name" id="first_name" label="Имя:" required />
      <FormInput v-model="form.last_name" id="last_name" label="Фамилия:" required />
      <FormInput v-model="form.login" id="login" label="Логин:" required />
      <FormInput v-model="form.password" id="password" label="Пароль:" type="password" required />
      <button type="submit" class="btn">Зарегистрироваться</button>
      <router-link to="/login" class="link">Авторизация</router-link>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import FormInput from '@/components/FormInput.vue';

interface Form {
  first_name: string;
  last_name: string;
  login: string;
  password: string;
}

const router = useRouter();
const form = ref<Form>({
  first_name: '',
  last_name: '',
  login: '',
  password: ''
});

const options = {
  method: 'POST',
  url: '/api/users/registration',
  headers: {'Content-Type': 'application/json'},
  data: form.value
};

const register = async () => {
  try {
    const { data } = await axios.request(options);
    router.push('/login');
  } catch (error: any) {
    console.error('Ошибка при регистрации:', error);
    alert(`Ошибка при регистрации: ${error.response?.data?.message || error.message}`);
  }
};


</script>

<style scoped lang="scss">
@use "@/assets/styles/variables.scss" as v;

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
