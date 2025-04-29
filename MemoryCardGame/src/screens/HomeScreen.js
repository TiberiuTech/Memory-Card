import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  SafeAreaView,
  Modal,
  TouchableHighlight,
  ImageBackground,
  Animated,
  Dimensions
} from 'react-native';
import { useGame } from '../context/GameContext';

const { width, height } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const { 
    difficulty, 
    updateDifficulty, 
    coins 
  } = useGame();
  
  const [showDifficultyModal, setShowDifficultyModal] = useState(false);
  const [showTutorialModal, setShowTutorialModal] = useState(false);
  
  const fadeAnim = useState(new Animated.Value(0))[0];
  const scaleAnim = useState(new Animated.Value(0.8))[0];
  
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, { 
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      })
    ]).start();
  }, []);
  
  const handleStartGame = () => {
    setShowDifficultyModal(true);
  };
  
  const handleOpenShop = () => {
    navigation.navigate('Shop');
  };
  
  const handleSelectDifficulty = (selectedDifficulty) => {
    updateDifficulty(selectedDifficulty);
    setShowDifficultyModal(false);
    navigation.navigate('Game');
  };
  
  return (
    <ImageBackground 
      source={require('../assets/images/background.png')}
      style={styles.background}
      imageStyle={{ resizeMode: 'cover' }}
      resizeMethod="resize"
      blurRadius={1}
    >
      <SafeAreaView style={styles.safeArea}>
        <Animated.View
          style={[
            styles.container, 
            { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }
          ]}
        >
          <View style={styles.titleContainer}>
            <Text style={styles.title}>MEMORY</Text>
            <Text style={styles.subtitle}>Test your memory!</Text>
          </View>
          
          <View style={styles.statsContainerWrapper}>
            <View style={styles.statsContainer}>
              <View style={styles.coinContainer}>
                <Text style={styles.statsLabel}>COINS</Text>
                <Text style={styles.coinsText}>💰 {coins}</Text> 
              </View>
              <View style={styles.difficultyContainer}>
                <Text style={styles.statsLabel}>GAME MODE</Text>
                <Text style={styles.difficultyText}>
                  {difficulty === 'easy' ? 'Easy' : 
                   difficulty === 'advance' ? 'Advance' : 'Expert'}
                </Text>
              </View>
            </View>
          </View>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.mainButton, styles.playButton]}
              onPress={handleStartGame}
              activeOpacity={0.8}
            >
              <Text style={styles.mainButtonText}>PLAY</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.mainButton, styles.shopButton]}
              onPress={handleOpenShop}
              activeOpacity={0.8}
            >
              <Text style={styles.mainButtonText}>SHOP</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.mainButton, styles.tutorialButton]}
              onPress={() => setShowTutorialModal(true)}
              activeOpacity={0.8}
            >
              <Text style={styles.mainButtonText}>INSTRUCTIONS</Text>
            </TouchableOpacity>
          </View>
          
          <Modal
            visible={showDifficultyModal}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setShowDifficultyModal(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.difficultyModalContent}> 
                <Text style={styles.modalTitle}>CHOOSE THE LEVEL</Text>
                
                <TouchableOpacity 
                  style={[styles.difficultyButton, styles.easyDifficultyButton]}
                  onPress={() => handleSelectDifficulty('easy')}
                  activeOpacity={0.8}
                >
                  <Text style={styles.difficultyButtonText}>Easy</Text>
                  <Text style={styles.difficultyInfoText}>2 💰 / Pair</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.difficultyButton, styles.mediumDifficultyButton]}
                  onPress={() => handleSelectDifficulty('advance')}
                  activeOpacity={0.8}
                >
                  <Text style={styles.difficultyButtonText}>Advance</Text>
                   <Text style={styles.difficultyInfoText}>5 💰 / Pair</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.difficultyButton, styles.hardDifficultyButton]}
                  onPress={() => handleSelectDifficulty('hard')}
                  activeOpacity={0.8}
                >
                  <Text style={styles.difficultyButtonText}>Hard</Text>
                   <Text style={styles.difficultyInfoText}>15 💰 / Pair</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.closeDifficultyButton}
                  onPress={() => setShowDifficultyModal(false)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.closeDifficultyButtonText}>X</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
          
          <Modal
            visible={showTutorialModal}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setShowTutorialModal(false)}
          >
            <View style={styles.modalContainer}>
              <View style={[styles.modalContent, styles.tutorialModal]}>
                <Text style={[styles.modalTitle, styles.tutorialTitle]}>INSTRUCTIONS</Text>
                
                <View style={styles.tutorialContent}>
                  <Text style={styles.tutorialHeading}>🎯 How to play:</Text>
                  <Text style={styles.tutorialText}>
                    › Find the pairs of identical cards!{'\n'}
                    › Earn Coins for each pair.{'\n'}
                    › Unlock new card sets from the SHOP.{'\n'}
                  </Text>
                  
                  <Text style={styles.tutorialHeading}>📊 Difficulty Levels:</Text>
                  <Text style={styles.tutorialText}>
                    <Text style={[styles.boldText, {color: '#2ecc71'}]}>Easy:</Text> The cards remain fixed.{'\n'}
                    <Text style={[styles.boldText, {color: '#e67e22'}]}>Advance:</Text> The cards are shuffled!{'\n'}
                    <Text style={[styles.boldText, {color: '#e74c3c'}]}>Expert:</Text> Shuffle + Limited Lives!{'\n'}
                  </Text>
                  
                  <Text style={styles.tutorialHeading}>💰 Earn Coins:</Text>
                  <Text style={styles.tutorialText}>
                    <Text style={[styles.boldText, {color: '#2ecc71'}]}>Easy:</Text> 2 💰 / Pair{'\n'}
                    <Text style={[styles.boldText, {color: '#e67e22'}]}>Advance:</Text> 5 💰 / Pair{'\n'}
                    <Text style={[styles.boldText, {color: '#e74c3c'}]}>Expert:</Text> 15 💰 / Pair{'\n'}
                  </Text>
                </View>
                
                <TouchableOpacity
                  style={styles.closeModalButton}
                  onPress={() => setShowTutorialModal(false)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.closeModalButtonText}>CLOSE</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </Animated.View>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  container: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
    backgroundColor: 'transparent',
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 55,
    fontWeight: 'bold',
    fontFamily: 'serif',
    color: '#f1c40f',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 18,
    color: '#ecf0f1',
    marginTop: 5,
    fontStyle: 'italic',
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  statsContainerWrapper: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '95%',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  coinContainer: {
    alignItems: 'center',
  },
  difficultyContainer: {
    alignItems: 'center',
  },
  statsLabel: {
    fontSize: 11,
    color: '#bdc3c7',
    fontWeight: '600',
    marginBottom: 3,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  coinsText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#f1c40f',
  },
  difficultyText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ecf0f1',
    textTransform: 'uppercase',
  },
  buttonContainer: {
    width: '85%',
    alignItems: 'center',
  },
  mainButton: {
    paddingVertical: 14,
    paddingHorizontal: 25,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 8,
  },
  playButton: {
     backgroundColor: '#2ecc71',
     borderColor: '#27ae60',
  },
  shopButton: {
     backgroundColor: '#3498db',
     borderColor: '#2980b9',
  },
  tutorialButton: {
     backgroundColor: '#9b59b6',
     borderColor: '#8e44ad',
  },
  mainButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
  },
  difficultyModalContent: {
    backgroundColor: 'rgba(20, 20, 30, 0.98)',
    borderRadius: 15,
    paddingVertical: 30,
    paddingHorizontal: 25,
    alignItems: 'center',
    width: '85%',
    borderColor: '#f1c40f',
    borderWidth: 2,
    shadowColor: '#f1c40f',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 30,
    position: 'relative',
  },
  modalTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#f1c40f',
    textAlign: 'center',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  difficultyButton: {
    paddingVertical: 10,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4,
  },
  easyDifficultyButton: {
     backgroundColor: '#2ecc71',
     borderColor: '#27ae60',
  },
  mediumDifficultyButton: {
     backgroundColor: '#e67e22',
     borderColor: '#d35400',
  },
  hardDifficultyButton: {
     backgroundColor: '#e74c3c',
     borderColor: '#c0392b',
  },
  difficultyButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
   difficultyInfoText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    marginTop: 3,
  },
  closeDifficultyButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#c0392b',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  closeDifficultyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContent: {
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    elevation: 10,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
  tutorialModal: {
    maxHeight: '85%',
  },
   tutorialTitle: {
    color: '#34495e',
    fontSize: 24,
  },
  tutorialContent: {
    width: '100%',
    padding: 10,
    backgroundColor: 'transparent',
    borderRadius: 0,
    marginBottom: 15,
  },
  tutorialHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#34495e',
    marginTop: 12,
    marginBottom: 6,
  },
  tutorialText: {
    fontSize: 15,
    color: '#2c3e50',
    lineHeight: 22,
  },
  boldText: {
    fontWeight: '700', 
  },
  closeModalButton: {
    backgroundColor: '#3498db',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 10,
    elevation: 3,
  },
  closeModalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
});

export default HomeScreen; 