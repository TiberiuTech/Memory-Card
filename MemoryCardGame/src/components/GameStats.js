import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useGame } from '../context/GameContext';

const GameStats = () => {
  const { 
    level, 
    difficulty, 
    coins, 
    lives,
    timePerCard
  } = useGame();
  
  // Calculăm numărul de vieți afișate
  const renderLives = () => {
    if (difficulty !== 'hard') return null;
    
    const fullLives = Math.floor(lives);
    const hasHalfLife = lives % 1 !== 0;
    
    const livesArray = [];
    
    // Adăugăm vieți complete
    for (let i = 0; i < fullLives; i++) {
      livesArray.push('❤️');
    }
    
    // Adăugăm jumătate de viață dacă e cazul
    if (hasHalfLife) {
      livesArray.push('💔');
    }
    
    return livesArray.join(' ');
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Nivel:</Text>
          <Text style={styles.statValue}>{level}</Text>
        </View>
        
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Dificultate:</Text>
          <Text style={styles.statValue}>
            {difficulty === 'easy' ? 'Ușor' : 
              difficulty === 'advance' ? 'Avansat' : 'Greu'}
          </Text>
        </View>
        
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Monede:</Text>
          <Text style={styles.statValue}>{coins} 🪙</Text>
        </View>
        
        {difficulty === 'hard' && (
          <View style={styles.stat}>
            <Text style={styles.statLabel}>Vieți:</Text>
            <Text style={styles.statValue}>{renderLives()}</Text>
          </View>
        )}
        
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Timp/Carte:</Text>
          <Text style={styles.statValue}>{timePerCard}s</Text>
        </View>
      </View>
      
      <View style={styles.rewardsInfo}>
        <Text style={styles.rewardsText}>
          Recompensă per pereche: {
            difficulty === 'easy' ? '2 monede' : 
            difficulty === 'advance' ? '5 monede' : 
            '15 monede'
          }
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
    padding: 10,
    borderRadius: 10,
    margin: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  stat: {
    margin: 5,
    minWidth: 70,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: 'bold',
  },
  statValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
  rewardsInfo: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  rewardsText: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
});

export default GameStats; 