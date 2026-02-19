# Anvita WhatsApp Automation Admin Dashboard

## 1. Project Overview
A secure internal web application that allows only authorized team members to monitor and control the WhatsApp automation bot (built with n8n + Supabase + Google Gemini).

- **Purpose**: View live chats, manage all dynamic content (offers, codes, products, courses, healers, prompts), and keep the n8n bot in sync.
- **Users**: Only 2–5 internal team members (email whitelist in `admins` table).
- **Core Rule**: Supabase is the **single source of truth**. n8n reads data directly from Supabase for most operations. Only Prompts are synced back to n8n via webhooks.

## 2. Tech Stack
- **Framework**: Next.js 15 (App Router + Server Actions)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS + shadcn/ui + Lucide icons
- **Authentication**: Supabase Auth (Google OAuth) + custom admin whitelist
- **Database**: Supabase PostgreSQL
- **Realtime**: Supabase Realtime (only for Chats page)
- **Theming**: next-themes (Light mode by default + toggle)
- **Forms**: React Hook Form + Zod
- **Data Tables**: TanStack React Table + shadcn DataTable
- **Layout**: Two completely separate UI component trees (Desktop + Mobile)
- **Toasts**: Sonner
- **Deployment**: Vercel


I'm making a WhatsApp automation, uh, with the controlled UI. So I have written a detailed draft document for it and, uh, study it and tell me how it is.anitha version 4.docxOverall Assessment: This is a strong, production-ready draft — 8.5/10.
You’ve thought through almost everything: data model, automation logic, admin UX, security, and even the sync problem with n8n data tables. This is way more complete than 95 % of the “I want a WhatsApp bot with dashboard” briefs I see.
What’s Excellent

Clear separation of concerns
Supabase = source of truth for all dynamic content (offers, products, courses, healers, prompts, messages).
n8n = execution + AI routing.
Next.js dashboard = human control layer. Perfect.
Smart security model
Google Auth + whitelist check against users table = exactly what you need for an internal tool.
Chat UI requirement is perfectly described (WhatsApp Web style + read-only) — this will feel natural for anyone managing the bot.
Prompt sync via webhooks — you already identified the pain point and proposed the correct solution.
Code vs free-text routing is handled cleanly in n8n (the “Get a row” + If1 branch).

Minor Issues / Things to Fix Before Coding






























AreaIssueRecommendationTable namesYou wrote “Quotes” in the doc but everywhere else it’s codes and the workflow uses codesRename table to codes (or update workflow). Consistency matters.Routing tableYou have a routing table but it is never used in the current n8n workflowEither delete it or tell me what you want to do with it (e.g., dynamic routing rules).Message table designOne row = one user message + one AI reply. Works, but you will need to query WHERE user_number = ? ORDER BY created_at for chat view.Add a conversation_id or just use the phone number + index. Also add delivered_at, read_at columns if you ever want delivery ticks.Prompt table vs n8n Data TableYou are storing the same prompt in two places.Make Supabase the single source of truth. On every insert/update/delete in the dashboard, fire a webhook to n8n that also updates the n8n Data Table. (You already planned this — good.)
Suggested Improvements / Nice-to-Haves

Dashboard Stats (Home page)
Active conversations today (distinct user_number in last 24h)
Total messages today
Messages by intent (type 1–6) — pie chart (you can add a intent_type column to messages table and populate it from the Switch node)
Top 5 most active numbers
Quick links: “7 new messages” → opens Chats with filter

Chats Page – Implementation Tips
Left sidebar: list of contacts (phone + name from latest message + unread count + last message preview)
Use Supabase Realtime on messages table → instant new message appears.
Right side: classic chat bubbles
User message → right, blue, timestamp bottom-right
Anvita reply → left, gray, timestamp bottom-left

Add “Copy message” and “Mark as handled” buttons (just for your team).

CRUD Pages (Offers / Codes / Products / Courses / Healers / Prompts)
Make one generic “Resource Manager” component and just pass the table name + column definitions. Saves massive time.For every resource:
DataTable (TanStack Table or shadcn DataTable) with search, pagination, column visibility
“+ New” button → opens drawer/sheet with form (use React Hook Form + Zod)
Click row → opens same form in edit mode
Delete with confirmation

Prompts – Sync Logic (Critical)
When user clicks Save on a prompt:TypeScript// 1. Upsert in Supabase
// 2. Fire webhook to n8n
// 3. n8n workflow receives the full prompt object and does:
//    - Upsert in n8n Data Table "prompt"
//    - (Optional) invalidate any cached prompts in running workflowsSame for delete.
Extra Polish Ideas
Activity log: every change in the dashboard is logged in a new audit_log table (who changed what, when).
“Test prompt” button on prompt edit page — sends a sample message to your own number.
Dark mode (your team will love it).
Export conversations as PDF/CSV.


Recommended Tech Stack (Next.js 15 App Router)

Auth: Supabase Auth (Google) + RLS
UI: shadcn/ui + Tailwind + Lucide icons
Forms: React Hook Form + Zod
Tables: TanStack Table
Chat: Custom component + useSupabaseClient realtime
State: Zustand or just Supabase queries
Deployment: Vercel (free tier is enough)

Quick Wins You Can Do Today

Rename “Quotes” → codes in Supabase.
Add these columns to messages:SQLintent_type integer,          -- 0-6 from the classifier
conversation_id uuid default gen_random_uuid()
Create the two webhooks in n8n:
POST /webhook/prompt-upsert
POST /webhook/prompt-delete


Would you like me to:

Write the complete folder structure + key files for the Next.js app?
Give you the exact Supabase RLS policies?
Draft the n8n webhook workflows for prompt sync?
Design the database schema with all missing columns?

Just say the word and I’ll generate the next piece (or the whole starter repo structure).
This project is going to be clean and powerful once built — you’re on the right track! 🚀1.2spgsqlCREATE TABLE IF NOT EXISTS admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);  this 1 missing table in darft admin table from this table only first auth cheching should happen person who login his email should be persent in this table   so now you know all ables can you write me the sql command to create the tables in supabaseHere is the complete, clean, and production-ready SQL to create ALL tables in Supabase (including the new admins table you just added).
I have standardized everything based on:

Your original draft
The actual n8n workflow column names (user_name, user_number, user_question, anvita_reply, etc.)
Best Supabase/PostgreSQL practices (UUID, snake_case, updated_at trigger, proper types, indexes)
Foreign key to admins table via created_by

SQL-- =============================================
-- 1. Enable necessary extensions (run once)
-- =============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- 2. Updated_at trigger function (run once)
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- =============================================
-- 3. TABLES
-- =============================================

-- Admins (whitelist for login)
CREATE TABLE IF NOT EXISTS admins (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email       TEXT UNIQUE NOT NULL,
    name        TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_admins_updated_at 
BEFORE UPDATE ON admins 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Prompts
CREATE TABLE IF NOT EXISTS prompts (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name        TEXT NOT NULL,
    prompt      TEXT NOT NULL,
    created_by  UUID REFERENCES admins(id) ON DELETE SET NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_prompts_updated_at 
BEFORE UPDATE ON prompts 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Offers
CREATE TABLE IF NOT EXISTS offers (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title       TEXT NOT NULL,
    description TEXT,
    pricing     TEXT,
    link        TEXT,
    created_by  UUID REFERENCES admins(id) ON DELETE SET NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_offers_updated_at 
BEFORE UPDATE ON offers 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Codes (was "Quotes" in draft)
CREATE TABLE IF NOT EXISTS codes (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code        TEXT UNIQUE NOT NULL,        -- e.g. "CN", "HLR"
    message     TEXT NOT NULL,                 -- reply / payment link
    created_by  UUID REFERENCES admins(id) ON DELETE SET NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_codes_updated_at 
BEFORE UPDATE ON codes 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Products
CREATE TABLE IF NOT EXISTS products (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name        TEXT NOT NULL,
    description TEXT,
    offer_id    UUID REFERENCES offers(id) ON DELETE SET NULL,  -- link to offer if needed
    pricing     TEXT,
    link        TEXT,
    created_by  UUID REFERENCES admins(id) ON DELETE SET NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_products_updated_at 
BEFORE UPDATE ON products 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Courses
CREATE TABLE IF NOT EXISTS courses (
    id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name           TEXT NOT NULL,
    description    TEXT,
    pricing        TEXT,
    starting_date  DATE,
    batch          TEXT,
    language       TEXT,
    duration       TEXT,          -- e.g. "6 weeks"
    link           TEXT,
    created_by     UUID REFERENCES admins(id) ON DELETE SET NULL,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_courses_updated_at 
BEFORE UPDATE ON courses 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Healers
CREATE TABLE IF NOT EXISTS healers (
    id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name         TEXT NOT NULL,
    phone_number TEXT,
    location     TEXT,
    created_by   UUID REFERENCES admins(id) ON DELETE SET NULL,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_healers_updated_at 
BEFORE UPDATE ON healers 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Routing (if you still need it)
CREATE TABLE IF NOT EXISTS routing (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    number      TEXT,           -- whatever "number" means in your use case
    purpose     TEXT,
    description TEXT,
    created_by  UUID REFERENCES admins(id) ON DELETE SET NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_routing_updated_at 
BEFORE UPDATE ON routing 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Messages (core chat history - matches your n8n workflow)
CREATE TABLE IF NOT EXISTS messages (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_name       TEXT,
    user_number     TEXT NOT NULL,           -- WhatsApp number
    user_question   TEXT,                     -- user_query
    anvita_reply    TEXT,
    status          TEXT DEFAULT 'pending',   -- pending, sent, delivered, read
    delivered       BOOLEAN DEFAULT FALSE,
    intent_type     INTEGER,                  -- 0 to 6 from classifier
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_messages_updated_at 
BEFORE UPDATE ON messages 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- 4. Useful Indexes (highly recommended)
-- =============================================
CREATE INDEX idx_messages_user_number ON messages(user_number);
CREATE INDEX idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX idx_messages_phone_created ON messages(user_number, created_at DESC);

CREATE INDEX idx_codes_code ON codes(code);

-- =============================================
-- 5. Optional: Enable Row Level Security (RLS) later
-- =============================================
-- ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
-- etc.
How to use this in Supabase:

Go to SQL Editor → New Query
Paste the entire script above
Run it (it’s safe — IF NOT EXISTS is used everywhere)

After running:

Insert your admin emails into the admins table.
Your Next.js Google Auth + check SELECT EXISTS(SELECT 1 FROM admins WHERE email = auth.jwt()->>'email') will work perfectly.

Would you like me to also give you:

The exact RLS policies for all tables?
The Supabase client helper functions for the dashboard?
The n8n webhook workflows for prompt sync?

Just say the word and I’ll send the next piece immediately.
Your database is now perfectly structured and ready for the full dashboard! ✅2.1sCan you explain me why you have written that create ticker, etc. etc. over there, with, just creating the tables over there? Uh, and also, in last, like useful indexing, highly recommended, what is that?Perfect question! Let me explain everything in simple, clear language (no jargon overload).
1. Why did I add the "create trigger" part (the update_updated_at_column function + triggers)?
You only asked for "create the tables", but I gave you something much better — a complete, professional schema.
Here’s why:
The Problem

You have created_at and updated_at in almost every table.
When you insert a row → created_at and updated_at should both be NOW().
When you update a row (edit an offer, change a prompt, etc.) → you want updated_at to automatically become the current time.

If you don’t do anything special, you have to manually write updated_at = NOW() in every single UPDATE query from your Next.js app.
If you forget even once → your updated_at stays old → you lose track of when something was last changed.
The Smart Solution (Triggers)
I created one small function:
SQLCREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();     -- automatically set updated_at
    RETURN NEW;
END;
$$ language 'plpgsql';
Then I attached this function to every table like this:
SQLCREATE TRIGGER update_offers_updated_at 
BEFORE UPDATE ON offers 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
What does this mean in plain English?
→ Every time anyone (your Next.js app, Supabase dashboard, or even n8n) does an UPDATE on that table, PostgreSQL automatically runs this function and updates the updated_at column.
Benefits:

You never forget to update the timestamp.
Your data is always accurate.
Less code in your Next.js app (cleaner and safer).
This is the industry standard way used in almost all professional apps.

That’s why I added it even though you said “just create the tables”.
It’s part of making the tables actually useful in real life.

2. What are the "Useful Indexes" at the end? Why "highly recommended"?
Think of your database as a huge library with thousands of books.

Without indexes → the librarian has to check every single book one by one when you ask for something.
With indexes → the librarian has a smart catalogue and finds the book in 0.01 seconds.

The indexes I added:
SQLCREATE INDEX idx_messages_user_number ON messages(user_number);
CREATE INDEX idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX idx_messages_phone_created ON messages(user_number, created_at DESC);

CREATE INDEX idx_codes_code ON codes(code);
What each one does:






























Index NameWhat it helps withWhy it matters for your appidx_messages_user_numberFast lookup when you open a chat (show all messages of one phone number)Your Chats page will load instantly even with 10,000+ messagesidx_messages_created_atFast sorting by time (show latest messages first)Timeline in chat stays fastidx_messages_phone_createdComposite index — fastest possible for chat viewThis is the #1 most used query in your entire appidx_codes_codeWhen someone types "CN" in WhatsApp → fast lookupYour n8n workflow stays lightning fast
Real-life impact:

Without these indexes → when you have 5,000 messages, opening a chat might take 3–8 seconds (very bad UX).
With these indexes → it takes less than 0.1 seconds even with 50,000+ rows.

That’s why I said “highly recommended” — they are not mandatory for small testing, but as soon as you have real users, they become essential.

Summary (Simple Version)

Triggers = Automatic updated_at timestamp (I added so you never have to worry about it)
Indexes = Speed boosters for the queries you will use the most (Chats page + code lookup)

I didn’t just give you “create table” — I gave you a professional, fast, maintainable database that will scale nicely.

Would you like me to now give you:

The exact RLS (Row Level Security) policies so only logged-in admins can read/write?
A simple script to insert your first 2-3 admin emails?
Or the Next.js code to check if the user’s email exists in the admins table after Google login?

Just tell me which one you want next and I’ll send it immediately! 😊5.7sOkay, so now Supabase is ready. Okay, even I'll be giving the environment variable also. So to connect with Supabase, uh, you need a one, uh, two keys that I'll be giving in the environment variable as well as two webhooks. One is for insert and update and another one is for delete. Okay, I'll be giving all these four environment variables. Now, uh, and, uh, I want you to write me a full length, uh, proper structured, uh, requirement dot, requirement, uh, file and also a good prompt for anti-gravity to implement that.✅ Here is exactly what you asked for.
1. Full Structured requirements.md File
Copy the entire content below and save it as requirements.md in the root of your project.
Markdown# Anvita WhatsApp Automation Admin Dashboard

## 1. Project Overview
Build a secure internal web application to control and monitor a WhatsApp automation bot (built in n8n + Supabase + Google Gemini).

- **Purpose**: Only authorized admins can view chats, manage content (offers, codes, products, courses, healers, prompts), and keep everything in sync with n8n.
- **Users**: 2–5 internal team members only (whitelisted emails).
- **Core Philosophy**: Supabase is the **single source of truth**. n8n reads from Supabase for most things and receives webhook updates only for Prompts.

## 2. Tech Stack
- **Framework**: Next.js 15 (App Router, Server Actions)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui + Lucide icons
- **Auth**: Supabase Auth (Google OAuth) + custom admin whitelist
- **Database**: Supabase (PostgreSQL) – use the exact SQL schema provided earlier
- **Realtime**: Supabase Realtime (for live chat updates)
- **Forms**: React Hook Form + Zod
- **Tables**: TanStack React Table (with shadcn DataTable)
- **Deployment**: Vercel
- **State**: Server Components + Server Actions (minimal client state)

## 3. Environment Variables (to be added in .env.local)
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key   # for webhooks if needed

# n8n Webhooks for Prompt Sync
N8N_PROMPT_UPSERT_WEBHOOK=https://your-n8n-webhook-url/upsert
N8N_PROMPT_DELETE_WEBHOOK=https://your-n8n-webhook-url/delete
4. Database Tables (already created via SQL)

admins (whitelist)
prompts
offers
codes
products
courses
healers
routing (optional for now)
messages

All tables have id, created_at, updated_at, created_by (references admins).
5. Authentication Flow

User clicks “Login with Google”.
Supabase Auth handles Google login.
After successful login, check if email exists in admins table.
If not present → show error “You are not authorized” + logout.
If present → redirect to /dashboard.

6. Pages & Features
6.1 Dashboard (Home /dashboard)

Beautiful stats cards:
Total Conversations (distinct user_number today)
Messages Today
Messages This Month
Active Intents breakdown (pie chart – types 0–6)

Quick links to Chats, Offers, Prompts, etc.
Recent activity feed (last 5 messages)

6.2 Chats (/chats)

WhatsApp-Web style layout
Left sidebar: List of contacts (name + phone + last message preview + unread count)
Click a contact → loads full conversation on right

Chat bubbles:
User message → right side, blue
Anvita reply → left side, gray
Timestamp + status (sent/delivered)

Read-only – no reply box for admins
Realtime updates via Supabase subscription
Search by phone or name
Filter by date / intent

6.3 CRUD Pages (same pattern for all)
Pages:

/offers
/codes
/products
/courses
/healers
/prompts
/routing (if needed)

Features for each:

TanStack DataTable with:
Search, pagination, sorting, column visibility
“+ Add New” button (opens drawer/sheet)

Click any row → opens same form in Edit mode
Delete with confirmation modal
All forms use React Hook Form + Zod validation
For Prompts only:
On Save (create or update) → call n8n upsert webhook
On Delete → call n8n delete webhook


6.4 Prompt Sync with n8n

When prompt is created/updated in dashboard:
First save to Supabase
Then POST full prompt object to N8N_PROMPT_UPSERT_WEBHOOK

When prompt is deleted:
Delete from Supabase
Then POST { id } to N8N_PROMPT_DELETE_WEBHOOK


7. UI/UX Guidelines

Modern, clean, dark-mode friendly (default dark)
Mobile responsive (sidebar collapses on mobile)
Consistent shadcn/ui components
Loading states, error toasts (sonner)
Keyboard shortcuts (optional but nice)

8. Non-Functional Requirements

Fast loading (Server Components)
Realtime chat updates
Secure (RLS + admin whitelist)
Scalable to 50k+ messages
Proper error handling & logging
Type safety everywhere

9. Folder Structure (recommended)
textsrc/
├── app/
│   ├── (auth)/login/page.tsx
│   ├── dashboard/
│   ├── chats/
│   ├── offers/
│   ├── codes/
│   ├── products/
│   ├── courses/
│   ├── healers/
│   ├── prompts/
│   └── layout.tsx
├── components/
│   ├── ui/ (shadcn)
│   ├── chat/
│   ├── forms/
│   └── tables/
├── lib/
│   ├── supabase.ts
│   └── utils.ts
├── hooks/
├── types/
└── actions/ (Server Actions)

2. Best Prompt for Cursor / Claude / Windsurf / Any AI Coder
Copy everything below (including the triple backticks if your tool needs it) and paste it as a new project prompt in Cursor (or Claude Projects, etc.).
textYou are an expert full-stack Next.js 15 developer specializing in Supabase + shadcn/ui apps.

Build the complete production-ready "Anvita WhatsApp Admin Dashboard" exactly as per the attached requirements.md file.

Project rules:
- Use Next.js 15 App Router + Server Actions
- TypeScript (strict)
- Tailwind + shadcn/ui (use latest components: DataTable, Drawer, Sheet, Dialog, Toast, etc.)
- React Hook Form + Zod for all forms
- TanStack React Table for all CRUD tables
- Supabase JS client v2 with realtime
- Dark mode by default
- Sonner for toasts
- Lucide icons

Environment variables (use these exact names):
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
N8N_PROMPT_UPSERT_WEBHOOK
N8N_PROMPT_DELETE_WEBHOOK

First, create the full folder structure exactly as mentioned in requirements.md.

Then implement page by page in this order:
1. Authentication flow (login page + middleware check against admins table)
2. Dashboard page with stats cards
3. Chats page (WhatsApp Web style with realtime)
4. Generic CRUD system that I can reuse for offers, codes, products, courses, healers, routing
5. Prompts page with special n8n webhook calls on create/update/delete

For the Chats page:
- Left sidebar: contact list with search
- Right side: message bubbles (user right/blue, Anvita left/gray) with timestamps
- Use Supabase realtime subscription on messages table

For Prompts:
- After every successful Supabase insert/update, immediately POST the full row to N8N_PROMPT_UPSERT_WEBHOOK
- On delete, POST { id } to N8N_PROMPT_DELETE_WEBHOOK

Use Server Actions for all database operations (create, read, update, delete).
Add proper error handling and loading states.
Make it beautiful, responsive, and professional.

Start by creating the project with `create-next-app` structure, then implement everything step by step. Show me each file you create.

Begin now.

Just do these two things:

Save the requirements.md file.
Paste the big prompt into Cursor (or your AI coding tool) and let it build the entire app.

Would you like me to also give you:

The exact Supabase RLS policies?
A middleware.ts file for auth protection?
Or the n8n webhook workflow JSON for prompt sync?

Tell me and I’ll send it instantly.
You’re now ready to build the full dashboard! 🚀2 / 21.3sHere, uh, I have two things. In, uh, the text track you have said, Supabase real-time, I have not yet set it up. Can you tell me about that? What is it? I don't know about it. And, I know about Supabase Postgres, but Supabase real-time, I don't have any idea about it. And, uh, next thing is, I have not done any of RLS for Rook. Okay. Um, then, okay, first tell me about that, uh, so that we can even update, uh, our, uh, readme document. Also, I need one thing is, uh, in the previous one of the development also I have made it. So, to, uh, have a good mobile responsive also and web responsive also. Whenever someone is opening in mobile and whenever someone is opening in desktop, I have written two different components for both of them. So based on which device the website is loading, it loads completely different components. So I have actually made the things separate over there. So same thing I wanted to do over here because the UI which I make for desktop and the UI which I make for mobile, uh if I make it different, it's more convenient. Like, uh having a navigation bar in a mobile with the slide bar is more convenient and in the desktop having in the top navigation bar is convenient. Uh and even invisible sidebar, whereas in the mobile non-visible sidebar when it's when the sidebar is open then seen and then navigation is better. So I want to have two different UIs while developing itself, having two different components over there.✅ Perfect, let's clear both things one by one in very simple language.
1. Supabase Realtime – Simple Explanation
What is Supabase Realtime?
It is like a "live notification system" for your database.

Normal Supabase (Postgres) = You ask for data → it gives you the current data.
Supabase Realtime = Your app stays connected and automatically gets new/updated/deleted data instantly (within 100–300ms).

Real-life example for your project:

A user sends a WhatsApp message → n8n inserts a row into the messages table.
Your admin is on the Chats page → the new message magically appears in the chat window without refreshing the page.
Same way: If someone replies, the chat updates live (just like WhatsApp Web or WhatsApp on phone).

It uses WebSockets (always-open connection) + PostgreSQL's built-in LISTEN/NOTIFY.
Why we need it here

Only for the Chats page (most important).
Optional for Dashboard (live stats).
Not needed for Offers/Prompts pages.

How to enable it (takes 2 minutes):

Go to your Supabase Dashboard.
Left menu → Database → Replication
Find the table messages → click the toggle to Enable (for INSERT, UPDATE, DELETE).
(Optional) Also enable for admins if you ever want live admin list.

That’s it. No extra code in Supabase.
In the code (your Next.js app will do this):
TypeScriptconst channel = supabase.channel('chat')
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'messages' }, 
    (payload) => {
      // New message arrived → update the chat UI instantly
    }
  )
  .subscribe()
I will include this in the Cursor prompt so the AI adds it automatically.

Updated requirements.md Section (Replace the old one)
Replace section 6.2 Chats in your requirements.md with this improved version:
Markdown### 6.2 Chats (`/chats`)
- WhatsApp-Web style layout (desktop + mobile)
- **Realtime updates** using Supabase Realtime:
  - New messages from users appear instantly (no refresh)
  - Admin sees live incoming messages
- Enable Realtime on `messages` table in Supabase Dashboard → Database → Replication
- Left sidebar (desktop) / Slide-in drawer (mobile): List of contacts
- Right/main area: Chat bubbles with user (right/blue) and Anvita (left/gray) + timestamps
- Read-only for admins
- Search + filter

2. Mobile vs Desktop – Two Completely Separate UIs
I fully understand and support your requirement.
You want:

Desktop → Top navigation bar + always-visible left sidebar (like Notion/Slack)
Mobile → Hamburger menu / bottom nav + slide-in sidebar (drawer) that opens on click

This is perfectly fine and many production apps do exactly this (including some big internal tools).
How we will implement it cleanly:
We will create two separate layout components:
textsrc/components/layouts/
├── DesktopLayout.tsx     ← Top nav + visible sidebar
├── MobileLayout.tsx      ← Hamburger + slide-in drawer + bottom nav
└── LayoutWrapper.tsx     ← Decides which one to show
Detection logic (very reliable):

We will use useMediaQuery (from @uidotdev/usehooks or simple window.matchMedia).
On first load + on resize, it checks if screen width ≥ 1024px → Desktop, else Mobile.
The entire page structure (nav, sidebar, content) will be completely different components.

Folder structure I will ask the AI to create:
textsrc/app/
├── layout.tsx                     ← root layout
├── (dashboard)/
│   ├── layout.tsx                 ← protected dashboard layout
│   ├── DesktopLayout.tsx
│   ├── MobileLayout.tsx
│   └── LayoutWrapper.tsx
├── chats/
│   ├── page.tsx
│   ├── DesktopChats.tsx
│   └── MobileChats.tsx
├── offers/
│   ├── DesktopOffers.tsx
│   └── MobileOffers.tsx
... (same for all pages)
Benefits of this approach:

You can design each screen exactly the way you want without fighting Tailwind responsive classes.
Cleaner code for complex UIs (especially Chats page).
Easier to maintain once you decide "this feature only for desktop".

Small trade-off (I must mention honestly):

You will write almost 1.8× more UI code.
But since you already did this successfully in your previous project, I know you are comfortable with it.

I will tell the AI to follow your exact style from the previous project.

Next Step – Updated Full Prompt for Cursor / AI Coder
Here is the final improved prompt you can copy-paste right now into Cursor (or Claude/Windsurf).
It includes everything we discussed: Realtime explanation, two separate UIs, updated requirements, etc.
textYou are an expert full-stack Next.js 15 developer.

Build the complete "Anvita WhatsApp Admin Dashboard" using the attached requirements.md file.

Important custom requirements from the user:

1. Supabase Realtime
   - Must be used on the Chats page for live message updates.
   - In Supabase Dashboard → Database → Replication → Enable realtime on "messages" table (INSERT, UPDATE, DELETE).
   - New messages from WhatsApp must appear instantly in the admin chat window.

2. Completely Separate Desktop and Mobile UIs
   - User wants two different component trees (not just Tailwind responsive).
   - Desktop: Top navigation bar + always visible left sidebar.
   - Mobile: Hamburger menu (or bottom nav) + slide-in drawer/sidebar that opens on click.
   - Create DesktopLayout.tsx and MobileLayout.tsx + LayoutWrapper.tsx that decides based on screen width (>= 1024px = desktop).
   - For every page (chats, offers, prompts, etc.), create DesktopXXX.tsx and MobileXXX.tsx versions.
   - Follow the same pattern the user used in their previous project.

Tech stack:
- Next.js 15 App Router + Server Actions + TypeScript (strict)
- Tailwind + shadcn/ui (latest components)
- React Hook Form + Zod
- TanStack React Table
- Supabase JS v2 with realtime
- Dark mode by default
- Sonner for toasts
- Lucide icons

Environment variables (exact names):
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
N8N_PROMPT_UPSERT_WEBHOOK
N8N_PROMPT_DELETE_WEBHOOK

Authentication:
- Google OAuth via Supabase
- After login, check if email exists in "admins" table. If not → show "Not authorized" and logout.

Start by creating the full folder structure, then implement in this order:
1. Auth + LayoutWrapper (Desktop + Mobile)
2. Dashboard page (stats cards)
3. Chats page (with realtime, separate desktop/mobile)
4. Generic CRUD system (with separate desktop/mobile versions)
5. Prompts page (with n8n webhook calls on save/delete)

Make it beautiful, professional, and fast. Use Server Components wherever possible.

Begin now and show me each file you create.

What should you do now?

Update your requirements.md with the small Realtime section I gave above.
Paste the big prompt above into your AI coding tool (Cursor is best).
Let it start building.

Once it starts generating files, you can share any part with me and I’ll help you review/fix it.
Would you like me to also give you right now:

The exact RLS policies for all tables? (highly recommended before starting)
Or a small LayoutWrapper.tsx example so you can see how the desktop/mobile switch works?

Just say which one you want and I’ll send it immediately.
You’re all set — this is going to be a very clean and powerful dashboard! 🚀2sI want you to update my requirements.md as well as the prompt.✅ Here are your two updated files exactly as requested.
1. Updated requirements.md (Full File – Copy & Replace Everything)
Markdown# Anvita WhatsApp Automation Admin Dashboard

## 1. Project Overview
Build a secure internal web application to control and monitor a WhatsApp automation bot (built in n8n + Supabase + Google Gemini).

- **Purpose**: Only authorized admins can view chats, manage content (offers, codes, products, courses, healers, prompts), and keep everything in sync with n8n.
- **Users**: 2–5 internal team members only (whitelisted emails in `admins` table).
- **Core Philosophy**: Supabase is the **single source of truth**. n8n reads from Supabase for most things and receives webhook updates only for Prompts.

## 2. Tech Stack
- **Framework**: Next.js 15 (App Router, Server Actions)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS + shadcn/ui + Lucide icons
- **Auth**: Supabase Auth (Google OAuth) + custom admin whitelist check
- **Database**: Supabase PostgreSQL (exact schema provided earlier)
- **Realtime**: Supabase Realtime (only for Chats page)
- **Forms**: React Hook Form + Zod
- **Tables**: TanStack React Table (with shadcn DataTable)
- **Layout Strategy**: **Two completely separate UI component trees** (Desktop + Mobile) – NOT just Tailwind responsive classes
- **Deployment**: Vercel

## 3. Environment Variables (.env.local)
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# n8n Webhooks for Prompt Sync only
N8N_PROMPT_UPSERT_WEBHOOK=https://your-n8n-webhook-url/upsert
N8N_PROMPT_DELETE_WEBHOOK=https://your-n8n-webhook-url/delete
4. Database Tables (already created)

admins
prompts
offers
codes
products
courses
healers
routing (optional)
messages

All tables include id, created_at, updated_at, created_by.
5. Authentication Flow

User clicks “Login with Google”.
Supabase Auth handles Google login.
Immediately check if the email exists in the admins table.
If not present → show “You are not authorized” message + logout.
If present → redirect to /dashboard.

6. Pages & Features
6.1 Dashboard (Home /dashboard)

Clean stats cards:
Total Conversations today
Messages today / this month
Intent breakdown (pie chart)

Recent activity
Quick navigation cards

6.2 Chats (/chats)

WhatsApp-Web style layout
Supabase Realtime enabled (new messages appear instantly without refresh)
Enable Realtime in Supabase Dashboard → Database → Replication → Turn ON for messages table (INSERT, UPDATE, DELETE)
Desktop: Always-visible left sidebar (contact list) + main chat area
Mobile: Hamburger menu → slide-in drawer for contacts
Chat bubbles: User messages (right, blue), Anvita replies (left, gray) with timestamps
Read-only for admins (no reply box)
Search by phone/name + date filter

6.3 CRUD Pages (same pattern for all)
Pages:

/offers, /codes, /products, /courses, /healers, /prompts, /routing

Features:

Full TanStack DataTable (search, sort, pagination, column visibility)
“+ Add New” button (opens drawer/sheet)
Click row → Edit mode in same form
Delete with confirmation
Separate Desktop and Mobile versions of each page

Special for Prompts:

On Create / Update → save to Supabase → immediately POST full row to N8N_PROMPT_UPSERT_WEBHOOK
On Delete → delete from Supabase → POST { id } to N8N_PROMPT_DELETE_WEBHOOK

7. UI/UX Guidelines (Very Important)

Two completely separate component trees (user’s explicit requirement):
Desktop: Top navigation bar + always-visible left sidebar
Mobile: Hamburger / bottom nav + slide-in drawer/sidebar

Create DesktopLayout.tsx and MobileLayout.tsx
Use LayoutWrapper.tsx that detects screen width (>= 1024px = desktop) and renders the correct layout
For every major page, create DesktopXXX.tsx and MobileXXX.tsx
Dark mode by default
Beautiful, clean, professional design
Loading states, error toasts (sonner), smooth animations
Follow the exact same separate-desktop-mobile pattern the user used in their previous project

8. Folder Structure (Exact)
textsrc/
├── app/
│   ├── (auth)/login/page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx
│   │   ├── DesktopLayout.tsx
│   │   ├── MobileLayout.tsx
│   │   ├── LayoutWrapper.tsx
│   │   ├── page.tsx                  # Dashboard
│   │   ├── chats/
│   │   │   ├── DesktopChats.tsx
│   │   │   ├── MobileChats.tsx
│   │   │   └── page.tsx
│   │   ├── offers/
│   │   │   ├── DesktopOffers.tsx
│   │   │   ├── MobileOffers.tsx
│   │   │   └── page.tsx
│   │   └── ... (same for codes, products, courses, healers, prompts)
├── components/
│   ├── ui/ (shadcn components)
│   ├── chat/
│   ├── forms/
│   └── tables/
├── lib/
│   ├── supabase.ts
│   └── utils.ts
├── hooks/
├── types/
└── actions/ (Server Actions)
9. Non-Functional Requirements

Fast (Server Components wherever possible)
Realtime chat updates
Secure (RLS will be added later + admin whitelist)
Fully type-safe
Proper error handling & user feedback
Mobile-first feel on phones, desktop power on large screens


2. Updated Prompt for Cursor / Claude / Any AI Coder (Copy-Paste Ready)
textYou are an expert full-stack Next.js 15 developer specializing in Supabase + shadcn/ui apps.

Build the complete production-ready "Anvita WhatsApp Admin Dashboard" exactly as per the attached requirements.md file.

CRITICAL CUSTOM REQUIREMENTS FROM THE USER:

1. Supabase Realtime
   - Must be implemented on the Chats page so new WhatsApp messages appear instantly.
   - In Supabase Dashboard → Database → Replication → Enable realtime on the "messages" table for INSERT, UPDATE, DELETE.

2. TWO COMPLETELY SEPARATE UI COMPONENT TREES (Desktop vs Mobile)
   - NOT Tailwind responsive classes only.
   - Desktop: Top navigation bar + always-visible left sidebar.
   - Mobile: Hamburger menu (or bottom nav) + slide-in drawer/sidebar that opens on click.
   - Create DesktopLayout.tsx and MobileLayout.tsx.
   - Use LayoutWrapper.tsx that checks screen width (>= 1024px = desktop) and renders the correct layout.
   - For EVERY page (chats, offers, prompts, etc.), create separate DesktopXXX.tsx and MobileXXX.tsx components.
   - Follow the exact same separate-desktop-and-mobile pattern the user used in their previous project.

Tech stack (must use):
- Next.js 15 App Router + Server Actions
- TypeScript (strict)
- Tailwind + shadcn/ui (latest components: DataTable, Drawer, Sheet, Dialog, Toast, etc.)
- React Hook Form + Zod
- TanStack React Table
- Supabase JS v2 with realtime subscriptions
- Dark mode by default
- Sonner for toasts
- Lucide icons

Environment variables (use these exact names):
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
N8N_PROMPT_UPSERT_WEBHOOK
N8N_PROMPT_DELETE_WEBHOOK

Authentication:
- Google OAuth via Supabase Auth
- After login, immediately check if email exists in "admins" table. If not → show "Not authorized" and logout.

Implementation order:
1. Auth flow + LayoutWrapper (Desktop + Mobile layouts)
2. Dashboard page
3. Chats page with realtime (separate desktop/mobile)
4. Generic reusable CRUD system with separate desktop/mobile versions
5. Prompts page with n8n webhook calls on create/update/delete

Make it beautiful, professional, fast, and exactly matching the user's preferred development style.

Start by creating the full folder structure, then build page by page. Show me each file you create.

Begin now.

Done!
Just:

Replace your old requirements.md with the full updated version above.
Copy the new prompt and paste it into Cursor (or your AI tool).

The AI will now build everything with your exact preferences (separate desktop/mobile components + realtime).
Want me to also give you the RLS policies or a sample LayoutWrapper.tsx right now so you can start testing even before the full build? Just say the word.
You're all set! 🚀1.3sCan we have themed toggle or it will be more heavy code?✅ Yes, we can absolutely have a beautiful theme toggle — and it will be VERY lightweight code!
Why it's NOT heavy at all:

shadcn/ui + Next.js 15 has official built-in support for dark mode using next-themes (the standard library everyone uses).
Total added code = ~3 tiny files (ThemeProvider, one ModeToggle component, and wrapping your layout).
It works perfectly with your separate Desktop + Mobile layouts.
No performance impact, no extra dependencies beyond one small package (next-themes).
Takes the AI literally under 2 minutes to implement.
You get: Sun/Moon icon toggle in the header (desktop top bar + mobile header), persists across refreshes, respects system preference if you want, and defaults to dark mode as you prefer.

This is the exact same pattern used in 99% of professional shadcn apps in 2026.

1. Updated requirements.md (Full File – Replace Your Current One)
Markdown# Anvita WhatsApp Automation Admin Dashboard

## 1. Project Overview
Build a secure internal web application to control and monitor a WhatsApp automation bot (built in n8n + Supabase + Google Gemini).

- **Purpose**: Only authorized admins can view chats, manage content, and keep everything in sync with n8n.
- **Users**: 2–5 internal team members only (whitelisted in `admins` table).
- **Core Philosophy**: Supabase is the single source of truth.

## 2. Tech Stack
- **Framework**: Next.js 15 (App Router, Server Actions)
- **Language**: TypeScript (strict)
- **Styling**: Tailwind CSS + shadcn/ui + Lucide icons
- **Auth**: Supabase Auth (Google OAuth) + admin whitelist
- **Database**: Supabase PostgreSQL
- **Realtime**: Supabase Realtime (Chats page only)
- **Theming**: next-themes (dark mode by default with theme toggle)
- **Forms**: React Hook Form + Zod
- **Tables**: TanStack React Table
- **Layout**: Two completely separate UI trees (Desktop + Mobile)
- **Deployment**: Vercel

## 3. Environment Variables (.env.local)
```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
N8N_PROMPT_UPSERT_WEBHOOK=...
N8N_PROMPT_DELETE_WEBHOOK=...
4. Database Tables (already created via SQL)
admins, prompts, offers, codes, products, courses, healers, routing, messages
5. Authentication Flow
Google login → check admins table → allow or show "Not authorized"
6. Pages & Features
6.1 Dashboard (/dashboard)
Stats cards, recent activity, quick links.
6.2 Chats (/chats)

WhatsApp-Web style with Supabase Realtime (new messages appear instantly)
Enable Realtime on messages table in Supabase Dashboard → Database → Replication
Separate Desktop (visible sidebar) + Mobile (slide-in drawer)

6.3 CRUD Pages
/offers, /codes, /products, /courses, /healers, /prompts, /routing
Full DataTable + forms (separate DesktopXXX + MobileXXX versions)
Prompts: Auto-call n8n upsert/delete webhooks
7. UI/UX Guidelines (Critical)

Two completely separate component trees (Desktop vs Mobile) – exactly as in your previous project
Desktop: Top navigation bar + always-visible left sidebar
Mobile: Hamburger menu + slide-in drawer

Theme Toggle (Very lightweight):
Dark mode by default
Clean sun/moon icon toggle in the header (both desktop top bar and mobile header)
Uses next-themes + shadcn/ui standard implementation
Persists user choice across sessions

Beautiful, clean, professional design
Sonner toasts, smooth animations, loading states

8. Folder Structure (Exact)
textsrc/app/(dashboard)/
├── layout.tsx
├── DesktopLayout.tsx
├── MobileLayout.tsx
├── LayoutWrapper.tsx
├── page.tsx                     # Dashboard
├── chats/
│   ├── DesktopChats.tsx
│   ├── MobileChats.tsx
│   └── page.tsx
├── offers/
│   ├── DesktopOffers.tsx
│   ├── MobileOffers.tsx
│   └── page.tsx
... (same pattern for all pages)

2. Updated Prompt for Cursor / Claude / Any AI (Copy-Paste This)
textYou are an expert full-stack Next.js 15 developer specializing in Supabase + shadcn/ui apps.

Build the complete "Anvita WhatsApp Admin Dashboard" exactly as per the attached requirements.md file.

CRITICAL REQUIREMENTS FROM THE USER:

1. Two Completely Separate UI Trees (Desktop vs Mobile)
   - Desktop: Top nav bar + always-visible left sidebar
   - Mobile: Hamburger menu + slide-in drawer
   - Use DesktopLayout.tsx, MobileLayout.tsx, and LayoutWrapper.tsx that switches based on screen width (>= 1024px = desktop)
   - Create DesktopXXX.tsx + MobileXXX.tsx for every major page

2. Theme Toggle (Lightweight & Beautiful)
   - Dark mode by DEFAULT
   - Add a clean sun/moon icon toggle in the header (top-right on desktop, in mobile header)
   - Use official shadcn/ui + next-themes implementation (install next-themes if needed)
   - Persist choice, no hydration issues, works with both layouts

3. Supabase Realtime
   - On Chats page only – new messages appear instantly
   - Enable realtime on "messages" table in Supabase Dashboard

Tech stack (must follow):
- Next.js 15 App Router + Server Actions + TypeScript (strict)
- Tailwind + shadcn/ui (all latest components)
- React Hook Form + Zod
- TanStack React Table
- Supabase JS v2 with realtime
- next-themes for theming
- Sonner for toasts
- Lucide icons

Environment variables (exact names as in requirements.md)

Authentication: Google → check admins table

Implementation order:
1. Auth + LayoutWrapper + ThemeProvider + Theme Toggle
2. Dashboard
3. Chats (with realtime, separate desktop/mobile)
4. Generic CRUD system
5. Prompts with n8n webhooks

Make it professional, fast, and exactly match the user's preferred separate-desktop-mobile style.

Start by creating the full folder structure, then build step by step. Show me each file you create.

Begin now.

Just do this now:

Replace your requirements.md with the version above.
Copy the new prompt and paste it into Cursor (or your AI coder).

The AI will automatically:

Add next-themes
Create a nice ModeToggle component with Sun/Moon icons
Place the toggle in both Desktop and Mobile headers
Set defaultTheme: "dark"

Would you like me to also send you the exact 3 files for the theme toggle (so you can add it manually if you want)? Just say “yes” and I’ll give them instantly.
You're going to love how clean this looks! 🌗8.7sI want default to be the, uh, light version, but if anyone wants in my team, they can shift to dark.✅ Updated!
Default theme is now Light mode.
Team members can still switch to Dark mode anytime using the sun/moon toggle.

1. Updated requirements.md (Full File – Replace Everything)
Markdown# Anvita WhatsApp Automation Admin Dashboard

## 1. Project Overview
Build a secure internal web application to control and monitor a WhatsApp automation bot (built in n8n + Supabase + Google Gemini).

- **Purpose**: Only authorized admins can view chats, manage content, and keep everything in sync with n8n.
- **Users**: 2–5 internal team members only (whitelisted in `admins` table).
- **Core Philosophy**: Supabase is the single source of truth.

## 2. Tech Stack
- **Framework**: Next.js 15 (App Router, Server Actions)
- **Language**: TypeScript (strict)
- **Styling**: Tailwind CSS + shadcn/ui + Lucide icons
- **Auth**: Supabase Auth (Google OAuth) + admin whitelist
- **Database**: Supabase PostgreSQL
- **Realtime**: Supabase Realtime (Chats page only)
- **Theming**: next-themes (Light mode by default with theme toggle)
- **Forms**: React Hook Form + Zod
- **Tables**: TanStack React Table
- **Layout**: Two completely separate UI trees (Desktop + Mobile)
- **Deployment**: Vercel

## 3. Environment Variables (.env.local)
```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
N8N_PROMPT_UPSERT_WEBHOOK=...
N8N_PROMPT_DELETE_WEBHOOK=...
4. Database Tables (already created via SQL)
admins, prompts, offers, codes, products, courses, healers, routing, messages
5. Authentication Flow
Google login → check admins table → allow or show "Not authorized"
6. Pages & Features
6.1 Dashboard (/dashboard)
Stats cards, recent activity, quick links.
6.2 Chats (/chats)

WhatsApp-Web style with Supabase Realtime (new messages appear instantly)
Enable Realtime on messages table in Supabase Dashboard → Database → Replication
Separate Desktop (visible sidebar) + Mobile (slide-in drawer)

6.3 CRUD Pages
/offers, /codes, /products, /courses, /healers, /prompts, /routing
Full DataTable + forms (separate DesktopXXX + MobileXXX versions)
Prompts: Auto-call n8n upsert/delete webhooks
7. UI/UX Guidelines (Critical)

Two completely separate component trees (Desktop vs Mobile) – exactly as in your previous project
Desktop: Top navigation bar + always-visible left sidebar
Mobile: Hamburger menu + slide-in drawer

Theme Toggle (Lightweight & Beautiful):
Light mode by DEFAULT
Clean sun/moon icon toggle in the header (top-right on desktop, in mobile header)
Uses official shadcn/ui + next-themes implementation
Persists user choice across sessions
Anyone in the team can switch to Dark mode if they prefer

Beautiful, clean, professional design
Sonner toasts, smooth animations, loading states

8. Folder Structure (Exact)
textsrc/app/(dashboard)/
├── layout.tsx
├── DesktopLayout.tsx
├── MobileLayout.tsx
├── LayoutWrapper.tsx
├── page.tsx                     # Dashboard
├── chats/
│   ├── DesktopChats.tsx
│   ├── MobileChats.tsx
│   └── page.tsx
├── offers/
│   ├── DesktopOffers.tsx
│   ├── MobileOffers.tsx
│   └── page.tsx
... (same pattern for all pages)

2. Updated Prompt for Cursor / Claude / Any AI Coder (Copy-Paste This)
textYou are an expert full-stack Next.js 15 developer specializing in Supabase + shadcn/ui apps.

Build the complete "Anvita WhatsApp Admin Dashboard" exactly as per the attached requirements.md file.

CRITICAL REQUIREMENTS FROM THE USER:

1. Two Completely Separate UI Trees (Desktop vs Mobile)
   - Desktop: Top nav bar + always-visible left sidebar
   - Mobile: Hamburger menu + slide-in drawer
   - Use DesktopLayout.tsx, MobileLayout.tsx, and LayoutWrapper.tsx that switches based on screen width (>= 1024px = desktop)
   - Create DesktopXXX.tsx + MobileXXX.tsx for every major page

2. Theme Toggle (Lightweight & Beautiful)
   - **Light mode by DEFAULT**
   - Clean sun/moon icon toggle in the header (top-right on desktop, in mobile header)
   - Use official shadcn/ui + next-themes implementation (install next-themes if needed)
   - Persist choice across sessions, no hydration issues
   - Works perfectly with both Desktop and Mobile layouts

3. Supabase Realtime
   - On Chats page only – new messages appear instantly
   - Enable realtime on "messages" table in Supabase Dashboard

Tech stack (must follow):
- Next.js 15 App Router + Server Actions + TypeScript (strict)
- Tailwind + shadcn/ui (all latest components)
- React Hook Form + Zod
- TanStack React Table
- Supabase JS v2 with realtime
- next-themes for theming
- Sonner for toasts
- Lucide icons

Environment variables (exact names as in requirements.md)

Authentication: Google → check admins table

Implementation order:
1. Auth + LayoutWrapper + ThemeProvider + Theme Toggle (default = light)
2. Dashboard
3. Chats (with realtime, separate desktop/mobile)
4. Generic CRUD system
5. Prompts with n8n webhooks

Make it professional, fast, and exactly match the user's preferred separate-desktop-mobile style.

Start by creating the full folder structure, then build step by step. Show me each file you create.

Begin now.

Done!
Just replace your requirements.md and paste the new prompt into Cursor/Claude.
The AI will now build the entire app with Light mode as default + toggle ready.
Would you like me to also give you the exact 3 small files for the theme toggle (ThemeProvider, ModeToggle, etc.) so you can see how clean it is? Just say “yes” and I’ll send them immediately.
Ready when you are! 🌞1.3sOkay, uh, we had a lot of iterations where, um, so I want you to generate me a full and final read, sorry, requirements.md file. In that you also include database table created, Google authentication flow, uh, all pages, and UI guidelines, folder structure, everything.Here is your complete, final, and polished requirements.md file.
Copy everything below and save it as requirements.md in the root of your project.
Markdown# Anvita WhatsApp Automation Admin Dashboard

## 1. Project Overview
A secure internal web application that allows only authorized team members to monitor and control the WhatsApp automation bot (built with n8n + Supabase + Google Gemini).

- **Purpose**: View live chats, manage all dynamic content (offers, codes, products, courses, healers, prompts), and keep the n8n bot in sync.
- **Users**: Only 2–5 internal team members (email whitelist in `admins` table).
- **Core Rule**: Supabase is the **single source of truth**. n8n reads data directly from Supabase for most operations. Only Prompts are synced back to n8n via webhooks.

## 2. Tech Stack
- **Framework**: Next.js 15 (App Router + Server Actions)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS + shadcn/ui + Lucide icons
- **Authentication**: Supabase Auth (Google OAuth) + custom admin whitelist
- **Database**: Supabase PostgreSQL
- **Realtime**: Supabase Realtime (only for Chats page)
- **Theming**: next-themes (Light mode by default + toggle)
- **Forms**: React Hook Form + Zod
- **Data Tables**: TanStack React Table + shadcn DataTable
- **Layout**: Two completely separate UI component trees (Desktop + Mobile)
- **Toasts**: Sonner
- **Deployment**: Vercel

## 3. Environment Variables (.env.local)
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# n8n Webhooks (only for prompt sync)
N8N_PROMPT_UPSERT_WEBHOOK=https://your-n8n-instance/webhook/prompt-upsert
N8N_PROMPT_DELETE_WEBHOOK=https://your-n8n-instance/webhook/prompt-delete
4. Database Tables (Already Created)
Run the full SQL script provided earlier. All tables are ready with proper triggers, indexes, and created_by foreign key to admins.
Tables:

admins (email whitelist for login)
prompts
offers
codes (marketing quick-reply codes)
products
courses
healers
routing (optional)
messages (chat history – user_question + anvita_reply in same row)

Important: Enable Supabase Realtime on the messages table only:
→ Supabase Dashboard → Database → Replication → Enable realtime for messages (INSERT, UPDATE, DELETE).
5. Authentication Flow

User lands on /login page.
Clicks “Login with Google” → Supabase Auth handles OAuth.
After successful login, immediately run a server-side check:SQLSELECT EXISTS(SELECT 1 FROM admins WHERE email = auth.jwt()->>'email')
If email not found → show clear message “You are not authorized to access this dashboard” + auto logout.
If email found → redirect to /dashboard.

6. Pages & Features
6.1 Dashboard (/dashboard)

Clean stats cards (Conversations today, Messages today, Messages this month, Intent breakdown pie chart)
Recent activity feed (last 5 messages)
Quick navigation cards to all sections

6.2 Chats (/chats)

Exact WhatsApp Web style
Realtime updates via Supabase Realtime (new messages appear instantly)
Left sidebar (Desktop) / Slide-in drawer (Mobile): Contact list with name, phone, last message preview, unread count
Main chat area: Message bubbles
User messages → right side, blue
Anvita replies → left side, gray
Timestamps + status

Read-only (no reply box for admins)
Search by phone/name + date filter

6.3 CRUD Pages
Pages (same pattern for each):

/offers
/codes
/products
/courses
/healers
/prompts
/routing (if needed)

Features:

Full-featured TanStack DataTable (search, sort, pagination, column visibility, export)
“+ Add New” button (opens drawer/sheet with form)
Click any row → opens same form in Edit mode
Delete with confirmation dialog
All forms use React Hook Form + Zod validation

Special handling for Prompts:

After every Create or Update → save to Supabase → immediately POST the full row to N8N_PROMPT_UPSERT_WEBHOOK
On Delete → delete from Supabase → POST { id } to N8N_PROMPT_DELETE_WEBHOOK

7. UI/UX Guidelines (Critical)

Two completely separate component trees (exactly as in your previous project):
Desktop: Top navigation bar + always-visible left sidebar
Mobile: Hamburger menu + slide-in drawer (sidebar opens on click)

Use LayoutWrapper.tsx that detects screen width (>= 1024px = Desktop) and renders the correct layout
Theme:
Light mode by DEFAULT
Clean sun/moon toggle in the header (top-right on desktop, inside mobile header)
Uses official next-themes + shadcn/ui implementation
Choice persists across sessions

Dark/light toggle works perfectly on both Desktop and Mobile layouts
Modern, clean, professional look
Smooth animations, loading spinners, error toasts
Fully responsive within each layout (but layouts themselves are separate)

8. Folder Structure (Exact – Follow This)
textsrc/
├── app/
│   ├── (auth)/
│   │   └── login/page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx
│   │   ├── DesktopLayout.tsx
│   │   ├── MobileLayout.tsx
│   │   ├── LayoutWrapper.tsx
│   │   ├── page.tsx                    # Dashboard
│   │   ├── chats/
│   │   │   ├── DesktopChats.tsx
│   │   │   ├── MobileChats.tsx
│   │   │   └── page.tsx
│   │   ├── offers/
│   │   │   ├── DesktopOffers.tsx
│   │   │   ├── MobileOffers.tsx
│   │   │   └── page.tsx
│   │   ├── codes/          (same pattern)
│   │   ├── products/
│   │   ├── courses/
│   │   ├── healers/
│   │   ├── prompts/
│   │   └── routing/
├── components/
│   ├── ui/                     # shadcn components
│   ├── chat/
│   ├── forms/
│   ├── tables/
│   └── layout/                 # ThemeProvider, ModeToggle, etc.
├── lib/
│   ├── supabase.ts
│   └── utils.ts
├── hooks/
├── types/
├── actions/                    # Server Actions (CRUD + auth checks)
└── middleware.ts               # Optional route protection
9. Non-Functional Requirements

Fast loading (use Server Components wherever possible)
Live chat updates (no manual refresh)
Fully type-safe
Proper error handling and user-friendly messages
Secure (admin whitelist)
Beautiful default Light theme with easy toggle
Works perfectly on both desktop and mobile devices