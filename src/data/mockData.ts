
export const MOCK_RESOURCES = [
  {
    id: 1,
    title: "Introduction to Programming",
    description: "Comprehensive notes covering C programming basics, control structures, and arrays.",
    type: "Notes",
    subject: "Computer Programming",
    semester: 1,
    uploadDate: "2023-09-15",
    fileUrl: "#",
  },
  {
    id: 2,
    title: "Digital Logic Question Bank",
    description: "Collection of past exam questions from 2018-2022 with detailed solutions.",
    type: "Questions",
    subject: "Digital Logic",
    semester: 1,
    uploadDate: "2023-08-25",
    fileUrl: "#",
  },
  {
    id: 3,
    title: "Mathematics I Syllabus",
    description: "Official syllabus for Mathematics I including course objectives and evaluation criteria.",
    type: "Syllabus",
    subject: "Mathematics I",
    semester: 1,
    uploadDate: "2023-10-05",
    fileUrl: "#",
  },
  {
    id: 4,
    title: "Data Structures Notes",
    description: "Complete notes on arrays, linked lists, stacks, queues, trees, and graphs.",
    type: "Notes",
    subject: "Data Structures and Algorithms",
    semester: 3,
    uploadDate: "2023-09-10",
    fileUrl: "#",
  },
  {
    id: 5,
    title: "Database Management Systems",
    description: "Lecture notes covering relational model, SQL, normalization, and transactions.",
    type: "Notes",
    subject: "Database Management Systems",
    semester: 4,
    uploadDate: "2023-07-20",
    fileUrl: "#",
  },
  {
    id: 6,
    title: "Object-Oriented Programming Past Papers",
    description: "Last 5 years question papers for OOP with Java programming examples.",
    type: "Questions",
    subject: "Object-Oriented Programming",
    semester: 3,
    uploadDate: "2023-08-05",
    fileUrl: "#",
  },
];

export const SEMESTERS = Array.from({ length: 8 }, (_, i) => i + 1);

export const SUBJECTS = [
  "Computer Programming", 
  "Digital Logic", 
  "Mathematics I", 
  "Data Structures and Algorithms",
  "Database Management Systems",
  "Object-Oriented Programming",
  "Software Engineering",
  "Computer Networks",
  "Computer Architecture",
  "Web Development",
  "Mobile Application Development",
  "Artificial Intelligence",
  "Operating Systems",
  "Computer Graphics",
];

export const RESOURCE_TYPES = ["Notes", "Questions", "Syllabus"];
