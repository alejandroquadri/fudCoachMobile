export interface User {
  _id: string;
  email: string;
  name: string;
  password: string;
  weightLogs: Array<{ weightLog: number; date: Date }>;
  weightUnit: string;
  height: string;
  heightUnit: string;
  birthday: string;
  gender: string;
  completedQA: boolean;
  nickName?: string;
  qAndAnswers?: Array<string>;
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
  gender?: string;
  lifestyle?: number;
  weightGoal?: number;
}
