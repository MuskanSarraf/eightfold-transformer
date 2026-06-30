# Eightfold Candidate Transformer Engine

A robust, deterministic pipeline designed to ingest candidate data from messy, disparate sources (structured CSVs/JSONs and unstructured Resumes/Profiles) and transform them into one clean, trustworthy canonical profile.

## Features
- **Multi-Source Ingestion**: Parses ATS JSON blobs, Recruiter CSVs, GitHub profiles, and raw Resume PDFs.
- **Deterministic Merging**: Handles conflicts and deduplicates arrays while maintaining a perfect ledger of `provenance` (tracking where every single attribute came from).
- **Confidence Scoring**: Assigns weights to different data sources to calculate an `overall_confidence` score for the merged candidate.
- **Dynamic Projection**: A configurable projection layer allowing you to reshape the output schema at runtime using a JSON configuration.

## Requirements
- Node.js (v18+ recommended)
- NPM

## Installation & Setup

1. **Install Dependencies**
   Navigate to the root directory and install backend dependencies:
   ```bash
   npm install
   ```
   Navigate to the frontend directory and install frontend dependencies:
   ```bash
   cd frontend
   npm install
   cd ..
   ```

2. **Start the Engines**
   Start the backend server (runs on port 3000):
   ```bash
   npm run start
   ```
   In a separate terminal, start the React frontend UI:
   ```bash
   cd frontend
   npm run dev
   ```

## Usage

1. Open your browser and navigate to the frontend URL (usually `http://localhost:5173`).
2. You will see a **Runtime Configuration** text area. You can modify this JSON payload to reshape the output.
3. Drag and drop your sample data (e.g., `resume.pdf`, `candidates.csv`, `ats.json`) into the upload area.
4. Click **Process Candidate Data**.
5. The pipeline will parse, normalize (dates to `YYYY-MM`, phones to `E.164`), merge, and dynamically project the output right on the screen.

## Testing

To run the unit tests:
```bash
npm test
```

## Assumptions & Descoped Items
- **NLP / ML Extraction**: Due to time constraints, deep NLP extraction from PDFs was descoped in favor of deterministic regex extraction for emails, phones, and a predefined list of canonical skills.
- **CLI vs UI**: The project requirements requested a thin I/O layer. I opted for a beautiful, glassmorphism React UI to allow easily tweaking the Runtime Configuration JSON rather than a CLI tool, as it visually demonstrates the projection engine's capabilities much better.
- **Github API**: The GitHub parser is implemented but currently expects a username payload. For the sake of the file-upload demo, we rely primarily on the ATS, CSV, and Resume parsers to demonstrate structured and unstructured merging.
