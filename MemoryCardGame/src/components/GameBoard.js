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
  const [initialViewPeriod, setInitialViewPeriod] = useState(false); // Stare pentru perioada inițială de vizualizare
  
  // Animație pentru amestecare (nivel advance)
  const shuffleAnimation = useRef(new Animated.Value(0)).current;
  const [isShuffling, setIsShuffling] = useState(false);
  
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
    
    // Resetăm toate stările la început
    setInitialViewPeriod(true);
    setIsShuffling(false);
    setFlippedIndexes([]);
    
    console.log(`Generez cărți noi pentru nivel ${level} (${difficulty})`);
    
    // Creăm cărțile cu valorile inițiale
    let newCards = shuffled.map((value, index) => ({
      id: index,
      value,
      // Pentru nivelurile easy și advance, afișăm cărțile cu fața în sus inițial
      isFlipped: difficulty !== 'hard',
      isMatched: false,
      position: getCardPosition(index),
      // Adăugăm poziția inițială de grid
      gridPos: index + 1, // Poziția 1-16 pe grid (pentru animație)
      animated: false,
    }));
    
    // Setăm imediat cărțile
    setCards(newCards);
    
    // Verificăm starea cărților după 100ms
    setTimeout(() => {
      console.log(`Verificare după 100ms: Cards[0].isFlipped = ${newCards[0].isFlipped}`);
    }, 100);
    
    // Pentru nivelul easy
    if (difficulty === 'easy') {
      // Folosim timpul specific nivelului pentru perioada de vizualizare
      const viewTime = timePerCard * 1000; // Convertim din secunde în milisecunde
      console.log(`Nivel easy ${level}: Timp de vizualizare ${timePerCard} secunde`);
      
      // După timpul de vizualizare, întoarcem cărțile cu fața în jos
      setTimeout(() => {
        console.log("Easy: Întorc cărțile cu fața în jos");
        setCards(prevCards => 
          prevCards.map(card => ({
            ...card,
            isFlipped: false
          }))
        );
        setInitialViewPeriod(false); // Dezactivăm perioada de vizualizare
      }, viewTime);
    }
    
    // Pentru nivelul advance
    else if (difficulty === 'advance') {
      // Fix 1.5 secunde pentru vizualizare
      const viewTime = 1500; 
      console.log(`Nivel advance ${level}: Afișez cărțile timp de ${viewTime/1000} secunde`);
      
      // Verificăm starea cărților și starea initialViewPeriod
      console.log(`Initial view period este: ${initialViewPeriod}`);
      
      // După timpul de vizualizare, întoarcem cărțile și începem amestecarea
      setTimeout(() => {
        console.log("Advance: Întorc cărțile cu fața în jos acum");
        // Întoarcem toate cărțile cu fața în jos
        setCards(prevCards => {
          const updatedCards = prevCards.map(card => ({
            ...card,
            isFlipped: false
          }));
          console.log(`Card[0] după flip: isFlipped=${updatedCards[0].isFlipped}`);
          return updatedCards;
        });
        
        // După o scurtă pauză, începem amestecarea
        setTimeout(() => {
          console.log("Advance: Pornesc amestecarea");
          startCardShuffling();
        }, 300);
        
      }, viewTime); // 1.5 secunde exact
    }
    
    // Pentru nivelul hard, pornim direct amestecarea fără a afișa cărțile
    else if (difficulty === 'hard') {
      console.log("Hard: Pornesc amestecarea directă");
      startCardShuffling();
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
  
  // Întoarcem o carte când este apăsată
  const flipCard = (id) => {
    // Verificăm dacă putem întoarce cărți în acest moment
    if (isProcessing || flippedIndexes.length >= 2 || gameCompleted || initialViewPeriod || isShuffling) {
      console.log(`Nu pot întoarce cartea - Processing: ${isProcessing}, Flipped: ${flippedIndexes.length}, Completed: ${gameCompleted}, InitialView: ${initialViewPeriod}, Shuffling: ${isShuffling}`);
      return;
    }
    
    // Găsim indexul cărții în starea noastră
    const cardIndex = cards.findIndex(card => card.id === id);
    if (cardIndex === -1 || cards[cardIndex].isMatched) return;
    
    // Actualizăm starea de flip a cărții
    const newCards = [...cards];
    newCards[cardIndex].isFlipped = true;
    setCards(newCards);
    console.log(`Întorc cartea ${id} (value: ${cards[cardIndex].value})`);
    
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
          console.log(`Pereche găsită! Valoarea: ${matchedCards[firstCardIndex].value}`);
          
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
        console.log(`Perechea nu s-a potrivit. Card1: ${newCards[firstCardIndex].value}, Card2: ${newCards[cardIndex].value}`);
        console.log(`Păstrez cărțile vizibile timp de 1.5 secunde`);
        
        setTimeout(() => {
          console.log("Întorc cărțile nepotrivite cu fața în jos");
          const resetCards = [...newCards];
          resetCards[firstCardIndex].isFlipped = false;
          resetCards[cardIndex].isFlipped = false;
          setCards(resetCards);
          setFlippedIndexes([]);
          setIsProcessing(false);
          
          // În modul hard, pierdem jumătate de viață
          if (difficulty === 'hard') {
            console.log("Hard mode: -0.5 vieți");
            updateLives(-0.5);
          }
        }, 1500); // Fix la 1.5 secunde
      }
    }
  };
  
  // Verificăm dacă jocul a fost completat
  const checkGameCompletion = (pairsFound) => {
    if (pairsFound === 8) {  // 8 perechi în total
      setGameCompleted(true);
      
      if (level < 10) {
        // Trecem la nivelul următor
        const nextLevel = level + 1;
        
        // Afișăm mesajul de felicitare și anunțăm trecerea la nivelul următor
        Alert.alert(
          'Felicitări!', 
          `Ai completat nivelul ${level}! Treci la nivelul ${nextLevel}.`,
          [
            { 
              text: 'Continuă', 
              onPress: () => {
                // Actualizăm nivelul și pregătim noul joc
                updateLevel(nextLevel);
              }
            }
          ]
        );
      } else {
        // Jucătorul a terminat toate nivelurile
        Alert.alert(
          'Felicitări!', 
          'Ai completat toate nivelurile în modul ' + difficulty + '!',
          [
            { 
              text: 'Joacă din nou', 
              onPress: () => {
                // Resetăm la nivelul 1
                updateLevel(1);
              }
            }
          ]
        );
      }
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
  
  // Funcție pentru animarea schimbului între două cărți
  const animateCardSwap = (card1Pos, card2Pos) => {
    // Găsim cardurile care trebuie animate (prin poziția lor pe grid 1-16)
    setCards(prevCards => {
      const updatedCards = [...prevCards];
      
      // Găsim indexurile cărților în array
      const card1Index = updatedCards.findIndex(card => card.gridPos === card1Pos);
      const card2Index = updatedCards.findIndex(card => card.gridPos === card2Pos);
      
      // Dacă am găsit ambele cărți, le schimbăm valorile
      if (card1Index !== -1 && card2Index !== -1) {
        // Marcăm cărțile pentru animație
        updatedCards[card1Index] = {...updatedCards[card1Index], animated: true, swapTo: card2Pos};
        updatedCards[card2Index] = {...updatedCards[card2Index], animated: true, swapTo: card1Pos};
        
        // După 300ms, finalizăm schimbul valorilor și resetăm starea animației
        setTimeout(() => {
          setCards(prevCards => {
            const finalCards = [...prevCards];
            
            // Găsim din nou indexurile (ar trebui să fie aceleași)
            const idx1 = finalCards.findIndex(card => card.gridPos === card1Pos);
            const idx2 = finalCards.findIndex(card => card.gridPos === card2Pos);
            
            if (idx1 !== -1 && idx2 !== -1) {
              // Schimbăm valorile
              const tempValue = finalCards[idx1].value;
              finalCards[idx1].value = finalCards[idx2].value;
              finalCards[idx2].value = tempValue;
              
              // Resetăm starea animației
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
  
  // Funcție pentru pornirea animației de amestecare
  const startCardShuffling = () => {
    console.log("Începe procesul de amestecare a cărților");
    setIsShuffling(true);
    
    // Obținem configurația de amestecare pentru nivelul curent
    const shufflePairs = getShufflePairsForLevel(level);
    console.log(`Nivel ${level} (${difficulty}): Folosesc configurația de amestecare specifică nivelului`);
    
    // Definim durata totală a animației și delay între perechi
    const totalDuration = 3000; // 3 secunde în total
    const pairDelay = 300; // 300ms între fiecare pereche
    
    // Pornim animația de amestecare cu un timer 
    // pentru fiecare pereche de cărți, în secvență
    shufflePairs.forEach((pair, pairIndex) => {
      setTimeout(() => {
        // Animăm schimbul între 2 cărți
        console.log(`Animez schimbul #${pairIndex+1}: ${pair[0]} <-> ${pair[1]}`);
        animateCardSwap(pair[0], pair[1]);
      }, pairIndex * pairDelay);
    });
    
    // După ce toate animațiile sunt terminate, deblocăm interacțiunea
    setTimeout(() => {
      console.log("Amestecarea s-a terminat - jocul poate începe");
      setIsShuffling(false);
      setInitialViewPeriod(false);
    }, totalDuration);
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
    width: width * 0.95, // Folosim aproape toată lățimea ecranului în modul portrait
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