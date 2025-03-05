import { ref } from "vue";
import type { Category } from "../interfaces/interfaces";

export const useCategories = () => {
  const error = ref<string | null>(null);
  const loading = ref<boolean>(false);
  const categories = ref<Category[]>([]);

  // Fetch all categories
  const fetchCategories = async (): Promise<void> => {
    loading.value = true;
    try {
      const response = await fetch("http://localhost:4000/api/categories");
      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }
      const data: Category[] = await response.json();
      categories.value = data;
      console.log("Categories fetched successfully", categories.value);
    } catch (err) {
      error.value = (err as Error).message;
    } finally {
      loading.value = false;
    }
  };

  // Helper function to return the category name for a given category ID
  function getCategoryName(catId: string): string {
    const cat = categories.value.find((c: Category) => c._id === catId);
    return cat ? cat.name : catId;
  }

  return {
    error,
    loading,
    categories,
    fetchCategories,
    getCategoryName,
  };
};
