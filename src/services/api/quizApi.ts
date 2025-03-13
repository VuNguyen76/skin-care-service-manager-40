
import api from './index';

export const quizApi = {
  getQuestions: async () => {
    const response = await api.get('/quiz/questions');
    return response.data;
  },
  
  submitAnswers: async (answers: any[]) => {
    const response = await api.post('/quiz/submit', answers);
    return response.data;
  },
  
  // Admin functions
  createQuestion: async (questionData: any) => {
    const response = await api.post('/quiz/questions', questionData);
    return response.data;
  },
  
  updateQuestion: async (id: number, questionData: any) => {
    const response = await api.put(`/quiz/questions/${id}`, questionData);
    return response.data;
  },
  
  deleteQuestion: async (id: number) => {
    const response = await api.delete(`/quiz/questions/${id}`);
    return response.data;
  }
};
