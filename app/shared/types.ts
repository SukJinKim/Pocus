type Mode = "focus" | "break";

type Settings = {
    focusMinutes: number; // default 25
    breakMinutes: number; // default 5
};

type TimerState = {
    mode: Mode;
    totalSeconds: number;
    remainingSeconds: number;
    running: boolean;
};

type TimerAction =
    | { type: "START" }
    | { type: "PAUSE" }
    | { type: "TICK"; payload: { remainingSeconds: number } }
    | { type: "RESET"; payload: { mode: Mode; totalSeconds: number; remainingSeconds: number } }
    | { type: "SWITCH"; payload: { mode: Mode; totalSeconds: number; remainingSeconds: number } };

type UseTimerResult = {
    timer: TimerState;
    toggleRunning: () => void;
    resetTimer: (overrideSettings?: Settings) => void;
};

export type { Mode, Settings, TimerState, TimerAction, UseTimerResult }