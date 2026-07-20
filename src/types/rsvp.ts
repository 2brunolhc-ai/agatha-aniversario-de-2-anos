export type AttendanceStatus = "yes" | "no";
export type YesNoChoice = "yes" | "no";

export type RSVPRecord = {
  id: string;
  full_name: string;
  attendance_status: AttendanceStatus;
  total_guests: number | null;
  adults: number | null;
  children: number | null;
  companion_count: number;
  companion_names: string | null;
  message: string | null;
  created_at: string;
};

export type RSVPFormValues = {
  fullName: string;
  attendanceStatus: AttendanceStatus | "";
  hasCompanions: YesNoChoice | "";
  companionCount: number;
  hasChildren: YesNoChoice | "";
  children: number;
  companionNames: string;
  message: string;
  website: string;
};
