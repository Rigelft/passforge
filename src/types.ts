export type PasswordHistoryItem = {
  id: string;
  createdAt: number;
  password: string;
  accountName?: string;
};

export type PasswordHistoryAddInput = {
  password: string;
  accountName?: string;
};
