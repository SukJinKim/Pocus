import type { Route } from "./+types"
import { Link } from "react-router"
import { ArrowRight, Check } from "lucide-react"
import { Button } from "~/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
import { Tomato } from "~/components/Tomato"
import { cn } from "~/lib/utils"

const providers = [
  {
    id: "google",
    name: "Google",
    href: "/auth/google",
    accentClass:
      "border-[#DB4437]/50 text-[#DB4437] hover:bg-[#DB4437]/10 dark:border-[#DB4437]/40",
    Icon: GoogleIcon,
  },
  {
    id: "naver",
    name: "Naver",
    href: "/auth/naver",
    accentClass:
      "border-[#03C75A]/50 text-[#03C75A] hover:bg-[#03C75A]/10 dark:border-[#03C75A]/40",
    Icon: NaverIcon,
  },
  {
    id: "kakao",
    name: "Kakao",
    href: "/auth/kakao",
    accentClass:
      "border-[#FEE500]/50 text-neutral-900 hover:bg-[#FEE500]/20 dark:border-[#FEE500]/40",
    Icon: KakaoIcon,
  },
] as const

const highlights = [
  "기기마다 집중 기록과 테마가 자동으로 동기화돼요.",
  "세션 통계가 안전하게 클라우드에 저장돼요.",
  "커뮤니티 업데이트와 베타 기능을 가장 먼저 경험해요.",
] as const

export function meta(): Route.MetaDescriptor[] {
  return [
    { title: "로그인 | Pocus" },
    { name: "description", content: "Google, Naver, Kakao 로 Pocus에 로그인하세요." },
  ]
}

export default function LoginPage() {
  return (
    <div className="min-h-dvh bg-neutral-100/80 dark:bg-neutral-950 px-4 py-10 flex items-center justify-center">
      <div className="w-full max-w-2xl">
        <Card className="border-slate-200/80 dark:border-slate-800/60 bg-white/90 dark:bg-neutral-900/80 shadow-lg">
          <CardHeader className="text-center space-y-5">
            <div className="inline-flex items-center justify-center gap-2 text-md font-medium">
              <Tomato className="size-5" />
              <span>Pocus</span>
            </div>
            <div className="space-y-2">
              <CardTitle className="text-3xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-rose-400 via-rose-500 to-rose-600 dark:from-rose-300 dark:via-rose-400 dark:to-rose-500">
                Stay focus with pomodoro!
              </CardTitle>
              <CardDescription className="text-base">
                선호하는 계정으로 로그인하고, 오늘의 pocus 경험을 이어가세요.
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-8">
            <div className="space-y-4">
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                SSO 로그인
              </p>
              <div className="grid gap-3">
                {providers.map((provider) => (
                  <Button
                    key={provider.id}
                    asChild
                    variant="outline"
                    className={cn(
                      "w-full justify-start border px-4 py-6 text-base font-semibold",
                      "bg-white text-slate-900 hover:text-slate-900 dark:bg-neutral-900",
                      provider.accentClass
                    )}
                  >
                    <a
                      href={provider.href}
                      className="flex w-full items-center justify-between"
                      aria-label={`${provider.name} 계정으로 로그인`}
                    >
                      <span className="flex items-center gap-3">
                        <provider.Icon className="size-6" />
                        <span>{provider.name} 계정으로 로그인</span>
                      </span>
                      <ArrowRight className="size-5 opacity-60" />
                    </a>
                  </Button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground text-center">
                로그인 버튼을 누르면 Pocus의 이용약관과 개인정보 처리방침에 동의하는 것으로 간주됩니다.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-linear-to-br from-white via-white to-rose-100/60 dark:from-neutral-900 dark:via-neutral-900 dark:to-rose-950/40 p-5 shadow-inner">
              <p className="text-sm font-semibold text-slate-900 dark:text-neutral-100 mb-4">
                로그인하면 이런 점이 좋아요
              </p>
              <ul className="space-y-3 text-sm text-muted-foreground">
                {highlights.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <Check className="mt-0.5 size-4 text-rose-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>

          <CardFooter className="flex-col gap-3 border-t border-slate-200/60 dark:border-slate-800/60 pt-6">
            <div className="flex w-full flex-col gap-3 sm:flex-row">
              <Button
                variant="ghost"
                className="w-full text-muted-foreground hover:text-rose-500"
                asChild
              >
                <Link to="/">로그인 없이 사용하기</Link>
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path
        fill="#EA4335"
        d="M12.24 10.285v3.59h5.01c-.203 1.146-1.352 3.36-5.01 3.36-3.017 0-5.48-2.49-5.48-5.555s2.463-5.555 5.48-5.555c1.716 0 2.868.695 3.525 1.3l2.402-2.31C16.64 3.632 14.65 2.7 12.24 2.7 6.97 2.7 2.7 6.97 2.7 12.24c0 5.27 4.27 9.54 9.54 9.54 5.507 0 9.14-3.868 9.14-9.323 0-.627-.068-1.103-.152-1.572H12.24Z"
      />
    </svg>
  )
}

function NaverIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path fill="#03C75A" d="M4 4h16v16H4z" />
      <path fill="white" d="M14.3 17.5h-2.09l-2.5-3.77v3.77H7.5V6.5h2.21l2.39 3.54V6.5h2.2z" />
    </svg>
  )
}

function KakaoIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <ellipse cx="12" cy="12" rx="10" ry="9" fill="#FEE500" />
      <path
        fill="#381E1F"
        d="M7 14.4c.9.53 2.27 1.04 5 1.04 2.73 0 4.1-.51 5-1.04-.28 1.46-1.72 4.2-5 4.2-3.28 0-4.72-2.74-5-4.2Z"
      />
    </svg>
  )
}
