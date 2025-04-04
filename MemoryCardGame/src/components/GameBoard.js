import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Alert, Dimensions, Animated } from 'react-native';
import Card from './Card';
import { useGame } from '../context/GameContext';

const { width, height } = Dimensions.get('window');

const GameBoard = () => {
  const { 
    difficulty, 
    level, 
    timePerCard, 
    updateLives, 
    addCoins, 
    getRewardForMatch 
  } = useGame();
  
  const [cards, setCards] = useState([]);
  const [flippedIndexes, setFlippedIndexes] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  
  // Animație pentru amestecare (nivel advance și hard)
  const shuffleAnim = useRef(new Animated.Value(0)).current;
  
  // Generăm cardurile la începutul jocului sau când se schimbă nivelul
  useEffect(() => {
    generateCards();
    setFlippedIndexes([]);
    setMatchedPairs([]);
    setGameCompleted(false);
  }, [level, difficulty]);
  
  // Generăm și amestecăm cardurile
  const generateCards = () => {
    const values = [1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 6, 7, 8];
    let shuffled = shuffleArray(values);
    
    const newCards = shuffled.map((value, index) => ({
      id: index,
      value,
      isFlipped: false,
      isMatched: false,
      position: getCardPosition(index),
    }));
    
    setCards(newCards);
    
    // Pentru nivelurile avansate, realizăm și animație de amestecare
    if (difficulty === 'advance' || difficulty === 'hard') {
      performShuffleAnimation();
    }
  };
  
  // Amestecăm array-ul de valori pentru cărți
  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };
  
  // Calculăm poziția inițială a cardului în grid
  const getCardPosition = (index) => {
    const row = Math.floor(index / 4);
    const col = index % 4;
    return { row, col };
  };
  
  // Animație de amestecare pentru nivele avansate
  const performShuffleAnimation = () => {
    // Definim ordinea de amestecare în funcție de nivel
    const shufflePairs = getShufflePairsForLevel(level);
    
    // Actualizăm pozițiile cărților în funcție de ordinea de amestecare
    const updatedCards = [...cards];
    shufflePairs.forEach(pair => {
      const [from, to] = pair;
      // Calculăm noile poziții
      const fromPos = getCardPosition(from - 1); // Ajustăm pentru indexul 0
      const toPos = getCardPosition(to - 1);   // Ajustăm pentru indexul 0
      
      // Actualizăm cărțile
      if (updatedCards[from - 1] && updatedCards[to - 1]) {
        updatedCards[from - 1].position = toPos;
        updatedCards[to - 1].position = fromPos;
      }
    });
    
    setCards(updatedCards);
    
    // Animăm amestecarea
    shuffleAnim.setValue(0);
    Animated.timing(shuffleAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  };
  
  // Întoarcem o carte când este apăsată
  const flipCard = (id) => {
    if (isProcessing || flippedIndexes.length >= 2 || gameCompleted) return;
    
    // Găsim indexul cărții în starea noastră
    const cardIndex = cards.findIndex(card => card.id === id);
    if (cardIndex === -1 || cards[cardIndex].isMatched) return;
    
    // Actualizăm starea de flip a cărții
    const newCards = [...cards];
    newCards[cardIndex].isFlipped = true;
    setCards(newCards);
    
    // Adăugăm la array-ul de cărți întoarse
    setFlippedIndexes([...flippedIndexes, cardIndex]);
    
    // Verificăm dacă este a doua carte întoarsă
    if (flippedIndexes.length === 1) {
      setIsProcessing(true);
      
      // Verificăm dacă cele două cărți se potrivesc
      const firstCardIndex = flippedIndexes[0];
      
      if (newCards[firstCardIndex].value === newCards[cardIndex].value) {
        // Am găsit o pereche!
        setTimeout(() => {
          const matchedCards = [...newCards];
          matchedCards[firstCardIndex].isMatched = true;
          matchedCards[cardIndex].isMatched = true;
          setCards(matchedCards);
          
          // Actualizăm perechile potrivite și resetăm indexurile întoarse
          setMatchedPairs([...matchedPairs, matchedCards[firstCardIndex].value]);
          setFlippedIndexes([]);
          setIsProcessing(false);
          
          // Adăugăm monede pentru perechea găsită
          addCoins(getRewardForMatch());
          
          // Verificăm dacă jocul s-a terminat
          checkGameCompletion(matchedPairs.length + 1);
        }, 1000);
      } else {
        // Nu s-au potrivit, întoarcem cărțile la loc
        setTimeout(() => {
          const resetCards = [...newCards];
          resetCards[firstCardIndex].isFlipped = false;
          resetCards[cardIndex].isFlipped = false;
          setCards(resetCards);
          setFlippedIndexes([]);
          setIsProcessing(false);
          
          // În modul hard, pierdem jumătate de viață
          if (difficulty === 'hard') {
            updateLives(-0.5);
          }
        }, timePerCard * 1000);
      }
    }
  };
  
  // Verificăm dacă jocul a fost completat
  const checkGameCompletion = (pairsFound) => {
    if (pairsFound === 8) {  // 8 perechi în total
      setGameCompleted(true);
      Alert.alert('Felicitări!', 'Ai completat nivelul!');
    }
  };
  
  // Returnăm configurația de amestecare pentru nivelul curent
  const getShufflePairsForLevel = (level) => {
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
  
  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        <View style={styles.row}>
          {cards.slice(0, 4).map((card) => (
            <Card
              key={card.id}
              id={card.id}
              value={card.value}
              isFlipped={card.isFlipped}
              isMatched={card.isMatched}
              onPress={flipCard}
              position={card.position}
              shuffleAnimation={difficulty !== 'easy' ? shuffleAnim : null}
            />
          ))}
        </View>
        <View style={styles.row}>
          {cards.slice(4, 8).map((card) => (
            <Card
              key={card.id}
              id={card.id}
              value={card.value}
              isFlipped={card.isFlipped}
              isMatched={card.isMatched}
              onPress={flipCard}
              position={card.position}
              shuffleAnimation={difficulty !== 'easy' ? shuffleAnim : null}
            />
          ))}
        </View>
        <View style={styles.row}>
          {cards.slice(8, 12).map((card) => (
            <Card
              key={card.id}
              id={card.id}
              value={card.value}
              isFlipped={card.isFlipped}
              isMatched={card.isMatched}
              onPress={flipCard}
              position={card.position}
              shuffleAnimation={difficulty !== 'easy' ? shuffleAnim : null}
            />
          ))}
        </View>
        <View style={styles.row}>
          {cards.slice(12, 16).map((card) => (
            <Card
              key={card.id}
              id={card.id}
              value={card.value}
              isFlipped={card.isFlipped}
              isMatched={card.isMatched}
              onPress={flipCard}
              position={card.position}
              shuffleAnimation={difficulty !== 'easy' ? shuffleAnim : null}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  grid: {
    justifyContent: 'center',
    alignItems: 'center',
    width: width * 0.9,
    height: height * 0.8,
    maxWidth: 800,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
});

export default GameBoard; 