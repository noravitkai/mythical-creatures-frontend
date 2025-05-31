<template>
  <main class="mx-auto max-w-screen-xl p-4 sm:p-6 lg:p-8 lg:items-center">
    <div v-if="loading" class="text-lg text-zinc-900 text-center">
      Loading quiz...
    </div>
    <div v-else-if="error" class="text-lg text-red-600 text-center">
      {{ error }}
    </div>
    <div v-else>
      <section v-if="!quizStarted">
        <header class="md:mx-auto md:max-w-2xl text-left md:text-center">
          <h1 class="text-3xl font-extrabold sm:text-5xl">
            What’s Your Creature?
            <strong class="font-extrabold text-teal-600 sm:block">
              Reveal Your Match.
            </strong>
          </h1>
          <p class="mt-4 md:max-w-lg md:mx-auto text-zinc-700">
            Which legendary being you’d be? Take this quick quiz to find out
            which mythical creature from Hungarian folklore best matches your
            spirit.
          </p>
                  <div class="mt-8 flex flex-wrap justify-start md:justify-center gap-4">
          <button
            @click="startQuiz"
            class="rounded-md bg-teal-600 px-5 py-2.5 text-sm font-medium text-zinc-100 shadow-sm transition duration-300 hover:bg-teal-700"
          >
            Start Quiz
          </button>
        </div>
        </header>
      </section>
      <div v-else class="max-w-2xl mx-auto">
        <section v-if="!quizComplete">
          <div class="mb-4 flex items-center justify-between">
            <span class="text-xs font-medium uppercase tracking-widest text-teal-600">
              Question {{ currentIndex + 1 }}/{{ totalQuestions }}
            </span>
            <div class="w-2/3 bg-zinc-200 h-2 rounded overflow-hidden">
              <div
                class="bg-teal-600 h-2"
                :style="{ width: `${progressPercent}%` }"
              ></div>
            </div>
          </div>
          <div
            class="flex flex-col w-full h-full bg-white shadow-sm border border-zinc-200"
          >
            <div class="pt-3 pb-4 px-3">
              <h2 class="text-sm font-bold text-zinc-900">
                {{ currentQuestion.text }}
              </h2>
            </div>
            <ul class="space-y-4 px-3 pb-4">
              <li
                v-for="(opt, idx) in currentQuestion.options"
                :key="idx"
                class="flex"
              >
                <button
                  @click="() => selectOption(opt)"
                  class="w-full text-left border border-zinc-300 px-3 py-2 text-sm text-zinc-700 transition duration-200 hover:bg-zinc-100"
                >
                  {{ opt.text }}
                </button>
              </li>
            </ul>
          </div>
        </section>
        <section v-if="quizComplete && topCreatureData">
          <div class="max-w-3xl mx-auto">
            <div class="mb-8 text-left sm:text-center">
              <h2
                class="text-3xl font-medium uppercase tracking-widest text-zinc-900 sm:text-4xl"
              >
                {{ topCreatureData.name }}
              </h2>
              <h3 class="text-xl font-bold text-teal-600 sm:text-2xl">
                {{ topCreatureData.translation }}
              </h3>
            </div>
            <div class="flex flex-col sm:flex-row">
              <div class="sm:w-1/2">
                <img
                  :src="topCreatureData.imageURL"
                  alt="Creature image"
                  class="w-full h-72 sm:h-80 object-cover mb-4 sm:mb-0"
                />
              </div>
              <div class="sm:w-1/2 flex flex-col sm:pl-6">
                <div>
                  <p class="text-sm">
                    {{ topCreatureData.description }}
                  </p>
                  <div class="space-y-1 mt-4">
                    <p class="text-sm">
                      <span class="font-bold">Power Level:</span>
                      {{ topCreatureData.powerLevel }}
                    </p>
                    <p class="text-sm">
                      <span class="font-bold">Strengths:</span>
                      {{ topCreatureData.strengths }}
                    </p>
                    <p class="text-sm">
                      <span class="font-bold">Weaknesses:</span>
                      {{ topCreatureData.weaknesses }}
                    </p>
                  </div>
                  <p class="text-sm mt-4">
                    <span class="font-bold">Fun Fact: </span>
                    <span class="italic">{{ topCreatureData.funFact }}</span>
                  </p>
                </div>
              </div>
            </div>
            <div class="mt-8 flex justify-start sm:justify-center">
              <button
                @click="restartQuiz"
                class="rounded-md bg-teal-600 px-5 py-2.5 text-sm font-medium text-zinc-100 shadow-sm transition ease-in-out duration-300 hover:bg-teal-700"
              >
                Restart Quiz
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import type { Question } from "../interfaces/interfaces";
import { useQuestions } from "../modules/useQuestions";
import { useCreatures } from "../modules/useCreatures";
import type { Creature } from "../interfaces/interfaces";

// Composable to fetch questions
const { questions, fetchQuestions, loading, error } = useQuestions();
const { creatures, fetchCreatures } = useCreatures();

// State
const quizStarted = ref(false);
const currentIndex = ref(0);
const creatureTally = ref<Record<string, number>>({});
const topCreature = computed(() => {
  const entries = Object.entries(creatureTally.value);
  if (entries.length === 0) return null;
  return entries.reduce((a, b) => (a[1] > b[1] ? a : b))[0];
});

onMounted(async () => {
  await fetchQuestions();
  await fetchCreatures();
});

const topCreatureData = computed<Creature | null>(() => {
  return creatures.value.find((c) => c._id === topCreature.value) || null;
});

// Computed: total questions, current question, and progress
const totalQuestions = computed(() => questions.value.length);
const currentQuestion = computed<Question>(() => {
  return (
    questions.value[currentIndex.value] || {
      _id: "",
      text: "No question available",
      options: [],
      _createdBy: "",
      createdAt: "",
      updatedAt: "",
    }
  );
});
const progressPercent = computed(() => {
  if (totalQuestions.value === 0) return 0;
  return (currentIndex.value / totalQuestions.value) * 100;
});
const quizComplete = computed(() => {
  return quizStarted.value && currentIndex.value >= totalQuestions.value;
});

// Start the quiz: show first question
function startQuiz() {
  if (questions.value.length > 0) {
    quizStarted.value = true;
    currentIndex.value = 0;
    creatureTally.value = {};
  }
}

// When user selects an option: move to next question
function selectOption(option: { text: string; creatureIds: string[] }) {
  option.creatureIds.forEach((creature) => {
    creatureTally.value[creature] = (creatureTally.value[creature] || 0) + 1;
  });

  if (currentIndex.value < totalQuestions.value - 1) {
    currentIndex.value += 1;
  } else {
    currentIndex.value = totalQuestions.value;
  }
}

// Restart the quiz
function restartQuiz() {
  quizStarted.value = true;
  currentIndex.value = 0;
  creatureTally.value = {};
}
</script>
