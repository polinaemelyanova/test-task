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
import FormInput from '@/components/FormInput.vue';

definePageMeta ({
  middleware: 'auth',
})

interface Form {
  first_name: string;
  last_name: string;
  login: string;
  password: string;
}

const form = ref<Form>({
  first_name: '',
  last_name: '',
  login: '',
  password: ''
});

const register = async () => {
  try {
    await $fetch('/api/users/registration', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(form.value)
    });



    navigateTo('/login');

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
