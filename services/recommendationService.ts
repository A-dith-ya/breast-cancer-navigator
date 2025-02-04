import config from "@/config";
import logger from "@/utils/logger";

const API_BASE_URL = config.API_BASE_URL;

interface RecommendationResponse {
  Recommendations: {
    MealPlan: {
      DietType: string;
      NutritionalFocus: string;
      Meals: {
        Breakfast: string[];
        Snack1: string[];
        Lunch: string[];
        Snack2: string[];
        Dinner: string[];
        EveningSnack: string[];
      };
    };
    ExercisePlan: {
      MobilityLevel: string;
      Focus: string;
      Routine: {
        WarmUp: string[];
        StrengthTraining: string[];
        Cardio: string[];
        CoolDown: string[];
      };
      Tips: string[];
    };
    MentalWellBeingSupport: {
      MindfulnessPractices: string[];
      Journaling: string[];
      RelaxationTechniques: string[];
      ConnectWithOthers: string[];
    };
  };
  error?: string;
}

export const generateRecommendation = async (
  id: string,
  age: string,
  gender: string,
  dietaryPreferences: string,
  mobility: string
): Promise<RecommendationResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/generateRecommendation`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
        age,
        gender,
        dietaryPreferences,
        mobility,
      }),
    });

    logger.log("Response:", response);

    if (!response.ok) {
      throw new Error(
        `Failed to generate recommendation: ${response.statusText}`
      );
    }

    const responseText = await response.text();
    logger.log("Response text:", responseText);

    const parsedData = JSON.parse(responseText);
    return parsedData.recommendation.Recommendations;
  } catch (error) {
    logger.error("Error generating recommendation:", error);
    return { error: (error as Error).message } as RecommendationResponse;
  }
};

export const getRecommendation = async (
  id: string
): Promise<RecommendationResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/getRecommendation/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to retrieve recommendation: ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    logger.error("Error retrieving recommendation:", error);
    return { error: (error as Error).message } as RecommendationResponse;
  }
};
