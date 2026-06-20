## Note to collaborators

Remember to do these: 

- Download the `.env` file into your project folder & do not upload the file into the repository.
- Execute: `npm install` before running `npm run dev` whenever you pull any changes.

## Frontend Structure Notes

The frontend is being migrated away from direct MongoDB/collection terminology and toward domain API modules.

Prefer these API wrappers for new code:

```text
src/api/apiClient.js     # Shared HTTP client and auth headers
src/api/authApi.js       # Login, signup, account deletion, password reset
src/api/eventDashboardApi.js # Event dashboard summary and incomplete-patient search
src/api/formsApi.js      # Patient form reads and submissions
src/api/patientsApi.js   # Patient creation, lookup, names, duplicate-safe name matches, and search
src/api/queuesApi.js     # Station queue reads, add/remove, and restore-last-removed actions
src/api/stationsApi.js   # Patient station completion status and eligibility
src/reports/doctorPdf.js # Doctor consult PDF generation
src/reports/formAPdf.js  # Form A PDF generation
src/reports/patientReportPdf.js # Legacy patient report PDF generation
src/reports/patientReportPdfUpdated.js # Current patient report PDF generation
src/reports/pdfMake.js   # Shared pdfMake setup
src/services/stationCounts.js # Backend-first station count recalculation helper
src/services/stationFallbacks.js # Legacy frontend station rules for migration/offline fallback only
```

Form components may still pass legacy collection names such as `registrationForm` or `triageForm`. The bridge in `src/forms/formKeys.js` maps those names to backend form keys such as `registration` and `triage`.

`src/services/mongoDB.js` is now a compatibility facade. Existing callers can continue using helpers like `getSavedData`, `getSavedPatientData`, and `getPreRegDataById`, but the implementation prefers the newer domain routes where a form or patient mapping exists.

For new frontend work:

- Use `patientsApi`, `formsApi`, and `authApi` instead of direct `fetch('/api/...')`.
- Use `patientsApi.getPatientNameMatches` when resolving patients by name, because patient names are not unique.
- Use `queuesApi.restoreLastRemovedToFront` for the station queue undo action. Removed queue items are persisted on the backend per station.
- Use `stationsApi.getPatientStationSummary` for dashboard station display, completion, eligibility, and count data.
- Use `stationsApi.getPatientStationEligibility` when a report or page needs the Form A style eligibility rows.
- Use `eventDashboardApi` for event-level summary stats and paginated incomplete-patient search.
- Use `stationsApi.recalculatePatientStationCounts` instead of writing station counts through generic collection routes.
- Avoid passing MongoDB collection names from UI components when a domain key is available.
- Add new form collection-to-key mappings in `src/forms/formKeys.js`.
- Keep `services/mongoDB.js` compatibility behavior until old callers have been migrated.
- `src/services/stationCounts.js` is backend-first. Its fallback path delegates to `src/services/stationFallbacks.js`.

## Station Registry Notes

The backend station module is now the source of truth for station configuration and rules:

```text
phs-app-backend/server/modules/forms/formRegistry.js       # Form key to MongoDB collection mapping
phs-app-backend/server/modules/stations/stationRegistry.js # Station key, label, route, required forms, active flag
phs-app-backend/server/modules/stations/stationEligibility.js # Named eligibility rules
```

The dashboard loads `GET /api/patients/:patientId/station-summary`, which returns active stations with completion and eligibility. `PatientTimeline.jsx` keeps an emergency hardcoded fallback list only so the dashboard can still render during backend station API failures. Do not treat that fallback list as the yearly station configuration.

For yearly station changes:

1. Add or update form metadata in backend `formRegistry.js`.
2. Add or update the station entry in backend `stationRegistry.js`.
3. Add or update the named rule in backend `stationEligibility.js`.
4. Add or update the frontend route/component only if the station needs a new page.
5. Add the frontend collection-to-key bridge in `src/forms/formKeys.js` if legacy components still pass a collection name.

To disable a station for the year, prefer setting `active: false` in the backend station registry. This keeps old form data readable while hiding the station from the active dashboard flow.

Stage 8 starts extracting report/PDF responsibilities from `src/api/api.jsx`. `generateDoctorPdf` now lives in `src/reports/doctorPdf.js`, with `src/api/api.jsx` re-exporting it as a compatibility facade so existing callers keep working.

Stage 9 continues that report extraction. `generateFormAPdf` and its private Form A rendering helpers now live in `src/reports/formAPdf.js`, with `src/api/api.jsx` re-exporting it as a compatibility facade for existing callers.

Stage 10A moves the legacy `generate_pdf` jsPDF report and its direct rendering helpers into `src/reports/patientReportPdf.js`. `src/api/api.jsx` continues to re-export those helpers as a compatibility facade for existing callers.

Stage 10B moves `generate_pdf_updated` and its direct pdfMake section helpers into `src/reports/patientReportPdfUpdated.js`. `src/api/api.jsx` continues to re-export those helpers as a compatibility facade for existing callers.

## Print Queue Admin Search

`DoctorAdmin.jsx` and `FormAAdmin.jsx` support exact patient ID search in both current queue and print history views. The search is server-side and uses the existing paginated print queue endpoints with `patientId`, so results are not limited to the currently visible page.

## Event Dashboard

`src/pages/EventDashboard.jsx` provides a read-only event operations view at:

```text
/app/event-dashboard
```

It uses manual refresh rather than SSE or polling. The page calls:

```text
GET /api/event-dashboard/summary
GET /api/event-dashboard/incomplete-patients?q=...&page=1&limit=25
```

The MVP dashboard shows:

- registered patient count
- still-screening patient count
- completed patient count
- station queue counts and current bottleneck
- pending print queue counts
- paginated registered-but-not-completed patients searchable by name or ID, including their current station queue when present

For the MVP, completion means the backend patient document has a `summaryForm` marker. This is intentionally simple and should be revisited only if event operations define a different final completion checkpoint.

## Past Versions

For reference:

- [2025 Website](https://phs-app-2025.vercel.app/login)
- [2024 Website](https://phs-app.vercel.app/login)
- [2023 Website](https://phs-app-gules.vercel.app/login)
