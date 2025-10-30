import { Flame, Leaf, Pause, Play, RotateCcw } from "lucide-react";
import { Button } from './components/ui/button';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Card, CardContent } from './components/ui/card';
import { Badge } from './components/ui/badge';
import { CircularProgressbar } from './components/CircularProgressbar';
import { Toaster } from './components/ui/sonner';
import { SettingsDialog } from "./components/SettingsDialog";
import { formatTime, todayKey } from "./utils";
import { useTimer } from "./hooks/useTimer";
import type { Settings } from "@/types";
import { Tomato } from "./components/Tomato";
import { toast } from "sonner";
import { LS_KEYS } from "./constants";

function App() {
  const initialSettings: Settings = useMemo(() => {
    try {
      const raw = localStorage.getItem(LS_KEYS.settings);
      if (raw) return JSON.parse(raw) as Settings;
    } catch (error) {
      console.error('Failed to load initial settings', error);
    }
    return { focusMinutes: 25, breakMinutes: 5 };
  }, []);

  const initialTodaySessions: number = useMemo(() => {
    try {
      const raw = localStorage.getItem(LS_KEYS.sessionsByDay);
      if (!raw) return 0;
      const byDay = JSON.parse(raw) as Record<string, number>;
      return byDay[todayKey()] ?? 0;
    } catch {
      return 0;
    }
  }, [])

  const [settings, setSettings] = useState(initialSettings);
  const [todaySessions, setTodaySessions] = useState(initialTodaySessions);

  const { timer, toggleRunning, resetTimer } = useTimer(settings);
  const prevModeRef = useRef(timer.mode);

  useEffect(() => {
    const prevMode = prevModeRef.current;

    if (prevMode === "focus" && timer.mode === "break") {
      const today = todayKey();

      setTodaySessions((prev) => {
        const next = prev + 1;

        try {
          const raw = localStorage.getItem(LS_KEYS.sessionsByDay);
          const byDay = raw ? (JSON.parse(raw) as Record<string, number>) : {};
          byDay[today] = next;
          localStorage.setItem(LS_KEYS.sessionsByDay, JSON.stringify(byDay));
        } catch (error) {
          console.error("Failed to persist session count", error);
        }

        return next;
      });
    }

    prevModeRef.current = timer.mode;
  }, [timer.mode]);

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
      localStorage.setItem(LS_KEYS.settings, JSON.stringify(next));
    } catch (e) {
      toast.error("세팅을 저장하지 못했어요. 잠시 후 다시 시도해주세요.")
      console.error("Failed to save settings", e);
    }
    resetTimer(next);
    toast.success("세팅이 저장됐어요! 이제 집중 세션를 시작해볼까요?")
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
                    <Flame /> 집중 세션
                  </Badge>
                ) : (
                  <Badge
                    variant="secondary"
                    className="bg-teal-500 text-white dark:bg-teal-600"
                  >
                    <Leaf /> 휴식 세션
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
            <div>오늘 완료 세션: <span className="font-semibold text-neutral-800">{todaySessions}</span>&nbsp;회</div>
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
