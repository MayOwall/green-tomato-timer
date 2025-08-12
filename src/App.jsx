import React, { useState, useEffect, useRef } from 'react';
import CircularTimer from './CircularTimer.jsx';

function PomodoroTimer() {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [inputMinutes, setInputMinutes] = useState(25);
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const timerId = useRef(null);
  const confettiCount = 10;

  // 시간 포맷 맞추기 (MM:SS)
  const formatTime = (m, s) => {
    const mm = Math.max(0, m).toString().padStart(2, '0');
    const ss = s.toString().padStart(2, '0');
    return `${mm}:${ss}`;
  };

  // 타이머 카운트다운
  useEffect(() => {
    if (isRunning && !isFinished) {
      timerId.current = setInterval(() => {
        setSeconds((prevSec) => {
          if (prevSec === 0) {
            if (minutes === 0) {
              clearInterval(timerId.current);
              setIsRunning(false);
              setIsFinished(true);
              return 0;
            }
            setMinutes((prevMin) => Math.max(0, prevMin - 1));
            return 59;
          }

          return prevSec - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timerId.current);
  }, [isRunning, minutes, isFinished]);

  // 시작 / 일시정지 토글
  const toggleStartPause = () => {
    if (isFinished) return; // 완료된 후엔 작동 안함
    setIsRunning(!isRunning);
  };

  // 정지 버튼
  const stopTimer = () => {
    clearInterval(timerId.current);
    setIsRunning(false);
    setIsFinished(false);
    setMinutes(inputMinutes);
    setSeconds(0);
  };

  // 입력값 변경
  const handleInputChange = (e) => {
    const val = e.target.value;
    if (/^\d*$/.test(val)) {
      setInputMinutes(val === '' ? '' : Math.min(999, Number(val)));
    }
  };

  // 입력 완료 시 타이머 시간 변경
  const handleSetTime = () => {
    if (inputMinutes === '' || inputMinutes <= 0) return;
    setMinutes(Number(inputMinutes));
    setSeconds(0);
    setIsFinished(false);
    setIsRunning(false);
  };

  // 다시 시작 버튼 (완료 후)
  const restartTimer = () => {
    setMinutes(inputMinutes);
    setSeconds(0);
    setIsFinished(false);
    setIsRunning(true);
  };

  return (
    <div style={styles.container}>
      <CircularTimer
        minutes={minutes}
        seconds={seconds}
        totalSeconds={inputMinutes * 60}
      />
      <div style={{ height: '10px' }}></div>
      {/* 버튼들 */}
      {!isFinished && (
        <>
          {/* 시간 설정 폼 */}
          <div style={{ marginBottom: 20 }}>
            <input
              type="text"
              value={inputMinutes}
              onChange={handleInputChange}
              style={styles.input}
              placeholder="분 단위 설정"
              disabled={isRunning}
            />
            <button
              onClick={handleSetTime}
              disabled={isRunning || inputMinutes === ''}
            >
              설정
            </button>
          </div>
          <div style={styles.buttonGroup}>
            <button
              onClick={toggleStartPause}
              disabled={isFinished || inputMinutes === ''}
              style={styles.button}
            >
              {isRunning ? '일시정지' : '시작'}
            </button>
            <button onClick={stopTimer} style={styles.button}>
              정지
            </button>
          </div>
        </>
      )}

      {/* 완료 시 축하 이벤트 */}
      {isFinished && (
        <div style={styles.celebration}>
          <h4>🎉 축하합니다! 시간이 다 되었어요! 🎉</h4>
          <div className="confetti-container">
            {[...Array(confettiCount)].map((_, i) => (
              <span
                key={i}
                className="confetti-piece"
                style={{
                  left: `${Math.random() * 100}vw`, // 화면 가로 위치 랜덤
                  width: `${8 + Math.random() * 4}px`, // 크기 랜덤 (8~12px)
                  height: `${8 + Math.random() * 4}px`,
                  backgroundColor: `hsl(${Math.random() * 360}, 80%, 60%)`, // 색깔 랜덤
                  animationDuration: `${1 + Math.random() * 1.5}s`, // 애니메이션 시간 랜덤
                  animationDelay: `${Math.random() * 3}s`, // 시작 딜레이 랜덤
                }}
              />
            ))}
          </div>
          <div style={{ marginTop: 10 }}>
            <button onClick={restartTimer} style={styles.button}>
              다시 시작
            </button>
            <button
              onClick={() => {
                setIsFinished(false);
                setMinutes(inputMinutes);
                setSeconds(0);
              }}
              style={styles.button}
            >
              초기화
            </button>
          </div>
        </div>
      )}

      {/* CSS for 폭죽(종이) 애니메이션 */}
      <style>{`
        .confetti-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          pointer-events: none;
          overflow: visible;
          z-index: 9999;
        }
        .confetti-piece {
          position: absolute;
          width: 10px;
          height: 10px;
          border-radius: 2px;
          top: 0;
          animation-name: confetti-fall;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          transform-origin: center;
          opacity: 0.8;
        }
        @keyframes confetti-fall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}

const styles = {
  container: {
    width: '100vw',
    textAlign: 'center',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    userSelect: 'none',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh', // 높이도 꽉 채우고 싶다면
  },
  input: {
    width: 80,
    fontSize: 18,
    padding: 6,
    textAlign: 'center',
    marginRight: 10,
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'center',
    gap: 15,
  },
  button: {
    fontSize: 16,
    padding: '8px 16px',
    cursor: 'pointer',
  },
  celebration: {},
};

export default PomodoroTimer;
