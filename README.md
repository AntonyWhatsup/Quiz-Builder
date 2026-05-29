# Quiz Builder

A full-stack web application for creating and managing quizzes with multiple question types (Boolean, Input, Checkbox).

**Tech Stack:**
- **Backend:** Node.js + Express + Prisma + SQLite + TypeScript
- **Frontend:** Next.js + React + TypeScript + Custom CSS

---

## **Project Structure**

```
quiz-builder/
├── backend/
│   ├── src/
│   │   └── index.ts          # Express server + API endpoints
│   ├── prisma/
│   │   └── schema.prisma     # Database schema
│   ├── seed.js               # Sample data seeding script
│   └── package.json
├── frontend/
│   ├── pages/
│   │   ├── _app.tsx          # App wrapper + global styles
│   │   ├── index.tsx         # Quiz list page
│   │   ├── create.tsx        # Quiz creation page
│   │   └── quizzes/[id].tsx  # Quiz detail page
│   ├── styles/
│   │   └── globals.css       # Global styles + color palette
│   └── package.json
├── .env                      # Environment variables (DATABASE_URL, PORT)
├── .eslintrc.json            # ESLint config
├── .prettierrc                # Prettier config
└── README.md
```

---

## **Prerequisites**

- **Node.js 18+** and **npm**
- A terminal (PowerShell, bash, or cmd)

---

## **Quick Start**

### **1. Install Dependencies**

```bash
# Install root dependencies (Prisma, ts-node-dev, etc.)
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### **2. Set Up Database**

```bash
# Generate Prisma client
npm run prisma:generate

# Create SQLite database and push schema
npm run prisma:push
```

This creates a `dev.db` file in the root directory.

### **3. (Optional) Seed Sample Quiz**

```bash
npm run seed
```

Creates a sample quiz with one question for testing.

### **4. Start Backend Server**

```bash
npm run dev
```

Backend runs on **http://localhost:4000**

### **5. Start Frontend Dev Server** (in a separate terminal)

```bash
cd frontend
npm run dev
```

Frontend runs on **http://localhost:3000**

### **6. Open in Browser**

Navigate to **http://localhost:3000**

---

## **Available Scripts**

### **Root (quiz-builder/)**

- `npm install` — Install dependencies
- `npm run dev` — Start backend dev server
- `npm run prisma:generate` — Generate Prisma client
- `npm run prisma:push` — Sync schema to database
- `npm run seed` — Populate sample data
- `npm run lint` — Run ESLint
- `npm run format` — Format code with Prettier

### **Frontend (frontend/)**

- `npm run dev` — Start Next.js dev server
- `npm run build` — Build for production
- `npm run start` — Start production server
- `npm run lint` — Run ESLint

---

## **API Endpoints**

### **Backend Base URL:** `http://localhost:4000`

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/quizzes` | Create a new quiz |
| `GET` | `/quizzes` | List all quizzes with question count |
| `GET` | `/quizzes/:id` | Get full quiz details with questions |
| `DELETE` | `/quizzes/:id` | Delete a quiz and its questions |

### **Example: Create Quiz**

```bash
curl -X POST http://localhost:4000/quizzes \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Science Basics",
    "questions": [
      {
        "text": "Is Earth round?",
        "type": "BOOLEAN"
      },
      {
        "text": "What is your name?",
        "type": "INPUT"
      },
      {
        "text": "Select all animals",
        "type": "CHECKBOX",
        "options": ["Dog", "Car", "Cat"]
      }
    ]
  }'
```

---

## **Frontend Pages**

### **1. Quiz List** (`http://localhost:3000/`)
- View all created quizzes
- Click quiz to view details
- Delete quizzes with delete button

### **2. Create Quiz** (`http://localhost:3000/create`)
- Add quiz title
- Add multiple questions dynamically
- Support 3 question types:
  - **Boolean:** True/False
  - **Input:** Short text answer
  - **Checkbox:** Multiple selections
- Submit to create quiz

### **3. Quiz Details** (`http://localhost:3000/quizzes/:id`)
- View quiz title and all questions
- Answer questions (Input, Boolean, Checkbox)
- Submit answers (shows preview)
- Go back to quiz list

---

## **Database Schema**

**Quiz**
- `id` — UUID
- `title` — String
- `createdAt` — DateTime
- `updatedAt` — DateTime

**Question**
- `id` — UUID
- `quizId` — Foreign key to Quiz
- `text` — String (question text)
- `type` — String (`BOOLEAN`, `INPUT`, or `CHECKBOX`)
- `options` — JSON (stringified array of options for CHECKBOX type)

---

## **Code Quality**

**ESLint & Prettier** are configured for consistent code formatting.

```bash
# Lint all files
npm run lint

# Auto-format code
npm run format
```

---

## **Environment Variables**

Create `.env` in the root:

```env
DATABASE_URL="file:./dev.db"
PORT=4000
```

**Note:** The `.env` file should **not** be committed to Git. It's already in `.gitignore`.

---

## **Troubleshooting**

### **Port Already in Use**
If `localhost:4000` or `localhost:3000` is busy, kill the process:
```bash
# Windows PowerShell
Get-Process node | Stop-Process -Force

```

### **Prisma Sync Issues**
```bash
# Clear and regenerate client
rm -rf node_modules/.prisma
npm run prisma:generate
npm run prisma:push
```

### **Frontend Can't Connect to Backend**
- Ensure backend is running on `http://localhost:4000`
- Check no firewall is blocking port 4000
- Frontend hardcodes backend URL to `http://localhost:4000`

---

## **Production Build**

### **Build Frontend**
```bash
cd frontend
npm run build
npm run start
```

### **Build Backend**
Backend runs directly with ts-node in dev mode. For production:
```bash
npm run dev  # or use a process manager like PM2
```

---

## **Notes**

- **Database:** SQLite (`dev.db`) created locally; changes persist across restarts
- **Styling:** Custom CSS with Google Fonts (Inter); no Tailwind CDN in final version
- **Type Safety:** Full TypeScript in backend and frontend
- **CORS:** Backend configured to accept frontend requests from `http://localhost:3000`

---

Notes

- Backend runs on `http://localhost:4000` by default.
- Frontend talks to backend at `http://localhost:4000` (hard-coded for simplicity).
- Use `.env` to override `DATABASE_URL` if needed (see `.env.example`).


