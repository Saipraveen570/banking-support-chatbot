import { Account } from '../types';

const mockAccounts: Account[] = [
  {
    type: 'Checking',
    number: '...1234',
    balance: 5432.10,
  },
  {
    type: 'Savings',
    number: '...5678',
    balance: 12345.67,
  },
];

export const getAccountBalance = async (): Promise<Account[]> => {
  // Simulate a network request
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(mockAccounts);
    }, 300);
  });
};

export const blockCard = async (cardType: string): Promise<string> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(`I'm sorry to hear that your ${cardType} card is lost or stolen. I have initiated the process to block your ${cardType} card immediately. A confirmation message will be sent to your registered mobile number shortly.`);
    }, 500);
  });
};

export const generateOrResetPin = async (cardType: string): Promise<string> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(`I understand you'd like to generate or reset your PIN for your ${cardType} card. For your security, please use our official mobile banking app or visit the nearest branch to complete this process. I can guide you through the steps on the app if you'd like.`);
    }, 500);
  });
};

export const replaceCard = async (cardType: string): Promise<string> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(`I've initiated a request to replace your damaged ${cardType} card. A new card will be dispatched to your registered address within 5-7 business days. You'll receive an SMS with tracking details.`);
    }, 500);
  });
};

export const activateDeactivateCard = async (cardType: string, action: 'activate' | 'deactivate'): Promise<string> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(`I've processed your request to ${action} your ${cardType} card. A confirmation SMS will be sent to your registered mobile number.`);
    }, 500);
  });
};