<template>
  <section class="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
    <header>
      <h2 class="text-3xl font-bold text-zinc-900 sm:text-4xl">
        Discover the Bestiary
      </h2>
      <p class="mt-4 max-w-md text-zinc-600">
        Browse through our collection of mythical creatures from Hungarian
        folklore.
      </p>
    </header>

    <div v-if="loading" class="mt-8 text-zinc-900">Loading creatures...</div>
    <div v-else-if="error" class="mt-8 text-red-600">{{ error }}</div>
    <ul
      v-else
      class="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 items-stretch"
    >
      <li v-for="creature in sortedCreatures" :key="creature._id" class="flex">
        <div
          class="flex flex-col w-full h-full shadow-sm border border-zinc-200 group"
        >
          <div class="relative">
            <img
              :src="creature.imageURL"
              alt="Creature image"
              class="h-72 sm:h-80 w-full object-cover opacity-75 transition-opacity duration-300 group-hover:opacity-50"
            />
            <div
              class="absolute inset-0 bg-black bg-opacity-60 opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex flex-col justify-center items-start p-4 text-white text-sm"
            >
              <p class="mb-1">
                <span class="font-bold">Power Level:</span>
                {{ creature.powerLevel }}
              </p>
              <p class="mb-1">
                <span class="font-bold">Strengths:</span>
                {{ creature.strengths }}
              </p>
              <p class="mb-1">
                <span class="font-bold">Weaknesses:</span>
                {{ creature.weaknesses }}
              </p>
              <p class="mb-1">
                <span class="font-bold">Fun Fact:</span>
                {{ creature.funFact }}
              </p>
            </div>
          </div>
          <div class="relative bg-white pt-3 pb-4 px-3 flex-1 overflow-y-auto">
            <h3
              class="text-sm font-medium uppercase tracking-widest text-teal-600"
            >
              {{ creature.name }}
            </h3>
            <p class="mt-1 text-sm font-bold text-zinc-900">
              {{ creature.translation }}
            </p>
            <p class="mt-2 text-xs text-zinc-600">
              {{ creature.description }}
            </p>
          </div>
        </div>
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
import { onMounted, computed } from "vue";
import { useCreatures } from "../modules/useCreatures";

const { loading, error, creatures, fetchCreatures } = useCreatures();

const sortedCreatures = computed(() => {
  return [...creatures.value].sort((a, b) => a.name.localeCompare(b.name));
});

onMounted(async () => {
  await fetchCreatures();
});
</script>
