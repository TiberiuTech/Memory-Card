import React, { useEffect } from 'react';
import { StyleSheet, Pressable, View, Text, Dimensions, Animated } from 'react-native';
import { useGame } from '../context/GameContext';

const { width, height } = Dimensions.get('window');
// Calculăm dimensiunea cardului bazată pe orientarea portrait
// În modul portrait, folosim lățimea ecranului pentru a calcula dimensiunea cardului
// Vrem 4 carduri pe lățime, deci împărțim lățimea la 4 și reducem puțin pentru marje

// Calculăm dimensiunea cardului pentru modul portrait
const CARD_WIDTH = width * 0.22; // Aproximativ 1/4 din lățimea ecranului minus margini
const CARD_HEIGHT = CARD_WIDTH * 1.3; // Păstrăm raportul de aspect

const Card = ({ id, value, isFlipped, isMatched, onPress, position, shuffleAnimation }) => {
  const { difficulty } = useGame();
  const flipAnimation = new Animated.Value(isFlipped ? 1 : 0);
  
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
  
  // Calculăm transformările pentru animație sau folosim valori statice
  let cardTransform = [];
  
  if (position && shuffleAnimation) {
    // Animație pentru poziții când există shuffleAnimation
    const translateX = shuffleAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, position.x || 0],
    });
    
    const translateY = shuffleAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, position.y || 0],
    });
    
    cardTransform = [
      { translateX },
      { translateY }
    ];
  }
  
  return (
    <Pressable
      style={[
        styles.container,
        cardTransform.length > 0 ? { transform: cardTransform } : {}
      ]}
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
  );
};

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    margin: 3,
    // Folosim o abordare flexibilă pentru lățime
    flex: 0, // Dezactivăm flex pentru a folosi dimensiuni fixe
    maxWidth: CARD_WIDTH,
    perspective: 1000, // Adăugăm perspectivă pentru efect 3D mai bun
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