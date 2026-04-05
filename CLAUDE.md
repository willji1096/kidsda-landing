# 키즈다 랜딩페이지 개선 프로젝트

## 프로젝트 개요
- **클라이언트**: 위고컴퍼니
- **프로젝트**: 키즈다(KidsDa) 랜딩페이지 개선
- **키즈다**: 어린이 시사 뉴스 교육 앱 (iOS/Android)
- **외주사**: 알파미디어

## 기술 스택
- **프론트엔드**: Vanilla HTML/CSS/JS (프레임워크 없음)
- **폰트**: Noto Sans KR (Google Fonts)
- **스크롤 방식**: 배민 스타일 풀페이지 커스텀 스크롤 (body fixed, JS wheel/touch 가로채기, 섹션 단위 전환)
- **애니메이션**: CSS keyframes + JS classList 토글

## 파일 구조
```
index.html   — 메인 HTML (11개 섹션: Hero → 폰목업 → 아이카드 → 교과연계 → 매일업데이트 → 후기 → 전문가 → 테마 → 학습 → CTA → Footer)
style.css    — 전체 스타일 (CSS Variables, 반응형 768px 브레이크포인트)
script.js    — 풀페이지 스크롤 로직 (섹션 전환, 인디케이터, reveal 애니메이션)
```

## 디자인 시스템
- **Primary**: Blue 계열 (--blue-500: #3B82F6, --blue-600: #2563EB)
- **텍스트**: Gray 계열 (--gray-800: #1F2937 본문, --gray-500: #6B7280 서브)
- **보더 라디우스**: 100px (버튼/뱃지), 20px (카드), 16px (테마 아이템)
- **레이아웃**: max-width 1100px, padding 40px (모바일 24px)

## 코딩 컨벤션
- 한국어 주석 사용
- CSS BEM 미사용, 단순 클래스명 (`.section-hero`, `.btn-primary`)
- JS: IIFE 패턴, vanilla DOM API
- 이미지 없이 CSS + 이모지로 비주얼 구성

## 주의사항
- body가 `position: fixed`이므로 일반 스크롤 동작하지 않음
- 섹션 전환 애니메이션 duration: 900ms
- 반응형: 768px 이하에서 레이아웃 변경 (네비 축소, 좌우 → 상하 배치)

## 워크플로우 & 도구

### 스킬 (슬래시 커맨드)
- `/browse` — 브라우저에서 랜딩페이지 열어 QA 테스트
- `/design-review` — 시각적 완성도 검수 (간격, 정렬, 일관성 체크)
- `/qa` — 체계적 QA + 버그 자동 수정
- `/landing-page-guide-v2` — 랜딩페이지 전환율 개선 가이드
- `/frontend-design` — 고퀄리티 UI 구현

### 에이전트
- `aing:iron` — 프론트엔드 구현 (화면, 컴포넌트, 스타일링)
- `aing:rowan` — 애니메이션/모션 (스크롤 전환, 마이크로인터랙션)
- `aing:willji` — UI/UX 디자인, 레이아웃 설계

### 로컬 서버
```bash
python3 -m http.server 8080
# 또는
npx live-server --port=8080
```
