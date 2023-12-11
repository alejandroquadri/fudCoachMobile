export interface User {
  _id: string;
  email: string;
  name: string;
  password: string;
  weightLogs?: Array<{ wheigtLog: number; date: Date }>;
  birthday: string;
  weightGoal?: number;
  finishedIntro?: boolean;
}
