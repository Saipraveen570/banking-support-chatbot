import React from 'react';
import { Account } from '../types';

interface AccountInfoProps {
  accounts: Account[];
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const AccountInfo: React.FC<AccountInfoProps> = ({ accounts }) => {
  return (
    <div className="mt-3 space-y-2">
      {accounts.map((account, index) => (
        <div key={index} className="p-3 bg-gray-50 rounded-lg border border-gray-200 flex justify-between items-center">
          <div>
            <p className="font-semibold text-gray-700 text-sm">{account.type} ({account.number})</p>
          </div>
          <p className="font-mono text-gray-800 text-sm tracking-tight">{formatCurrency(account.balance)}</p>
        </div>
      ))}
    </div>
  );
};
