<template>
  <main
    class="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:items-center"
  >
    <div v-if="loading" class="text-lg text-zinc-900 text-center">
      Loading creatures...
    </div>
    <div v-else-if="error" class="text-lg text-red-600 text-center">
      {{ error }}
    </div>
    <div v-else>
      <section v-if="!randomCreature">
        <div class="md:mx-auto md:max-w-2xl text-left md:text-center">
          <h1 class="text-3xl font-extrabold sm:text-5xl">
            Enter the Enchanted Realm.
            <strong class="font-extrabold text-teal-600 sm:block">
              Summon a Creature.
            </strong>
          </h1>
          <p class="mt-4 md:max-w-lg md:mx-auto text-zinc-700">
            Explore a collection of quirky legends rooted in Hungarian folklore.
            Click below to randomly summon one of these mythical beings and
            learn more about their story.
          </p>
          <div
            class="mt-8 flex flex-wrap justify-start md:justify-center gap-4"
          >
            <button
              @click="generateRandomCreature"
              class="block rounded-md bg-teal-600 px-5 py-2.5 text-sm font-medium text-zinc-100 shadow-sm transition ease-in-out duration-300 hover:bg-teal-700"
            >
              Summon a Creature
            </button>
          </div>
        </div>
      </section>
      <section v-else>
        <div class="max-w-3xl mx-auto">
          <div class="mb-8 text-left sm:text-center">
            <h2
              class="text-3xl font-medium uppercase tracking-widest text-zinc-900 sm:text-4xl"
            >
              {{ randomCreature.name }}
            </h2>
            <h3 class="text-xl font-bold text-teal-600 sm:text-2xl">
              {{ randomCreature.translation }}
            </h3>
          </div>
          <div class="flex flex-col sm:flex-row">
            <div class="sm:w-1/2">
              <img
                :src="randomCreature.imageURL"
                alt="Creature image"
                class="w-full h-72 sm:h-80 object-cover mb-4 sm:mb-0"
              />
            </div>
            <div class="sm:w-1/2 flex flex-col sm:pl-6">
              <div>
                <p class="text-sm">
                  {{ randomCreature.description }}
                </p>
                <div class="space-y-1 mt-4">
                  <p class="text-sm">
                    <span class="font-bold">Power Level:</span>
                    {{ randomCreature.powerLevel }}
                  </p>
                  <p class="text-sm">
                    <span class="font-bold">Strengths:</span>
                    {{ randomCreature.strengths }}
                  </p>
                  <p class="text-sm">
                    <span class="font-bold">Weaknesses:</span>
                    {{ randomCreature.weaknesses }}
                  </p>
                </div>
                <p class="text-sm mt-4">
                  <span class="font-bold">Fun Fact: </span>
                  <span class="italic">{{ randomCreature.funFact }}</span>
                </p>
              </div>
            </div>
          </div>
          <div class="mt-8 flex justify-start sm:justify-center">
            <button
              @click="generateRandomCreature"
              class="rounded-md bg-teal-600 px-5 py-2.5 text-sm font-medium text-zinc-100 shadow-sm transition ease-in-out duration-300 hover:bg-teal-700"
            >
              Summon Another Creature
            </button>
          </div>
        </div>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import type { Creature } from "../interfaces/interfaces";
import { useCreatures } from "../modules/useCreatures";

const { creatures, fetchCreatures, loading, error } = useCreatures();
const randomCreature = ref<Creature | null>(null);

const generateRandomCreature = () => {
  if (creatures.value.length > 0) {
    const index = Math.floor(Math.random() * creatures.value.length);
    randomCreature.value = creatures.value[index];
  }
};

onMounted(async () => {
  await fetchCreatures();
});
</script>
