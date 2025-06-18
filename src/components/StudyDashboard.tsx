
import React, { useState, useEffect } from 'react';
import { Calendar, Settings, Share, Music, Maximize2, RotateCcw, Play, Pause, SkipForward } from 'lucide-react';
import { DateTimeline } from './DateTimeline';

export default function StudyDashboard() {
  const [selectedDate, setSelectedDate] = useState('18');
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [totalTimeSpent, setTotalTimeSpent] = useState(3660); // 1h 1m in seconds
  const [todayTimeSpent, setTodayTimeSpent] = useState(0);
  const [partsCompleted, setPartsCompleted] = useState(5);
  const [totalParts] = useState(16);
  const [sessionCount, setSessionCount] = useState(4);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
        setTodayTimeSpent((time) => time + 1);
        setTotalTimeSpent((time) => time + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, timeLeft]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatTimeShort = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const formatTimeTotal = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    
    if (days > 0) {
      return `${days}d ${hours.toString().padStart(2, '0')}h`;
    }
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const resetTimer = () => {
    setTimeLeft(25 * 60);
    setIsPlaying(false);
  };

  const skipSession = () => {
    setTimeLeft(25 * 60);
    setSessionCount(prev => prev + 1);
    setIsPlaying(false);
  };

  const progress = ((25 * 60 - timeLeft) / (25 * 60)) * 100;
  const completionProgress = (partsCompleted / totalParts) * 100;

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

      {/* Topic Title & Share */}
      <div className="flex justify-between items-center px-6 pt-6 pb-2">
        <h2 className="text-xl font-semibold">Indian Polity and Governance</h2>
        <Share className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
      </div>

      {/* Calendar Timeline */}
      <DateTimeline selectedDate={selectedDate} onDateSelect={setSelectedDate} />

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-6 mt-6 pb-10">
        {/* Left: Pomodoro Card */}
        <div className="bg-[#1a1a1f] rounded-xl p-6 relative shadow-lg border border-slate-800">
          <div className="flex justify-between items-center mb-6">
            <span className="bg-red-500 text-white text-xs font-medium rounded-full px-2 py-1">
              {sessionCount}
            </span>
            <div className="flex space-x-3">
              <Maximize2 className="w-5 h-5 cursor-pointer hover:text-orange-400 text-gray-400 transition-colors" />
              <Music className="w-5 h-5 cursor-pointer hover:text-orange-400 text-gray-400 transition-colors" />
              <Settings className="w-5 h-5 cursor-pointer hover:text-orange-400 text-gray-400 transition-colors" />
            </div>
          </div>

          <div className="relative flex items-center justify-center mb-8">
            <svg viewBox="0 0 200 200" className="w-64 h-64 transform -rotate-90">
              <circle
                cx="100"
                cy="100"
                r="85"
                stroke="#2e2e35"
                strokeWidth="8"
                fill="none"
              />
              <circle
                cx="100"
                cy="100"
                r="85"
                stroke="#f97316"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 85}`}
                strokeDashoffset={`${2 * Math.PI * 85 * (1 - progress / 100)}`}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-in-out"
              />
            </svg>
            <div className="absolute text-center">
              <p className="text-sm text-gray-400 mb-1">{isPlaying ? 'focused' : 'paused'}</p>
              <h1 className="text-4xl font-bold mb-1">{formatTime(timeLeft)}</h1>
              <p className="text-xs text-gray-500">{formatTime(totalTimeSpent)}</p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center space-x-6">
            <button 
              onClick={resetTimer}
              className="text-gray-400 hover:text-white transition-colors p-2 rounded-full hover:bg-slate-800"
            >
              <RotateCcw className="w-6 h-6" />
            </button>
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className="bg-white text-black p-4 rounded-full shadow-xl hover:scale-105 transition-transform"
            >
              {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
            </button>
            <button 
              onClick={skipSession}
              className="text-gray-400 hover:text-white transition-colors p-2 rounded-full hover:bg-slate-800"
            >
              <SkipForward className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Right: Study Stats Card */}
        <div className="bg-[#1a1a1f] rounded-xl p-6 shadow-lg border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Indian Polity and Governance</h3>
            <span className="text-orange-400 text-sm font-medium">{Math.round(completionProgress)}%</span>
          </div>
          
          <div className="h-2 bg-slate-700 rounded-full overflow-hidden mb-6">
            <div 
              className="bg-gradient-to-r from-orange-500 to-red-500 h-full transition-all duration-500 ease-out" 
              style={{ width: `${completionProgress}%` }}
            ></div>
          </div>

          <div className="space-y-4">
            <div className="bg-[#2a2a2f] rounded-lg p-4 border border-slate-700">
              <p className="text-xs text-orange-400 font-medium mb-1">Spent Today</p>
              <p className="text-lg font-semibold">{formatTimeShort(todayTimeSpent)}</p>
            </div>
            
            <div className="bg-[#2a2a2f] rounded-lg p-4 border border-slate-700">
              <p className="text-xs text-orange-400 font-medium mb-1">Spent Total</p>
              <p className="text-lg font-semibold">{formatTimeTotal(totalTimeSpent)}</p>
            </div>
            
            <div className="bg-[#2a2a2f] rounded-lg p-4 border border-slate-700">
              <p className="text-xs text-orange-400 font-medium mb-1">Parts Done</p>
              <p className="text-lg font-semibold">{partsCompleted}/{totalParts}</p>
            </div>
          </div>

          {/* Study Streak */}
          <div className="mt-6 pt-4 border-t border-slate-700">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Study Streak</span>
              <span className="text-orange-400 font-medium">4 days</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
