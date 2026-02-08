let audioCtx: AudioContext | null = null;
let compressor: DynamicsCompressorNode | null = null;

function getAudioContext() {
  if (audioCtx && compressor) return { audioCtx, compressor };

  audioCtx = new AudioContext();

  // --- 1. コンプレッサーの設定 ---
  compressor = audioCtx.createDynamicsCompressor();
  // 閾値：このレベルを超えると圧縮を開始する
  compressor.threshold.setValueAtTime(-24, audioCtx.currentTime);
  // 膝：圧縮のカーブの滑らかさ
  compressor.knee.setValueAtTime(40, audioCtx.currentTime);
  // 比率：どれくらい圧縮するか
  compressor.ratio.setValueAtTime(12, audioCtx.currentTime);
  // アタック：圧縮が始まるまでの時間
  compressor.attack.setValueAtTime(0.003, audioCtx.currentTime);
  // リリース：圧縮が終わるまでの時間
  compressor.release.setValueAtTime(0.25, audioCtx.currentTime);

  // コンプレッサーをスピーカーに接続
  compressor.connect(audioCtx.destination);
  return { audioCtx, compressor };
}

export function playPiano(freq: number) {
  const { audioCtx, compressor } = getAudioContext();
  const now = audioCtx.currentTime;
  const masterGain = audioCtx.createGain();

  // オシレーター（基本音 + 倍音）
  const osc1 = audioCtx.createOscillator();
  const osc2 = audioCtx.createOscillator();
  const g1 = audioCtx.createGain();
  const g2 = audioCtx.createGain();

  osc1.type = "triangle";
  osc1.frequency.setValueAtTime(freq, now);
  g1.gain.setValueAtTime(0.6, now);

  osc2.type = "sawtooth";
  osc2.frequency.setValueAtTime(freq * 2, now); // 倍音
  g2.gain.setValueAtTime(0.05, now);

  // フィルター
  const filter = audioCtx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(2000, now);
  filter.frequency.exponentialRampToValueAtTime(100, now + 1.2);

  // 接続
  osc1.connect(g1);
  osc2.connect(g2);
  g1.connect(masterGain);
  g2.connect(masterGain);
  masterGain.connect(filter);

  // --- 2. フィルタの出力をコンプレッサーに接続 ---
  filter.connect(compressor);

  // エンベロープ
  masterGain.gain.setValueAtTime(0, now);
  masterGain.gain.linearRampToValueAtTime(0.8, now + 0.005);
  masterGain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

  osc1.start(now);
  osc2.start(now);
  osc1.stop(now + 1.3);
  osc2.stop(now + 1.3);
}
