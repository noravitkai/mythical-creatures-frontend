<template>
  <div class="p-4 sm:p-6 lg:p-8">
    <div class="mx-auto max-w-lg text-center">
      <h1 class="text-2xl font-bold sm:text-3xl">Log in to your account!</h1>
      <p class="mt-4 text-zinc-500">
        Please fill in the details below to manage the collection of creatures
        and categories.
      </p>
    </div>
    <form
      class="mx-auto mt-8 mb-0 max-w-md space-y-4"
      @submit.prevent="fetchToken(email, password)"
    >
      <div>
        <label for="email" class="sr-only">Email</label>
        <div class="relative">
          <input
            type="email"
            class="bg-zinc-100 w-full rounded-md p-4 pe-12 text-sm shadow-xs border border-zinc-400"
            placeholder="Email"
            v-model="email"
          />
        </div>
      </div>
      <div>
        <label for="password" class="sr-only">Password</label>
        <div class="relative">
          <input
            type="password"
            class="bg-zinc-100 w-full rounded-md p-4 pe-12 text-sm shadow-xs border border-zinc-400"
            placeholder="Password"
            v-model="password"
          />
        </div>
      </div>
      <div class="flex items-center justify-between">
        <p class="text-sm text-zinc-500">
          No account?
          <router-link to="/register" class="underline">Sign up!</router-link>
        </p>
        <button
          type="submit"
          class="inline-block rounded-md bg-teal-600 px-5 py-2.5 text-sm font-medium text-zinc-100 shadow-sm transition ease-in-out duration-300 hover:bg-teal-700"
        >
          Sign in
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { useUsers } from "../modules/auth/useUsers";
const { fetchToken, email, password } = useUsers();
</script>
