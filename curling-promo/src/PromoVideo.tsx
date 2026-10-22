import React from 'react';
import {
  AbsoluteFill,
  Audio,
  staticFile,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from 'remotion';

// 색상 팔레트 (딥 그린 / 레드 / 골드 / 아이스 블루 / 스노우 화이트)
const C = {
  green: '#0B3D2E',
  red: '#C8102E',
  gold: '#F2C14E',
  ice: '#A9D8F0',
  snow: '#FFFFFF',
};

const TITLE = '2026 1대1 드로우 챌린지(가안)';
const DATE_PLACE = '12.26 · 의정부컬링경기장 (장소 변경 가능)';
// public/audio/carol.mp3 를 넣은 뒤 true 로 바꾸세요 (저작권 확인된 음원만)
const HAS_AUDIO = false;
const TEAM_COUNT = 128; // 예상 참가팀 (1대1 단판 토너먼트)

// 눈송이 패럴랙스: 3개 레이어가 서로 다른 속도로 내려옴
const Snow: React.FC = () => {
  const frame = useCurrentFrame();
  const {height} = useVideoConfig();
  const layers = [
    {count: 40, speed: 1.2, size: 6, opacity: 0.4},
    {count: 25, speed: 2.2, size: 10, opacity: 0.6},
    {count: 15, speed: 3.4, size: 16, opacity: 0.8},
  ];
  return (
    <AbsoluteFill>
      {layers.map((layer, li) =>
        Array.from({length: layer.count}).map((_, i) => {
          const x = (i * 137.5 + li * 53) % 1920;
          const y = ((i * 91 + frame * layer.speed) % (height + 40)) - 20;
          return (
            <div
              key={`${li}-${i}`}
              style={{
                position: 'absolute',
                left: x,
                top: y,
                width: layer.size,
                height: layer.size,
                borderRadius: '50%',
                background: C.snow,
                opacity: layer.opacity,
              }}
            />
          );
        })
      )}
    </AbsoluteFill>
  );
};

// 1. 오프닝 (0–60f): 빙판 위 스톤 미끄러짐 + 눈 패럴랙스
const Opening: React.FC = () => {
  const frame = useCurrentFrame();
  const x = interpolate(frame, [0, 60], [-300, 960], {
    easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    extrapolateRight: 'clamp',
  });
  return (
    <AbsoluteFill style={{background: `linear-gradient(180deg, ${C.green}, #06231A)`}}>
      <Snow />
      <div
        style={{
          position: 'absolute',
          left: x,
          top: 620,
          width: 180,
          height: 180,
          borderRadius: '50%',
          background: `radial-gradient(circle at 35% 35%, #ffffff, ${C.ice})`,
          boxShadow: '0 0 40px rgba(169,216,240,0.6)',
        }}
      />
    </AbsoluteFill>
  );
};

// 2. 1대1 경기 (60–150f) — 촬영 소스 자리표시자
const MatchPlaceholder: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 200}});
  return (
    <AbsoluteFill style={{background: C.ice, justifyContent: 'center', alignItems: 'center'}}>
      <div
        style={{
          border: `4px dashed ${C.green}`,
          padding: '60px 90px',
          transform: `scale(${0.9 + enter * 0.1})`,
          textAlign: 'center',
          color: C.green,
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{fontSize: 40, fontWeight: 700}}>[촬영 소스 자리]</div>
        <div style={{fontSize: 28, marginTop: 12}}>1대1 스톤 던지기 · 스위핑 (3~5초, 슬로모션)</div>
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: 120,
          fontSize: 64,
          fontWeight: 800,
          color: C.green,
          fontFamily: 'sans-serif',
        }}
      >
        1대1, 가장 가까운 한 점
      </div>
    </AbsoluteFill>
  );
};

// 3. 코스튬 그룹 몽타주 (150–270f): 복장 카드가 스태거로 등장 + 비트 싱크 컷 전환
const costumes = [
  {label: '산타', emoji: '🎅', color: C.red},
  {label: '루돌프', emoji: '🦌', color: '#8B5A2B'},
  {label: '트리', emoji: '🎄', color: '#1E7B4F'},
  {label: '눈사람', emoji: '⛄', color: '#4A90C2'},
  {label: '선물상자', emoji: '🎁', color: C.gold},
  {label: '엘프', emoji: '🧝', color: '#2E8B57'},
];

const CostumeMontage: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const beat = Math.floor(frame / 15) % 2; // 비트 싱크 (약 120 BPM 가정)
  return (
    <AbsoluteFill style={{background: C.green, justifyContent: 'center', alignItems: 'center'}}>
      <Snow />
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 360px)',
          gap: 36,
          transform: `scale(${beat ? 1.02 : 1})`,
        }}
      >
        {costumes.map((c, i) => {
          const s = spring({frame: frame - i * 8, fps, config: {damping: 14}});
          return (
            <div
              key={c.label}
              style={{
                height: 200,
                borderRadius: 24,
                background: c.color,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                transform: `translateY(${(1 - s) * 80}px) scale(${s})`,
                opacity: s,
                color: C.snow,
                fontFamily: 'sans-serif',
              }}
            >
              <div style={{fontSize: 72}}>{c.emoji}</div>
              <div style={{fontSize: 30, fontWeight: 700}}>{c.label}</div>
            </div>
          );
        })}
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: 90,
          fontSize: 56,
          fontWeight: 800,
          color: C.gold,
          fontFamily: 'sans-serif',
        }}
      >
        오늘은 선수도, 관객도 산타
      </div>
    </AbsoluteFill>
  );
};

// 4. 이벤트 (270–360f): 응원 현장·단체 사진 자리 + 카운트업
const EventScene: React.FC = () => {
  const frame = useCurrentFrame();
  const count = Math.round(
    interpolate(frame, [0, 60], [0, TEAM_COUNT], {extrapolateRight: 'clamp'})
  );
  return (
    <AbsoluteFill style={{background: C.snow, justifyContent: 'center', alignItems: 'center'}}>
      <div
        style={{
          border: `4px dashed ${C.green}`,
          padding: '50px 80px',
          color: C.green,
          fontFamily: 'sans-serif',
          textAlign: 'center',
        }}
      >
        <div style={{fontSize: 36, fontWeight: 700}}>[응원 현장 · 단체 사진 자리]</div>
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: 120,
          fontFamily: 'sans-serif',
          color: C.red,
          fontWeight: 800,
          fontSize: 80,
        }}
      >
        {count}팀 참가
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: 60,
          fontFamily: 'sans-serif',
          color: C.green,
          fontSize: 40,
        }}
      >
        128팀이 맞붙는 1대1 단판 토너먼트
      </div>
    </AbsoluteFill>
  );
};

// 5. 타이틀 (360–420f): 마스크 리빌 + 키네틱 타이포
const TitleScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const reveal = interpolate(frame, [0, 25], [0, 100], {
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  const titleSpring = spring({frame: frame - 10, fps, config: {damping: 200}});
  return (
    <AbsoluteFill style={{background: C.green, justifyContent: 'center', alignItems: 'center'}}>
      <div
        style={{
          clipPath: `inset(0 ${100 - reveal}% 0 0)`,
          color: C.gold,
          fontFamily: 'sans-serif',
          fontSize: 88,
          fontWeight: 900,
          transform: `translateY(${(1 - titleSpring) * 30}px)`,
        }}
      >
        {TITLE}
      </div>
      <div
        style={{
          marginTop: 30,
          color: C.snow,
          fontFamily: 'sans-serif',
          fontSize: 44,
          opacity: titleSpring,
        }}
      >
        {DATE_PLACE}
      </div>
    </AbsoluteFill>
  );
};

// 6. 엔딩 (420–450f): 로고 자리 + 루프용 눈 흩날림
const Ending: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame, fps, config: {damping: 200}});
  return (
    <AbsoluteFill style={{background: `linear-gradient(180deg, #06231A, ${C.green})`}}>
      <Snow />
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', opacity: s}}>
        <div
          style={{
            border: `3px dashed ${C.gold}`,
            padding: '30px 60px',
            color: C.gold,
            fontFamily: 'sans-serif',
            fontSize: 36,
          }}
        >
          [로고 자리]
        </div>
        <div style={{marginTop: 40, color: C.snow, fontFamily: 'sans-serif', fontSize: 56, fontWeight: 800}}>
          여러분을 기다립니다
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const PromoVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{background: C.green}}>
      {/* 캐롤 풍 배경음악: public/audio/carol.mp3에 저작권 확인된 파일을 넣어 주세요 */}
      {HAS_AUDIO ? <Audio src={staticFile('audio/carol.mp3')} volume={0.8} /> : null}
      <Sequence from={0} durationInFrames={60}>
        <Opening />
      </Sequence>
      <Sequence from={60} durationInFrames={90}>
        <MatchPlaceholder />
      </Sequence>
      <Sequence from={150} durationInFrames={120}>
        <CostumeMontage />
      </Sequence>
      <Sequence from={270} durationInFrames={90}>
        <EventScene />
      </Sequence>
      <Sequence from={360} durationInFrames={60}>
        <TitleScene />
      </Sequence>
      <Sequence from={420} durationInFrames={30}>
        <Ending />
      </Sequence>
    </AbsoluteFill>
  );
};
