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
      const response = await fetch(
        "https://my-awesome-ments-api.onrender.com/api/creatures"
      );
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
  };

  // Set default values if not provided
  const setDefaultValues = (creature: newCreature, userId: string) => {
    return {
      name: creature.name,
      translation: creature.translation || "No English translation available",
      description:
        creature.description || "No description available for this creature",
      powerLevel: creature.powerLevel || 50,
      strengths: creature.strengths || "Not specified",
      weaknesses: creature.weaknesses || "Not specified",
      funFact:
        creature.funFact || "No additional information available currently",
      imageURL: creature.imageURL || "https://picsum.photos/500/500",
      _createdBy: userId,
    };
  };

  // Upload the image file
  async function uploadImage(file: File): Promise<string | null> {
    const formData = new FormData();
    formData.append("image", file);
    try {
      const res = await fetch(
        "https://my-awesome-ments-api.onrender.com/api/upload",
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await res.json();
      return data.imageUrl;
    } catch (err) {
      console.error("File upload failed", err);
      return null;
    }
  }

  // Add a new creature with image upload
  const addCreature = async (
    creature: newCreature,
    imageFile: File | null
  ): Promise<void> => {
    try {
      const { token, userId } = getTokenAndUserId();
      validateCreature(creature);

      // Set defaults from provided creature data
      let creatureWithDefaults = setDefaultValues(creature, userId);

      // If an image file is provided, upload it and override the default imageURL
      if (imageFile) {
        const uploadedImageUrl = await uploadImage(imageFile);
        if (uploadedImageUrl) {
          creatureWithDefaults = {
            ...creatureWithDefaults,
            imageURL: uploadedImageUrl,
          };
        }
      }

      const response = await fetch(
        "https://my-awesome-ments-api.onrender.com/api/creatures",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "auth-token": token,
          },
          body: JSON.stringify(creatureWithDefaults),
        }
      );

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.error || "No data available");
      }
      const newCreatureResponse: Creature = await response.json();
      creatures.value.push(newCreatureResponse);
      console.log("Creature added successfully", newCreatureResponse);
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
    const response = await fetch(
      `https://my-awesome-ments-api.onrender.com/api/creatures/${id}`,
      {
        method: "DELETE",
        headers: {
          "auth-token": token,
        },
      }
    );
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
    const response = await fetch(
      `https://my-awesome-ments-api.onrender.com/api/creatures/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
        body: JSON.stringify(updatedCreature),
      }
    );
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

  return {
    error,
    loading,
    creatures,
    fetchCreatures,
    getTokenAndUserId,
    addCreature,
    deleteCreature,
    updateCreature,
    uploadImage,
  };
};
