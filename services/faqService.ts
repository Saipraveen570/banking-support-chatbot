interface Faq {
  question: string;
  answer: string;
  relatedQuestions?: string[];
}

export interface FaqResult {
  answer: string;
  relatedQuestions: string[];
}

let faqs: Faq[] | null = null;

const loadFaqs = async (): Promise<Faq[]> => {
  if (faqs) {
    return faqs;
  }
  try {
    const response = await fetch('./faq.json');
    if (!response.ok) {
      throw new Error('Failed to load FAQs');
    }
    const data: { faqs: Faq[] } = await response.json();
    faqs = data.faqs;
    return faqs;
  } catch (error) {
    console.error("Error loading FAQs:", error);
    return []; // Return an empty array on failure
  }
};

export const findFaqAnswer = async (userQuestion: string): Promise<FaqResult | null> => {
  const allFaqs = await loadFaqs();
  const normalizedUserQuestion = userQuestion.trim().toLowerCase().replace(/\?$/, '');

  const foundFaq = allFaqs.find(faq => {
    const normalizedFaqQuestion = faq.question.trim().toLowerCase().replace(/\?$/, '');
    return normalizedFaqQuestion === normalizedUserQuestion;
  });

  if (foundFaq) {
    return {
      answer: foundFaq.answer,
      relatedQuestions: foundFaq.relatedQuestions || [],
    };
  }

  return null;
};
