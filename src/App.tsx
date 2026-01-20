import { useState, useEffect } from 'react';
import moment from 'moment';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Timer, History, Globe, Settings, Moon, Sun, Play, Pause, RotateCcw } from 'lucide-react';

type Mode = 'clock' | 'stopwatch' | 'timer';

function App() {
  const [time, setTime] = useState(moment());
  const [mode, setMode] = useState<Mode>('clock');
  const [isRunning, setIsRunning] = useState(false);
  const [swTime, setSwTime] = useState(0);
  const [countdown, setCountdown] = useState(60);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(moment());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let interval: any;
    if (isRunning && mode === 'stopwatch') {
      interval = setInterval(() => setSwTime(s => s + 10), 10);
    } else if (isRunning && mode === 'timer') {
      interval = setInterval(() => setCountdown(c => (c > 0 ? c - 1 : 0)), 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, mode]);

  const formatStopwatch = (ms: number) => {
    const m = Math.floor(ms / 60000);
    const s = Math.floor((ms % 60000) / 1000);
    const ms_part = Math.floor((ms % 1000) / 10);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}.${ms_part.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 font-mono">
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/20 rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-2xl bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 p-12 rounded-[3rem] text-center neon-shadow"
      >
        <div className="flex justify-center gap-4 mb-12">
          <ModeBtn icon={<Clock className="w-5 h-5" />} active={mode === 'clock'} onClick={() => setMode('clock')} />
          <ModeBtn icon={<History className="w-5 h-5" />} active={mode === 'stopwatch'} onClick={() => setMode('stopwatch')} />
          <ModeBtn icon={<Timer className="w-5 h-5" />} active={mode === 'timer'} onClick={() => setMode('timer')} />
        </div>

        <AnimatePresence mode="wait">
          {mode === 'clock' && (
            <motion.div
              key="clock"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <h2 className="text-8xl md:text-9xl font-black text-emerald-400 tracking-tighter text-neon uppercase">
                {time.format('HH:mm:ss')}
              </h2>
              <p className="text-xl text-emerald-600/60 font-medium tracking-widest uppercase">
                {time.format('dddd, MMMM D, YYYY')}
              </p>
            </motion.div>
          )}

          {mode === 'stopwatch' && (
            <motion.div
              key="stopwatch"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              <h2 className="text-8xl md:text-9xl font-black text-blue-400 tracking-tighter uppercase whitespace-nowrap">
                {formatStopwatch(swTime)}
              </h2>
              <div className="flex justify-center gap-6">
                <ActionBtn icon={isRunning ? <Pause /> : <Play />} onClick={() => setIsRunning(!isRunning)} color="blue" />
                <ActionBtn icon={<RotateCcw />} onClick={() => { setSwTime(0); setIsRunning(false); }} color="zinc" />
              </div>
            </motion.div>
          )}

          {mode === 'timer' && (
            <motion.div
              key="timer"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              <h2 className="text-8xl md:text-9xl font-black text-amber-400 tracking-tighter">
                {Math.floor(countdown / 60).toString().padStart(2, '0')}:{(countdown % 60).toString().padStart(2, '0')}
              </h2>
              <div className="flex justify-center gap-6">
                <ActionBtn icon={isRunning ? <Pause /> : <Play />} onClick={() => setIsRunning(!isRunning)} color="amber" />
                <ActionBtn icon={<RotateCcw />} onClick={() => { setCountdown(60); setIsRunning(false); }} color="zinc" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-16 pt-8 border-t border-zinc-800 flex justify-between items-center text-zinc-500 text-xs">
          <div className="flex items-center gap-2">
            <Globe className="w-3 h-3" />
            <span>LOCAL TIMEZONE: {Intl.DateTimeFormat().resolvedOptions().timeZone}</span>
          </div>
          <p>© 2024 MK-PROJECTS</p>
        </div>
      </motion.div>
    </div>
  );
}

function ModeBtn({ icon, active, onClick }: { icon: any, active: boolean, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`p-4 rounded-2xl transition-all ${active
          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
          : 'text-zinc-600 hover:text-zinc-300'
        }`}
    >
      {icon}
    </button>
  );
}

function ActionBtn({ icon, onClick, color }: { icon: any, onClick: () => void, color: string }) {
  const colors: any = {
    blue: 'bg-blue-500 hover:bg-blue-600 shadow-blue-500/20',
    amber: 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/20',
    zinc: 'bg-zinc-700 hover:bg-zinc-600 shadow-zinc-500/20'
  };
  return (
    <button
      onClick={onClick}
      className={`w-16 h-16 rounded-full flex items-center justify-center text-white transition-all shadow-xl active:scale-90 ${colors[color]}`}
    >
      {icon}
    </button>
  );
}

export default App;
