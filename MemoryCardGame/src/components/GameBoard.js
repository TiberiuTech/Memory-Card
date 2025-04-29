import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Alert, Dimensions, ScrollView, Animated } from 'react-native';
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
    getRewardForMatch,
    updateLevel 
  } = useGame();
  
  const [cards, setCards] = useState([]);
  const [flippedIndexes, setFlippedIndexes] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [initialViewPeriod, setInitialViewPeriod] = useState(false);
  
  const shuffleAnimation = useRef(new Animated.Value(0)).current;
  const [isShuffling, setIsShuffling] = useState(false);
  
  useEffect(() => {
    generateCards();
    setFlippedIndexes([]);
    setMatchedPairs([]);
    setGameCompleted(false);
  }, [level, difficulty]);
  
  const generateCards = () => {
    const values = [1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 6, 7, 8];
    let shuffled = shuffleArray(values);
    
    setInitialViewPeriod(true);
    setIsShuffling(false);
    setFlippedIndexes([]);
    
    console.log(`Generate cards for level ${level} (${difficulty})`);
    
    let newCards = shuffled.map((value, index) => ({
      id: index,
      value,
      isFlipped: true,
      isMatched: false,
      position: getCardPosition(index),
      gridPos: index + 1,
      animated: false,
    }));
    
    setCards(newCards);
    
    setTimeout(() => {
      console.log(`Check after 100ms: Cards[0].isFlipped = ${newCards[0].isFlipped}`);
    }, 100);
    
    if (difficulty === 'easy') {
      const viewTime = timePerCard * 1000;
      console.log(`Easy level ${level}: View time ${timePerCard} seconds`);
      
      setTimeout(() => {
        console.log("Easy: Turn cards face down");
        setCards(prevCards => 
          prevCards.map(card => ({
            ...card,
            isFlipped: false
          }))
        );
        setInitialViewPeriod(false);
      }, viewTime);
    }
    
    else if (difficulty === 'advance') {
      const viewTime = 1500; 
      console.log(`Advance level ${level}: Display cards for ${viewTime/1000} seconds`);
      
      console.log(`Initial view period is: ${initialViewPeriod}`);
      
      setTimeout(() => {
        console.log("Advance: Turn cards face down now");
        setCards(prevCards => {
          const updatedCards = prevCards.map(card => ({
            ...card,
            isFlipped: false
          }));
          console.log(`Card[0] after flip: isFlipped=${updatedCards[0].isFlipped}`);
          return updatedCards;
        });
        
        setTimeout(() => {
          console.log("Advance: Start shuffling");
          startCardShuffling();
        }, 300);
        
      }, viewTime);
    }
    
    else if (difficulty === 'hard') {
      const viewTime = 3500;
      console.log(`Hard level ${level}: Display cards for ${viewTime/1000} seconds`);
      
      setTimeout(() => {
        console.log("Hard: Start distribution animation");
        startCardDistribution();
      }, viewTime);
    }
  };
  
  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };
  
  const getCardPosition = (index) => {
    const row = Math.floor(index / 4);
    const col = index % 4;
    return { row, col };
  };
  
  const flipCard = (id) => {
    if (isProcessing || flippedIndexes.length >= 2 || gameCompleted || initialViewPeriod || isShuffling) {
      console.log(`Cannot flip card - Processing: ${isProcessing}, Flipped: ${flippedIndexes.length}, Completed: ${gameCompleted}, InitialView: ${initialViewPeriod}, Shuffling: ${isShuffling}`);
      return;
    }
    
    const cardIndex = cards.findIndex(card => card.id === id);
    if (cardIndex === -1 || cards[cardIndex].isMatched) return;
    
    const newCards = [...cards];
    newCards[cardIndex].isFlipped = true;
    setCards(newCards);
    console.log(`Turn card ${id} (value: ${cards[cardIndex].value})`);
    
    setFlippedIndexes([...flippedIndexes, cardIndex]);
    
    if (flippedIndexes.length === 1) {
      setIsProcessing(true);
      
      const firstCardIndex = flippedIndexes[0];
      
      if (newCards[firstCardIndex].value === newCards[cardIndex].value) {
        setTimeout(() => {
          const matchedCards = [...newCards];
          matchedCards[firstCardIndex].isMatched = true;
          matchedCards[cardIndex].isMatched = true;
          setCards(matchedCards);
          console.log(`Pair found! Value: ${matchedCards[firstCardIndex].value}`);
          
          setMatchedPairs([...matchedPairs, matchedCards[firstCardIndex].value]);
          setFlippedIndexes([]);
          setIsProcessing(false);
          
          addCoins(getRewardForMatch());
          
          checkGameCompletion(matchedPairs.length + 1);
        }, 1000);
      } else {
        console.log(`Pair not found. Card1: ${newCards[firstCardIndex].value}, Card2: ${newCards[cardIndex].value}`);
        console.log(`Keep cards visible for 1.5 seconds`);

        setTimeout(() => {
          console.log("Turn cards face down");
          const resetCards = [...newCards];
          resetCards[firstCardIndex].isFlipped = false;
          resetCards[cardIndex].isFlipped = false;
          setCards(resetCards);
          setFlippedIndexes([]);
          setIsProcessing(false);
          
          if (difficulty === 'hard') {
            console.log("Hard mode: -0.5 lives");
            updateLives(-0.5);
          }
        }, 1500);
      }
    }
  };
  
  const checkGameCompletion = (pairsFound) => {
    if (pairsFound === 8) {
      setGameCompleted(true);
      
      if (level < 10) {
        const nextLevel = level + 1;
        
        Alert.alert(
          'Congratulations!', 
          `You completed level ${level}! Go to level ${nextLevel}.`,
          [
            { 
              text: 'Continue', 
              onPress: () => {
                updateLevel(nextLevel);
              }
            }
          ]
        );
      } else {
        Alert.alert(
          'Congratulations!', 
          'You completed all levels in ' + difficulty + ' mode!',
          [
            { 
              text: 'Play again', 
              onPress: () => {
                updateLevel(1);
              }
            }
          ]
        );
      }
    }
  };
  
  const getShufflePairsForLevel = (level) => {
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
  
  const animateCardSwap = (card1Pos, card2Pos) => {
    setCards(prevCards => {
      const updatedCards = [...prevCards];
      
      const card1Index = updatedCards.findIndex(card => card.gridPos === card1Pos);
      const card2Index = updatedCards.findIndex(card => card.gridPos === card2Pos);
      
      if (card1Index !== -1 && card2Index !== -1) {
        updatedCards[card1Index] = {...updatedCards[card1Index], animated: true, swapTo: card2Pos};
        updatedCards[card2Index] = {...updatedCards[card2Index], animated: true, swapTo: card1Pos};
        
        setTimeout(() => {
          setCards(prevCards => {
            const finalCards = [...prevCards];
            
            const idx1 = finalCards.findIndex(card => card.gridPos === card1Pos);
            const idx2 = finalCards.findIndex(card => card.gridPos === card2Pos);
            
            if (idx1 !== -1 && idx2 !== -1) {
              const tempValue = finalCards[idx1].value;
              finalCards[idx1].value = finalCards[idx2].value;
              finalCards[idx2].value = tempValue;
              
              finalCards[idx1].animated = false;
              finalCards[idx2].animated = false;
              delete finalCards[idx1].swapTo;
              delete finalCards[idx2].swapTo;
            }
            
            return finalCards;
          });
        }, 800);
      }
      
      return updatedCards;
    });
  };
  
  const startCardShuffling = () => {
    console.log("Start shuffling animation");
    setIsShuffling(true);
    
    const shufflePairs = getShufflePairsForLevel(level);
    console.log(`Level ${level} (${difficulty}): Using specific level shuffle configuration`);
    
    const totalDuration = 3000;
    const pairDelay = 300;
    
    shufflePairs.forEach((pair, pairIndex) => {
      setTimeout(() => {
        console.log(`animate the swap #${pairIndex+1}: ${pair[0]} <-> ${pair[1]}`);
        animateCardSwap(pair[0], pair[1]);
      }, pairIndex * pairDelay);
    });
    
    setTimeout(() => {
      console.log("Shuffling finished - game can start");
      setIsShuffling(false);
      setInitialViewPeriod(false);
    }, totalDuration);
  };
  
  const startCardDistribution = () => {
    console.log("Start card distribution animation for hard level");
    setIsShuffling(true);
    
    let remainingValues = [1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 6, 7, 8];
    remainingValues = shuffleArray(remainingValues);
    
    for (let i = 1; i < remainingValues.length; i++) {
      if (remainingValues[i] === remainingValues[i-1]) {
        for (let j = i + 1; j < remainingValues.length; j++) {
          if (remainingValues[j] !== remainingValues[i]) {
            [remainingValues[i], remainingValues[j]] = [remainingValues[j], remainingValues[i]];
            break;
          }
        }
      }
    }
    
    const distributionDelay = 300;
    
    setCards(prevCards => 
      prevCards.map(card => ({
        ...card,
        isFlipped: false,
        isStack: true,
        stackPosition: 1
      }))
    );

    for (let position = 1; position <= 16; position++) {
      setTimeout(() => {
        setCards(prevCards => {
          const updatedCards = [...prevCards];
          
          updatedCards.forEach((card, index) => {
            if (card.isStack) {
              updatedCards[index].stackPosition = position;
            }
          });
          
          const cardIndex = updatedCards.findIndex(card => card.gridPos === position);
          
          if (cardIndex !== -1) {
            updatedCards[cardIndex].value = remainingValues[position - 1];
            
            updatedCards[cardIndex].isStack = false;
            updatedCards[cardIndex].animated = true;
            
            setTimeout(() => {
              setCards(prevState => {
                const newState = [...prevState];
                const idx = newState.findIndex(card => card.gridPos === position);
                if (idx !== -1) {
                  newState[idx].isFlipped = true;
                  newState[idx].animated = false;
                }
                return newState;
              });
            }, 200);
          }
          
          return updatedCards;
        });
      }, position * distributionDelay);
    }
    
    const totalDistributionTime = 16 * distributionDelay + 1500;
    
    setTimeout(() => {
      setCards(prevCards => 
        prevCards.map(card => ({
          ...card,
          isFlipped: false,
          animated: false,
          isStack: false
        }))
      );
      
      setTimeout(() => {
        console.log("Hard: Start final shuffling");
        startCardShuffling();
      }, 500);
      
    }, totalDistributionTime);
  };
  
  return (
    <View style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
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
                gridPos={card.gridPos}
                animated={card.animated}
                swapTo={card.swapTo}
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
                gridPos={card.gridPos}
                animated={card.animated}
                swapTo={card.swapTo}
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
                gridPos={card.gridPos}
                animated={card.animated}
                swapTo={card.swapTo}
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
                gridPos={card.gridPos}
                animated={card.animated}
                swapTo={card.swapTo}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  grid: {
    justifyContent: 'center',
    alignItems: 'center',
    width: width * 0.95,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginVertical: 3,
  },
});

export default GameBoard; 