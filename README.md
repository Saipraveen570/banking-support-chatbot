Banking Support Chatbot

A secure, AI-powered Banking Support Chatbot built using Google Gemini 2.5 Flash, designed to provide fast, empathetic, and accurate assistance for a wide range of banking-related queries. This project includes enterprise-grade safety guardrails, escalation flows, and structured conversational logic to ensure reliable and compliant customer support.

🚀 Overview

This chatbot simulates a real banking support assistant, helping customers navigate:

UPI transaction issues

Debit/credit card services

Fraud & suspicious activity alerts

KYC and profile updates

Online/mobile banking problems

Loan & EMI guidance

Account information support

General banking FAQs

The system prompt is engineered to maintain high consistency, security, and empathetic responses, ideal for portfolio display or integration within a banking prototype.

✅ Features

AI-powered natural language understanding powered by Gemini 2.5 Flash

Empathetic and structured responses using a proven response framework

Secure interaction patterns with strict redaction and safety rules

Multi-domain banking workflows

Escalation pathways (App → Website → Hotline → Branch)

Guardrails against sensitive data exposure (OTP, PIN, CVV, Aadhaar, card numbers)

Highly configurable system prompt for production environments

🛠️ Tech Stack

Google Gemini 2.5 Flash (AI model)

Google AI Studio / API integration

Python / Node.js (optional) for backend integration

Frontend: Can be integrated with web/mobile UIs

Version Control: Git & GitHub

📐 Architecture Diagram

Below is a simplified high-level architecture of the Banking Support Chatbot application:

                   ┌──────────────────────────┐
                   │        User Interface     │
                   │ (React + TypeScript App)  │
                   └──────────────┬───────────┘
                                  │
                                  ▼
                     ┌──────────────────────┐
                     │   Chatbot Engine     │
                     │     (App.tsx)        │
                     └──────────────┬───────┘
                                    │
                         User Query │
                                    ▼
                 ┌──────────────────────────────┐
                 │  Service Layer (services/)    │
                 │  - messageService.ts          │
                 │  - apiService.ts              │
                 └──────────────┬───────────────┘
                                │ Processed Query
                                ▼
                   ┌───────────────────────────┐
                   │  Gemini 2.5 Flash (API)   │
                   │  - System Prompt           │
                   │  - Safety Guardrails       │
                   │  - Response Generation     │
                   └──────────────┬────────────┘
                                  │ AI Response
                                  ▼
                     ┌──────────────────────────┐
                     │ Response Formatter Layer │
                     │ (utils/responseFormatter)│
                     └──────────────┬──────────┘
                                  │
                                  ▼
                   ┌──────────────────────────┐
                   │   Display to User        │
                   │   (UI Components)        │
                   └──────────────────────────┘

This architecture ensures:

Clear separation of UI, logic, and backend interaction

Safe, controlled communication with Gemini 2.5 Flash

Scalable structure for adding intents, flows, and features

📁 Project Structure (Actual Repository Structure)
root/
│
├── components/
│   └── ... UI components for chat interface
│
├── services/
│   └── ... API and chatbot service handlers
│
├── App.tsx
├── index.tsx
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── types.ts
├── metadata.json
├── faq.json
├── .gitignore
└── README.md

