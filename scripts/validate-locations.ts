/**
 * Location data validation script.
 * Run via: npm run validate
 *
 * Checks all locations in src/data/locations.ts for:
 * - Duplicate id / slug values
 * - Empty required fields
 * - ZIP format (5 digits)
 * - bookingUrl starts with https://
 * - treatmentsSupported values are valid TreatmentAreas
 * - procedures values are valid Procedures
 * - lat / lon are finite numbers
 */

import { locations } from "../src/data/locations";

const VALID_TREATMENT_AREAS = new Set([
  "cervical",
  "shoulder",
  "lumbar",
  "hip",
  "knee",
  "ankle",
]);

const VALID_PROCEDURES = new Set(["PNS"]);

const REQUIRED_STRING_FIELDS = [
  "id",
  "slug",
  "name",
  "description",
  "address",
  "city",
  "state",
  "zip",
  "bookingUrl",
] as const;

const errors: string[] = [];

function err(locationLabel: string, message: string) {
  errors.push(`[${locationLabel}] ${message}`);
}

const seenIds = new Map<string, number>();
const seenSlugs = new Map<string, number>();

locations.forEach((loc, idx) => {
  const label = loc.name || `index ${idx}`;

  // Required string fields
  for (const field of REQUIRED_STRING_FIELDS) {
    const value = loc[field];
    if (typeof value !== "string" || value.trim() === "") {
      err(label, `Missing or empty required field: ${field}`);
    }
  }

  // Duplicate id
  if (loc.id) {
    if (seenIds.has(loc.id)) {
      err(label, `Duplicate id "${loc.id}" (also at index ${seenIds.get(loc.id)})`);
    }
    seenIds.set(loc.id, idx);
  }

  // Duplicate slug
  if (loc.slug) {
    if (seenSlugs.has(loc.slug)) {
      err(label, `Duplicate slug "${loc.slug}" (also at index ${seenSlugs.get(loc.slug)})`);
    }
    seenSlugs.set(loc.slug, idx);
  }

  // ZIP format
  if (loc.zip && !/^\d{5}$/.test(loc.zip)) {
    err(label, `Invalid ZIP "${loc.zip}" — must be exactly 5 digits`);
  }

  // Booking URL
  if (loc.bookingUrl && !loc.bookingUrl.startsWith("https://")) {
    err(label, `bookingUrl must start with https:// — got "${loc.bookingUrl}"`);
  }

  // Lat / Lon
  if (!Number.isFinite(loc.lat)) {
    err(label, `lat is not a finite number: ${loc.lat}`);
  }
  if (!Number.isFinite(loc.lon)) {
    err(label, `lon is not a finite number: ${loc.lon}`);
  }

  // specialties
  if (!Array.isArray(loc.specialties) || loc.specialties.length === 0) {
    err(label, "specialties must be a non-empty array");
  } else {
    for (const s of loc.specialties) {
      if (typeof s !== "string" || s.trim() === "") {
        err(label, `Invalid specialties value: "${s}"`);
      }
    }
  }

  // treatmentsSupported
  if (!Array.isArray(loc.treatmentsSupported) || loc.treatmentsSupported.length === 0) {
    err(label, "treatmentsSupported must be a non-empty array");
  } else {
    for (const area of loc.treatmentsSupported) {
      if (!VALID_TREATMENT_AREAS.has(area)) {
        err(label, `Invalid treatmentsSupported value: "${area}"`);
      }
    }
  }

  // procedures
  if (!Array.isArray(loc.procedures) || loc.procedures.length === 0) {
    err(label, "procedures must be a non-empty array");
  } else {
    for (const proc of loc.procedures) {
      if (!VALID_PROCEDURES.has(proc)) {
        err(label, `Invalid procedure value: "${proc}"`);
      }
    }
  }
});

// Summary
if (errors.length === 0) {
  console.log(`✓ All ${locations.length} locations passed validation.`);
  process.exit(0);
} else {
  console.error(`✗ ${errors.length} validation error(s) found:\n`);
  for (const e of errors) {
    console.error(`  ${e}`);
  }
  process.exit(1);
}
