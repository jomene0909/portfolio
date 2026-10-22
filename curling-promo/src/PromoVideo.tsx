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

// 시나리오 컷 태그: 기획안용 스토리보드 느낌의 장면 라벨
const SceneTag: React.FC<{label: string}> = ({label}) => (
  <div
    style={{
      position: 'absolute',
      top: 40,
      left: 48,
      padding: '10px 24px',
      borderRadius: 999,
      background: 'rgba(0,0,0,0.38)',
      color: C.snow,
      fontFamily: 'sans-serif',
      fontSize: 28,
      fontWeight: 700,
      letterSpacing: 1,
    }}
  >
    {label}
  </div>
);

const Stone: React.FC<{x: number; y: number; color: string}> = ({x, y, color}) => (
  <g transform={`translate(${x} ${y})`}>
    <circle r={50} fill="#5C626B" />
    <circle r={44} fill="#A3A9B1" />
    <circle r={28} fill={color} />
    <circle r={9} fill="#FFFFFF" opacity={0.55} />
  </g>
);

// 2. 1대1 경기 (60–150f): 컬링 시트 탑뷰, 두 스톤을 던져 하우스 중심(버튼)과의 거리를 비교
const MatchPlaceholder: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const slide = (from: number, dur: number) =>
    interpolate(frame, [from, from + dur], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.out(Easing.cubic),
    });
  const BX = 1400;
  const BY = 540;
  const sa = slide(0, 38);
  const sb = slide(32, 38);
  const ax = interpolate(sa, [0, 1], [120, 1215]);
  const ay = interpolate(sa, [0, 1], [540, 655]);
  const bx = interpolate(sb, [0, 1], [120, 1385]);
  const by = interpolate(sb, [0, 1], [540, 528]);
  const sweeping = sb > 0.02 && sb < 0.97;
  const measure = interpolate(frame, [70, 85], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const pop = spring({frame: frame - 70, fps, config: {damping: 12}});
  const caption = spring({frame: frame - 5, fps, config: {damping: 200}});
  const label = (text: string, x: number, y: number, color: string, opacity = 1) => (
    <text
      x={x}
      y={y}
      fill={color}
      fontSize={34}
      fontWeight={800}
      fontFamily="sans-serif"
      textAnchor="middle"
      stroke="#FFFFFF"
      strokeWidth={8}
      paintOrder="stroke"
      opacity={opacity}
    >
      {text}
    </text>
  );
  return (
    <AbsoluteFill style={{background: `linear-gradient(180deg, #EAF6FC, ${C.ice})`}}>
      <svg width={1920} height={1080} style={{position: 'absolute'}}>
        <rect x={0} y={290} width={1920} height={500} fill="#FFFFFF" opacity={0.55} />
        <line x1={0} y1={290} x2={1920} y2={290} stroke={C.green} strokeWidth={4} opacity={0.3} />
        <line x1={0} y1={790} x2={1920} y2={790} stroke={C.green} strokeWidth={4} opacity={0.3} />
        <line x1={0} y1={BY} x2={1920} y2={BY} stroke={C.green} strokeWidth={2} opacity={0.2} />
        <line x1={700} y1={290} x2={700} y2={790} stroke={C.red} strokeWidth={8} opacity={0.7} />
        <line x1={BX} y1={290} x2={BX} y2={790} stroke={C.green} strokeWidth={3} opacity={0.35} />
        <circle cx={BX} cy={BY} r={250} fill="#2E6FB5" />
        <circle cx={BX} cy={BY} r={180} fill="#FFFFFF" />
        <circle cx={BX} cy={BY} r={115} fill={C.red} />
        <circle cx={BX} cy={BY} r={50} fill="#FFFFFF" />
        <circle cx={BX} cy={BY} r={10} fill={C.green} />
        {label('팀 A', 120, 420, C.red, interpolate(frame, [0, 10], [0, 1], {extrapolateRight: 'clamp'}))}
        {label('팀 B', 120, 690, '#B8860B', interpolate(frame, [30, 40], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}))}
        {sweeping
          ? [0, 1, 2].map((k) => {
              const sway = Math.sin(frame * 1.2 + k) * 22;
              return (
                <line
                  key={k}
                  x1={bx + 80 + k * 26}
                  y1={by - 36 + sway}
                  x2={bx + 100 + k * 26}
                  y2={by + 36 + sway}
                  stroke={C.green}
                  strokeWidth={8}
                  strokeLinecap="round"
                  opacity={0.55 - k * 0.15}
                />
              );
            })
          : null}
        {measure > 0 ? (
          <>
            <line x1={BX} y1={BY} x2={ax} y2={ay} stroke={C.green} strokeWidth={8} strokeDasharray="16 10" opacity={measure} />
            <line x1={BX} y1={BY} x2={bx} y2={by} stroke="#B8860B" strokeWidth={8} strokeDasharray="16 10" opacity={measure} />
            <circle cx={bx} cy={by} r={62 + Math.sin(frame / 3) * 6} fill="none" stroke={C.gold} strokeWidth={8} opacity={measure} />
            {label('멀다', ax - 20, ay + 100, C.red, measure)}
            {label('가까운 한 점!', bx - 150, by - 90, '#B8860B', measure)}
          </>
        ) : null}
        <Stone x={ax} y={ay} color={C.red} />
        <Stone x={bx} y={by} color={C.gold} />
      </svg>
      <div
        style={{
          position: 'absolute',
          bottom: 110,
          width: '100%',
          textAlign: 'center',
          fontSize: 64,
          fontWeight: 800,
          color: C.green,
          fontFamily: 'sans-serif',
          opacity: caption,
          transform: `scale(${0.95 + pop * 0.05})`,
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

// 산타모자 관중: 응원 현장 대체 연출
const CrowdMember: React.FC<{x: number; y: number; frame: number; seed: number; color: string}> = ({
  x,
  y,
  frame,
  seed,
  color,
}) => {
  const bob = Math.sin(frame / 3 + seed * 0.9) * 10;
  const sway = Math.sin(frame / 3 + seed * 0.9 + 1) * 18;
  const yy = y + bob;
  return (
    <g>
      <line x1={x - 30} y1={yy + 45} x2={x - 56 + sway} y2={yy - 18} stroke="#F6D1B5" strokeWidth={13} strokeLinecap="round" />
      <line x1={x + 30} y1={yy + 45} x2={x + 56 - sway} y2={yy - 18} stroke="#F6D1B5" strokeWidth={13} strokeLinecap="round" />
      <ellipse cx={x} cy={yy + 64} rx={40} ry={46} fill={color} />
      <circle cx={x} cy={yy} r={25} fill="#F6D1B5" />
      <polygon points={`${x - 27},${yy - 12} ${x + 27},${yy - 12} ${x + 8},${yy - 56}`} fill={C.red} />
      <rect x={x - 29} y={yy - 17} width={58} height={11} rx={5} fill={C.snow} />
      <circle cx={x + 8} cy={yy - 58} r={7} fill={C.snow} />
    </g>
  );
};

const rounds = [128, 64, 32, 16, 8, 4, 2, 1];
const cheers = [
  {text: '파이팅!', x: 330, y: 600, at: 26},
  {text: '나이스 샷!', x: 960, y: 570, at: 42},
  {text: '한 점 더!', x: 1560, y: 610, at: 58},
];
const crowdColors = [C.red, '#1E7B4F', '#4A90C2', C.gold, '#8B5A2B'];

// 4. 이벤트 (270–360f): 응원 현장 + 128강 토너먼트 라운드 진행
const EventScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const count = Math.round(
    interpolate(frame, [0, 45], [0, TEAM_COUNT], {extrapolateRight: 'clamp'})
  );
  return (
    <AbsoluteFill style={{background: `linear-gradient(180deg, ${C.green}, #06231A)`}}>
      <Snow />
      <div
        style={{
          position: 'absolute',
          top: 110,
          width: '100%',
          textAlign: 'center',
          fontFamily: 'sans-serif',
          color: C.gold,
          fontWeight: 900,
          fontSize: 110,
        }}
      >
        {count}팀 참가
      </div>
      <div style={{position: 'absolute', top: 290, width: '100%', display: 'flex', justifyContent: 'center', gap: 28}}>
        {rounds.map((r, i) => {
          const s = spring({frame: frame - 20 - i * 6, fps, config: {damping: 14}});
          const last = i === rounds.length - 1;
          return (
            <div
              key={r}
              style={{
                width: 150,
                height: 100,
                borderRadius: 20,
                background: last ? C.gold : 'rgba(255,255,255,0.14)',
                color: last ? C.green : C.snow,
                fontFamily: 'sans-serif',
                fontWeight: 800,
                fontSize: last ? 40 : 46,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                transform: `scale(${s})`,
                opacity: s,
              }}
            >
              {last ? '🏆 우승' : `${r}강`}
            </div>
          );
        })}
      </div>
      <div
        style={{
          position: 'absolute',
          top: 430,
          width: '100%',
          textAlign: 'center',
          fontFamily: 'sans-serif',
          color: C.snow,
          fontSize: 44,
        }}
      >
        128팀이 맞붙는 1대1 단판 토너먼트
      </div>
      <svg width={1920} height={1080} style={{position: 'absolute'}}>
        {[0, 1, 2].map((r) =>
          Array.from({length: 17}).map((_, i) => (
            <CrowdMember
              key={`${r}-${i}`}
              x={40 + i * 116 + (r % 2) * 58}
              y={700 + r * 110}
              frame={frame}
              seed={i + r * 5}
              color={crowdColors[(i + r) % crowdColors.length]}
            />
          ))
        )}
      </svg>
      {cheers.map((c) => {
        const s = spring({frame: frame - c.at, fps, config: {damping: 10}});
        return (
          <div
            key={c.text}
            style={{
              position: 'absolute',
              left: c.x - 130,
              top: c.y - 40,
              width: 260,
              padding: '14px 0',
              borderRadius: 30,
              background: C.snow,
              color: C.red,
              fontFamily: 'sans-serif',
              fontWeight: 900,
              fontSize: 44,
              textAlign: 'center',
              transform: `scale(${s})`,
              opacity: s,
            }}
          >
            {c.text}
          </div>
        );
      })}
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

// 6. 엔딩 (420–450f): 텍스트 엠블럼 + 루프용 눈 흩날림
const Ending: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame, fps, config: {damping: 200}});
  return (
    <AbsoluteFill style={{background: `linear-gradient(180deg, #06231A, ${C.green})`}}>
      <Snow />
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', opacity: s}}>
        <svg width={280} height={280} viewBox="-140 -140 280 280">
          <circle r={130} fill="none" stroke={C.gold} strokeWidth={6} />
          <circle r={86} fill="#5C626B" />
          <circle r={76} fill="#A3A9B1" />
          <circle r={48} fill={C.red} />
          <polygon points="-70,-40 70,-40 20,-120" fill={C.red} stroke={C.snow} strokeWidth={4} />
          <rect x={-76} y={-52} width={152} height={22} rx={11} fill={C.snow} />
          <circle cx={22} cy={-124} r={16} fill={C.snow} />
        </svg>
        <div style={{marginTop: 24, color: C.gold, fontFamily: 'sans-serif', fontSize: 52, fontWeight: 900}}>
          2026 1대1 드로우 챌린지
        </div>
        <div style={{marginTop: 24, color: C.snow, fontFamily: 'sans-serif', fontSize: 56, fontWeight: 800}}>
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
        <SceneTag label="S#1 · 오프닝" />
      </Sequence>
      <Sequence from={60} durationInFrames={90}>
        <MatchPlaceholder />
        <SceneTag label="S#2 · 1대1 경기" />
      </Sequence>
      <Sequence from={150} durationInFrames={120}>
        <CostumeMontage />
        <SceneTag label="S#3 · 코스튬" />
      </Sequence>
      <Sequence from={270} durationInFrames={90}>
        <EventScene />
        <SceneTag label="S#4 · 응원·토너먼트" />
      </Sequence>
      <Sequence from={360} durationInFrames={60}>
        <TitleScene />
        <SceneTag label="S#5 · 타이틀" />
      </Sequence>
      <Sequence from={420} durationInFrames={30}>
        <Ending />
        <SceneTag label="S#6 · 엔딩" />
      </Sequence>
    </AbsoluteFill>
  );
};
