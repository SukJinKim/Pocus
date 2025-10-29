import { Flame, Leaf, Pause, Play, RotateCcw } from "lucide-react";
import { Button } from './components/ui/button';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Card, CardContent } from './components/ui/card';
import { Badge } from './components/ui/badge';
import { CircularProgressbar } from './components/CircularProgressbar';
import { toast } from 'sonner';
import { Toaster } from './components/ui/sonner';
import { SettingsDialog } from "./components/SettingsDialog";
import { formatTime } from "./utils";
import type { Mode, SettingsType, PomodoroTimer } from "@/types";

function App() {
  const LS_SETTINGS_KEY = "pocus:settings";
  const DEFAULT_SETTINGS: SettingsType = {
    focusMinutes: 25,
    breakMinutes: 5
  }

  // 초기 설정 로드
  const initialSettings: SettingsType = useMemo(() => {
    try {
      const raw = localStorage.getItem(LS_SETTINGS_KEY);
      if (raw) return JSON.parse(raw) as SettingsType;
    } catch (error) {
      console.error('Failed to load initial settings', error);
    }
    return DEFAULT_SETTINGS;
  }, []);

  const [settings, setSettings] = useState(initialSettings);

  const FOCUS_SECONDS = settings.focusMinutes * 60;
  const BREAK_SECONDS = settings.breakMinutes * 60;
  const COUNTDOWN_INTERVAL_MS = 1000;

  const initialPomodoroTimer: PomodoroTimer = {
    mode: "focus" as Mode,
    running: false,
    totalSeconds: settings.focusMinutes * 60,
    remainingSeconds: settings.focusMinutes * 60
  };

  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [pomodoroTimer, setPomodoroTimer] = useState(initialPomodoroTimer)

  /**
   * Effects
   */
  // 1초씩 카운트다운
  useEffect(() => {
    if (pomodoroTimer.running && tickRef.current === null) {
      tickRef.current = setInterval(() => {
        setPomodoroTimer((prev) => {
          return {
            ...prev,
            remainingSeconds: prev.remainingSeconds - 1
          };
        });
      }, COUNTDOWN_INTERVAL_MS);
    }

    return () => {
      if (tickRef.current) {
        clearInterval(tickRef.current);
        tickRef.current = null;
      }
    };
  }, [pomodoroTimer.running]);

  // 모드 전환
  useEffect(() => {
    if (pomodoroTimer.remainingSeconds < 0) {
      setPomodoroTimer((prev) => {
        return {
          ...prev,
          mode: (prev.mode === "focus") ? "break" : "focus",
          totalSeconds: (prev.mode === "focus") ? BREAK_SECONDS : FOCUS_SECONDS,
          remainingSeconds: (prev.mode === "focus") ? BREAK_SECONDS : FOCUS_SECONDS
        }
      });

      // 토스트 알림 전송
      const nextMessage = pomodoroTimer.mode === "focus" ?
        "집중 모드가 종료되었습니다. 편히 쉬세요!☕" :
        "휴식 모드가 종료되었습니다. 다시 집중하세요!🔥";
      const nextIcon = pomodoroTimer.mode === "focus" ? <Leaf className="size-4" /> : <Flame className="size-4" />;

      toast(nextMessage, {
        icon: nextIcon,
        duration: 5000,
        classNames: {
          description: "!text-foreground/80",
        },
      })

      // Notify
      try {
        if ("Notification" in window) {
          if (Notification.permission === "granted") {
            new Notification(nextMessage);
          } else if (Notification.permission !== "denied") {
            Notification.requestPermission().then((perm) => {
              if (perm === "granted") {
                new Notification(nextMessage);
              }
            });
          }
        }
      } catch (error) {
        console.error('Failed to send notification', error);
      }
    };
  }, [pomodoroTimer.remainingSeconds]);

  /**
   * Event Handlers
   */
  function onStartPause(): void {
    if (pomodoroTimer.running) {
      setPomodoroTimer({
        ...pomodoroTimer,
        running: false
      })
    } else {
      setPomodoroTimer({
        ...pomodoroTimer,
        running: true
      })
    }
  }

  function onReset(): void {
    setPomodoroTimer(initialPomodoroTimer);
  }

  function onSaveSettings(next: SettingsType): void {
    setSettings(next);
    try {
      localStorage.setItem(LS_SETTINGS_KEY, JSON.stringify(next));
    } catch (e) {
      console.error("Failed to save settings", e);
    }
    setPomodoroTimer({
      mode: "focus",
      running: false,
      totalSeconds: next.focusMinutes * 60,
      remainingSeconds: next.focusMinutes * 60
    });
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
                <span className="text-gray-400">Stay focus with pomodoro!🍅</span>
              </div>
              <SettingsDialog
                className={"ml-auto"}
                settings={settings}
                onSave={onSaveSettings} />
            </div>
          </header >

          {/* 타이머 */}
          <Card className="w-full max-w-lg mx-auto">
            <CardContent className="px-8 py-10">
              <div className="flex flex-col items-center gap-6">
                {pomodoroTimer.mode === "focus" ? (
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
                  remaining={pomodoroTimer.remainingSeconds}
                  total={pomodoroTimer.totalSeconds}
                  text={formatTime(pomodoroTimer.remainingSeconds)}
                  className="mx-auto"
                  strokeWidth={16}
                  pathColor={pomodoroTimer.mode === "focus" ? "var(--color-rose-500)" : "var(--color-teal-500)"}
                  textColor={pomodoroTimer.mode === "focus" ? "var(--color-rose-500)" : "var(--color-teal-500)"}
                />

                {/* Controls (Start/Pause, Reset) */}
                <div className="flex flex-wrap items-center justify-center gap-8 mt-8">
                  <Button variant="outline" size="lg" aria-label={pomodoroTimer.running ? "Pause" : "Play"} onClick={onStartPause}>
                    {pomodoroTimer.running ? <><Pause /> 일시정지</> : <><Play /> 시작</>
                    }
                  </Button>
                  <Button variant="outline" size="lg" aria-label="reset" onClick={onReset}>
                    <RotateCcw /> 초기화
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

