# Eightfold Transformer: Technical Design Document

## 1. Pipeline Overview
The core architecture of the Transformer engine follows a linear, deterministic flow designed to transform noisy, disparate data sources into a single, highly-confident canonical profile.

**Pipeline Stages:**
1. **Detect & Read (`profileControllers.js`)**: Identifies incoming file types (CSV, ATS JSON, Resume PDF, Github URL) and routes them to their respective parsers.
2. **Extract (`parsers/*`)**: Extracts unstructured text (e.g., via `pdf-parse`) or deserializes structured blobs. Maps arbitrary fields to the baseline canonical shape using the `candidateBuilder`.
3. **Normalize (`normalizers/*`)**: Enforces standard formats on raw attributes. Crucially, normalizes dates to `YYYY-MM` (via `dateNormalizer`), phones to `E.164` (via `phoneNormalizer`), and maps skills to canonical forms.
4. **Merge & Resolve (`mergeEngine.js`)**: Deduplicates incoming candidates into a single canonical record. 
5. **Calculate Confidence (`confidenceCalculator.js`)**: Associates a predefined trust score (e.g., GitHub=0.95, Resume=0.90, ATS=0.85, CSV=0.70) with each field dynamically.
6. **Project (`projectionEngine.js`)**: Applies the dynamic runtime configuration to reshape the output, selecting fields, mapping nested attributes, and dictating missing-value behavior.
7. **Validate (`candidateSchema.js`)**: Dynamically validates the final output against the strict constraints provided by the runtime config.

## 2. Canonical Output Schema
The internal schema maintains strict type safety:
- `candidate_id` (string)
- `full_name` (string)
- `emails` (string[])
- `phones` (string[]) (E.164 format)
- `location` ({ city, region, country }) (country: ISO-3166 alpha-2)
- `links` ({ linkedin, github, portfolio, other[] })
- `headline` (string | null)
- `years_experience` (number | null)
- `skills` ([ { name, confidence, sources[] } ]) (canonical skill names)
- `experience` ([ { company, title, start, end, summary } ]) (dates as YYYY-MM)
- `education` ([ { institution, degree, field, end_year } ])
- `provenance` ([ { field, source, method } ])
- `overall_confidence` (number)

## 3. Merge / Conflict-Resolution Policy
The merger operates on a **union-and-escalate** policy:
- **Arrays (Skills, Emails, Phones)**: We union all unique values. For skills, if the same skill is found across multiple sources, we merge them into one skill object, append the new source to the `sources[]` array, and escalate the `confidence` to the `Math.max()` of the provided sources.
- **Scalars (Name, Headline)**: We take the first non-null value (which structurally prioritizes the order of input, though a timestamp-based priority could be added in the future).
- **Provenance Logging**: Every field merged successfully records a `{ field, source, method }` entry into the global `provenance` ledger.

## 4. Runtime Custom-Output Configuration
The `projectionEngine.js` intercepts the canonical payload right before transmission and applies the user's JSON config:
- **`path` and `from`**: Evaluated dynamically using a custom `getValue` utility capable of traversing arrays (e.g., `skills[].name`).
- **`normalize`**: Triggers explicit normalization hooks (like `E164` for phones).
- **`on_missing`**: Dynamically dictates whether an undefined field should be omitted from the JSON, set to `null`, or throw a hard `Error`.

## 5. Edge Cases & Constraints
1. **Missing or Corrupted Files**: 
   - *Handling*: Handled via robust try-catch blocks in the parsers. Unknown values become `null`. If a source is entirely garbage, it returns an empty canonical candidate rather than crashing, ensuring the merge engine always receives a predictable object shape.
2. **Conflicting Dates (e.g., "Present" vs "2024")**:
   - *Handling*: The `dateNormalizer` attempts a native `Date` parse; if invalid, it falls back to regex pattern matching for 4-digit years.
3. **Descoped Under Time Pressure**:
   - Complex entity resolution (e.g., determining if "Software Engineer" and "SDE" are the same title).
   - Deep NLP for unstructured text extraction; currently relying on basic regex matching for skills and emails from resumes.
