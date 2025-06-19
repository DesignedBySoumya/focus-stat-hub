
import React, { useState } from 'react';
import { Calendar, Settings, Share } from 'lucide-react';
import { DateTimeline } from './DateTimeline';
import { SubjectList } from './SubjectList';
import { StudySession } from './StudySession';

interface Subject {
  id: string;
  title: string;
  timeSpent: string;
  progress: number;
  totalParts: number;
  completedParts: number;
}

const subjects: Subject[] = [
  {
    id: '1',
    title: 'Indian Polity and Governance',
    timeSpent: '1d 02h',
    progress: 31,
    totalParts: 16,
    completedParts: 5
  },
  {
    id: '2',
    title: 'Indian and World Geography',
    timeSpent: '9h 01m',
    progress: 18,
    totalParts: 12,
    completedParts: 2
  },
  {
    id: '3',
    title: 'Indian Economy',
    timeSpent: '5h 30m',
    progress: 45,
    totalParts: 10,
    completedParts: 4
  },
  {
    id: '4',
    title: 'Modern Indian History',
    timeSpent: '12h 15m',
    progress: 60,
    totalParts: 14,
    completedParts: 8
  }
];

export default function StudyDashboard() {
  const [selectedDate, setSelectedDate] = useState('18');
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);

  return (
    <div className="min-h-screen bg-[#0f0f12] text-white font-sans">
      {/* Header */}
      <div className="bg-slate-900 px-6 py-5 border-b border-slate-700">
        <div className="flex items-center justify-between">
          <button className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 transition-colors px-4 py-2 rounded-lg">
            <span className="text-sm font-medium text-white">UPSC CSE</span>
          </button>
          <div className="flex items-center space-x-3">
            <Calendar className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
            <Settings className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
            <Share className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
          </div>
        </div>
      </div>

      {/* Calendar Timeline - Always visible */}
      <DateTimeline selectedDate={selectedDate} onDateSelect={setSelectedDate} />

      {/* Conditional Content */}
      {selectedSubject ? (
        <StudySession 
          subject={selectedSubject} 
          onBack={() => setSelectedSubject(null)} 
        />
      ) : (
        <SubjectList 
          subjects={subjects} 
          onSubjectSelect={setSelectedSubject} 
        />
      )}
    </div>
  );
}
