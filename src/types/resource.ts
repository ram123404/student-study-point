
export interface Resource {
  id: number;
  title: string;
  description: string;
  type: string;
  subject: string;
  semester: number;
  uploadDate: string;
  fileUrl: string;
  field?: string; // Adding field of study (BCA, BBA, BIM, etc.)
}
