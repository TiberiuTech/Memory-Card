import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  SafeAreaView,
  Modal
} from 'react-native';
import { useGame } from '../context/GameContext';

const HomeScreen = ({ navigation }) => {
  const { 
    difficulty, 
    updateDifficulty, 
    coins 
  } = useGame();
  
  const [showDifficultyModal, setShowDifficultyModal] = useState(false);
  const [showTutorialModal, setShowTutorialModal] = useState(false);
  
  // Începe jocul cu dificultatea selectată
  const handleStartGame = () => {
    navigation.navigate('Game');
  };
  
  // Deschide magazinul
  const handleOpenShop = () => {
    navigation.navigate('Shop');
  };
  
  // Selectează dificultatea
  const handleSelectDifficulty = (selectedDifficulty) => {
    updateDifficulty(selectedDifficulty);
    setShowDifficultyModal(false);
  };
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Joc de Memorie</Text>
        
        <View style={styles.statsContainer}>
          <Text style={styles.statsText}>Monede: {coins} 🪙</Text>
          <Text style={styles.statsText}>
            Dificultate: {
              difficulty === 'easy' ? 'Ușor' : 
              difficulty === 'advance' ? 'Avansat' : 'Greu'
            }
          </Text>
        </View>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.button}
            onPress={handleStartGame}
          >
            <Text style={styles.buttonText}>Start Joc</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.button}
            onPress={() => setShowDifficultyModal(true)}
          >
            <Text style={styles.buttonText}>Dificultate</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.button}
            onPress={handleOpenShop}
          >
            <Text style={styles.buttonText}>Magazin</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.button}
            onPress={() => setShowTutorialModal(true)}
          >
            <Text style={styles.buttonText}>Tutorial</Text>
          </TouchableOpacity>
        </View>
        
        {/* Modal pentru selectarea dificultății */}
        <Modal
          visible={showDifficultyModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowDifficultyModal(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Selectează Dificultatea</Text>
              
              <TouchableOpacity 
                style={[styles.button, styles.difficultyButton, difficulty === 'easy' && styles.selectedButton]}
                onPress={() => handleSelectDifficulty('easy')}
              >
                <Text style={styles.buttonText}>Ușor (2 monede/pereche)</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.button, styles.difficultyButton, difficulty === 'advance' && styles.selectedButton]}
                onPress={() => handleSelectDifficulty('advance')}
              >
                <Text style={styles.buttonText}>Avansat (5 monede/pereche)</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.button, styles.difficultyButton, difficulty === 'hard' && styles.selectedButton]}
                onPress={() => handleSelectDifficulty('hard')}
              >
                <Text style={styles.buttonText}>Greu (15 monede/pereche)</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.button, styles.cancelButton]}
                onPress={() => setShowDifficultyModal(false)}
              >
                <Text style={styles.buttonText}>Înapoi</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        
        {/* Modal pentru tutorial */}
        <Modal
          visible={showTutorialModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowTutorialModal(false)}
        >
          <View style={styles.modalContainer}>
            <View style={[styles.modalContent, styles.tutorialModal]}>
              <Text style={styles.modalTitle}>Tutorial</Text>
              
              <View style={styles.tutorialContent}>
                <Text style={styles.tutorialHeading}>Cum să joci:</Text>
                <Text style={styles.tutorialText}>
                  - Întoarce cărțile pentru a găsi perechi{'\n'}
                  - Câștigi monede pentru fiecare pereche găsită{'\n'}
                  - Folosește monedele pentru a cumpăra cărți noi{'\n'}
                </Text>
                
                <Text style={styles.tutorialHeading}>Niveluri de dificultate:</Text>
                <Text style={styles.tutorialText}>
                  <Text style={styles.boldText}>Ușor:</Text> Cărțile rămân în aceeași poziție{'\n'}
                  <Text style={styles.boldText}>Avansat:</Text> Cărțile se amestecă{'\n'}
                  <Text style={styles.boldText}>Greu:</Text> Cărțile se amestecă și ai 3 vieți{'\n'}
                </Text>
                
                <Text style={styles.tutorialHeading}>Recompense:</Text>
                <Text style={styles.tutorialText}>
                  <Text style={styles.boldText}>Ușor:</Text> 2 monede per pereche{'\n'}
                  <Text style={styles.boldText}>Avansat:</Text> 5 monede per pereche{'\n'}
                  <Text style={styles.boldText}>Greu:</Text> 15 monede per pereche{'\n'}
                </Text>
              </View>
              
              <TouchableOpacity 
                style={[styles.button, styles.closeButton]}
                onPress={() => setShowTutorialModal(false)}
              >
                <Text style={styles.buttonText}>Închide</Text>
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
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#5c6bc0',
    marginBottom: 30,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statsText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  buttonContainer: {
    width: '100%',
  },
  button: {
    backgroundColor: '#5c6bc0',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
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
  tutorialModal: {
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  difficultyButton: {
    marginVertical: 8,
    width: '100%',
  },
  selectedButton: {
    backgroundColor: '#3f51b5',
  },
  cancelButton: {
    backgroundColor: '#f44336',
    marginTop: 10,
  },
  closeButton: {
    backgroundColor: '#4caf50',
    marginTop: 10,
  },
  tutorialContent: {
    width: '100%',
    padding: 10,
  },
  tutorialHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#5c6bc0',
    marginTop: 10,
    marginBottom: 5,
  },
  tutorialText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  boldText: {
    fontWeight: 'bold',
  },
});

export default HomeScreen; 