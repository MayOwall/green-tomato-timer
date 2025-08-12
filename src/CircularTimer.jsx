import React from 'react';

function CircularTimer({ minutes, seconds, totalSeconds }) {
  const strokeWidth = 60;
  const radius = 75;
  const circumference = 2 * Math.PI * radius;

  const remainingSeconds = minutes * 60 + seconds;
  const progress = remainingSeconds / totalSeconds;
  const offset = circumference * (1 - progress);

  const formatTime = (m, s) => {
    const mm = m.toString().padStart(2, '0');
    const ss = s.toString().padStart(2, '0');
    return `${mm}:${ss}`;
  };

  return (
    <svg width={320} height={320} viewBox="0 0 220 220">
      <defs>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow
            dx="0"
            dy="2"
            stdDeviation="4"
            floodColor="#000"
            floodOpacity="0.3"
          />
        </filter>
      </defs>

      {/* 배경 원 */}
      <circle
        cx="110"
        cy="110"
        r={radius}
        fill="white"
        stroke="#eee"
        strokeWidth={strokeWidth}
      />
      {/* 진행 원 */}
      <circle
        cx="110"
        cy="110"
        r={radius}
        fill="transparent"
        stroke="#4c8c2b"
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        transform="rotate(-90 110 110)"
      />
      {/* 중앙 원 (테두리 + 그림자) */}
      <circle
        cx="110"
        cy="110"
        r="45"
        fill="#e7fade"
        filter="url(#shadow)"
        stroke="white"
        strokeWidth={2}
      />
      {/* 시간 텍스트 */}
      <text
        x="110"
        y="118"
        fill="#395929"
        fontSize="22"
        fontWeight="bold"
        textAnchor="middle"
      >
        {formatTime(minutes, seconds)}
      </text>
    </svg>
  );
}

export default CircularTimer;
