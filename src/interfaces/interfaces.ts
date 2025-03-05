export type User = {
  _id: string;
  username: string;
  email: string;
  password: string;
};

export type Creature = {
  _id: string;
  name: string;
  translation: string;
  description: string;
  powerLevel: number;
  strengths: string;
  weaknesses: string;
  imageURL: string;
  category: string;
  _createdBy: string;
  createdAt: string;
  updatedAt: string;
};

export type newCreature = Omit<Creature, "_id" | "createdAt" | "updatedAt"> & {
  _createdBy?: string;
};

export type Category = {
  _id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};
