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
