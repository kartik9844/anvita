// TypeScript types matching the exact Supabase database schema

export type Admin = {
  id: string;
  email: string;
  name: string | null;
  created_at: string;
  updated_at: string;
};

export type Prompt = {
  id: string;
  name: string;
  prompt: string;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

export type Offer = {
  id: string;
  title: string;
  description: string | null;
  pricing: string | null;
  link: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

export type Code = {
  id: string;
  code: string;
  message: string;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

export type Product = {
  id: string;
  name: string;
  description: string | null;
  offer_id: string | null;
  pricing: string | null;
  link: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

export type Course = {
  id: string;
  name: string;
  description: string | null;
  pricing: string | null;
  starting_date: string | null;
  batch: string | null;
  language: string | null;
  duration: string | null;
  link: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

export type Healer = {
  id: string;
  name: string;
  phone_number: string | null;
  location: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

export type Routing = {
  id: string;
  number: string | null;
  purpose: string | null;
  description: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

export type Message = {
  id: string;
  user_name: string | null;
  user_number: string;
  user_question: string | null;
  anvita_reply: string | null;
  status: string;
  delivered: boolean;
  intent_type: number | null;
  created_at: string;
  updated_at: string;
};

// Contact summary for chat sidebar
export type Contact = {
  user_number: string;
  user_name: string | null;
  last_message: string | null;
  last_message_time: string | null;
  message_count: number;
};

// Dashboard stats
export type DashboardStats = {
  conversationsToday: number;
  messagesToday: number;
  messagesThisMonth: number;
  intentBreakdown: { intent: number; count: number }[];
  recentMessages: Message[];
};

// Generic CRUD config for reusable components
export type TableName =
  | "offers"
  | "codes"
  | "products"
  | "courses"
  | "healers"
  | "prompts"
  | "routing";
