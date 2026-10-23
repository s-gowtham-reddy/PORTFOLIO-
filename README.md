# Gowtham Reddy Syamala — Data Engineering Portfolio

Personal portfolio web application showcasing projects, technical skills, research, and engineering background in Data Engineering and Software Development.

## Tech Stack

* **Frontend**: [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Vite](https://vitejs.dev/)
* **Styling**: Vanilla CSS tokens & [Tailwind CSS](https://tailwindcss.com/)
* **Routing**: [Wouter](https://github.com/molefrog/wouter)
* **Icons**: [Lucide React](https://lucide.dev/)
* **Package Management**: [pnpm](https://pnpm.io/) workspaces

---

## Getting Started

### Prerequisites

* **Node.js**: v20+ (recommended v22+)
* **pnpm**: v9+ (or enable via `corepack enable`)

### 1. Install Dependencies

In the project root directory, run:

```bash
pnpm install
```

### 2. Configure Environment

Copy `.env.example` to `.env` in the portfolio directory:

```bash
cp artifacts/gowtham-portfolio/.env.example artifacts/gowtham-portfolio/.env
```

*(By default, standard fallbacks `PORT=5173` and `BASE_PATH=/` are used automatically even without `.env`.)*

### 3. Start Development Server

Run the portfolio application locally:

```bash
pnpm dev
```

or explicitly:

```bash
pnpm --filter @workspace/gowtham-portfolio dev
```

Open your browser and navigate to **`http://localhost:5173`**.

---

## Build for Production

To create an optimized production build:

```bash
pnpm build
```

or build only the portfolio web app:

```bash
pnpm run build:portfolio
```

The production bundle will be output to `artifacts/gowtham-portfolio/dist/public/`.

---

## Project Structure

```text
├── artifacts/
│   ├── gowtham-portfolio/      # Main portfolio web application
│   │   ├── src/
│   │   │   ├── App.tsx         # Main portfolio layout, case studies, & routes
│   │   │   ├── lib/            # Profile metadata & links
│   │   │   └── index.css       # Core design tokens and styling
│   │   ├── public/             # Static assets (Resume PDF, favicon, og-image)
│   │   └── vite.config.ts      # Vite build configuration
│   └── api-server/             # Express API server workspace package
├── lib/                        # Shared client/contract libraries
├── pnpm-workspace.yaml         # Monorepo workspace configuration
└── package.json                # Root package scripts
```

---

## Featured Work & Case Studies

* **Integrated Flight Safety and Risk Analysis**: Predictive risk assessment system using machine learning (91.2% accuracy, 0.88 F1-score with 10-fold cross-validation) presented at ICECBE 2026.
* **LLM-Powered Code Reviewer**: Developer productivity workflow analyzing Python and Java code with contextual suggestions.
* **Career Guidance Chatbot**: Interactive NLP and rule-based system matching skills and interests to career pathways.

---

## Contact & Links

* **Email**: [gouthamreddy.117.in@gmail.com](mailto:gouthamreddy.117.in@gmail.com)
* **LinkedIn**: [linkedin.com/in/gowtham-work](https://www.linkedin.com/in/gowtham-work/)
* **GitHub**: [github.com/s-gowtham-reddy](https://github.com/s-gowtham-reddy)
