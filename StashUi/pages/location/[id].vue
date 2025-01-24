<script setup lang="ts">

import type { Database } from '~/database.types'

const { id } = useRoute().params

const client = useSupabaseClient<Database>()

const location = ref<Database['public']['Tables']['Location']['Row']>()

async function getLocation(id: string) {
    const { data, error } = await client.from('Location').select('*').eq('id', +id).single()
    if (error) console.log(error)
    if (data !== null)
        location.value = data
}


const rooms = ref()
async function getRooms() {
    const { data, error } = await client.from('Room').select('*').eq('location_id', +id)
    if (error) console.log(error)
    rooms.value = data
}
const roomName = ref('')

async function createRoom() {
    const { data, error } = await client.from('Room').insert({ name: roomName.value, location_id: +id })
    if (error) console.log(error)
    console.log(data)
    roomName.value = ''
    getRooms()
}

const session = useSupabaseSession();
const token = session?.value?.access_token;
const locationData = ref()
const locationError = ref()

const config = useRuntimeConfig()

// Move the fetch into an async function
async function fetchLocationData() {
    const { data, error } = await useFetch(`${config.public.apiBase}/location`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    locationData.value = data.value
    locationError.value = error.value
    console.log(locationData.value)
    console.log(locationError.value)
}

getLocation(id as string)
getRooms()
fetchLocationData()

</script>

<template>
    <div class="flex flex-col gap-2 pt-2">
        <UCard>
            <div class="">
                Your Location:
                <p>{{ location?.name }}</p>
            </div>
        </UCard>
        <UCard>
            <template #header>
                <div class=" flex justify-between items-center">
                    <h3 class="text-xl font-medium">Rooms</h3>
                    <div class=" flex gap-2">
                        <UInput v-model="roomName" placeholder="Room name" />
                        <UButton @click="createRoom">
                            <UIcon name="i-heroicons-plus" />
                        </UButton>
                    </div>
                </div>
            </template>
            <div class="flex flex-col gap-2">
                <ULink v-for="room in rooms" class=" hover:text-primary  " :key="room.id" :to="`/location/${room.id}`">
                    {{ room.name }}
                </ULink>
            </div>
        </UCard>
    </div>
</template>

<style></style>