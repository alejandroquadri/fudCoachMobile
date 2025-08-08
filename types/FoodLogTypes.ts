export interface FoodLog {
  _id: string;
  user_id: string;
  createdAt: string; // timestamp when log was created
  updatedAt: string; // timestamp when log was updated
  // date: string; // date the food was consumed
  // hour: string; // hour the food was consumed
  foodObj: {
    foodName: string;
    servings: number;
    size: string;
    calories: number;
    carbohydrates: number;
    proteins: number;
    fats: number;
  };
}

export interface EmptyCardInterface {
  type: string;
}

export interface WaterLog {
  _id?: string;
  user_id: string;
  createdAt?: Date; // timestamp when log was created
  updatedAt?: Date; // timestamp when log was updated
  date: string;
  waterCups: number;
}

export interface ExerciseLog {
  _id?: string;
  user_id: string;
  createdAt?: Date; // timestamp when log was created
  updatedAt?: Date; // timestamp when log was updated
  date: string;
  hour: string;
  exerciseName: string;
  duration: number;
  caloriesBurned: number;
}
