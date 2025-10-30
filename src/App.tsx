import { Flame, Leaf, Pause, Play, RotateCcw } from "lucide-react";
import { Button } from './components/ui/button';
import { useMemo, useState } from 'react';
import { Card, CardContent } from './components/ui/card';
import { Badge } from './components/ui/badge';
import { CircularProgressbar } from './components/CircularProgressbar';
import { Toaster } from './components/ui/sonner';
import { SettingsDialog } from "./components/SettingsDialog";
import { formatTime } from "./utils";
import { useTimer } from "./hooks/useTimer";
import type { Settings } from "@/types";
import { Tomato } from "./components/Tomato";

function App() {
  const LS_SETTINGS_KEY = "pocus:settings";

  const initialSettings: Settings = useMemo(() => {
    try {
      // const raw = localStorage.getItem(LS_SETTINGS_KEY);
      // if (raw) return JSON.parse(raw) as Settings;
    } catch (error) {
      console.error('Failed to load initial settings', error);
    }
    return { focusMinutes: 0.1, breakMinutes: 0.1 };
  }, []);

  const [settings, setSettings] = useState(initialSettings);

  const { timer, toggleRunning, resetTimer } = useTimer(settings);

  /**
   * Event Handlers
   */
  function onStartPause(): void {
    toggleRunning();
  }

  function onReset(): void {
    resetTimer();
  }

  function onSaveSettings(next: Settings): void {
    setSettings(next);
    try {
      localStorage.setItem(LS_SETTINGS_KEY, JSON.stringify(next));
    } catch (e) {
      console.error("Failed to save settings", e);
    }
    resetTimer(next);
  }

  return (
    <>
      <div className="min-h-dvh bg-neutral-50 px-4 py-10 flex justify-center">
        <div className="w-full max-w-3xl flex flex-col">
          {/* Header */}
          <header className="w-full py-4 mb-8 border-b border-b-slate-200">
            <div className="max-w-3xl mx-auto px-6 flex flex-wrap items-end justify-between gap-4 text-left">
              <div>
                <h1 className="text-2xl font-bold">Pocus </h1>
                <span className="text-gray-400">Stay focus with pomodoro!&nbsp;<Tomato className={"inline-block"} /></span>
              </div>
              <SettingsDialog
                className={"ml-auto"}
                settings={settings}
                onSave={onSaveSettings} />
            </div>
          </header >

          {/* Timer */}
          <Card className="w-full max-w-lg mx-auto">
            <CardContent className="px-8 py-10">
              <div className="flex flex-col items-center gap-6">
                {timer.mode === "focus" ? (
                  <Badge
                    variant="secondary"
                    className="bg-rose-500 text-white dark:bg-rose-600"
                  >
                    <Flame /> 집중 모드
                  </Badge>
                ) : (
                  <Badge
                    variant="secondary"
                    className="bg-teal-500 text-white dark:bg-teal-600"
                  >
                    <Leaf /> 휴식 모드
                  </Badge>
                )}

                {/* Circular Progressbar */}
                <CircularProgressbar
                  remaining={timer.remainingSeconds}
                  total={timer.totalSeconds}
                  text={formatTime(timer.remainingSeconds)}
                  className="mx-auto"
                  strokeWidth={16}
                  pathColor={timer.mode === "focus" ? "var(--color-rose-500)" : "var(--color-teal-500)"}
                  textColor={timer.mode === "focus" ? "var(--color-rose-500)" : "var(--color-teal-500)"}
                />

                {/* Controls (Start/Pause, Reset) */}
                <div className="flex flex-wrap items-center justify-center gap-8 mt-8">
                  <Button variant="outline" size="lg" aria-label={timer.running ? "Pause" : "Play"} onClick={onStartPause}>
                    {timer.running ? <><Pause />&nbsp;일시정지</> : <><Play />&nbsp;시작</>
                    }
                  </Button>
                  <Button variant="outline" size="lg" aria-label="reset" onClick={onReset}>
                    <RotateCcw />&nbsp;초기화
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card >

          {/* Footer */}
          <footer className="w-full max-w-lg mx-auto mt-6 flex items-center justify-between text-sm text-neutral-600">
            <div>오늘 완료 횟수: <span className="font-semibold text-neutral-800">{1}</span>&nbsp;회</div>
            <div>
              집중 {settings.focusMinutes}분 · 휴식 {settings.breakMinutes}분
            </div>
          </footer>
        </div>
      </div>

      <Toaster position={'top-right'} />
    </>
  )
}

export default App