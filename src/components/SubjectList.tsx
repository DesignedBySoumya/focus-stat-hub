
import React from 'react';
import { Play } from 'lucide-react';

interface Subject {
  id: string;
  title: string;
  timeSpent: string;
  progress: number;
  totalParts: number;
  completedParts: number;
}

interface SubjectListProps {
  subjects: Subject[];
  onSubjectSelect: (subject: Subject) => void;
}

export function SubjectList({ subjects, onSubjectSelect }: SubjectListProps) {
  return (
    <div className="px-6 pb-10 space-y-4">
      {subjects.map((subject) => (
        <div
          key={subject.id}
          className="bg-[#1a1a1f] rounded-xl p-6 shadow-lg border border-slate-800 flex items-center justify-between"
        >
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white mb-2">{subject.title}</h3>
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <span>📚 {subject.completedParts}/{subject.totalParts} parts</span>
              <span>⏱️ {subject.timeSpent}</span>
              <span className="text-orange-400">{subject.progress}%</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2 mt-3">
              <div 
                className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${subject.progress}%` }}
              />
            </div>
          </div>
          <button
            onClick={() => onSubjectSelect(subject)}
            className="ml-6 bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-full shadow-lg transition-all duration-200 hover:scale-105"
          >
            <Play className="w-6 h-6" />
          </button>
        </div>
      ))}
    </div>
  );
}
