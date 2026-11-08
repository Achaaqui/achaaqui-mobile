export type ApiErrorResponse = {
  success: false;
  message: string;
  data: null;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type SignupRequest = LoginRequest & {
  username: string;
};

export type TokenResponse = {
  access_token: string;
  token_type: 'bearer';
};

export type EmailAvailabilityResponse = {
  available: boolean;
};

export type ResearchRequest = {
  prompt: string;
  conversation_id: string;
};

export type ResearchResponse = {
  answer: string;
};

export type ConversationMessage = {
  role: 'user' | 'assistant';
  content: string;
};

export type ConversationResponse = {
  conversation_id: string;
  messages: ConversationMessage[];
};

export type ConversationSummary = {
  id: string;
  title: string;
  updated_at: string;
};

export type ApiResponse<T> = T | ApiErrorResponse;
