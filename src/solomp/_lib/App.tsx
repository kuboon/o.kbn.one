// @jsxImportSource @remix-run/component
import type { Handle } from "@remix-run/component";
import { playPiano } from "./sound.ts";
import {
  getDigitValue,
  initModel,
  type LowerDigit,
  type Msg,
  update,
} from "./logic.ts";

const NOTES = {
  upper: "F5",
  lower: ["", "D5", "B4", "G4", "E4"],
} as const;

export function App(handle: Handle) {
  let model = initModel();

  const dispatch = (msg: Msg) => {
    const wasSolved = model.problem.solved;
    model = update(model, msg);
    handle.update();

    if (msg.type === "TOGGLE_UPPER" || msg.type === "SET_LOWER") {
      playDigitChord(msg.index);
    }

    if (!wasSolved && model.problem.solved) {
      setTimeout(() => {
        dispatch({ type: "NEXT_PROBLEM" });
      }, 1500);
    }
  };

  const NOTE_FREQS = {
    F5: 698.46,
    D5: 587.33,
    B4: 493.88,
    G4: 392.00,
    E4: 329.63,
  } as const;

  const playDigitChord = (index: number) => {
    const digit = model.digits[index];
    if (!digit) return;

    if (digit.upper) playPiano(NOTE_FREQS.F5);
    if (digit.lower !== 0) {
      const lowerNote = NOTES.lower[digit.lower];
      if (lowerNote) {
        playPiano(NOTE_FREQS[lowerNote as keyof typeof NOTE_FREQS]);
      }
    }
  };

  return () => (
    <div
      css={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100dvh",
        backgroundColor: "#f8fafc",
        padding: "0.5rem",
        touchAction: "none",
        overflow: "hidden",
        userSelect: "none",
      }}
    >
      <svg
        viewBox="0 0 600 300"
        preserveAspectRatio="xMidYMid meet"
        css={{
          width: "100%",
          height: "100%",
        }}
      >
        {/* Staff Lines */}
        {[0, 1, 2, 3, 4].map((i) => (
          <line
            key={i}
            x1="40"
            y1={(50 + i * 40).toString()}
            x2="560"
            y2={(50 + i * 40).toString()}
            stroke="#1e293b"
            strokeWidth="2"
          />
        ))}

        {/* Abacus Bridge */}
        <line
          x1="40"
          y1="70"
          x2="560"
          y2="70"
          stroke="#94a3b8"
          strokeWidth="4"
          strokeLinecap="round"
          opacity="0.4"
        />

        {/* Treble Clef */}
        <text x="35" y="200" fontSize="280">𝄞</text>

        {/* Columns and Notes */}
        {model.digits.map((digit, i) => {
          const x = 165 + i * 85;
          return (
            <g key={i}>
              <text
                x={x.toString()}
                y="17"
                fontSize="36"
                fontFamily="monospace"
                fontWeight="bold"
                fill="#2563eb"
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {getDigitValue(digit)}
              </text>
              {/* Upper Note (5) */}
              <g
                css={{ cursor: "pointer" }}
                on={{
                  pointerup: () =>
                    dispatch({ type: "TOGGLE_UPPER", index: i }),
                }}
              >
                <rect
                  x={(x - 35).toString()}
                  y="20"
                  width="70"
                  height="50"
                  fill="transparent"
                />
                <ellipse
                  cx={x.toString()}
                  cy="50"
                  rx="19"
                  ry="14"
                  fill={digit.upper ? "#3b82f6" : "white"}
                  stroke="#1e3a8a"
                  strokeWidth="3"
                />
                <path
                  d={`M ${(x + 18).toString()} 25 L ${(x + 18).toString()} 50`}
                  stroke="#1e3a8a"
                  strokeWidth="2.5"
                />
              </g>

              {/* Lower Notes (1-4) */}
              {[1, 2, 3, 4].map((val) => {
                const y = 50 + val * 40;
                return (
                  <g
                    key={val}
                    css={{ cursor: "pointer" }}
                    on={{
                      pointerup: () =>
                        dispatch({
                          type: "SET_LOWER",
                          index: i,
                          value: val as LowerDigit,
                        }),
                    }}
                  >
                    <rect
                      x={(x - 35).toString()}
                      y={(y - 20).toString()}
                      width="70"
                      height="40"
                      fill="transparent"
                    />
                    <ellipse
                      cx={x.toString()}
                      cy={y.toString()}
                      rx="19"
                      ry="14"
                      fill={
                        digit.lower === val
                          ? "#3b82f6"
                          : digit.lower > val
                          ? "#93c5fd"
                          : "white"
                      }
                      stroke="#1e3a8a"
                      strokeWidth="3"
                    />
                    <path
                      d={`M ${(x + 18).toString()} ${(y - 45).toString()} L ${
                        (x + 18).toString()
                      } ${y.toString()}`}
                      stroke="#1e3a8a"
                      strokeWidth="2.5"
                    />
                  </g>
                );
              })}
            </g>
          );
        })}
      </svg>

      <div
        css={{
          height: "20%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "2.5rem",
        }}
      >
        <button
          type="button"
          css={{
            padding: "0.75rem 3rem",
            backgroundColor: "#1e293b",
            color: "white",
            border: "none",
            borderRadius: "1rem",
            fontWeight: "bold",
            fontSize: "1.25rem",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
            cursor: "pointer",
            transition: "all 0.15s",
            ":hover": {
              backgroundColor: "#334155",
            },
            ":active": {
              backgroundColor: "#0f172a",
              transform: "scale(0.95)",
            },
          }}
          on={{ click: () => dispatch({ type: "RESET" }) }}
        >
          RESET
        </button>
        <div
          css={{
            display: "flex",
            alignItems: "center",
            gap: "1.5rem",
          }}
        >
          <div
            css={{
              fontSize: "2.25rem",
              fontFamily: '"Courier New", monospace',
              fontWeight: "bold",
              color: "#334155",
            }}
          >
            {model.problem.a} × {model.problem.b} = ?
          </div>
          {model.problem.solved && (
            <div
              css={{
                fontSize: "2.25rem",
                fontWeight: "bold",
                color: "#16a34a",
                animation: "bounce 1s infinite",
                "@keyframes bounce": {
                  "0%, 100%": {
                    transform: "translateY(-25%)",
                    animationTimingFunction: "cubic-bezier(0.8, 0, 1, 1)",
                  },
                  "50%": {
                    transform: "translateY(0)",
                    animationTimingFunction: "cubic-bezier(0, 0, 0.2, 1)",
                  },
                },
              }}
            >
              正解！
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
