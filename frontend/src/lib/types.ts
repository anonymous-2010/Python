export interface Teacher {
  id: string;
  name: string;
  subject: string;
  image: string | null;
  subjectImage?: string | null;
  experience?: string;
  qualification?: string;
}

export interface Fee {
  amount: number;
  discount: number;
  total: number;
}

export interface Batch {
  batchId: string;
  name: string;
  class: string;
  exam: string;
  language: string;
  mode: string;
  status: string;
  startDate: string;
  endDate: string;
  batchCode?: string;
  byName?: string;
  isPurchased?: boolean;
  subjectCount?: number;
  program?: string;
  previewImage?: string | null;
  fee?: Fee | null;
  description?: string | null;
}

export interface User {
  userId: string;
  name: string;
  phone: string;
  city: string;
  state: string | null;
  pincode: string | null;
  email: string;
  image: string | null;
  username: string | null;
  uniqueCode: string | null;
  class: string | null;
  board: string | null;
  exams: string[];
  wallet: number | null;
  totalRewards: number | null;
  coins: Record<string, number> | null;
  isProfileCompleted: boolean | null;
  createdAt: string | null;
  isVerifiedEmail: boolean | null;
  isScholar: boolean | null;
  roles: string[];
  orgName: string | null;
}

export interface LectureTeacher {
  name: string;
  image: string | null;
}

export interface ScheduleData {
  _lectureState: 'open' | 'closed';
  _dataNumber: number;
  _receivedAt: string;
  scheduleId: string | null;
  batchId: string | null;
  topic: string | null;
  teacherName: string | null;
  teacherImage: string | null;
  subject: { name?: string } | null;
  url: string | null;
  date: string | null;
  startTime: string | null;
  endTime: string | null;
  lectureStatus: string | null;
  isActive: boolean | null;
  isLive: boolean | null;
  lectureTeacher: LectureTeacher | null;
  batch: Batch | null;
  teachers: Teacher[];
  user: User | null;
  token: string | null;
}
