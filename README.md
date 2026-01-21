# 🍅 Pocus (Pomodoro + Focus)

**Pocus**는 리액트(React)와 타입스크립트(TypeScript)를 기반으로 제작된 뽀모도로 타이머 웹 애플리케이션입니다.  
효율적인 집중 시간 관리를 위해 직관적인 UI와 실용적인 기능을 제공하며, 개인적인 학습 및 토이 프로젝트 목적으로 개발되었습니다.  
<br/>
<br/>

## 🚀 주요 기능

- **뽀모도로 타이머**: 집중 시간과 휴식 시간을 주기에 맞춰 관리할 수 있습니다.
- **실시간 시각화**: 원형 프로그레스 바를 통해 남은 집중/휴식 시간을 직관적으로 확인할 수 있습니다.
- **시간 커스터마이징**: 설정 다이얼로그를 통해 집중 시간과 휴식 시간을 사용자 편의에 맞게 조정할 수 있습니다.
- **테마 모드 지원**: 사용자 선호에 따라 라이트 모드와 다크 모드를 지원합니다.
- **반응형 웹**: 모바일과 데스크톱 환경 모두에서 최적화된 화면 구성을 제공합니다.  
<br/>
<br/>
  
## 🛠 기술 스택

- **Framework**: [React](https://reactjs.org/) (Vite 기반)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) (Radix UI)
- **State Management**: React Hooks (커스텀 훅: `useTimer`)
- **Icons**: Lucide React  
<br/>
<br/>
  
## 📂 프로젝트 구조

```text
src/
├── components/       # UI 및 기능별 컴포넌트 (Tomato, SettingsDialog 등)
│   └── ui/           # shadcn/ui 기본 컴포넌트 (Button, Card, Dialog 등)
├── hooks/            # 커스텀 훅 (useTimer.ts - 타이머 핵심 로직)
├── lib/              # 유틸리티 함수 (cn 등)
├── types.ts          # 타입 정의 파일
├── constants.ts      # 앱 전체에서 사용하는 상수 관리
├── App.tsx           # 메인 애플리케이션 레이아웃
└── main.tsx          # 엔트리 포인트
```  
<br/>
<br/>

## ⚙️ 시작하기

### 설치
```Bash
npm install
```

### 실행
```Bash
npm run dev
```  
<br/>
<br/>

## 💡 학습 포인트 (연습 목적)
- Custom Hook 설계: ```useTimer``` 훅을 통해 비즈니스 로직과 UI 로직을 분리하는 연습.
- TypeScript 적용: 컴포넌트 Props와 상태 관리에 타입 시스템을 적용하여 안정성 확보.
- 다크 모드 구현: ```next-themes``` 스타일의 테마 전환 로직 이해 및 적용.
- 컴포넌트 모듈화: ```shadcn/ui```를 활용한 재사용 가능한 UI 컴포넌트 구성 능력 향상.
