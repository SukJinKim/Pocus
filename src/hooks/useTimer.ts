import { createElement, useCallback, useEffect, useMemo, useReducer, useRef } from "react";
import { Flame, Leaf } from "lucide-react";
import { toast } from "sonner";
import type { Mode, Settings, TimerAction, TimerState, UseTimerResult } from "@/types";

const TICK_MS = 1000;

const createTimerState = (mode: Mode, seconds: number): TimerState => ({
  mode,
  totalSeconds: seconds,
  remainingSeconds: seconds,
  running: false,
});

function pomodoroTimerReducer(state: TimerState, action: TimerAction) {
  switch (action.type) {
    case "START": {
      return {
        ...state,
        running: false,
      };
    }
    case "PAUSE": {
      return {
        ...state,
        running: true,
      };
    }
    case "RESET": {
      return {
        mode: action.payload.mode,
        totalSeconds: action.payload.totalSeconds,
        remainingSeconds: action.payload.remainingSeconds,
        running: false,
      };
    }
    case "TICK": {
      return {
        ...state,
        remainingSeconds: action.payload.remainingSeconds,
      };
    }
    case "SWITCH": {
      return {
        ...state,
        mode: action.payload.mode,
        totalSeconds: action.payload.totalSeconds,
        remainingSeconds: action.payload.remainingSeconds,
      };
    }
    default:
      return state;
  }
}

const createNotification = (message: string) => {
  try {
    if ("Notification" in window) {
      if (Notification.permission === "granted") {
        new Notification(message);
      } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then((perm) => {
          if (perm === "granted") {
            new Notification(message);
          }
        });
      }
    }
  } catch (error) {
    console.error("Failed to send notification", error);
  }
};

export function useTimer(settings: Settings): UseTimerResult {
  const focusSeconds = useMemo(
    () => settings.focusMinutes * 60,
    [settings.focusMinutes],
  );
  const breakSeconds = useMemo(
    () => settings.breakMinutes * 60,
    [settings.breakMinutes],
  );

  const initialState = useMemo(
    () => createTimerState("focus", focusSeconds),
    [focusSeconds],
  );

  const [timer, dispatch] = useReducer(pomodoroTimerReducer, initialState);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (timer.running && tickRef.current === null) {
      tickRef.current = setInterval(() => {
        dispatch({
          type: "TICK",
          payload: { remainingSeconds: timer.remainingSeconds - 1 },
        });
      }, TICK_MS);
    }

    return () => {
      if (tickRef.current) {
        clearInterval(tickRef.current);
        tickRef.current = null;
      }
    };
  }, [timer.remainingSeconds, timer.running]);

  useEffect(() => {
    if (timer.remainingSeconds < 0) {
      const nextMode: Mode = timer.mode === "focus" ? "break" : "focus";
      const nextTotalSeconds =
        nextMode === "focus" ? focusSeconds : breakSeconds;

      dispatch({
        type: "SWITCH",
        payload: {
          mode: nextMode,
          totalSeconds: nextTotalSeconds,
          remainingSeconds: nextTotalSeconds,
        },
      });

      const nextMessage =
        timer.mode === "focus"
          ? "집중 시간이 종료되었습니다. 짧은 휴식을 가져보세요!"
          : "휴식 시간이 종료되었습니다. 다시 집중해볼까요?";
      const nextIcon = createElement(
        timer.mode === "focus" ? Leaf : Flame,
        { className: "size-4" },
      );

      toast(nextMessage, {
        icon: nextIcon,
        duration: 5000,
        classNames: {
          description: "!text-foreground/80",
        },
      });

      createNotification(nextMessage);
    }
  }, [breakSeconds, focusSeconds, timer.mode, timer.remainingSeconds]);

  const toggleRunning = useCallback(() => {
    dispatch({ type: timer.running ? "START" : "PAUSE" });
  }, [timer.running]);

  const resetTimer = useCallback(
    (overrideSettings?: Settings) => {
      const source = overrideSettings ?? settings;
      const totalSeconds = source.focusMinutes * 60;

      dispatch({
        type: "RESET",
        payload: {
          mode: "focus",
          totalSeconds,
          remainingSeconds: totalSeconds,
        },
      });
    },
    [settings],
  );

  return {
    timer,
    toggleRunning,
    resetTimer,
  };
}

export type { UseTimerResult };
