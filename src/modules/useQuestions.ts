import { ref } from "vue";
import type { Question, newQuestion } from "../interfaces/interfaces";

export const useQuestions = () => {
  const error = ref<string | null>(null);
  const loading = ref<boolean>(false);
  const questions = ref<Question[]>([]);

  // Helper to retrieve token and userId from localStorage
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

  // Fetch quiz questions from the server
  const fetchQuestions = async (): Promise<void> => {
    loading.value = true;
    try {
      const response = await fetch(
        "https://my-awesome-ments-api.onrender.com/api/questions"
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error ||
            `Failed to fetch questions (status ${response.status})`
        );
      }
      const data: Question[] = await response.json();
      questions.value = data;
      console.log("Questions fetched successfully", questions.value);
    } catch (err) {
      error.value = (err as Error).message;
    } finally {
      loading.value = false;
    }
  };

  // Add a new quiz question
  const addQuestion = async (payload: newQuestion): Promise<void> => {
    try {
      const { token, userId } = getTokenAndUserId();

      // _createdBy from the JWT
      const questionPayload = {
        ...payload,
        _createdBy: userId,
      };

      const response = await fetch(
        "https://my-awesome-ments-api.onrender.com/api/questions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "auth-token": token,
          },
          body: JSON.stringify(questionPayload),
        }
      );

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.error || "Failed to create question");
      }

      const newQuestion: Question = await response.json();
      questions.value.push(newQuestion);
      console.log("Question added successfully", newQuestion);
      await fetchQuestions();
    } catch (err) {
      error.value = (err as Error).message;
    }
  };

  // Update an existing quiz question on the server
  const updateQuestionOnServer = async (
    id: string,
    payload: Partial<Question>,
    token: string
  ): Promise<Question> => {
    const response = await fetch(
      `https://my-awesome-ments-api.onrender.com/api/questions/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
        body: JSON.stringify(payload),
      }
    );
    if (!response.ok) {
      const errorResponse = await response.json();
      throw new Error(errorResponse.error || "Failed to update question");
    }
    return await response.json();
  };

  // Update a question inside the local state array
  const updateQuestionInState = (
    id: string,
    updatedQuestion: Question
  ): void => {
    const index = questions.value.findIndex((q) => q._id === id);
    if (index !== -1) {
      questions.value[index] = updatedQuestion;
    }
  };

  // Wrapper to update a question combining server call and local state update
  const updateQuestion = async (
    id: string,
    payload: Partial<Question>
  ): Promise<void> => {
    try {
      const { token } = getTokenAndUserId();
      const updated = await updateQuestionOnServer(id, payload, token);
      updateQuestionInState(id, updated);
      await fetchQuestions();
      console.log("Question updated successfully", updated);
    } catch (err) {
      error.value = (err as Error).message;
    }
  };

  // Delete a quiz question from the server
  const deleteQuestionFromServer = async (
    id: string,
    token: string
  ): Promise<void> => {
    const response = await fetch(
      `https://my-awesome-ments-api.onrender.com/api/questions/${id}`,
      {
        method: "DELETE",
        headers: {
          "auth-token": token,
        },
      }
    );
    if (!response.ok) {
      const errorResponse = await response.json();
      throw new Error(errorResponse.error || "Failed to delete question");
    }
  };

  // Delete a question from the local state array
  const removeQuestionFromState = (id: string): void => {
    questions.value = questions.value.filter((q) => q._id !== id);
    console.log("Question deleted successfully", id);
  };

  // Delete a question combining server call and state update
  const deleteQuestion = async (id: string): Promise<void> => {
    try {
      const { token } = getTokenAndUserId();
      await deleteQuestionFromServer(id, token);
      removeQuestionFromState(id);
      console.log("Deleting question with id", id);
    } catch (err) {
      error.value = (err as Error).message;
    }
  };

  return {
    error,
    loading,
    questions,
    fetchQuestions,
    addQuestion,
    updateQuestion,
    deleteQuestion,
    getTokenAndUserId,
  };
};
