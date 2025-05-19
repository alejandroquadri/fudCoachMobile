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
  name: string;
  email: string;
  gender: string;
  lifeStyle: number;
  activityLevel: number;
  triedOtherApps?: boolean;
  weight: number; // esto siempre lo voy a guardar en kg
  height: number; // esto siempre lo voy a guardar en cm
  birthdate: string; // un string del tipo YYYY-MM-DD
  weightDirection?: string; // perder peso | ganar peso | mantenerme | etc
  weightGoal: number; // siempre en kg
  goalVelocity?: string; // velocidad para alcanzar la meta
  goalObsticle?: string; // que te impide alcanzar tus metas
  dietType?: string; // tipo de dieta: clasico | vegano | vegetariano | paleo | etc
  qualitativeGoal?: string; // ser mas saludabe | tener mas energia | etc
}
