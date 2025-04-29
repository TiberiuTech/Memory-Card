import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { useGame } from '../context/GameContext';

const { width } = Dimensions.get('window');

const GameStats = () => {
  const { 
    level, 
    difficulty, 
    coins, 
    lives,
    timePerCard
  } = useGame();
  
  const renderLives = () => {
    if (difficulty !== 'hard') return null;
    
    const fullLives = Math.floor(lives);
    const hasHalfLife = lives % 1 !== 0;
    
    const livesArray = [];
    
    for (let i = 0; i < fullLives; i++) {
      livesArray.push('❤️');
    }
    
    if (hasHalfLife) {
      livesArray.push('💔');
    }
    
    return livesArray.join(' ');
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Level:</Text>
          <Text style={styles.statValue}>{level}</Text>
        </View>
        
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Difficulty:</Text>
          <Text style={styles.statValue}>
            {difficulty === 'easy' ? 'Easy' : 
              difficulty === 'advance' ? 'Advance' : 'Hard'}
          </Text>
        </View>
        
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Coins:</Text>
          <Text style={styles.statValue}>{coins} 🪙</Text>
        </View>
      </View>
      
      <View style={styles.bottomRow}>
        {difficulty === 'hard' && (
          <View style={styles.stat}>
            <Text style={styles.statLabel}>Lives:</Text>
            <Text style={styles.statValue}>{renderLives()}</Text>
          </View>
        )}
        
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Time/Card:</Text>
          <Text style={styles.statValue}>{timePerCard}s</Text>
        </View>
        
        <View style={styles.rewardStat}>
          <Text style={styles.statLabel}>Reward:</Text>
          <Text style={styles.statValue}>
            {difficulty === 'easy' ? '2' : 
             difficulty === 'advance' ? '5' : '15'} 🪙/pair
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
    padding: 8,
    borderRadius: 10,
    marginVertical: 5,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    width: width * 0.95,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  stat: {
    margin: 3,
    flex: 1,
  },
  rewardStat: {
    margin: 3,
    flex: 1.5,
  },
  statLabel: {
    fontSize: 11,
    color: '#666',
    fontWeight: 'bold',
  },
  statValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: 'bold',
  },
});

export default GameStats; 