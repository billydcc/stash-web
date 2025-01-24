<script setup lang="ts">
const user = useSupabaseUser();

function logout() {
  useSupabaseClient().auth.signOut();

  navigateTo('/login');
}
</script>

<template>
  <UContainer class="p-4">
    <UCard v-if="user && $route.path !== '/login'" class="mb-4">
      <template #header>
        <div class="flex items-center justify-between">
          <p>You are logged in {{ user?.email }}</p>
          <UButton color="red" variant="soft" @click="logout">Sign Out</UButton>
        </div>
      </template>
    </UCard>
    <NuxtPage />
  </UContainer>
</template>
