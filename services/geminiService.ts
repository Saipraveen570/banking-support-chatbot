import { GoogleGenAI, Chat, FunctionDeclaration, Type, FunctionResponse } from "@google/genai";
import { getAccountBalance, blockCard, generateOrResetPin, replaceCard, activateDeactivateCard } from './accountService';
import { Account } from '../types';

const SYSTEM_INSTRUCTION = `You are a highly reliable, empathetic, and intelligent Banking Support Virtual Assistant. Your job is to help customers with their banking-related queries quickly, clearly, and safely.

Follow these guidelines at all times:

✅ 1. Tone & Communication Style

Always respond with empathy, patience, and clarity.
Example: “I understand how important this is for you. Let me help you right away.”

Keep responses concise but helpful.

Avoid jargon unless necessary.

Never sound robotic or generic.

✅ 2. Primary Responsibilities

You assist customers with queries related to:

Account Information

Account balance

Mini statement / recent transactions

Account details (account number, IFSC)

Statements & passbook requests

Fixed deposit/RD details

Card Services

Block lost/stolen debit or credit cards

Generate/reset PIN

Replace damaged cards

Card activation/deactivation

Card rejection issues

Payments & Transfers

UPI failures

IMPS/NEFT/RTGS status & timings

Refund queries

Adding beneficiaries

Automatic bill payments

Loans & EMI

Interest rates

Loan eligibility

EMI queries

Loan statement/closure

Failed EMI payments

KYC & Profile Updates

Aadhaar/PAN update issues

Update mobile/email/address

KYC status checks

Online/Mobile Banking

Password reset

Login issues

Mobile banking activation

UPI ID setup & trouble

Complaints & Alerts

Fraud/suspicious transactions

OTP not received

Failed transaction disputes

Cheque return reasons

General Banking Info

Branch hours

Customer care details

ATM/branch locator

Charges/fees info

Deposits & Investments

Open/break FD or RD

Interest rates

Tax-saving FD info

Miscellaneous

Update nominee

Credit score help

Required documents for new accounts

Interest certificates

✅ 3. Response Rules

Start with empathy.
Example: “I’m here to help you with that.”

Confirm the user's request if needed.

Provide step-by-step guidance when explaining processes.

If sensitive actions are required (blocking card, changing details), clearly warn:
“For security reasons, I’ll guide you through the safest method.”

Never guess. If unsure, ask a short clarifying question.

Avoid giving exact account/card details; guide them to secure channels.

✅ 4. Safety & Security

Never ask for full card numbers, passwords, PINs, CVV, or OTP.

Redirect securely:
“For your security, please perform this through the official banking app or branch.”

✅ 5. When Data Is Not Available

Say:
“I’m unable to view your personal account details, but here’s what you can do…”

Then give actionable steps.

✅ 6. Format of Responses

Use a clean, friendly structure:

✅ Acknowledgement
✅ Clear steps / resolution
✅ Additional tips if useful
✅ Ask if they need more help

Example:
“I understand how stressful card issues can be. Here’s what you can do…”

✅ 7. Mandatory Behavior

Never hallucinate policy or numbers—give safe, general guidance.

Always prioritize the quickest resolution path.

Respond instantly and accurately.

✅ Final Output Requirement

All responses must be:

✅ Empathetic
✅ Fast
✅ Accurate
✅ Actionable
✅ Secure
✅ Beginner-friendly`;

let ai: GoogleGenAI | null = null;
let chat: Chat | null = null;

export interface GeminiResponse {
  text: string;
  accounts?: Account[];
}

const getAi = () => {
  if (!ai) {
    if (!process.env.API_KEY) {
      throw new Error("API_KEY environment variable not set");
    }
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return ai;
};

// Define the function for the model to call
const getAccountBalanceFunctionDeclaration: FunctionDeclaration = {
  name: 'getAccountBalance',
  description: "Gets the current balance for all of the user's bank accounts, such as checking and savings.",
  parameters: {
    type: Type.OBJECT,
    properties: {},
    required: [],
  },
};

// New Function Declarations for Card Services
const blockCardFunctionDeclaration: FunctionDeclaration = {
  name: 'blockCard',
  description: "Blocks a user's lost or stolen debit or credit card immediately.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      cardType: {
        type: Type.STRING,
        description: 'The type of card to block (e.g., "debit card", "credit card").',
      },
    },
    required: ['cardType'],
  },
};

const generateOrResetPinFunctionDeclaration: FunctionDeclaration = {
  name: 'generateOrResetPin',
  description: "Guides the user on how to generate a new PIN or reset an existing PIN for their debit or credit card securely.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      cardType: {
        type: Type.STRING,
        description: 'The type of card (e.g., "debit card", "credit card").',
      },
    },
    required: ['cardType'],
  },
};

const replaceCardFunctionDeclaration: FunctionDeclaration = {
  name: 'replaceCard',
  description: "Initiates the process to replace a damaged debit or credit card for the user.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      cardType: {
        type: Type.STRING,
        description: 'The type of card to replace (e.g., "debit card", "credit card").',
      },
    },
    required: ['cardType'],
  },
};

const activateDeactivateCardFunctionDeclaration: FunctionDeclaration = {
  name: 'activateDeactivateCard',
  description: "Activates or deactivates a user's debit or credit card.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      cardType: {
        type: Type.STRING,
        description: 'The type of card (e.g., "debit card", "credit card").',
      },
      action: {
        type: Type.STRING,
        description: 'The action to perform: "activate" or "deactivate".',
        enum: ['activate', 'deactivate'],
      },
    },
    required: ['cardType', 'action'],
  },
};

export const startChat = (): Chat => {
  const genAI = getAi();
  chat = genAI.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      tools: [{
        functionDeclarations: [
          getAccountBalanceFunctionDeclaration,
          blockCardFunctionDeclaration,
          generateOrResetPinFunctionDeclaration,
          replaceCardFunctionDeclaration,
          activateDeactivateCardFunctionDeclaration,
        ]
      }],
    },
  });
  return chat;
};

export const sendMessage = async (message: string): Promise<GeminiResponse> => {
  if (!chat) {
    throw new Error("Chat not initialized. Call startChat first.");
  }
  try {
    let result = await chat.sendMessage({ message });
    let fetchedAccounts: Account[] | undefined = undefined;

    // Handle function calls if the model requests them
    while (result.functionCalls && result.functionCalls.length > 0) {
      const toolExecutionResponses: FunctionResponse[] = [];
      for (const functionCall of result.functionCalls) {
        let functionResult: string | Account[] | undefined;
        switch (functionCall.name) {
          case 'getAccountBalance':
            functionResult = await getAccountBalance();
            fetchedAccounts = functionResult as Account[];
            break;
          case 'blockCard':
            functionResult = await blockCard(functionCall.args.cardType as string);
            break;
          case 'generateOrResetPin':
            functionResult = await generateOrResetPin(functionCall.args.cardType as string);
            break;
          case 'replaceCard':
            functionResult = await replaceCard(functionCall.args.cardType as string);
            break;
          case 'activateDeactivateCard':
            functionResult = await activateDeactivateCard(functionCall.args.cardType as string, functionCall.args.action as 'activate' | 'deactivate');
            break;
          default:
            console.warn(`Unknown function call: ${functionCall.name}`);
            functionResult = `Unknown function: ${functionCall.name}`;
            break;
        }

        toolExecutionResponses.push({
          id: functionCall.id,
          name: functionCall.name,
          response: { result: functionResult },
        });
      }

      // Send the results of the function calls back to the model
      if (toolExecutionResponses.length > 0) {
        // Fix: When sending function call results back to the model in a chat,
        // use 'toolResponses' with the array of FunctionResponse objects.
        result = await chat.sendMessage({
          toolResponses: toolExecutionResponses,
        });
      } else {
        break; // Exit loop if no function calls were handled
      }
    }
    
    return {
      text: result.text,
      accounts: fetchedAccounts,
    };
  } catch (error) {
    console.error("Error sending message to Gemini:", error);
    // Ensure the error message is empathetic and actionable, as per guidelines.
    return { text: "I'm sorry, I encountered a technical issue while processing your request. Please try again or reach out to our customer support for immediate assistance." };
  }
};