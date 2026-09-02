import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import type {
  Booking,
  Caregiver,
  Patient,
  Review,
  Role,
} from "./types";
import { CAREGIVERS, SEED_BOOKINGS, SEED_PATIENTS, SEED_REVIEWS } from "./mock";

/**
 * In-memory app state for the MVP demo. No persistence — restarting the app
 * resets to seed data. Swap this module for a Supabase-backed repo later
 * (see src/lib/supabase.ts and supabase/migrations).
 */

let counter = 100;
const nextId = (p: string) => `${p}_${++counter}`;

interface NewBookingInput {
  caregiverId: string;
  patientId: string;
  scheduledStart: string;
  hours: number;
  hourlyRate: number;
  commissionRate: number;
  tasks: string[];
  note?: string;
}

interface StoreValue {
  role: Role;
  setRole: (r: Role) => void;

  caregivers: Caregiver[];
  patients: Patient[];
  bookings: Booking[];
  reviews: Review[];

  getCaregiver: (id: string) => Caregiver | undefined;
  getPatient: (id: string) => Patient | undefined;
  getBooking: (id: string) => Booking | undefined;
  reviewsForCaregiver: (caregiverId: string) => Review[];

  createBooking: (input: NewBookingInput) => string;
  cancelBooking: (id: string) => void;
  acceptBooking: (id: string) => void;
  checkIn: (id: string, coords?: { lat: number; lng: number }) => void;
  checkOut: (id: string, coords?: { lat: number; lng: number }) => void;
  addReview: (bookingId: string, stars: number, comment: string) => void;
}

const StoreContext = createContext<StoreValue | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<Role>("seeker");
  const [caregivers, setCaregivers] = useState<Caregiver[]>(CAREGIVERS);
  const [patients, setPatients] = useState<Patient[]>(SEED_PATIENTS);
  const [bookings, setBookings] = useState<Booking[]>(SEED_BOOKINGS);
  const [reviews, setReviews] = useState<Review[]>(SEED_REVIEWS);

  const getCaregiver = useCallback(
    (id: string) => caregivers.find((c) => c.id === id),
    [caregivers],
  );
  const getPatient = useCallback(
    (id: string) => patients.find((p) => p.id === id),
    [patients],
  );
  const getBooking = useCallback(
    (id: string) => bookings.find((b) => b.id === id),
    [bookings],
  );
  const reviewsForCaregiver = useCallback(
    (caregiverId: string) =>
      reviews
        .filter(
          (r) =>
            r.direction === "seeker_to_caregiver" &&
            r.caregiverId === caregiverId,
        )
        .sort((a, b) => +new Date(b.at) - +new Date(a.at)),
    [reviews],
  );

  const patchBooking = useCallback(
    (id: string, patch: Partial<Booking> | ((b: Booking) => Booking)) => {
      setBookings((prev) =>
        prev.map((b) =>
          b.id === id
            ? typeof patch === "function"
              ? patch(b)
              : { ...b, ...patch }
            : b,
        ),
      );
    },
    [],
  );

  const createBooking = useCallback((input: NewBookingInput) => {
    const id = nextId("bk");
    const booking: Booking = {
      id,
      caregiverId: input.caregiverId,
      patientId: input.patientId,
      status: "requested",
      scheduledStart: input.scheduledStart,
      hours: input.hours,
      hourlyRate: input.hourlyRate,
      commissionRate: input.commissionRate,
      tasks: input.tasks,
      note: input.note,
      events: [{ type: "requested", at: new Date().toISOString() }],
    };
    setBookings((prev) => [booking, ...prev]);
    // Demo convenience: caregiver "accepts" shortly after.
    setTimeout(() => {
      patchBooking(id, (b) =>
        b.status === "requested"
          ? {
              ...b,
              status: "accepted",
              events: [
                ...b.events,
                { type: "accepted", at: new Date().toISOString() },
              ],
            }
          : b,
      );
    }, 2500);
    return id;
  }, [patchBooking]);

  const acceptBooking = useCallback(
    (id: string) =>
      patchBooking(id, (b) => ({
        ...b,
        status: "accepted",
        events: [...b.events, { type: "accepted", at: new Date().toISOString() }],
      })),
    [patchBooking],
  );

  const cancelBooking = useCallback(
    (id: string) =>
      patchBooking(id, (b) => ({
        ...b,
        status: "cancelled",
        events: [...b.events, { type: "cancelled", at: new Date().toISOString() }],
      })),
    [patchBooking],
  );

  const checkIn = useCallback(
    (id: string, coords?: { lat: number; lng: number }) => {
      const at = new Date().toISOString();
      patchBooking(id, (b) => ({
        ...b,
        status: "in_progress",
        checkedInAt: at,
        events: [
          ...b.events,
          { type: "checked_in", at, lat: coords?.lat, lng: coords?.lng },
        ],
      }));
    },
    [patchBooking],
  );

  const checkOut = useCallback(
    (id: string, coords?: { lat: number; lng: number }) => {
      const at = new Date().toISOString();
      patchBooking(id, (b) => ({
        ...b,
        status: "completed",
        checkedOutAt: at,
        events: [
          ...b.events,
          { type: "checked_out", at, lat: coords?.lat, lng: coords?.lng },
        ],
      }));
    },
    [patchBooking],
  );

  const addReview = useCallback(
    (bookingId: string, stars: number, comment: string) => {
      const booking = bookings.find((b) => b.id === bookingId);
      if (!booking) return;
      const review: Review = {
        id: nextId("rv"),
        bookingId,
        caregiverId: booking.caregiverId,
        direction: "seeker_to_caregiver",
        stars,
        comment: comment.trim() || "ดูแลดี ประทับใจ",
        authorName: "ครอบครัวของคุณ",
        at: new Date().toISOString(),
      };
      setReviews((prev) => [review, ...prev]);
      setCaregivers((prev) =>
        prev.map((c) => {
          if (c.id !== booking.caregiverId) return c;
          const total = c.ratingAvg * c.ratingCount + stars;
          const count = c.ratingCount + 1;
          return {
            ...c,
            ratingCount: count,
            ratingAvg: Math.round((total / count) * 10) / 10,
            jobsDone: c.jobsDone + 1,
          };
        }),
      );
    },
    [bookings],
  );

  const value = useMemo<StoreValue>(
    () => ({
      role,
      setRole,
      caregivers,
      patients,
      bookings,
      reviews,
      getCaregiver,
      getPatient,
      getBooking,
      reviewsForCaregiver,
      createBooking,
      cancelBooking,
      acceptBooking,
      checkIn,
      checkOut,
      addReview,
    }),
    [
      role,
      caregivers,
      patients,
      bookings,
      reviews,
      getCaregiver,
      getPatient,
      getBooking,
      reviewsForCaregiver,
      createBooking,
      cancelBooking,
      acceptBooking,
      checkIn,
      checkOut,
      addReview,
    ],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within <StoreProvider>");
  return ctx;
}
