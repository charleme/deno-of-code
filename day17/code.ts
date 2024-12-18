type State = {
  A: bigint;
  B: bigint;
  C: bigint;
  i: number;
  out: bigint[];
};

export function step1(input: string[]): string {
  const { A, B, C, program } = parseInput(input);

  const state = {
    A,
    B,
    C,
    i: 0,
    out: [],
  };

  while (state.i + 1 < program.length) {
    const prevI = state.i;
    const instruction = instructions[Number(program[state.i])];
    const operand = program[state.i + 1];
    instruction(state, operand);

    if (prevI === state.i) {
      state.i += 2;
    }
  }

  return state.out.join(",");
}

export function step2(input: string[]): string {
  const { A: _, B, C, program } = parseInput(input);
  let i = 0n;
  let result = "";
  const target = program.join(",");
  while (result !== target) {
    if (target.endsWith(result)) {
      i *= 8n;
    } else {
      i += 1n;
    }

    result = step1([
      i.toString(),
      B.toString(),
      C.toString(),
      program.join(","),
    ]);
  }
  return i.toString();
}

const parseInput = (input: string[]) => {
  return {
    A: BigInt(input[0]),
    B: BigInt(input[1]),
    C: BigInt(input[2]),
    program: input[3].split(",").map(BigInt),
  };
};

const getOperandValue = (state: State, operand: bigint) => {
  const operandMap = [
    0n,
    1n,
    2n,
    3n,
    state.A,
    state.B,
    state.C,
    7n,
  ];

  return operandMap[Number(operand)];
};

const adv = (state: State, operand: bigint) => {
  state.A = state.A >> getOperandValue(state, operand);
};

const bxl = (state: State, operand: bigint) => {
  state.B = state.B ^ operand;
};

const bst = (state: State, operand: bigint) => {
  state.B = getOperandValue(state, operand) & 7n;
};

const jnz = (state: State, operand: bigint) => {
  if (state.A === 0n) {
    return;
  }

  state.i = Number(operand);
};

const bxc = (state: State, _operand: bigint) => {
  state.B = state.B ^ state.C;
};

const out = (state: State, operand: bigint) => {
  state.out.push(getOperandValue(state, operand) & 7n);
};

const bdv = (state: State, operand: bigint) => {
  state.B = state.A >> getOperandValue(state, operand);
};

const cdv = (state: State, operand: bigint) => {
  state.C = state.A >> getOperandValue(state, operand);
};

const instructions = [
  adv,
  bxl,
  bst,
  jnz,
  bxc,
  out,
  bdv,
  cdv,
];
