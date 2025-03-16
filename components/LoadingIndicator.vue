<template>
  <div class="loading">
    <div class="spinner"></div>
  </div>
</template>

<script setup lang="ts">
// Логика компонента (если нужна)
</script>

<style scoped lang="scss">
@use "@/assets/styles/variables" as v;
@use "@/assets/styles/globals";

.loading {
  text-align: center;
  font-size: 1.5rem;
  color: v.$primary-color;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.spinner {
  border: 4px solid rgba(v.$primary-color, 0.3); /* Прозрачный цвет */
  border-top: 4px solid v.$primary-color; /* Основной цвет */
  border-radius: 50%;
  width: 30px;
  height: 30px;
  animation: spin 1s linear infinite; /* Анимация */
  margin-bottom: 1rem;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>