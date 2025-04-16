
export interface Resource {
  id: number;
  title: string;
  description: string;
  type: string;
  subject: string;
  semester: number;
  uploadDate: string;
  fileUrl: string;
  field: string; // Field of study (BCA, BBA, BIM, etc.)
}
