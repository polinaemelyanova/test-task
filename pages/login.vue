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
import FormInput from '@/components/FormInput.vue';

definePageMeta({
  middleware: "auth",
})

interface Form {
  login: string;
  password: string;
}

const form = ref<Form>({
  login: '',
  password: ''
});


const login = async () => {
  try {
    const response = await $fetch('/api/users/login', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: form.value
    });
    console.log('Успешный вход:', response); // Отладочная информация
    await navigateTo('/') // Перенаправляем на главную

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