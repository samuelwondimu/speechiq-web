# SpeechIQ

**SpeechIQ** is an AI-powered speaking coach that helps you practice speaking out loud and get instant feedback on clarity, confidence, pacing, and filler words. Perfect for interviews, presentations, pitches, and everyday communication.

---

## 🚀 Features

- Record your speech directly in the browser
- Instant AI feedback with strengths, improvements, and practice exercises
- Track metrics like clarity, confidence, pace, and filler words
- Interactive waveform visualization for your recordings
- Dashboard with historical performance stats
- Light & Dark mode support

---

## 💻 Getting Started

### 1. Clone the repo
```bash
git clone https://github.com/samuelwondimu/speechiq.git
cd speechiq
````

### 2. Install dependencies

```bash
npm install
```

### 3. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### 4. Environment Variables

Create a `.env.local` file based on `.env.example` and provide:

```
DATABASE_URL=your-database-url
OPENAI_API_KEY=your-openai-key
NEXTAUTH_URL=http://localhost:3000
```

---

## 🤝 Contributing to SpeechIQ

We welcome contributions! Please follow these guidelines to keep the project stable and maintainable.

### Branch Strategy

* **`main`** → Production (live users)
* **`development`** → Source of truth / staging
* **`dev/*`** → Feature branches

⚠️ **Never commit directly to `main` or `development`.**

### Workflow

1. **Create a feature branch** from `development`:

```bash
git checkout development
git pull origin development
git checkout -b dev/feature-name
```

2. **Make your changes** locally.

3. **Commit with clear messages**:

```bash
git add .
git commit -m "Add waveform visualization for recorder"
```

4. **Push your branch**:

```bash
git push -u origin dev/feature-name
```

5. **Open a Pull Request** against `development`:

* Base: `development`
* Compare: your feature branch
* Describe what changed and why

6. Once approved and CI passes, merge into `development` and delete the feature branch.

### Pull Request Requirements

* Must pass all **CI checks** (lint + build)
* Must be reviewed
* Must be up-to-date with `development`

---

## 🛠 Release to Production

* Only maintainers merge `development → main`
* Production is automatically deployed via Vercel

---

## 🔒 Security & Environment

* Never commit `.env` or secret keys
* Use environment variables provided by Vercel for production
* Keep development and production databases separate

---

## 🐞 Reporting Bugs

Open an issue with:

* Clear title
* Steps to reproduce
* Expected vs actual behavior
* Screenshots if helpful

---

## 📜 Code of Conduct

Be respectful and constructive. Harassment or abusive behavior is not tolerated.

---

## ❤️ Thank You

Every contribution helps make **SpeechIQ** better. We appreciate your time, effort, and ideas.
