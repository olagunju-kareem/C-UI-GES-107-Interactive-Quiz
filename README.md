# GES 107 CBT Quiz Prep & Study Platform

An interactive, responsive Computer-Based Testing (CBT) practice web application for **GES 107** (Reproductive Health, Sexually Transmitted Infections, HIV/AIDS & Nutrition), designed in accordance with the University of Ibadan General Studies Programme curriculum.

Modeled after the streamlined study design of `gst111.netlify.app`, the platform provides instant feedback, comprehensive explanations for every question, topic filtering, exam simulation, and a full progress and performance tracker.

---

## 🚀 Features

- **270 Verified Questions**: Complete coverage of all official past exams (140-question past paper), textbook questions (Code 01 NDHS data), DLCF mock exam (Code 00), and recent 2022–2025 Continuous Assessment Google forms and theory papers.
- **Topic & Chapter Filtering**:
  - Concept of Health, Healthy Living & Determinants
  - Nutrition, Nutrients & Nutritional Disorders (Kwashiorkor, Marasmus)
  - Infectious Diseases, Pathogens & Chain of Infection
  - Human Reproductive Anatomy & Physiology
  - Adolescence, Youth & Life Skills Development (Three C Model)
  - STIs, HIV/AIDS Epidemiology, Prevention & Care (HAART, PEP, HCT)
  - Non-Communicable Diseases & Genetics (Sickle Cell Disease HbSS/HbAS)
  - Drugs, Pharmacology & Substance Abuse
  - Gender Equality, Violence & Gender Mainstreaming
  - Nigerian Health Demographics & NDHS Statistical Indicators
- **Instant Practice Mode**: Immediate answer validation with color-coded feedback (emerald for correct, rose for wrong) and pedagogical explanation notes to help students learn from mistakes.
- **Timed CBT Exam Simulator**: Realistic exam conditions with configurable timer, question palette, flagging system, and score breakdown.
- **Question Palette & Navigator**: Jump directly to any question; view answered, unanswered, and bookmarked questions at a glance.
- **Score Summary & Analytics**:
  - Percentage score and official University of Ibadan grading scale (Grade A to F)
  - Topic mastery breakdown highlighting strengths and revision targets
  - Review mode with filter for missed questions only
  - **"Retake Missed Questions"** button for targeted review
- **Searchable Question Bank**: Instant keyword search across questions, options, and explanations.
- **Dark Mode Support**: Seamless toggle between light and dark themes with persistent preference storage.
- **Standalone Offline HTML**: Includes a built-in generator and export feature to download a single self-contained `.html` file that runs completely offline on any browser without internet or Node.js.

---

## 🛠️ Tech Stack

- **Framework**: React 19 + TypeScript
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Build Tool**: Vite 8
- **Typography**: Plus Jakarta Sans & JetBrains Mono

---

## 📦 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or bun

### Installation

1. Clone or download the repository:
   ```bash
   git clone <repo-url>
   cd <repo-folder>
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:3000`.

---

## 📄 Offline Single-File Version

A completely static, self-contained HTML file containing all 270 questions, interactive JavaScript logic, and dark mode is located at:
```
public/ges107_cbt_quiz.html
```
You can also click the **"Offline HTML"** button in the header of the running web application to download the file directly to your phone or computer.

---

## 📚 Course Reference & Syllabus

- **Course**: GES 107 – Reproductive Health, STIs, HIV/AIDS and Nutrition
- **Institution**: General Studies Programme, University of Ibadan
- **Material Sources**:
  - Official GES 107 Past Questions (140 Questions Examination Paper)
  - Chapter 1 Textbook Practice (Code 01 – NDHS 2008/2010 Survey Data)
  - DLCF Mock Examination (Code 00)
  - First & Second Semester Continuous Assessments (2013, 2014, 2015, 2022, 2023/2024, 2024/2025)

---

## ⚖️ License

MIT
