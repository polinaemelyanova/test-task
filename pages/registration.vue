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
@use "@/assets/styles/variables" as v;
@use "@/assets/styles/globals";

.container {
  max-width: 400px;
}

</style>
