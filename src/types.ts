type Mode = "focus" | "break";

type SettingsType = {
    focusMinutes: number; // default 25
    breakMinutes: number; // default 5
};

type PomodoroTimer = {
    mode: Mode;
    totalSeconds: number;
    remainingSeconds: number;
    running: boolean;
};

export type { Mode, SettingsType, PomodoroTimer }