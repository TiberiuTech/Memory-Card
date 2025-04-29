import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Alert,
  SafeAreaView,
  Modal
} from 'react-native';
import { useGame } from '../context/GameContext';

const SHOP_CARDS = [
  { id: 1, name: 'standard card', price: 50, image: '🃏', description: 'set of standard cards'},
  { id: 2, name: 'fruits card', price: 100, image: '🍎', description: 'set of fruits cards'},
  { id: 3, name: 'animals card', price: 150, image: '🐱', description: 'set of animals cards'},
  { id: 4, name: 'sport card', price: 200, image: '⚽', description: 'set of sport cards'},
  { id: 5, name: 'space card', price: 250, image: '🚀', description: 'set of space cards'},
  { id: 6, name: 'fantasy card', price: 300, image: '🧙‍♂️', description: 'set of fantasy cards'},
  { id: 7, name: 'music card', price: 350, image: '🎵', description: 'set of music cards'},
  { id: 8, name: 'technology card', price: 400, image: '💻', description: 'set of technology cards'},
  { id: 9, name: 'stars card', price: 450, image: '⭐', description: 'set of stars cards'},
  { id: 10, name: 'gold card', price: 500, image: '👑', description: 'set of gold cards'},
];

const ShopScreen = ({ navigation }) => {
  const { coins, level, spendCoins, unlockedCards } = useGame();
  const [selectedCard, setSelectedCard] = useState(null);
  const [showCardModal, setShowCardModal] = useState(false);
  
  const availableCards = SHOP_CARDS;
  
  const canPurchaseCard = (card) => {
    return coins >= card.price && !unlockedCards.includes(card.id);
  };
  
  const handlePurchaseCard = (card) => {
    if (canPurchaseCard(card)) {
      const success = spendCoins(card.price);
      if (success) {
        unlockedCards(card.id);
        Alert.alert('Success!', `You have purchased ${card.name}!`);
      } else {
        Alert.alert('Error', 'An error occurred while purchasing the card.');
      }
    } else if (unlockedCards.includes(card.id)) {
      Alert.alert('Information', 'You have already unlocked this set of cards.');
    } else {
      Alert.alert('Insufficient coins', 'You do not have enough coins to purchase this set of cards.');
    }
  };
  
  const handleSelectCard = (card) => {
    setSelectedCard(card);
    setShowCardModal(true);
  };
  
  const renderShopItem = ({ item }) => {
    const isUnlocked = unlockedCards.includes(item.id);
    
    return (
      <TouchableOpacity
        style={[
          styles.shopItem,
          isUnlocked && styles.unlockedItem
        ]}
        onPress={() => handleSelectCard(item)}
      >
        <Text style={styles.cardImage}>{item.image}</Text>
        <View style={styles.cardInfo}>
          <Text style={styles.cardName}>{item.name}</Text>
          <Text style={styles.cardPrice}>
            {isUnlocked ? 'Unlocked' : `${item.price} 🪙`}
          </Text>
        </View>
        <Text style={styles.cardLevel}>Level {item.level}</Text>
      </TouchableOpacity>
    );
  };
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Shop</Text>
          <Text style={styles.coinsText}>Coins: {coins} 🪙</Text>
        </View>
        
        <FlatList
          data={availableCards}
          renderItem={renderShopItem}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.shopList}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                There are no cards available at your current level.
                Continue playing to unlock more!
              </Text>
            </View>
          }
        />
        
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        
        <Modal
          visible={showCardModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowCardModal(false)}
        >
          <View style={styles.modalContainer}>
            {selectedCard && (
              <View style={styles.modalContent}>
                <Text style={styles.modalCardImage}>{selectedCard.image}</Text>
                <Text style={styles.modalCardName}>{selectedCard.name}</Text>
                <Text style={styles.modalCardDescription}>{selectedCard.description}</Text>
                <Text style={styles.modalCardPrice}>Preț: {selectedCard.price} 🪙</Text>
                <Text style={styles.modalCardLevel}>Disponibil de la nivelul {selectedCard.level}</Text>
                
                {!unlockedCards.includes(selectedCard.id) && (
                  <TouchableOpacity
                    style={[
                      styles.buyButton,
                      !canPurchaseCard(selectedCard) && styles.disabledButton
                    ]}
                    onPress={() => {
                      handlePurchaseCard(selectedCard);
                      setShowCardModal(false);
                    }}
                    disabled={!canPurchaseCard(selectedCard)}
                  >
                    <Text style={styles.buyButtonText}>Cumpără</Text>
                  </TouchableOpacity>
                )}
                
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setShowCardModal(false)}
                >
                  <Text style={styles.closeButtonText}>Închide</Text>
                </TouchableOpacity>
              </View>
            )}
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
    padding: 15,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  coinsText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f9a825',
  },
  shopList: {
    paddingBottom: 20,
  },
  shopItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  unlockedItem: {
    backgroundColor: '#e3f2fd',
    borderColor: '#5c6bc0',
    borderWidth: 1,
  },
  cardImage: {
    fontSize: 30,
    marginRight: 15,
  },
  cardInfo: {
    flex: 1,
  },
  cardName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  cardPrice: {
    fontSize: 14,
    color: '#f9a825',
    marginTop: 5,
  },
  cardLevel: {
    fontSize: 12,
    color: '#666',
  },
  backButton: {
    backgroundColor: '#f44336',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    width: '80%',
  },
  modalCardImage: {
    fontSize: 50,
    marginBottom: 15,
  },
  modalCardName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  modalCardDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 15,
  },
  modalCardPrice: {
    fontSize: 16,
    color: '#f9a825',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  modalCardLevel: {
    fontSize: 14,
    color: '#5c6bc0',
    marginBottom: 20,
  },
  buyButton: {
    backgroundColor: '#4caf50',
    padding: 12,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  buyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  closeButton: {
    backgroundColor: '#5c6bc0',
    padding: 12,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ShopScreen; 