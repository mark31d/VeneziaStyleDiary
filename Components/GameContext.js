import React, { createContext, useContext, useState } from 'react';

/* ───── utility ───── */
const randPercent = () => 70 + Math.floor(Math.random() * 21);   // 70-90 %

/* ───── все доступные изображения (положите их в src/assets) ───── */
const allImgs = [
  require('../assets/c1.png'),
  require('../assets/c2.png'),
  require('../assets/c3.png'),
  require('../assets/c4.png'),
  require('../assets/c5.png'),
  require('../assets/c6.png'),
  require('../assets/c7.png'),
  require('../assets/c8.png'),
  require('../assets/c9.png'),
  require('../assets/c10.png'),
  require('../assets/c11.png'),
  require('../assets/c12.png'),
  require('../assets/c13.png'),
  require('../assets/c14.png'),
];

/* ───── генератор раундов: 5 × 6 уник. картинок ───── */
function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function buildRounds(src, rounds = 5, perRound = 6) {
  if (src.length < perRound) {
    console.warn(
      'Attention: fewer unique pictures than required for one round!',
    );
  }

  const result = [];
  let pool = shuffle(src); // первый случайный порядок

  for (let i = 0; i < rounds; i++) {
    // если в пуле не хватает картинок, пересобираем его заново
    if (pool.length < perRound) pool = shuffle(src);

    const roundImgs = pool.slice(0, perRound); // берём первые 6
    pool = pool.slice(perRound);               // убираем их из пула
    result.push(roundImgs);                    // добавляем в результат
  }
  return result;
}
const looks = buildRounds(allImgs); // → [["img1",…,"img6"], … 5 шт]

/* ───── контекст ───── */
const GameCtx = createContext();
export const useGame = () => useContext(GameCtx);

export function GameProvider({ children }) {
  const [round, setRound]   = useState(-1);   // −1 = титульный экран
  const [data]              = useState(looks);
  const [chosen, setChosen] = useState([]);   // выбранные индексы
  const [percent, setPct]   = useState(null); // «эту картинку выбрали X %»

  const startGame = () => { setRound(0);  setChosen([]); setPct(null); };
  const resetGame = () => { setRound(-1); setChosen([]); setPct(null); };

  const toggleImg = (idx) =>
    setChosen((p) => (p.includes(idx) ? p.filter((i) => i !== idx) : [...p, idx]));

  const finishRound = () => setPct(randPercent());

  const next = () => {
    if (round === data.length - 1) setRound('end');
    else                           setRound((r) => r + 1);

    setChosen([]); setPct(null);
  };

  return (
    <GameCtx.Provider
      value={{ data, round, chosen, percent,
               startGame, reset: resetGame,
               toggleImg, finishRound, next }}
    >
      {children}
    </GameCtx.Provider>
  );
}
