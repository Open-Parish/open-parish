# Changelog

All notable changes to this project will be documented in this file.

The format is based on Keep a Changelog, and this project follows Semantic Versioning.

## [0.3.0] - 2026-03-15

### Added
- Added a modular end-to-end dashboard flow covering login, certificates, settings, and logout.
- Added production guards that reject the default JWT secret and require explicit opt-in for development seeding.
- Added safer authenticated upload validation using file type detection and restricted image formats.
- Added a shared dashboard text helper to reduce repeated trimmed-string checks.

### Changed
- Moved authentication hardening documentation and API setup docs into a simpler open-source-friendly format.
- Tightened production error handling so internal server details are no longer exposed in API responses.
- Applied safe npm audit fixes across the API and dashboard dependency trees.
- Resolved the remaining SonarCloud issues in API bootstrap, settings, and dashboard settings code.

### Security
- Prevented production deployments from running with the committed fallback JWT secret.
- Limited authenticated uploads to safe image types instead of trusting caller-provided MIME types.
- Stopped exposing internal 500 error details in production responses.
- Required `ENABLE_DEV_SEED=true` before auto-seeding a development admin account.

## [0.2.1] - 2026-03-15

### Fixed
- Aligned local cookie auth host defaults so dashboard and API development environments work together on `localhost`.

## [0.2.0] - 2026-03-15

### Changed
- Replaced the install wizard flow with a development seeding workflow.
- Hardened cookie auth, CSRF protection, CORS handling, and login rate limiting.
- Renamed `olshp` configuration references to `openparish`.

