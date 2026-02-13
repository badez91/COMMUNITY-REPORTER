export interface CreateReportDTO {
  title: string;
  description: string;
  category: string;
  photoUrl?: string;
  latitude?: number;
  longitude?: number;
}
