<template>
  <main class="p-4 sm:p-6 lg:p-8">
    <header>
      <h1 class="text-3xl font-bold">Dashboard</h1>
      <p class="mt-2 text-lg">
        Manage the collection of Hungarian mythical creatures and quiz
        questions.
      </p>
    </header>
    <!-- Section for adding a new creature -->
    <section class="mt-8">
      <h2 class="text-2xl font-bold mb-4">Add a New Creature</h2>
      <form @submit.prevent="handleAddCreature">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-semibold text-zinc-600 uppercase">
              Name
            </label>
            <input
              type="text"
              v-model="newCreatureData.name"
              placeholder="Enter Hungarian name of the creature (max. 255 characters)"
              class="bg-zinc-100 w-full rounded-md p-1 sm:p-2 text-sm shadow-xs border border-zinc-400 mt-1"
              required
            />
          </div>
          <div>
            <label class="block text-xs font-semibold text-zinc-600 uppercase">
              Translation
            </label>
            <input
              type="text"
              v-model="newCreatureData.translation"
              placeholder="Enter the English translation (max. 255 characters)"
              class="bg-zinc-100 w-full rounded-md p-1 sm:p-2 text-sm shadow-xs border border-zinc-400 mt-1"
            />
          </div>
        </div>
        <div class="mt-4">
          <label class="block text-xs font-semibold text-zinc-600 uppercase">
            Description
          </label>
          <textarea
            rows="3"
            v-model="newCreatureData.description"
            placeholder="Provide a brief description (max. 300 characters)"
            class="bg-zinc-100 w-full rounded-md p-1 sm:p-2 text-sm shadow-xs border border-zinc-400 mt-1"
          ></textarea>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label class="block text-xs font-semibold text-zinc-600 uppercase">
              Power Level
            </label>
            <input
              type="number"
              v-model.number="newCreatureData.powerLevel"
              placeholder="Set power level (1–100)"
              class="bg-zinc-100 w-full rounded-md p-1 sm:p-2 text-sm shadow-xs border border-zinc-400 mt-1"
            />
          </div>
          <div>
            <label class="block text-xs font-semibold text-zinc-600 uppercase">
              Fun Fact
            </label>
            <input
              type="text"
              v-model="newCreatureData.funFact"
              placeholder="Write a fun fact about the creature (max. 255 characters)"
              class="bg-zinc-100 w-full rounded-md p-1 sm:p-2 text-sm shadow-xs border border-zinc-400 mt-1"
            />
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label class="block text-xs font-semibold text-zinc-600 uppercase">
              Strengths
            </label>
            <input
              type="text"
              v-model="newCreatureData.strengths"
              placeholder="List key strengths (max. 255 characters)"
              class="bg-zinc-100 w-full rounded-md p-1 sm:p-2 text-sm shadow-xs border border-zinc-400 mt-1"
            />
          </div>
          <div>
            <label class="block text-xs font-semibold text-zinc-600 uppercase">
              Weaknesses
            </label>
            <input
              type="text"
              v-model="newCreatureData.weaknesses"
              placeholder="List key weaknesses (max. 255 characters)"
              class="bg-zinc-100 w-full rounded-md p-1 sm:p-2 text-sm shadow-xs border border-zinc-400 mt-1"
            />
          </div>
        </div>
        <div class="mt-4">
          <label class="block text-xs font-semibold text-zinc-600 uppercase">
            Upload Image
          </label>
          <input
            type="file"
            @change="handleFileChange"
            class="bg-zinc-100 w-full rounded-md py-1 sm:py-2 text-sm shadow-xs mt-1"
          />
          <div v-if="imageUploading" class="mt-2 text-sm text-teal-600">
            Uploading image...
          </div>
          <div v-else-if="newCreatureData.imageURL" class="mt-2">
            <p class="block text-xs font-semibold text-zinc-600 uppercase">
              Preview:
            </p>
            <img
              :src="newCreatureData.imageURL"
              alt="Creature Image"
              class="mt-2 sm:mt-3 w-32 h-32 object-cover border"
            />
          </div>
        </div>
        <div class="mt-4 flex justify-start space-x-2">
          <button
            type="submit"
            class="rounded-md bg-teal-600 px-2 py-1 sm:px-4 sm:py-2 text-sm text-white hover:bg-teal-700 transition duration-300"
          >
            Save Creature
          </button>
        </div>
      </form>
    </section>
    <!-- Section for displaying, editing, and deleting creatures -->
    <section class="mt-8">
      <h2 class="text-2xl font-bold mb-4">Collection of Creatures</h2>
      <div class="overflow-x-auto">
        <table class="min-w-full text-zinc-900">
          <thead>
            <tr>
              <th
                class="px-2 py-1 sm:px-4 sm:py-2 border-b border-zinc-200 text-left text-xs font-semibold text-zinc-600 uppercase"
              >
                ID
              </th>
              <th
                class="px-2 py-1 sm:px-4 sm:py-2 border-b border-zinc-200 text-left text-xs font-semibold text-zinc-600 uppercase"
              >
                Name
              </th>
              <th
                class="px-2 py-1 sm:px-4 sm:py-2 border-b border-zinc-200 text-left text-xs font-semibold text-zinc-600 uppercase"
              >
                Translation
              </th>
              <th
                class="px-2 py-1 sm:px-4 sm:py-2 border-b border-zinc-200 text-left text-xs font-semibold text-zinc-600 uppercase"
              >
                Power Level
              </th>
              <th
                class="px-2 py-1 sm:px-4 sm:py-2 border-b border-zinc-200 text-left text-xs font-semibold text-zinc-600 uppercase"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            <template v-for="creature in creatures" :key="creature._id">
              <tr
                :class="{
                  'border-b': expandedRowId !== creature._id,
                  '': expandedRowId === creature._id,
                }"
              >
                <td class="px-2 py-1 sm:px-4 sm:py-2 text-sm">
                  {{ creature._id }}
                </td>
                <td class="px-2 py-1 sm:px-4 sm:py-2 text-sm">
                  {{ creature.name }}
                </td>
                <td class="px-2 py-1 sm:px-4 sm:py-2 text-sm">
                  {{ creature.translation }}
                </td>
                <td class="px-2 py-1 sm:px-4 sm:py-2 text-sm">
                  {{ creature.powerLevel }}
                </td>
                <td class="px-2 py-1 sm:px-4 sm:py-2 text-sm">
                  <div class="flex flex-col items-start space-y-2">
                    <button
                      type="button"
                      @click="toggleEdit(creature)"
                      class="text-teal-600 hover:text-teal-800 transition duration-300"
                    >
                      {{
                        expandedRowId === creature._id ? "Cancel" : "Read/Edit"
                      }}
                    </button>
                    <button
                      type="button"
                      @click="confirmAndDelete(creature._id)"
                      class="text-red-600 hover:text-red-800 transition duration-300"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
              <!-- Expandable row for editing -->
              <tr v-if="expandedRowId === creature._id" class="border-b">
                <td colspan="5" class="px-2 py-1 sm:px-4 sm:py-2">
                  <form>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label
                          class="block text-xs font-semibold text-zinc-600 uppercase"
                        >
                          Name
                        </label>
                        <input
                          type="text"
                          v-model="editableCreature.name"
                          placeholder="Enter Hungarian name of the creature (max. 255 characters)"
                          class="bg-zinc-100 w-full rounded-md p-1 sm:p-2 text-sm shadow-xs border border-zinc-400 mt-1"
                        />
                      </div>
                      <div>
                        <label
                          class="block text-xs font-semibold text-zinc-600 uppercase"
                        >
                          Translation
                        </label>
                        <input
                          type="text"
                          v-model="editableCreature.translation"
                          placeholder="Enter the English translation (max. 255 characters)"
                          class="bg-zinc-100 w-full rounded-md p-1 sm:p-2 text-sm shadow-xs border border-zinc-400 mt-1"
                        />
                      </div>
                    </div>
                    <div class="mt-4">
                      <label
                        class="block text-xs font-semibold text-zinc-600 uppercase"
                      >
                        Description
                      </label>
                      <textarea
                        rows="3"
                        v-model="editableCreature.description"
                        placeholder="Provide a brief description (max. 300 characters)"
                        class="bg-zinc-100 w-full rounded-md p-1 sm:p-2 text-sm shadow-xs border border-zinc-400 mt-1"
                      ></textarea>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <label
                          class="block text-xs font-semibold text-zinc-600 uppercase"
                        >
                          Power Level
                        </label>
                        <input
                          type="number"
                          v-model.number="editableCreature.powerLevel"
                          placeholder="Set power level (1–100)"
                          class="bg-zinc-100 w-full rounded-md p-1 sm:p-2 text-sm shadow-xs border border-zinc-400 mt-1"
                        />
                      </div>
                      <div>
                        <label
                          class="block text-xs font-semibold text-zinc-600 uppercase"
                        >
                          Fun Fact
                        </label>
                        <input
                          type="text"
                          v-model="editableCreature.funFact"
                          placeholder="Write a fun fact about the creature (max. 255 characters)"
                          class="bg-zinc-100 w-full rounded-md p-1 sm:p-2 text-sm shadow-xs border border-zinc-400 mt-1"
                        />
                      </div>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <label
                          class="block text-xs font-semibold text-zinc-600 uppercase"
                        >
                          Strengths
                        </label>
                        <input
                          type="text"
                          v-model="editableCreature.strengths"
                          placeholder="List key strengths (max. 255 characters)"
                          class="bg-zinc-100 w-full rounded-md p-1 sm:p-2 text-sm shadow-xs border border-zinc-400 mt-1"
                        />
                      </div>
                      <div>
                        <label
                          class="block text-xs font-semibold text-zinc-600 uppercase"
                        >
                          Weaknesses
                        </label>
                        <input
                          type="text"
                          v-model="editableCreature.weaknesses"
                          placeholder="List key weaknesses (max. 255 characters)"
                          class="bg-zinc-100 w-full rounded-md p-1 sm:p-2 text-sm shadow-xs border border-zinc-400 mt-1"
                        />
                      </div>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      <div>
                        <label
                          class="block text-xs font-semibold text-zinc-600 uppercase"
                        >
                          Created By
                        </label>
                        <input
                          type="text"
                          v-model="editableCreature._createdBy"
                          readonly
                          class="bg-zinc-200 w-full rounded-md p-1 sm:p-2 text-sm border border-zinc-400 mt-1"
                        />
                      </div>
                      <div>
                        <label
                          class="block text-xs font-semibold text-zinc-600 uppercase"
                        >
                          Created At
                        </label>
                        <input
                          type="text"
                          v-model="editableCreature.createdAt"
                          readonly
                          class="bg-zinc-200 w-full rounded-md p-1 sm:p-2 text-sm border border-zinc-400 mt-1"
                        />
                      </div>
                      <div>
                        <label
                          class="block text-xs font-semibold text-zinc-600 uppercase"
                        >
                          Updated At
                        </label>
                        <input
                          type="text"
                          v-model="editableCreature.updatedAt"
                          readonly
                          class="bg-zinc-200 w-full rounded-md p-1 sm:p-2 text-sm border border-zinc-400 mt-1"
                        />
                      </div>
                      <div class="mt-4">
                        <label
                          class="block text-xs font-semibold text-zinc-600 uppercase"
                        >
                          Upload Image
                        </label>
                        <input
                          type="file"
                          @change="handleEditableFileChange"
                          class="bg-zinc-100 w-full rounded-md py-1 sm:py-2 text-sm shadow-xs mt-1"
                        />
                        <div
                          v-if="editableImageUploading"
                          class="mt-2 text-sm text-teal-600"
                        >
                          Uploading image...
                        </div>
                        <div v-else-if="editableCreature.imageURL" class="mt-2">
                          <p
                            class="block text-xs font-semibold text-zinc-600 uppercase"
                          >
                            Preview:
                          </p>
                          <img
                            :src="editableCreature.imageURL"
                            alt="Uploaded Image"
                            class="mt-2 sm:mt-3 w-32 h-32 object-cover border"
                          />
                        </div>
                      </div>
                    </div>
                    <div class="mt-8 mb-3 sm:mb-2 flex justify-start space-x-2">
                      <button
                        type="button"
                        @click="toggleEdit(creature)"
                        class="rounded-md bg-zinc-300 px-2 py-1 sm:px-4 sm:py-2 text-sm text-zinc-800 hover:bg-zinc-400 transition duration-300"
                      >
                        Close
                      </button>
                      <button
                        type="button"
                        @click="handleUpdateCreature(creature._id)"
                        class="rounded-md bg-teal-600 px-2 py-1 sm:px-4 sm:py-2 text-sm text-white hover:bg-teal-700 transition duration-300"
                      >
                        Save
                      </button>
                    </div>
                  </form>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </section>
    <!-- Section for adding a new question -->
    <section class="mt-12">
      <h2 class="text-2xl font-bold mb-4">Add a Quiz Question</h2>
      <form @submit.prevent="handleAddQuestion" class="mb-6">
        <div>
          <label class="block text-xs font-semibold text-zinc-600 uppercase">
            Question
          </label>
          <input
            v-model="newQuestion.text"
            type="text"
            placeholder="Enter question or scenario (max. 200 characters)"
            class="bg-zinc-100 w-full rounded-md p-2 text-sm border border-zinc-400 mt-1"
            required
          />
        </div>
        <div
          v-for="(opt, idx) in newQuestion.options || []"
          :key="idx"
          class="mt-4"
        >
          <label class="block text-xs font-semibold text-zinc-600 uppercase">
            Choice {{ idx + 1 }}
          </label>
          <input
            v-model="opt.text"
            type="text"
            placeholder="Enter an answer option (max. 100 characters)"
            class="bg-zinc-100 w-full rounded-md p-2 text-sm border border-zinc-400 mt-1"
            required
          />
          <label
            class="block text-xs font-semibold text-zinc-600 uppercase mt-2"
          >
            Creatures Associated with Option
          </label>
          <select
            v-model="opt.creatureIds"
            multiple
            class="bg-zinc-100 w-full rounded-md p-2 text-sm border border-zinc-400 mt-1"
            required
          >
            <option v-for="cre in creatures" :key="cre._id" :value="cre._id">
              {{ cre.name }}
            </option>
          </select>
          <button
            v-if="idx >= 2"
            type="button"
            @click="removeOption(idx)"
            class="mt-1 text-red-600 hover:text-red-800 text-sm"
          >
            Remove Choice
          </button>
        </div>

        <button
          type="button"
          @click="addOption()"
          class="mt-4 text-teal-600 hover:text-teal-800"
        >
          + Add Option
        </button>
        <div class="mt-6">
          <button
            type="submit"
            class="rounded-md bg-teal-600 px-4 py-2 text-sm text-white hover:bg-teal-700"
          >
            Save Question
          </button>
        </div>
      </form>
      <!-- Section for displaying, editing, and deleting questions -->
      <div class="mt-8">
        <h2 class="text-2xl font-bold mb-4">Quiz Questions</h2>
        <div class="overflow-x-auto">
          <table class="min-w-full text-zinc-900">
            <thead>
              <tr>
                <th
                  class="px-2 py-1 sm:px-4 sm:py-2 border-b border-zinc-200 text-left text-xs font-semibold text-zinc-600 uppercase"
                >
                  ID
                </th>
                <th
                  class="px-2 py-1 sm:px-4 sm:py-2 border-b border-zinc-200 text-left text-xs font-semibold text-zinc-600 uppercase"
                >
                  Question
                </th>
                <th
                  class="px-2 py-1 sm:px-4 sm:py-2 border-b border-zinc-200 text-left text-xs font-semibold text-zinc-600 uppercase"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              <template v-for="question in questions" :key="question._id">
                <tr>
                  <td class="px-4 py-2 text-sm">{{ question._id }}</td>
                  <td class="px-4 py-2 text-sm">{{ question.text }}</td>
                  <td class="px-2 py-1 sm:px-4 sm:py-2 text-sm">
                    <div class="flex flex-col items-start space-y-2">
                      <button
                        type="button"
                        @click="toggleEditQuestion(question)"
                        class="text-teal-600 hover:text-teal-800 transition duration-300"
                      >
                        {{
                          editingQuestionId === question._id
                            ? "Cancel"
                            : "Read/Edit"
                        }}
                      </button>
                      <button
                        type="button"
                        @click="confirmDeleteQuestion(question._id)"
                        class="text-red-600 hover:text-red-800 transition duration-300"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
                <!-- Expandable row for editing -->
                <tr v-if="editingQuestionId === question._id">
                  <td colspan="4" class="px-4 py-2">
                    <form @submit.prevent="handleUpdateQuestion(question._id)">
                      <div>
                        <label
                          class="block text-xs font-semibold text-zinc-600 uppercase"
                        >
                          Question
                        </label>
                        <input
                          v-model="editingQuestion.text"
                          type="text"
                          class="bg-zinc-100 w-full rounded-md p-2 text-sm border border-zinc-400 mt-1"
                          required
                        />
                      </div>
                      <div
                        v-for="(opt, idx) in editingQuestion.options || []"
                        :key="idx"
                        class="mt-4"
                      >
                        <label
                          class="block text-xs font-semibold text-zinc-600 uppercase"
                        >
                          Choice {{ idx + 1 }}
                        </label>
                        <input
                          v-model="opt.text"
                          type="text"
                          class="bg-zinc-100 w-full rounded-md p-2 text-sm border border-zinc-400 mt-1"
                          required
                        />

                        <label
                          class="block text-xs font-semibold text-zinc-600 uppercase mt-2"
                        >
                          Creatures Associated with Option
                        </label>
                        <select
                          v-model="opt.creatureIds"
                          multiple
                          class="bg-zinc-100 w-full rounded-md p-2 text-sm border border-zinc-400 mt-1"
                          required
                        >
                          <option
                            v-for="cre in creatures"
                            :key="cre._id"
                            :value="cre._id"
                          >
                            {{ cre.name }}
                          </option>
                        </select>
                        <button
                          v-if="idx >= 2"
                          type="button"
                          @click="removeOptionFromEditing(idx)"
                          class="mt-1 text-red-600 hover:text-red-800 text-sm"
                        >
                          Remove Choice
                        </button>
                      </div>
                      <button
                        type="button"
                        @click="addOptionToEditing()"
                        class="mt-4 text-teal-600 hover:text-teal-800"
                      >
                        + Add Option
                      </button>
                      <div class="mt-6">
                        <button
                          type="submit"
                          class="rounded-md bg-teal-600 px-4 py-2 text-sm text-white hover:bg-teal-700"
                        >
                          Save Changes
                        </button>
                      </div>
                    </form>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import type { Creature, newCreature } from "../interfaces/interfaces";
import { useCreatures } from "../modules/useCreatures";
import { useQuestions } from "../modules/useQuestions";
import type { Question } from "../interfaces/interfaces";

// Creature composable
const {
  creatures,
  imageUploading,
  fetchCreatures,
  addCreature,
  deleteCreature,
  updateCreature,
  getTokenAndUserId,
  uploadImage,
} = useCreatures();

// Question composable
const {
  questions,
  fetchQuestions,
  addQuestion,
  updateQuestion,
  deleteQuestion,
  getTokenAndUserId: getTokenAndUserIdQ,
} = useQuestions();

// Creature state
const expandedRowId = ref<string | null>(null);
const editableCreature = ref<Partial<Creature>>({});

const newCreatureData = ref<newCreature>({
  name: "",
  translation: "",
  description: "",
  powerLevel: 50,
  strengths: "",
  weaknesses: "",
  funFact: "",
  imageURL: "",
  _createdBy: "",
});

const editableImageUploading = ref(false);

// Question state
const newQuestion = ref<Partial<Question>>({
  text: "",
  options: [
    { text: "", creatureIds: [] },
    { text: "", creatureIds: [] },
  ],
  _createdBy: "",
});

const editingQuestionId = ref<string | null>(null);
const editingQuestion = ref<Partial<Question>>({});

onMounted(async () => {
  await fetchCreatures();
  await fetchQuestions();
});

// Creature methods
function toggleEdit(creature: Creature) {
  if (expandedRowId.value === creature._id) {
    expandedRowId.value = null;
  } else {
    expandedRowId.value = creature._id;
    editableCreature.value = { ...creature };
  }
}

function confirmAndDelete(id: string) {
  if (confirm("Are you sure you want to delete this object?")) {
    deleteCreature(id);
  }
}

async function handleAddCreature() {
  try {
    const { userId } = getTokenAndUserId();
    newCreatureData.value._createdBy = userId;
    await addCreature(newCreatureData.value as newCreature, null);
    newCreatureData.value = {
      name: "",
      translation: "",
      description: "",
      powerLevel: 50,
      strengths: "",
      weaknesses: "",
      funFact: "",
      imageURL: "",
      _createdBy: "",
    };
  } catch (err) {
    console.error(err);
  }
}

async function handleUpdateCreature(id: string) {
  try {
    await updateCreature(id, editableCreature.value as Creature);
    expandedRowId.value = null;
  } catch (err) {
    console.error(err);
  }
}

async function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    const file = target.files[0];
    const imageUrl = await uploadImage(file);
    if (imageUrl) {
      newCreatureData.value.imageURL = imageUrl;
    }
  }
}

async function handleEditableFileChange(event: Event) {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    editableImageUploading.value = true;
    const file = target.files[0];
    const imageUrl = await uploadImage(file);
    if (imageUrl) {
      editableCreature.value.imageURL = imageUrl;
    }
    editableImageUploading.value = false;
  }
}

// Question methods
function addOption() {
  newQuestion.value.options?.push({ text: "", creatureIds: [] });
}

function addOptionToEditing() {
  editingQuestion.value.options?.push({ text: "", creatureIds: [] });
}

function removeOption(idx: number) {
  newQuestion.value.options?.splice(idx, 1);
}

function removeOptionFromEditing(idx: number) {
  editingQuestion.value.options?.splice(idx, 1);
}

async function handleAddQuestion() {
  try {
    const { userId } = getTokenAndUserIdQ();
    newQuestion.value._createdBy = userId;
    await addQuestion(newQuestion.value as any);
    newQuestion.value = {
      text: "",
      options: [
        { text: "", creatureIds: [] },
        { text: "", creatureIds: [] },
      ],
      _createdBy: "",
    };
  } catch (err) {
    console.error(err);
  }
}

function toggleEditQuestion(question: Question) {
  if (editingQuestionId.value === question._id) {
    editingQuestionId.value = null;
    editingQuestion.value = {};
  } else {
    editingQuestionId.value = question._id;
    editingQuestion.value = { ...question };
  }
}

async function handleUpdateQuestion(id: string) {
  try {
    await updateQuestion(id, editingQuestion.value as Question);
    editingQuestionId.value = null;
  } catch (err) {
    console.error(err);
  }
}

function confirmDeleteQuestion(id: string) {
  if (confirm("Are you sure you want to delete this question?")) {
    deleteQuestion(id);
  }
}
</script>
