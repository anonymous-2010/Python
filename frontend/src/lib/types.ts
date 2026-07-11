export interface Teacher {
  id: string;
  name: string;
  subject: string;
  image: string | null;
  experience?: string;
  qualification?: string;
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
}

export interface User {
  userId: string;
  name: string;
  phone: string;
  city: string;
  email: string;
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
}
