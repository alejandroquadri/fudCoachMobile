export interface User {
  _id: string;
  email: string;
  name: string;
  password: string;
  weightLogs: Array<{ weightLog: number; date: Date }>;
  weightUnit: string;
  height: number;
  heightUnit: string;
  birthday: string;
  sex: string;
  completedQA: boolean;
  nickName?: string;
  qAndAnswers?: Array<string>;
  tdee: number;
  bmr: number;
  dailyCaloricTarget: number;
  dailyCarbsTarget: number;
  dailyProteinTarget: number;
  dailyFatTarget: number;
}

export interface RegistrationData {
  name: string;
  email: string;
  password: string;
  birthdate?: Date;
  weight?: number;
  weightUnit?: string;
  height?: number;
  heightUnit?: string;
  sex?: string;
  lifestyle?: number;
  weightGoal?: number;
}

// hacia abajo las interfaces actualizadas

export interface UserProfile {
  _id: string;
  name: string;
  avatar?: string;
  email: string;
  password: string;
  gender: string;
  lifeStyle: number;
  activityLevel: string;
  triedOtherApps: boolean;
  unitType: 'metric' | 'imperial';
  initWeight: number; // esto siempre lo voy a guardar en kg
  height: number; // esto siempre lo voy a guardar en cm
  birthdate: string; // un string del tipo YYYY-MM-DD
  goal: string; // perder peso: 0 | ganar peso: 1 | mantenerme: 2
  weightGoal: number; // siempre en kg
  goalVelocity: number; // perdida de peso por semana en kg
  goalObstacle: string; // que te impide alcanzar tus metas
  dietType: string; // tipo de dieta: clasico | vegano | vegetariano | paleo | etc
  outcome: string; // ser mas saludabe | tener mas energia | etc
  nutritionGoals: NutritionGoals;
}

export interface NutritionGoals {
  tdee: number;
  bmr: number;
  dailyCaloricTarget: number;
  dailyCarbsTarget: number;
  dailyProteinTarget: number;
  dailyFatTarget: number;
}
