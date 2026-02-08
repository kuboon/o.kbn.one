export type LowerDigit = 0 | 1 | 2 | 3 | 4;

export interface DigitState {
  upper: boolean; // 5
  lower: LowerDigit; // 0, 1, 2, 3, 4
}

export interface Problem {
  a: number;
  b: number;
  solved: boolean;
}

export interface Model {
  digits: DigitState[];
  problem: Problem;
}

export type Msg =
  | { type: "TOGGLE_UPPER"; index: number }
  | { type: "SET_LOWER"; index: number; value: LowerDigit }
  | { type: "RESET" }
  | { type: "NEXT_PROBLEM" };

function generateProblem(): Problem {
  return {
    a: Math.floor(Math.random() * 90) + 10, // 10 to 99
    b: Math.floor(Math.random() * 90) + 10, // 10 to 99
    solved: false,
  };
}

export const initModel = (): Model => ({
  digits: Array.from({ length: 5 }, () => ({ upper: false, lower: 0 })),
  problem: generateProblem(),
});

export function getDigitValue(digit: DigitState): number {
  return (digit.upper ? 5 : 0) + digit.lower;
}

function calculateCurrentValue(digits: DigitState[]): number {
  // Assuming digits[0] is the most significant digit (10000s)
  // and digits[4] is the least significant (1s)
  return digits.reduce((acc, digit) => acc * 10 + getDigitValue(digit), 0);
}

export function update(model: Model, msg: Msg): Model {
  switch (msg.type) {
    case "TOGGLE_UPPER": {
      const newDigits = model.digits.map((d, i) =>
        i === msg.index ? { ...d, upper: !d.upper } : d
      );
      const currentVal = calculateCurrentValue(newDigits);
      const solved = !model.problem.solved &&
        currentVal === model.problem.a * model.problem.b;

      return {
        ...model,
        digits: newDigits,
        problem: solved ? { ...model.problem, solved: true } : model.problem,
      };
    }
    case "SET_LOWER": {
      const newDigits = model.digits.map((d, i) =>
        i === msg.index
          ? { ...d, lower: d.lower === msg.value ? 0 : msg.value }
          : d
      );
      const currentVal = calculateCurrentValue(newDigits);
      const solved = !model.problem.solved &&
        currentVal === model.problem.a * model.problem.b;

      return {
        ...model,
        digits: newDigits,
        problem: solved ? { ...model.problem, solved: true } : model.problem,
      };
    }
    case "RESET":
      return {
        ...model,
        digits: Array.from({ length: 5 }, () => ({ upper: false, lower: 0 })),
        // Don't generate new problem on RESET, just reset beads?
        // Usually RESET button is for the beads.
      };
    case "NEXT_PROBLEM":
      return {
        digits: Array.from({ length: 5 }, () => ({ upper: false, lower: 0 })),
        problem: generateProblem(),
      };
    default:
      return model;
  }
}
