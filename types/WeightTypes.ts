export interface WeightLogInterface {
  _id?: string;
  user_id: string;
  createdAt?: Date; // timestamp when log was created
  updatedAt?: Date; // timestamp when log was updated
  date: string;
  weightLog: number;
}
