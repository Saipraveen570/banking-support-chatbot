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

🧠 System Prompt (Core Logic)

The chatbot uses a robust, enterprise-ready system prompt with:

Response consistency rules

Escalation flows

Safety guardrails

Workflow mapping for all banking intents

(Stored in prompts/system_prompt.txt)

📊 Key Banking Workflows Implemented

Accounts: Balance guidance, statements, IFSC lookup

Cards: Blocking, PIN reset, activation issues, online usage

UPI: Failed transactions, incorrect recipient, verification failure

Loans/EMI: Restructuring request guidance, double debit resolution

KYC: Aadhaar mismatch, mobile number changes, branch escalation

Digital Banking: Login issues, password reset, app crashes

Fraud Alerts: Unauthorized transactions, dispute process

🛡️ Safety & Compliance

This chatbot follows strict safety protocols:

Does not request or store sensitive customer information

Rejects card numbers, CVV, PIN, Aadhaar, OTP patterns

Encourages secure use of official channels

Provides branch/hotline escalation when needed

▶️ How to Run
Using Google AI Studio

Create a new Gemini setup

Choose Gemini 2.5 Flash as the model

Set Response MIME Type: text/plain

Paste the system prompt into System Instructions

Start chatting!

Using backend code (optional)

Refer to your preferred SDK:

@google/generative-ai (Node.js)

google-generativeai (Python)

✅ Future Enhancements

Full API integration with banking sandbox

UI/UX banking dashboard for deployment

Retrieval-Augmented Generation (RAG) for bank-specific policies

Analytics logs for user queries and improvements

Multi-language support

🤝 Contributing

Feel free to fork this project, submit pull requests, or suggest features.

📜 License

This project is open-source under the MIT License.

⭐ Show Your Support

If this project helped you, please star the repository on GitHub!
