// ──────────────────────────────────────────
//  Background Jobs — Placeholders
// ──────────────────────────────────────────
//
//  When ready, integrate a job runner like Bull, Agenda, or node-cron.
//
//  Planned jobs:
//
//  1. booking-reminder.job.js
//     → Send reminders 24h before scheduled bookings
//
//  2. stale-booking-cleanup.job.js
//     → Auto-cancel bookings still "pending" after 48h
//
//  3. payout-processor.job.js
//     → Process provider payouts for completed bookings
//
//  4. rating-aggregator.job.js
//     → Periodic recalculation of provider aggregate ratings
//
//  5. notification-digest.job.js
//     → Send daily/weekly notification digests via email
//
// ──────────────────────────────────────────

export const registerJobs = () => {
    console.log('📋 Background jobs: not configured (placeholder)');
};
