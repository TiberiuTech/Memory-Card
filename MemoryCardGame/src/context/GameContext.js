import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const GameContext = createContext();

const INITIAL_STATE = {
  level: 1,
  difficulty: 'easy',
  coins: 0,
  unlockedCards: [],
  selectedCards: [],
  currentScore: 0,
  lives: 3,
  timePerCard: 1.5,
};

export const GameProvider = ({ children }) => {
  const [gameState, setGameState] = useState(INITIAL_STATE);
  
  useEffect(() => {
    const loadGameState = async () => {
      try {
        const savedState = await AsyncStorage.getItem('gameState');
        if (savedState) {
          setGameState(JSON.parse(savedState));
        }
      } catch (error) {
        console.log('Error loading game state:', error);
      }
    };
    
    loadGameState();
  }, []);
  
  useEffect(() => {
    const saveGameState = async () => {
      try {
        await AsyncStorage.setItem('gameState', JSON.stringify(gameState));
      } catch (error) {
        console.log('Error saving game state:', error);
      }
    };
    
    saveGameState();
  }, [gameState]);
  
  const updateLevel = (newLevel) => {
    setGameState(prev => ({ ...prev, level: newLevel }));
    
    let timePerCard;
    
    if (gameState.difficulty === 'easy') {
      timePerCard = getTimeForEasyLevel(newLevel);
    } else if (gameState.difficulty === 'advance') {
      timePerCard = getTimeForAdvanceLevel(newLevel);
    } else if (gameState.difficulty === 'hard') {
      timePerCard = 3.5;
    }
    
    setGameState(prev => ({ ...prev, timePerCard }));
  };
  
  const updateDifficulty = (newDifficulty) => {
    setGameState(prev => ({ ...prev, difficulty: newDifficulty }));
    updateLevel(1);
  };
  
  const addCoins = (amount) => {
    setGameState(prev => ({ ...prev, coins: prev.coins + amount }));
  };
  
  const spendCoins = (amount) => {
    if (gameState.coins >= amount) {
      setGameState(prev => ({ ...prev, coins: prev.coins - amount }));
      return true;
    }
    return false;
  };
  
  const unlockCard = (cardId) => {
    if (!gameState.unlockedCards.includes(cardId)) {
      setGameState(prev => ({
        ...prev,
        unlockedCards: [...prev.unlockedCards, cardId]
      }));
    }
  };
  
  const updateLives = (change) => {
    setGameState(prev => ({
      ...prev,
      lives: Math.max(0, prev.lives + change)
    }));
  };
  
  const resetGame = () => {
    setGameState(INITIAL_STATE);
  };
  
  const getTimeForEasyLevel = (level) => {
    switch (level) {
      case 1: return 4.0;
      case 2: return 3.8;
      case 3: return 3.5;
      case 4: return 3.3;
      case 5: return 3.0;
      case 6: return 2.8;
      case 7: return 2.5;
      case 8: return 2.3;
      case 9: return 2.0;
      case 10: return 1.3;
      default: return 4.0;
    }
  };
  
  const getTimeForAdvanceLevel = (level) => {
    switch (level) {
      case 1: return 4.0;
      case 2: return 3.8;
      case 3: return 3.5;
      case 4: return 3.3;
      case 5: return 3.0;
      case 6: return 2.8;
      case 7: return 2.5;
      case 8: return 2.3;
      case 9: return 2.0;
      case 10: return 1.3;
      default: return 4.0;
    }
  };
  
  const getRewardForMatch = () => {
    switch (gameState.difficulty) {
      case 'easy': return 2;  
      case 'advance': return 5;  
      case 'hard': return 15;  
      default: return 1;
    }
  };
  
  return (
    <GameContext.Provider
      value={{
        ...gameState,
        updateLevel,
        updateDifficulty,
        addCoins,
        spendCoins,
        unlockCard,
        updateLives,
        resetGame,
        getRewardForMatch
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => useContext(GameContext); 