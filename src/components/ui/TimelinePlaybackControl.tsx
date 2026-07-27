import React, { useState, useEffect } from 'react';
import { Play, Pause, FastForward, Sliders, AlertTriangle, GitCompare } from 'lucide-react';

interface TimelinePlaybackControlProps {
  onTimeChange: (timeMinute: number) => void;
  onCompareToggle: (enabled: boolean) => void;
  onBottleneckToggle: (enabled: boolean) => void;
  isCompareMode: boolean;
  isBottleneckMode: boolean;
}

export const TimelinePlaybackControl: React.FC<TimelinePlaybackControlProps> = ({
  onTimeChange,
  onCompareToggle,
  onBottleneckToggle,
  isCompareMode,
  isBottleneckMode,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState<1 | 4 | 10>(1);
  const [timeMinute, setTimeMinute] = useState(1170); // Default ~19:30 (1170 mins from midnight)

  useEffect(() => {
    let interval: any = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setTimeMinute((prev) => {
          const next = prev + speed;
          const capped = next > 1380 ? 480 : next; // Loop 08:00 (480m) to 23:00 (1380m)
          onTimeChange(capped);
          return capped;
        });
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isPlaying, speed, onTimeChange]);

  const handleSlider = (val: number) => {
    setTimeMinute(val);
    onTimeChange(val);
  };

  const formatTime = (minutes: number) => {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    const padH = hrs.toString().padStart(2, '0');
    const padM = mins.toString().padStart(2, '0');
    return `${padH}:${padM}`;
  };

  return (
    <div className="glass-panel bg-[var(--surface-1)] border border-[var(--border-main)] rounded-2xl p-4 shadow-2xl space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Title and Time Readout */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-400 font-bold block">
              Digital Twin Timeline Playback
            </span>
            <div className="text-base font-extrabold font-mono text-[var(--text-heading)]">
              {formatTime(timeMinute)}{' '}
              <span className="text-xs font-normal text-[var(--text-muted)] font-sans">
                {timeMinute >= 1140 ? '(Friday Dinner Peak)' : '(Historical Playback)'}
              </span>
            </div>
          </div>
        </div>

        {/* Controls Bar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Play / Pause */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-semibold text-xs transition-all flex items-center gap-1.5 shadow-md shadow-indigo-500/20"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isPlaying ? 'Pause' : 'Play'}</span>
          </button>

          {/* Speeds */}
          <div className="flex items-center bg-[var(--surface-2)] p-1 rounded-xl border border-[var(--border-muted)]">
            {([1, 4, 10] as const).map((s) => (
              <button
                key={s}
                onClick={() => setSpeed(s)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                  speed === s ? 'bg-indigo-600 text-white' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>

          {/* Bottleneck Overlay Toggle */}
          <button
            onClick={() => onBottleneckToggle(!isBottleneckMode)}
            className={`px-3 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
              isBottleneckMode
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                : 'bg-[var(--surface-2)] border-[var(--border-muted)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Bottlenecks</span>
          </button>

          {/* Compare Days Toggle */}
          <button
            onClick={() => onCompareToggle(!isCompareMode)}
            className={`px-3 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
              isCompareMode
                ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300'
                : 'bg-[var(--surface-2)] border-[var(--border-muted)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <GitCompare className="w-3.5 h-3.5" />
            <span>Compare Days</span>
          </button>
        </div>
      </div>

      {/* Scrubber Range Slider */}
      <div className="space-y-1">
        <input
          type="range"
          min={480} // 08:00
          max={1380} // 23:00
          step={5}
          value={timeMinute}
          onChange={(e) => handleSlider(Number(e.target.value))}
          className="w-full accent-indigo-500 cursor-pointer h-2 bg-[var(--surface-3)] rounded-lg"
        />
        <div className="flex justify-between text-[10px] font-mono text-[var(--text-muted)]">
          <span>08:00 Opening</span>
          <span>13:00 Lunch Peak</span>
          <span className="text-amber-400 font-bold">19:30 Dinner Bottleneck</span>
          <span>23:00 Close</span>
        </div>
      </div>
    </div>
  );
};
