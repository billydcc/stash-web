<script setup lang="ts">
const supabase = useSupabaseClient()
const email = ref('')
const password = ref('')
const loading = ref(false)
const signInWithPassword = async () => {
  loading.value = true
  const { error } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value,
  })
  if (error) alert(error.message)
  else {
    navigateTo('/')
  }
  loading.value = false
}

const signUp = async () => {
  loading.value = true
  const { error, data } = await supabase.auth.signUp({
    email: email.value,
    password: password.value,
  })
  if (error) console.log(error)
  else {
    console.log(data)
    navigateTo('/')
  }
  loading.value = false
}

const items = [{
  label: 'Sign In',
  icon: 'i-heroicons-arrow-right-on-rectangle'
},
{
  label: 'Sign Up',
  icon: 'i-heroicons-user-plus'
}]

const selectedTab = ref(0)
</script>
<template>
  <UCard class="w-full">
    <template #header>
      <h1>Stash</h1>
    </template>
    <UTabs :items="items" v-model="selectedTab" />
    <div class="w-full">
      <div class="grid grid-cols-1 gap-2 p-2">
        <UInput v-model="email" type="email" @keydown.enter="signUp" placeholder="Email" />
        <UInput v-model="password" type="password" @keydown.enter="signInWithPassword" placeholder="Password" />
        <UButton v-if="selectedTab === 0" :loading="loading" @click="signInWithPassword">
          Sign In
        </UButton>
        <UButton v-if="selectedTab === 1" :loading="loading" @click="signUp">
          Sign Up
        </UButton>
      </div>
    </div>
  </UCard>
</template>
