import { ref } from "vue";
import type { Creature, newCreature } from "../interfaces/interfaces";

export const useCreatures = () => {
  const error = ref<string | null>(null);
  const loading = ref<boolean>(false);
  const creatures = ref<Creature[]>([]);

  // Fetch all creatures
  const fetchCreatures = async (): Promise<void> => {
    loading.value = true;
    try {
      const response = await fetch("http://localhost:4000/api/creatures");
      if (!response.ok) {
        throw new Error("No data available");
      }
      const data: Creature[] = await response.json();
      creatures.value = data;
      console.log("Creatures fetched successfully", creatures.value);
    } catch (err) {
      error.value = (err as Error).message;
    } finally {
      loading.value = false;
    }
  };

  // Get the token and user ID from localStorage
  const getTokenAndUserId = (): { token: string; userId: string } => {
    const token = localStorage.getItem("lsToken");
    const userId = localStorage.getItem("userIdToken");
    if (!token) {
      throw new Error("No token available");
    }
    if (!userId) {
      throw new Error("No user id available");
    }
    return { token, userId };
  };

  // Validate the creature's data before adding it
  const validateCreature = (creature: newCreature): void => {
    if (!creature.name) {
      throw new Error("Creature name is required");
    }
    if (!creature.category) {
      throw new Error("Category is required");
    }
  };

  // Set default values if not provided
  const setDefaultValues = (creature: newCreature, userId: string) => {
    return {
      name: creature.name,
      translation: creature.translation || "Not specified",
      description: creature.description || "Not specified",
      powerLevel: creature.powerLevel || 50,
      strengths: creature.strengths || "Not specified",
      weaknesses: creature.weaknesses || "Not specified",
      imageURL: creature.imageURL || "https://picsum.photos/500/500",
      category: creature.category,
      _createdBy: userId,
    };
  };

  // Add a new creature with default values
  const addCreature = async (creature: newCreature): Promise<void> => {
    try {
      const { token, userId } = getTokenAndUserId();
      validateCreature(creature);
      const creatureWithDefaults = setDefaultValues(creature, userId);

      const response = await fetch("http://localhost:4000/api/creatures", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
        body: JSON.stringify(creatureWithDefaults),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.error || "No data available");
      }
      const newCreature: Creature = await response.json();
      creatures.value.push(newCreature);
      console.log("Creature added successfully", newCreature);
      await fetchCreatures();
    } catch (err) {
      error.value = (err as Error).message;
    }
  };

  // Delete a creature from the server
  const deleteCreatureFromServer = async (
    id: string,
    token: string
  ): Promise<void> => {
    const response = await fetch(`http://localhost:4000/api/creatures/${id}`, {
      method: "DELETE",
      headers: {
        "auth-token": token,
      },
    });

    if (!response.ok) {
      console.log("Creature not deleted");
      throw new Error("No data available");
    }
  };

  // Remove a creature from the state
  const removeCreatureFromState = (id: string): void => {
    creatures.value = creatures.value.filter((creature) => creature._id !== id);
    console.log("Creature deleted successfully", id);
  };

  // Delete a creature
  const deleteCreature = async (id: string): Promise<void> => {
    try {
      const { token } = getTokenAndUserId();
      await deleteCreatureFromServer(id, token);
      removeCreatureFromState(id);
      console.log("Deleting creature with id", id);
    } catch (err) {
      error.value = (err as Error).message;
    }
  };

  // Update a creature on the server
  const updateCreatureOnServer = async (
    id: string,
    updatedCreature: Partial<Creature>,
    token: string
  ): Promise<Creature> => {
    const response = await fetch(`http://localhost:4000/api/creatures/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "auth-token": token,
      },
      body: JSON.stringify(updatedCreature),
    });
    if (!response.ok) {
      const errorResponse = await response.json();
      throw new Error(errorResponse.error || "No data available");
    }
    return await response.json();
  };

  // Update a creature in the state
  const updateCreatureInState = (
    id: string,
    updatedCreature: Creature
  ): void => {
    const index = creatures.value.findIndex((c) => c._id === id);
    if (index !== -1) {
      creatures.value[index] = updatedCreature;
    }
  };

  // Update a creature with new data
  const updateCreature = async (
    id: string,
    updatedCreature: Partial<Creature>
  ): Promise<void> => {
    try {
      const { token } = getTokenAndUserId();
      const updatedCreatureResponse = await updateCreatureOnServer(
        id,
        updatedCreature,
        token
      );
      updateCreatureInState(id, updatedCreatureResponse);
      await fetchCreatures();
      console.log("Creature updated successfully", updatedCreatureResponse);
    } catch (err) {
      error.value = (err as Error).message;
    }
  };

  // File upload logic
  async function uploadFile(event: Event): Promise<string | null> {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files[0]) {
      const file = target.files[0];
      const formData = new FormData();
      formData.append("image", file);
      try {
        const res = await fetch("http://localhost:4000/api/upload", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        return data.imageUrl;
      } catch (err) {
        console.error("File upload failed", err);
        return null;
      }
    }
    return null;
  }

  return {
    error,
    loading,
    creatures,
    fetchCreatures,
    getTokenAndUserId,
    addCreature,
    deleteCreature,
    updateCreature,
    uploadFile,
  };
};
