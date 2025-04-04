# Memory Card Game

Un joc de memorie cu cărți dezvoltat în React Native.

## Descriere

Acest joc de memorie cu cărți oferă trei niveluri de dificultate, recompense, și un magazin pentru a debloca noi seturi de cărți. Jocul este optimizat pentru dispozitive în modul landscape.

## Caracteristici

- Trei niveluri de dificultate: Ușor, Avansat și Greu
- Sistem de progresie cu 10 niveluri pentru fiecare dificultate
- Sistem de monede și recompense
- Magazin pentru deblocarea de noi seturi de cărți
- Animații de întoarcere și amestecare a cărților
- Sistem de salvare a progresului

## Tehnologii utilizate

- React Native
- Expo
- React Navigation
- AsyncStorage pentru persistența datelor

## Cum să rulezi proiectul

1. Asigură-te că ai Node.js instalat
2. Instalează Expo CLI: `npm install -g expo-cli`
3. Navighează în directorul proiectului
4. Instalează dependențele: `npm install`
5. Pornește aplicația: `npm start`
6. Scanează codul QR cu aplicația Expo Go (Android) sau Camera (iOS)

## Niveluri de dificultate

### Ușor
- Cărțile rămân în aceeași poziție
- 2 monede per pereche găsită
- Timpul de vizualizare variază de la 4 secunde (nivel 1) la 1.3 secunde (nivel 10)

### Avansat
- Cărțile se amestecă după un model specific pentru fiecare nivel
- 5 monede per pereche găsită
- Același timp de vizualizare ca la nivelul Ușor

### Greu
- Cărțile se amestecă după același model ca la nivelul Avansat
- 15 monede per pereche găsită
- Timp fix de 3.5 secunde per carte
- 3 vieți, pierzi jumătate de viață la fiecare potrivire greșită

## Magazin

În magazin poți cheltui monedele câștigate pentru a debloca noi seturi de cărți:

- Cărți disponibile în funcție de nivelul actual
- Prețurile variază de la 50 la 500 de monede
- Cărți cu tematică diferită (standard, fructe, animale, etc.) 