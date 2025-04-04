import React, { useEffect, useRef } from 'react';
import { StyleSheet, Pressable, View, Text, Dimensions, Animated } from 'react-native';
import { useGame } from '../context/GameContext';

const { width, height } = Dimensions.get('window');
// Calculăm dimensiunea cardului bazată pe orientarea portrait
// În modul portrait, folosim lățimea ecranului pentru a calcula dimensiunea cardului
// Vrem 4 carduri pe lățime, deci împărțim lățimea la 4 și reducem puțin pentru marje

// Calculăm dimensiunea cardului pentru modul portrait
const CARD_WIDTH = width * 0.22; // Aproximativ 1/4 din lățimea ecranului minus margini
const CARD_HEIGHT = CARD_WIDTH * 1.3; // Păstrăm raportul de aspect

// Funcție helper pentru a găsi poziția pe grid (row, col) pentru un număr de poziție (1-16)
const getPositionFromGridNumber = (gridPos) => {
  const pos = gridPos - 1; // Convertim de la 1-based la 0-based
  const row = Math.floor(pos / 4);
  const col = pos % 4;
  return { row, col };
};

// Calculăm coordonatele x,y pentru o poziție pe grid
const getCoordinatesForPosition = (gridPos) => {
  const { row, col } = getPositionFromGridNumber(gridPos);
  // Calculăm coordonatele absolute
  const x = col * (CARD_WIDTH + 6); // 6 = marja totală între cărți
  const y = row * (CARD_HEIGHT + 6);
  return { x, y };
};

const Card = ({ id, value, isFlipped, isMatched, onPress, position, gridPos, animated, swapTo }) => {
  const { difficulty } = useGame();
  const flipAnimation = new Animated.Value(isFlipped ? 1 : 0);
  
  // Animație pentru swapping
  const swapAnimation = useRef(new Animated.Value(0)).current;
  
  // Resetăm animația de swap când se schimbă starea animated
  useEffect(() => {
    if (animated) {
      swapAnimation.setValue(0);
      Animated.timing(swapAnimation, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true
      }).start();
    }
  }, [animated, swapTo]);
  
  // Animație de flip
  useEffect(() => {
    Animated.timing(flipAnimation, {
      toValue: isFlipped ? 1 : 0,
      duration: 350, // Crescută de la 250ms la 350ms pentru animație mai vizibilă
      useNativeDriver: true,
      delay: isFlipped ? 100 : 0, // Adăugăm o mică întârziere când întoarcem cartea
    }).start();
  }, [isFlipped]);
  
  // Interpolări pentru animație
  const frontInterpolate = flipAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '0deg'],
  });
  
  const backInterpolate = flipAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });
  
  // Adăugăm și o animație de opacitate pentru a face cardul mai vizibil
  const frontOpacity = flipAnimation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0, 1],
  });
  
  const backOpacity = flipAnimation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 0, 0],
  });
  
  const frontAnimatedStyle = {
    transform: [{ rotateY: frontInterpolate }],
    opacity: frontOpacity,
  };
  
  const backAnimatedStyle = {
    transform: [{ rotateY: backInterpolate }],
    opacity: backOpacity,
  };
  
  // Stiluri condiționale pentru cartonașe potrivite
  const cardStyle = isMatched 
    ? [styles.card, styles.matchedCard] 
    : styles.card;
  
  // Stiluri pentru animația de schimb între poziții
  let containerStyle = [styles.container];
  
  if (animated && swapTo) {
    // Calculăm coordonatele pentru poziția actuală și cea țintă
    const currentPos = getCoordinatesForPosition(gridPos);
    const targetPos = getCoordinatesForPosition(swapTo);
    
    // Calculăm diferența pentru a anima
    const deltaX = targetPos.x - currentPos.x;
    const deltaY = targetPos.y - currentPos.y;
    
    // Interpolăm mișcarea
    const translateX = swapAnimation.interpolate({
      inputRange: [0, 0.4, 0.6, 1],
      outputRange: [0, deltaX, deltaX, 0], // Mișcă la target apoi înapoi
    });
    
    const translateY = swapAnimation.interpolate({
      inputRange: [0, 0.4, 0.6, 1],
      outputRange: [0, deltaY, deltaY, 0], // Mișcă la target apoi înapoi
    });
    
    // Adăugăm și scalare pentru efect vizual
    const scale = swapAnimation.interpolate({
      inputRange: [0, 0.2, 0.8, 1],
      outputRange: [1, 1.2, 1.2, 1],
    });
    
    // Adăugăm rotație pentru un efect mai realist
    const rotate = swapAnimation.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: ['0deg', `${gridPos % 2 === 0 ? 180 : -180}deg`, '0deg'],
    });
    
    // Adăugăm elevație pentru efect 3D
    const elevation = swapAnimation.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [1, 10, 1],
    });
    
    containerStyle.push({
      transform: [
        { translateX },
        { translateY },
        { scale },
        { rotate }
      ],
      elevation,
      zIndex: 100, // Asigurăm că cartea animată este deasupra celorlalte
    });
  }
  
  return (
    <Animated.View style={containerStyle}>
      <Pressable
        style={styles.cardContainer}
        onPress={() => !isFlipped && !isMatched && onPress(id)}
        disabled={isFlipped || isMatched}
      >
        {/* Partea din față (valoarea cardului) */}
        <Animated.View style={[cardStyle, frontAnimatedStyle, styles.cardFace]}>
          <Text style={styles.cardText}>{value}</Text>
        </Animated.View>
        
        {/* Partea din spate (spatele cardului) */}
        <Animated.View style={[styles.card, styles.cardBack, backAnimatedStyle, styles.cardFace]}>
          <Text style={styles.cardBackText}>?</Text>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    margin: 3,
    perspective: 1000,
  },
  cardContainer: {
    width: '100%',
    height: '100%',
  },
  cardFace: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backfaceVisibility: 'hidden',
    borderRadius: 6,
  },
  card: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
    backgroundColor: '#fff',
    elevation: 5, // Creștem elevația pentru umbră mai pronunțată
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3, // Creștem opacitatea umbrei
    shadowRadius: 3, // Creștem raza umbrei
  },
  cardBack: {
    backgroundColor: '#5c6bc0',
  },
  matchedCard: {
    backgroundColor: '#81c784',
  },
  cardText: {
    fontSize: Math.max(CARD_WIDTH * 0.45, 14), // Asigurăm o dimensiune lizibilă
    fontWeight: 'bold',
    color: '#333',
  },
  cardBackText: {
    fontSize: Math.max(CARD_WIDTH * 0.45, 14),
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default Card; 