import React, { useEffect, useRef } from 'react';
import { StyleSheet, Pressable, View, Text, Dimensions, Animated, Image, Easing } from 'react-native';
import { useGame } from '../context/GameContext';

const { width, height } = Dimensions.get('window');

const CARD_WIDTH = width * 0.22;
const CARD_HEIGHT = CARD_WIDTH * 1.5;


const getPositionFromGridNumber = (gridPos) => {
  const pos = gridPos - 1;
  const row = Math.floor(pos / 4);
  const col = pos % 4;
  return { row, col };
};

const getCoordinatesForPosition = (gridPos) => {
  const { row, col } = getPositionFromGridNumber(gridPos);
  const x = col * (CARD_WIDTH + 6);
  const y = row * (CARD_HEIGHT + 6);
  return { x, y };
};

const getStackCoordinates = (gridPos) => {
  const { row, col } = getPositionFromGridNumber(1);
  const x = col * (CARD_WIDTH + 6);
  const y = row * (CARD_HEIGHT + 6);
  return { x, y };
};

const cardBackImage = require('../assets/images/Pug.png');

const iceCreamImages = [
  require('../assets/images/IceCreamBlue.png'),   //1
  require('../assets/images/IceCreamGreen.png'),  //2
  require('../assets/images/IceCreamOrange.png'), //3
  require('../assets/images/IceCreamPurple.png'), //4
  require('../assets/images/IceCreamRed.png'),    //5
  require('../assets/images/IceCreamWhite.png'),  //6
  require('../assets/images/IceCreamYellow.png'), //7
  require('../assets/images/IceCreamPink.png'),   //8
];

const Card = ({ id, value, isFlipped, isMatched, onPress, position, gridPos, animated, swapTo, isStack, stackPosition }) => {
  const { difficulty } = useGame();
  
  useEffect(() => {
    if (difficulty === 'hard' && isStack) {
      console.log(`Card ${id} (value ${value}): in stack ${stackPosition}`);
    }
  }, [isStack, stackPosition, difficulty, id, value]);
  
  const flipAnimation = new Animated.Value(isFlipped ? 1 : 0);
  
  const swapAnimation = useRef(new Animated.Value(0)).current;
  
  const stackAnimation = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    if (isStack) {
      stackAnimation.setValue(0);
      Animated.timing(stackAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true
      }).start();
    }
  }, [isStack, stackPosition]);
  
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
  
  useEffect(() => {
    Animated.timing(flipAnimation, {
      toValue: isFlipped ? 1 : 0,
      duration: 600,
      easing: Easing.bounce,
      useNativeDriver: true,
      delay: 0,
    }).start();
  }, [isFlipped]);
  
  const frontInterpolate = flipAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '0deg'],
  });
  
  const backInterpolate = flipAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });
  
  const frontOpacity = flipAnimation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0, 1],
  });
  
  const backOpacity = flipAnimation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 0, 0],
  });
  
  const scale = flipAnimation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 1.2, 1],
  });
  
  const rotate = flipAnimation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['0deg', '360deg', '0deg'],
  });
  
  const frontAnimatedStyle = {
    transform: [{ rotateY: frontInterpolate }, { scale }, { rotate }],
    opacity: frontOpacity,
  };
  
  const backAnimatedStyle = {
    transform: [{ rotateY: backInterpolate }, { scale }, { rotate }],
    opacity: backOpacity,
  };
  
  const cardStyle = isMatched 
    ? [styles.card, styles.matchedCard] 
    : styles.card;
  
  let containerStyle = [styles.container];
  
  if (animated && swapTo) {
    const currentPos = getCoordinatesForPosition(gridPos);
    const targetPos = getCoordinatesForPosition(swapTo);
    
    const deltaX = targetPos.x - currentPos.x;
    const deltaY = targetPos.y - currentPos.y;
    
    const translateX = swapAnimation.interpolate({
      inputRange: [0, 0.4, 0.6, 1],
      outputRange: [0, deltaX, deltaX, 0],
    });
    
    const translateY = swapAnimation.interpolate({
      inputRange: [0, 0.4, 0.6, 1],
      outputRange: [0, deltaY, deltaY, 0],
    });
    
    const scale = swapAnimation.interpolate({
      inputRange: [0, 0.2, 0.8, 1],
      outputRange: [1, 1.2, 1.2, 1],
    });
    
    const rotate = swapAnimation.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: ['0deg', `${gridPos % 2 === 0 ? 180 : -180}deg`, '0deg'],
    });
    
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
      zIndex: 100,
    });
  }
  
  if (isStack && stackPosition) {
    const currentPos = getCoordinatesForPosition(gridPos);
    const targetPos = getCoordinatesForPosition(stackPosition);
    
    containerStyle.push({
      position: 'absolute',
      left: targetPos.x,
      top: targetPos.y,
      zIndex: 200 + id,
      transform: [
        { scale: 1 + (id * 0.01) },
        { translateY: id * -0.5 },
      ]
    });
  }
  
  return (
    <Animated.View style={containerStyle}>
      <Pressable
        style={styles.cardContainer}
        onPress={() => !isFlipped && !isMatched && onPress(id)}
        disabled={isFlipped || isMatched || isStack}
      >
        <Animated.View style={[cardStyle, frontAnimatedStyle, styles.cardFace]}>
          <Image source={iceCreamImages[value - 1]} style={styles.cardBackImage} resizeMode="cover" />
        </Animated.View>
        
        <Animated.View style={[styles.card, styles.cardBack, backAnimatedStyle, styles.cardFace]}>
          <Image source={cardBackImage} style={styles.cardBackImage} resizeMode="cover" />
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
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  cardBack: {
    backgroundColor: '#5c6bc0',
  },
  matchedCard: {
  },
  cardText: {
    fontSize: Math.max(CARD_WIDTH * 0.45, 14),
    fontWeight: 'bold',
    color: '#333',
  },
  cardBackImage: {
    width: '100%',
    height: '100%',
    borderRadius: 6,
  },
});

export default Card; 