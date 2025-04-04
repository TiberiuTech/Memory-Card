import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Image, 
  Alert,
  SafeAreaView,
  Modal
} from 'react-native';
import { useGame } from '../context/GameContext';

// Datele pentru cardurile disponibile în magazin
const SHOP_CARDS = [
  { id: 1, name: 'Carte Standard', price: 50, image: '🃏', description: 'Un set de cărți standard pentru joc', level: 1 },
  { id: 2, name: 'Carte Fructe', price: 100, image: '🍎', description: 'Un set de cărți cu tematică de fructe', level: 2 },
  { id: 3, name: 'Carte Animale', price: 150, image: '🐱', description: 'Un set de cărți cu tematică de animale', level: 3 },
  { id: 4, name: 'Carte Sport', price: 200, image: '⚽', description: 'Un set de cărți cu tematică sportivă', level: 4 },
  { id: 5, name: 'Carte Spațiu', price: 250, image: '🚀', description: 'Un set de cărți cu tematică spațială', level: 5 },
  { id: 6, name: 'Carte Fantezie', price: 300, image: '🧙‍♂️', description: 'Un set de cărți cu tematică fantasy', level: 6 },
  { id: 7, name: 'Carte Muzică', price: 350, image: '🎵', description: 'Un set de cărți cu tematică muzicală', level: 7 },
  { id: 8, name: 'Carte Tehnologie', price: 400, image: '💻', description: 'Un set de cărți cu tematică tehnologică', level: 8 },
  { id: 9, name: 'Carte Steluțe', price: 450, image: '⭐', description: 'Un set de cărți premium cu steluțe', level: 9 },
  { id: 10, name: 'Carte Aurită', price: 500, image: '👑', description: 'Setul de cărți de lux, aurite', level: 10 },
];

const ShopScreen = ({ navigation }) => {
  const { coins, level, spendCoins, unlockedCards } = useGame();
  const [selectedCard, setSelectedCard] = useState(null);
  const [showCardModal, setShowCardModal] = useState(false);
  
  // Filtrăm cardurile bazate pe nivelul utilizatorului
  const availableCards = SHOP_CARDS.filter(card => card.level <= level);
  
  // Verificăm dacă utilizatorul poate cumpăra cardul
  const canPurchaseCard = (card) => {
    return coins >= card.price && !unlockedCards.includes(card.id);
  };
  
  // Cumpără un card
  const handlePurchaseCard = (card) => {
    if (canPurchaseCard(card)) {
      const success = spendCoins(card.price);
      if (success) {
        unlockedCards(card.id);
        Alert.alert('Succes!', `Ai cumpărat ${card.name}!`);
      } else {
        Alert.alert('Eroare', 'A apărut o problemă la achiziționarea cardului.');
      }
    } else if (unlockedCards.includes(card.id)) {
      Alert.alert('Informație', 'Ai deblocat deja acest set de cărți.');
    } else {
      Alert.alert('Monede insuficiente', 'Nu ai destule monede pentru a cumpăra acest set de cărți.');
    }
  };
  
  // Selectează un card pentru a vedea detaliile
  const handleSelectCard = (card) => {
    setSelectedCard(card);
    setShowCardModal(true);
  };
  
  // Afișați un articol din lista de cărți
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
            {isUnlocked ? 'Deblocat' : `${item.price} 🪙`}
          </Text>
        </View>
        <Text style={styles.cardLevel}>Nivel {item.level}</Text>
      </TouchableOpacity>
    );
  };
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Magazin</Text>
          <Text style={styles.coinsText}>Monede: {coins} 🪙</Text>
        </View>
        
        <FlatList
          data={availableCards}
          renderItem={renderShopItem}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.shopList}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                Nu există cărți disponibile la nivelul tău actual.
                Continuă să joci pentru a debloca mai multe!
              </Text>
            </View>
          }
        />
        
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Înapoi</Text>
        </TouchableOpacity>
        
        {/* Modal pentru detaliile cardului */}
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