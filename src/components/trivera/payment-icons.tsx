"use client";

/** Inline SVG payment method icons used in the footer and checkout. */

export function PaystackIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 32" className={className} role="img" aria-label="Paystack">
      <rect width="80" height="32" rx="4" fill="#00C3F7" />
      <text
        x="40"
        y="21"
        textAnchor="middle"
        fontFamily="Arial, sans-serif"
        fontSize="12"
        fontWeight="700"
        fill="#0A1F44"
      >
        Paystack
      </text>
    </svg>
  );
}

export function VerveIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 32" className={className} role="img" aria-label="Verve">
      <rect width="64" height="32" rx="4" fill="#1A1A1A" />
      <text
        x="32"
        y="21"
        textAnchor="middle"
        fontFamily="Arial, sans-serif"
        fontSize="13"
        fontWeight="700"
        fontStyle="italic"
        fill="#FFFFFF"
      >
        verve
      </text>
    </svg>
  );
}

export function MastercardIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 32" className={className} role="img" aria-label="Mastercard">
      <rect width="48" height="32" rx="4" fill="#FFFFFF" stroke="#e5e7eb" />
      <circle cx="20" cy="16" r="8" fill="#EB001B" />
      <circle cx="28" cy="16" r="8" fill="#F79E1B" />
      <path
        d="M24 9.5a8 8 0 0 1 0 13 8 8 0 0 1 0-13z"
        fill="#FF5F00"
      />
    </svg>
  );
}

export function VisaIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 32" className={className} role="img" aria-label="Visa">
      <rect width="48" height="32" rx="4" fill="#1A1F71" />
      <text
        x="24"
        y="21"
        textAnchor="middle"
        fontFamily="Arial, sans-serif"
        fontSize="13"
        fontWeight="700"
        fontStyle="italic"
        fill="#FFFFFF"
      >
        VISA
      </text>
    </svg>
  );
}
