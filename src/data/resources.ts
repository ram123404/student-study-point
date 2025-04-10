
export interface Resource {
  id: number;
  title: string;
  subject: string;
  semester: number;
  type: 'Notes' | 'Questions' | 'Syllabus';
  description: string;
  fileUrl: string;
}

export const MOCK_RESOURCES: Resource[] = [
  {
    id: 1,
    title: 'Introduction to Programming',
    subject: 'Computer Programming',
    semester: 1,
    type: 'Notes',
    description: 'Comprehensive notes covering C programming basics',
    fileUrl: '#',
  },
  {
    id: 2,
    title: 'Data Structures Exam Questions',
    subject: 'Data Structures',
    semester: 3,
    type: 'Questions',
    description: 'Past exam questions with solutions',
    fileUrl: '#',
  }
];

export const SUBJECTS = [
  'Computer Programming', 
  'Data Structures', 
  'Mathematics', 
  'Database Management'
];

export const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8];
