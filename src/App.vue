<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
import { ref } from "vue";
import Logo from "../public/buso.svg";
import { useUsers } from "./modules/auth/useUsers";

const isMenuOpen = ref(false);
const { logoutUser, isLoggedIn } = useUsers();

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const closeMenu = () => {
  isMenuOpen.value = false;
};

const handleLogout = () => {
  logoutUser();
};
</script>

<template>
  <header>
    <div class="px-4 sm:px-6 lg:px-8">
      <div class="flex h-16 items-center justify-between">
        <!-- Logo -->
        <div class="flex-1 md:flex md:items-center md:gap-6">
          <RouterLink to="/" class="block text-teal-600">
            <span class="sr-only">Home</span>
            <img :src="Logo" alt="Logo" class="h-8" />
          </RouterLink>
        </div>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex md:items-center md:gap-6">
          <nav aria-label="Global">
            <ul class="flex items-center gap-6 text-sm">
              <li>
                <RouterLink
                  to="/"
                  class="text-zinc-500 transition ease-in-out duration-300 hover:text-zinc-700"
                >
                  Quiz
                </RouterLink>
              </li>
              <li>
                <RouterLink
                  to="/bestiary"
                  class="text-zinc-500 transition ease-in-out duration-300 hover:text-zinc-700"
                >
                  Bestiary
                </RouterLink>
              </li>
              <li>
                <RouterLink
                  to="/summon"
                  class="text-zinc-500 transition ease-in-out duration-300 hover:text-zinc-700"
                >
                  Summon
                </RouterLink>
              </li>
              <li v-if="isLoggedIn">
                <RouterLink
                  to="/dashboard"
                  class="text-zinc-500 transition ease-in-out duration-300 hover:text-zinc-700"
                >
                  Dashboard
                </RouterLink>
              </li>
            </ul>
          </nav>

          <button
            v-if="isLoggedIn"
            @click="handleLogout"
            class="rounded-md bg-teal-600 px-5 py-2.5 text-sm font-medium text-zinc-100 shadow-sm transition ease-in-out duration-300 hover:bg-teal-700"
          >
            Logout
          </button>
          <RouterLink
            v-else
            to="/login"
            class="rounded-md bg-teal-600 px-5 py-2.5 text-sm font-medium text-zinc-100 shadow-sm transition ease-in-out duration-300 hover:bg-teal-700"
          >
            Login
          </RouterLink>
        </div>

        <!-- Mobile Navigation -->
        <div class="flex items-center gap-4 md:hidden">
          <button
            v-if="isLoggedIn"
            class="rounded-md bg-teal-600 px-4 py-2 text-sm font-medium text-zinc-100 shadow-sm transition ease-in-out duration-300 hover:bg-teal-700"
            @click="handleLogout"
          >
            Logout
          </button>

          <RouterLink
            v-else
            to="/login"
            class="rounded-md bg-teal-600 px-4 py-2 text-sm font-medium text-zinc-100 shadow-sm transition ease-in-out duration-300 hover:bg-teal-700"
          >
            Login
          </RouterLink>

          <button
            class="rounded-sm bg-zinc-800 p-2 text-zinc-100 transition ease-in-out duration-300 hover:bg-zinc-900"
            @click="toggleMenu"
          >
            <svg
              v-if="!isMenuOpen"
              xmlns="http://www.w3.org/2000/svg"
              class="size-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
            <svg
              v-else
              xmlns="http://www.w3.org/2000/svg"
              class="size-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile Navigation Menu -->
      <nav
        v-if="isMenuOpen"
        class="absolute top-16 left-0 w-full bg-zinc-100 shadow-md md:hidden"
      >
        <ul class="flex flex-col items-left gap-4 p-4 text-sm">
          <li>
            <RouterLink
              to="/"
              class="text-zinc-700 transition ease-in-out duration-300 hover:text-zinc-900"
              @click="closeMenu"
            >
              Quiz
            </RouterLink>
          </li>
          <li>
            <RouterLink
              to="/bestiary"
              class="text-zinc-700 transition ease-in-out duration-300 hover:text-zinc-900"
              @click="closeMenu"
            >
              Bestiary
            </RouterLink>
          </li>
          <li>
            <RouterLink
              to="/summon"
              class="text-zinc-700 transition ease-in-out duration-300 hover:text-zinc-900"
              @click="closeMenu"
            >
              Summon
            </RouterLink>
          </li>
          <li v-if="isLoggedIn">
            <RouterLink
              to="/dashboard"
              class="text-zinc-700 transition ease-in-out duration-300 hover:text-zinc-900"
              @click="closeMenu"
            >
              Dashboard
            </RouterLink>
          </li>
        </ul>
      </nav>
    </div>
  </header>

  <main>
    <RouterView />
  </main>
</template>
