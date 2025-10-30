import { Button } from "./ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Label } from "./ui/label";
import { Settings as SettingsIcon } from "lucide-react";
import { Slider } from "./ui/slider";
import { useEffect, useState, type FormEvent } from "react";
import type { Settings } from "@/types";

type SettingsDialogProps = {
    settings: Settings;
    className?: string;
    onSave: (next: Settings) => void;
};

function SettingsDialog({ settings, className, onSave }: SettingsDialogProps) {
    const [focusMinutes, setFocusMinutes] = useState<number[]>([settings.focusMinutes]);
    const [breakMinutes, setBreakMinutes] = useState<number[]>([settings.breakMinutes]);

    useEffect(() => {
        setFocusMinutes([settings.focusMinutes]);
        setBreakMinutes([settings.breakMinutes]);
    }, [settings])

    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        onSave({
            focusMinutes: focusMinutes[0],
            breakMinutes: breakMinutes[0]
        })
    }

    return (
        <div className={className}>
            <Dialog>
                <DialogTrigger asChild>
                    <Button className="text-gray-500" variant="ghost" size="sm" aria-label="Settings">
                        <SettingsIcon />
                        <span className="hidden sm:inline-block">설정</span>
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] space-y-6 py-6">
                    <form onSubmit={handleSubmit}>
                        <DialogHeader className="space-y-2">
                            <DialogTitle>Pocus 설정</DialogTitle>
                            <DialogDescription>
                                원하는 집중·휴식 시간을 설정해 나만의 Pocus 리듬을 만들어보세요.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-6">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between gap-3">
                                    <Label htmlFor="focusMinutes">집중 시간(분)</Label>
                                    <span className="text-sm text-muted-foreground">{focusMinutes[0]} 분</span>
                                </div>
                                <Slider
                                    id="focusMinutes"
                                    value={focusMinutes}
                                    onValueChange={setFocusMinutes}
                                    max={60}
                                    step={1}
                                />
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between gap-3">
                                    <Label htmlFor="breakMinutes">휴식 시간(분)</Label>
                                    <span className="text-sm text-muted-foreground">{breakMinutes[0]} 분</span>
                                </div>
                                <Slider
                                    id="breakMinutes"
                                    value={breakMinutes}
                                    onValueChange={setBreakMinutes}
                                    max={60}
                                    step={1}
                                />
                            </div>
                        </div>
                        <DialogFooter className="pt-2 gap-3">
                            <DialogClose asChild>
                                <Button variant="outline">닫기</Button>
                            </DialogClose>
                            <DialogClose asChild>
                                <Button type="submit">변경사항 저장</Button>
                            </DialogClose>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div >
    );
}

export { SettingsDialog };