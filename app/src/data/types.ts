/** Domain model — mirrors supabase/migrations/0001_init.sql */

export type Role = "seeker" | "caregiver";

export type CaregiverTier = "assistant" | "na_pn" | "rn";

/** Care recipient mobility level — the segmentation axis judges asked us to make explicit. */
export type MobilityLevel = "independent" | "semi" | "bedridden";

export type VerificationStatus = "verified" | "pending" | "unverified";

export type BookingStatus =
  | "requested"
  | "accepted"
  | "in_progress"
  | "completed"
  | "cancelled";

export type BookingEventType =
  | "requested"
  | "accepted"
  | "checked_in"
  | "checked_out"
  | "cancelled";

export type ReviewDirection = "seeker_to_caregiver" | "caregiver_to_seeker";

export interface Caregiver {
  id: string;
  name: string;
  tier: CaregiverTier;
  photoUrl: string;
  hourlyRate: number; // THB / hour
  serviceArea: string; // e.g. "เขตห้วยขวาง"
  ratingAvg: number;
  ratingCount: number;
  jobsDone: number;
  yearsExperience: number;
  verification: VerificationStatus;
  licenseNo?: string; // สภาการพยาบาล เลขที่ (na_pn / rn)
  bio: string;
  /** task keys this caregiver offers — all drawn from ALLOWED_TASKS */
  services: string[];
  /** mobility levels this caregiver is comfortable supporting */
  acceptsMobility: MobilityLevel[];
}

export interface Patient {
  id: string;
  name: string;
  relation: string; // "ย่า", "ตา", "แม่"
  mobility: MobilityLevel;
  conditions: string; // free note
  area: string;
  addressLine: string;
}

export interface BookingEvent {
  type: BookingEventType;
  at: string; // ISO
  lat?: number;
  lng?: number;
  note?: string;
}

export interface Review {
  id: string;
  bookingId: string;
  caregiverId: string;
  direction: ReviewDirection;
  stars: number; // 1..5
  comment: string;
  authorName: string;
  at: string; // ISO
}

export interface Booking {
  id: string;
  caregiverId: string;
  patientId: string;
  status: BookingStatus;
  scheduledStart: string; // ISO
  hours: number;
  hourlyRate: number; // snapshot at booking time
  commissionRate: number; // 0..1, platform take from caregiver payout
  tasks: string[]; // selected task keys
  note?: string;
  events: BookingEvent[];
  checkedInAt?: string;
  checkedOutAt?: string;
}

export interface PriceBreakdown {
  hours: number;
  hourlyRate: number;
  subtotal: number;
  commissionRate: number;
  platformFee: number;
  caregiverPayout: number;
  total: number; // what the seeker pays
}
