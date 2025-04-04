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
      <View style={styles.topRow}>
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
      </View>
      
      <View style={styles.bottomRow}>
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
        
        <View style={styles.rewardStat}>
          <Text style={styles.statLabel}>Recompensă:</Text>
          <Text style={styles.statValue}>
            {difficulty === 'easy' ? '2' : 
             difficulty === 'advance' ? '5' : '15'} 🪙/pereche
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
    width: width * 0.95, // Ocupă mai multă lățime în orientarea portrait
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
    flex: 1.5, // Puțin mai mare pentru textul mai lung
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