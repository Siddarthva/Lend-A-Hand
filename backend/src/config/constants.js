// ──────────────────────────────────────
//  Application-wide constants
// ──────────────────────────────────────

export const ROLES = {
    CUSTOMER: 'customer',
    PROVIDER: 'provider',
    ADMIN: 'admin',
};

export const ACCOUNT_STATUS = {
    ACTIVE: 'active',
    SUSPENDED: 'suspended',
    BANNED: 'banned',
};

export const BOOKING_STATUS = {
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    IN_PROGRESS: 'in_progress',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled',
    DISPUTED: 'disputed',
};

export const PAYMENT_STATUS = {
    PENDING: 'pending',
    PAID: 'paid',
    REFUNDED: 'refunded',
    FAILED: 'failed',
};

export const TRANSACTION_TYPE = {
    PAYMENT: 'payment',
    PAYOUT: 'payout',
    REFUND: 'refund',
};

export const PAYMENT_METHODS = ['card', 'upi', 'wallet', 'cod'];

export const CATEGORIES = [
    'Cleaning',
    'Plumbing',
    'Electrical',
    'Painting',
    'Carpentry',
    'Gardening',
    'Moving',
    'Appliance Repair',
    'Pest Control',
    'AC & HVAC',
];

export const NOTIFICATION_TYPES = [
    'booking_update',
    'message',
    'promo',
    'review',
    'system',
    'payment',
];

export const PAGINATION = {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 12,
    MAX_LIMIT: 100,
};
