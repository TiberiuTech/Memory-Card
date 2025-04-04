import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Modal, SafeAreaView, Dimensions } from 'react-native';
import GameBoard from '../components/GameBoard';
import GameStats from '../components/GameStats';
import { useGame } from '../context/GameContext';

const { width } = Dimensions.get('window');

const GameScreen = ({ navigation }) => {
  const { 
    difficulty, 
    level, 
    updateLevel, 
    lives,
    resetGame 
  } = useGame();
  
  const [isPaused, setIsPaused] = useState(false);
  
  // Afișează modal pentru pauză
  const handlePause = () => {
    setIsPaused(true);
  };
  
  // Continuă jocul
  const handleResume = () => {
    setIsPaused(false);
  };
  
  // Mergi înapoi la meniu
  const handleBackToMenu = () => {
    setIsPaused(false);
    navigation.goBack();
  };
  
  // Resetează nivelul curent
  const handleRestart = () => {
    setIsPaused(false);
    resetGame();
  };
  
  // Verifică dacă jocul s-a terminat (din cauza vieților)
  const isGameOver = difficulty === 'hard' && lives <= 0;
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <GameStats />
        </View>
        
        <View style={styles.pauseButtonContainer}>
          <TouchableOpacity
            style={styles.pauseButton}
            onPress={handlePause}
          >
            <Text style={styles.buttonText}>⏸️ Pauză</Text>
          </TouchableOpacity>
        </View>
        
        {!isGameOver ? (
          <GameBoard />
        ) : (
          <View style={styles.gameOverContainer}>
            <Text style={styles.gameOverText}>Joc Terminat!</Text>
            <TouchableOpacity
              style={[styles.button, styles.restartButton]}
              onPress={handleRestart}
            >
              <Text style={styles.buttonText}>Restart</Text>
            </TouchableOpacity>
          </View>
        )}
        
        {/* Modal pentru pauză */}
        <Modal
          visible={isPaused}
          transparent={true}
          animationType="fade"
          onRequestClose={handleResume}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Joc în pauză</Text>
              
              <TouchableOpacity
                style={[styles.button, styles.modalButton]}
                onPress={handleResume}
              >
                <Text style={styles.buttonText}>Continuă</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.button, styles.modalButton]}
                onPress={handleRestart}
              >
                <Text style={styles.buttonText}>Restart</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.button, styles.modalButton, styles.backButton]}
                onPress={handleBackToMenu}
              >
                <Text style={styles.buttonText}>Înapoi la Meniu</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    padding: 5, // Mai puțin padding în modul portrait
  },
  header: {
    alignItems: 'center',
    marginBottom: 5,
  },
  pauseButtonContainer: {
    alignItems: 'flex-end',
    marginBottom: 10,
    marginRight: 10,
  },
  pauseButton: {
    backgroundColor: '#5c6bc0',
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  button: {
    backgroundColor: '#5c6bc0',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
    marginHorizontal: 5,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  gameOverContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameOverText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#f44336',
    marginBottom: 20,
  },
  restartButton: {
    backgroundColor: '#4caf50',
    paddingHorizontal: 30,
    paddingVertical: 12,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 5,
    width: '80%',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  modalButton: {
    marginVertical: 8,
    width: '100%',
    alignItems: 'center',
  },
  backButton: {
    backgroundColor: '#f44336',
  },
});

export default GameScreen; 