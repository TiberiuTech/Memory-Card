import React, { useEffect } from 'react';
import { StyleSheet, Pressable, View, Text, Dimensions, Animated } from 'react-native';
import { useGame } from '../context/GameContext';

const { width, height } = Dimensions.get('window');
// Calculăm dimensiunea cardului pentru a se potrivi exact 4 pe un rând
const CARD_SIZE = Math.min(width * 0.22, height * 0.22); // Asigură 4 pe rând cu spațiu între ele

const Card = ({ id, value, isFlipped, isMatched, onPress, position, shuffleAnimation }) => {
  const { difficulty } = useGame();
  const flipAnimation = new Animated.Value(isFlipped ? 1 : 0);
  
  // Animație de flip
  useEffect(() => {
    Animated.timing(flipAnimation, {
      toValue: isFlipped ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
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
  
  const frontAnimatedStyle = {
    transform: [{ rotateY: frontInterpolate }],
  };
  
  const backAnimatedStyle = {
    transform: [{ rotateY: backInterpolate }],
  };
  
  // Stiluri condiționale pentru cartonașe potrivite
  const cardStyle = isMatched 
    ? [styles.card, styles.matchedCard] 
    : styles.card;
  
  // Animație pentru amestecarea cărților (doar pentru modul 'advance' și 'hard')
  const translateX = position && shuffleAnimation ? 
    shuffleAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, position.x || 0],
    }) : new Animated.Value(0);
  
  const translateY = position && shuffleAnimation ? 
    shuffleAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, position.y || 0],
    }) : new Animated.Value(0);
  
  return (
    <Pressable
      style={[
        styles.container,
        { transform: [{ translateX }, { translateY }] }
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
    width: CARD_SIZE,
    height: CARD_SIZE * 1.4,
    margin: 5,
    // Adăugăm o lățime minimă pentru a asigura 4 pe un rând
    minWidth: '23%',
    maxWidth: '23%',
  },
  cardFace: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backfaceVisibility: 'hidden',
  },
  card: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#fff',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  cardBack: {
    backgroundColor: '#5c6bc0',
  },
  matchedCard: {
    backgroundColor: '#81c784',
  },
  cardText: {
    fontSize: CARD_SIZE * 0.4,
    fontWeight: 'bold',
    color: '#333',
  },
  cardBackText: {
    fontSize: CARD_SIZE * 0.4,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default Card; 