/**
 * Utilități pentru gestionarea cărților de joc
 */

// Generează perechile de cărți (1-8, fiecare apare de două ori)
export const generateCardPairs = () => {
  const values = [1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 6, 7, 8];
  return shuffleArray(values);
};

// Amestecă un array folosind algoritmul Fisher-Yates
export const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

// Obține configurația de amestecare pentru un anumit nivel
export const getShufflePairsForLevel = (level) => {
  // Configurația din descrierea jocului
  const shuffleConfigs = {
    1: [[1, 12], [8, 14], [15, 6], [5, 3], [4, 10], [13, 7], [9, 16], [11, 2]],
    2: [[3, 9], [7, 15], [5, 11], [2, 14], [6, 12], [4, 16], [1, 8], [10, 13]],
    3: [[6, 13], [9, 4], [7, 2], [11, 15], [3, 16], [12, 5], [8, 10], [1, 14]],
    4: [[5, 14], [8, 12], [3, 10], [7, 16], [1, 6], [9, 11], [2, 15], [4, 13]],
    5: [[10, 2], [6, 14], [9, 1], [12, 4], [15, 3], [8, 5], [13, 11], [7, 16]],
    6: [[7, 12], [3, 5], [9, 14], [10, 1], [6, 16], [2, 8], [4, 13], [11, 15]],
    7: [[1, 15], [4, 7], [12, 9], [2, 6], [10, 14], [8, 3], [16, 5], [13, 11]],
    8: [[14, 6], [3, 9], [8, 16], [2, 12], [1, 11], [10, 4], [7, 15], [5, 13]],
    9: [[11, 8], [5, 3], [2, 14], [6, 10], [7, 13], [12, 16], [1, 9], [4, 15]],
    10: [[11, 2], [9, 16], [13, 7], [4, 10], [5, 3], [15, 6], [8, 14], [1, 12]]
  };
  
  return shuffleConfigs[level] || shuffleConfigs[1];
};

// Calculează poziția unei cărți în grid
export const calculateCardPosition = (index) => {
  const row = Math.floor(index / 4);
  const col = index % 4;
  return { row, col };
};

// Obține timpul per carte în funcție de nivel și dificultate
export const getTimePerCard = (level, difficulty) => {
  if (difficulty === 'hard') {
    return 3.5; // Timp fix pentru hard
  }
  
  // Tabel de timpul per nivel
  const timeLevels = {
    1: 4.0,
    2: 3.8,
    3: 3.5,
    4: 3.3,
    5: 3.0,
    6: 2.8,
    7: 2.5,
    8: 2.3,
    9: 2.0,
    10: 1.3
  };
  
  return timeLevels[level] || 4.0;
}; 