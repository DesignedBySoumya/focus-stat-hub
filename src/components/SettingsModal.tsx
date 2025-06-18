
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  pomodoroLength: number;
  shortBreakLength: number;
  longBreakLength: number;
  onPomodoroChange: (minutes: number) => void;
  onShortBreakChange: (minutes: number) => void;
  onLongBreakChange: (minutes: number) => void;
  usePomodoroMode: boolean;
  onPomodoroModeChange: (enabled: boolean) => void;
}

export function SettingsModal({
  isOpen,
  onClose,
  pomodoroLength,
  shortBreakLength,
  longBreakLength,
  onPomodoroChange,
  onShortBreakChange,
  onLongBreakChange,
  usePomodoroMode,
  onPomodoroModeChange
}: SettingsModalProps) {
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins.toString().padStart(2, '0')}m` : `${minutes}m`;
  };

  const TimeAdjuster = ({ 
    label, 
    value, 
    onChange 
  }: { 
    label: string; 
    value: number; 
    onChange: (value: number) => void;
  }) => (
    <div className="flex justify-between items-center py-3">
      <span className="text-white">{label}</span>
      <div className="flex items-center space-x-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onChange(Math.max(5, value - 5))}
          className="w-8 h-8 p-0 bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
        >
          -
        </Button>
        <span className="text-white min-w-[60px] text-center">{formatTime(value)}</span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onChange(value + 5)}
          className="w-8 h-8 p-0 bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
        >
          +
        </Button>
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#1a1a1f] border-slate-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-white">Pomodoro Settings</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center py-3">
            <span className="text-white">Use Pomodoro</span>
            <button
              onClick={() => onPomodoroModeChange(!usePomodoroMode)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                usePomodoroMode ? 'bg-orange-500' : 'bg-slate-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  usePomodoroMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {usePomodoroMode && (
            <>
              <TimeAdjuster
                label="Pomodoro Length"
                value={pomodoroLength}
                onChange={onPomodoroChange}
              />
              <TimeAdjuster
                label="Short Break Length"
                value={shortBreakLength}
                onChange={onShortBreakChange}
              />
              <TimeAdjuster
                label="Long Break Length"
                value={longBreakLength}
                onChange={onLongBreakChange}
              />
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
