
import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Calendar, Settings, Share, Music, Maximize2, RotateCcw, Play, Pause, SkipForward } from 'lucide-react';
import { SettingsModal } from './SettingsModal';

interface Subject {
  id: string;
  title: string;
  timeSpent: string;
  progress: number;
  totalParts: number;
  completedParts: number;
}

interface StudySessionProps {
  subject: Subject;
  onBack: () => void;
}

export function StudySession({ subject, onBack }: StudySessionProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [totalTimeSpent, setTotalTimeSpent] = useState(3660);
  const [todayTimeSpent, setTodayTimeSpent] = useState(0);
  const [sessionCount, setSessionCount] = useState(4);
  const [completedSessions, setCompletedSessions] = useState(0);
  const [isBreak, setIsBreak] = useState(false);
  const [resetCount, setResetCount] = useState(0);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  
  // Settings
  const [pomodoroLength, setPomodoroLength] = useState(25);
  const [shortBreakLength, setShortBreakLength] = useState(5);
  const [longBreakLength, setLongBreakLength] = useState(20);
  const [usePomodoroMode, setUsePomodoroMode] = useState(true);
  
  const audioRef = useRef<HTMLAudioElement>(null);

  // Timer effect with break logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => {
          if (time <= 1) {
            if (usePomodoroMode) {
              if (isBreak) {
                setIsBreak(false);
                setIsPlaying(false);
                return pomodoroLength * 60;
              } else {
                const newCompletedSessions = completedSessions + 1;
                setCompletedSessions(newCompletedSessions);
                setIsBreak(true);
                setIsPlaying(false);
                
                const breakLength = newCompletedSessions % 3 === 0 ? longBreakLength : shortBreakLength;
                return breakLength * 60;
              }
            }
            return 0;
          }
          return time - 1;
        });
        
        if (!isBreak) {
          setTodayTimeSpent((time) => time + 1);
          setTotalTimeSpent((time) => time + 1);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, timeLeft, isBreak, completedSessions, usePomodoroMode, pomodoroLength, shortBreakLength, longBreakLength]);

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
    const newResetCount = resetCount + 1;
    setResetCount(newResetCount);
    
    if (newResetCount >= 2) {
      setSessionCount(0);
      setCompletedSessions(0);
      setResetCount(0);
    }
    
    setTimeLeft(isBreak ? (completedSessions % 3 === 0 ? longBreakLength : shortBreakLength) * 60 : pomodoroLength * 60);
    setIsPlaying(false);
  };

  const skipSession = () => {
    if (isBreak) {
      setIsBreak(false);
      setTimeLeft(pomodoroLength * 60);
    } else {
      const newCompletedSessions = completedSessions + 1;
      setCompletedSessions(newCompletedSessions);
      setIsBreak(true);
      const breakLength = newCompletedSessions % 3 === 0 ? longBreakLength : shortBreakLength;
      setTimeLeft(breakLength * 60);
    }
    setSessionCount(prev => prev + 1);
    setIsPlaying(false);
  };

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isMusicPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsMusicPlaying(!isMusicPlaying);
    }
  };

  const currentDuration = usePomodoroMode 
    ? (isBreak 
        ? (completedSessions % 3 === 0 ? longBreakLength : shortBreakLength) * 60 
        : pomodoroLength * 60)
    : 25 * 60;
  
  const progress = ((currentDuration - timeLeft) / currentDuration) * 100;

  return (
    <div className="pb-10">
      {/* Hidden audio element for background music */}
      <audio 
        ref={audioRef} 
        loop 
        preload="none"
        src="data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAAA"
      />
      
      {/* Back button and subject title */}
      <div className="flex justify-between items-center px-6 pt-6 pb-2">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="text-gray-400 hover:text-white transition-colors p-2 rounded-full hover:bg-slate-800"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h2 className="text-xl font-semibold">{subject.title}</h2>
        </div>
        <Share className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-6 mt-6">
        {/* Left: Pomodoro Card */}
        <div className="bg-[#1a1a1f] rounded-xl p-6 relative shadow-lg border border-slate-800">
          <div className="flex justify-between items-center mb-6">
            <span className="bg-red-500 text-white text-xs font-medium rounded-full px-2 py-1">
              {sessionCount}
            </span>
            <div className="flex space-x-3">
              <Maximize2 className="w-5 h-5 cursor-pointer hover:text-orange-400 text-gray-400 transition-colors" />
              <Music 
                className={`w-5 h-5 cursor-pointer transition-colors ${
                  isMusicPlaying ? 'text-orange-400' : 'text-gray-400 hover:text-orange-400'
                }`}
                onClick={toggleMusic}
              />
              <Settings 
                className="w-5 h-5 cursor-pointer hover:text-orange-400 text-gray-400 transition-colors" 
                onClick={() => setIsSettingsOpen(true)}
              />
            </div>
          </div>

          <div className="relative flex items-center justify-center mb-8">
            <div className="w-full max-w-[260px] md:max-w-[320px] mx-auto">
              <svg viewBox="0 0 200 200" className="w-full h-full transform -rotate-90">
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
                  stroke={isBreak ? "#10b981" : "#f97316"}
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 85}`}
                  strokeDashoffset={`${2 * Math.PI * 85 * (1 - progress / 100)}`}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-in-out"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-sm text-gray-400 mb-1">
                    {isBreak ? 'break' : (isPlaying ? 'focused' : 'paused')}
                  </p>
                  <h1 className="text-3xl md:text-4xl font-bold mb-1">{formatTime(timeLeft)}</h1>
                  <p className="text-xs text-gray-500">{formatTime(totalTimeSpent)}</p>
                </div>
              </div>
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
            <h3 className="text-lg font-semibold">{subject.title}</h3>
            <span className="text-orange-400 text-sm font-medium">{subject.progress}%</span>
          </div>
          
          <div className="h-2 bg-slate-700 rounded-full overflow-hidden mb-6">
            <div 
              className="bg-gradient-to-r from-orange-500 to-red-500 h-full transition-all duration-500 ease-out" 
              style={{ width: `${subject.progress}%` }}
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
              <p className="text-lg font-semibold">{subject.completedParts}/{subject.totalParts}</p>
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

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        pomodoroLength={pomodoroLength}
        shortBreakLength={shortBreakLength}
        longBreakLength={longBreakLength}
        onPomodoroChange={setPomodoroLength}
        onShortBreakChange={setShortBreakLength}
        onLongBreakChange={setLongBreakLength}
        usePomodoroMode={usePomodoroMode}
        onPomodoroModeChange={setUsePomodoroMode}
      />
    </div>
  );
}
