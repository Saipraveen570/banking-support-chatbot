export enum Author {
  USER = 'user',
  BOT = 'bot',
}

export interface Message {
  author: Author;
  text: string;
  suggestions?: string[];
  accounts?: Account[];
}

export interface Account {
  type: 'Checking' | 'Savings';
  number: string;
  balance: number;
}
