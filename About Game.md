Card Memory Game

# Jocul va avea, level per utilzator poti debloca carduri numai la un anumit lv, bani , shp unde poti gasi carduri desenate,va exista un shop unde vor fi carduri si se pot cumpara,vor exista monede (adica bani)


pentru prima implementare cartile vor fi colorate adica sa putem juca, nu pe spate pe fata

MATRICEA

(1 2 3 4)
(5 6 7 8)
(9 10 11 12)
(13 14 15 16)

#Easy -> monedele adica banii per pereche intoarsa la lv easy este de 2 monede per pereche descoperita

(lv 1-lv 10) 

lv 1- 4 secunde  

lv 2- 3.8 secunde  

lv 3- 3.5 secunde

lv 4- 3.3 secunde

lv 5- 3.0 secunde

lv 6- 2.8 secunde

lv 7- 2.5 secunde

lv 8- 2.3 secunde

lv 9- 2.0 secunde

lv 10- 1.3 secunde

#Advance -> monedele adica banii per pereche intoarsa la lv easy este de 5 monede per pereche descoperita

- cardurile se vor intoarce cu spatele si incep sa se amestece intre ele

(1 2 3 4)
(5 6 7 8)
(9 10 11 12)
(13 14 15 16)

cardurile se vor amesteca in ordinea

1-12->12-1
8-14->14-8
15-6->6-15
5-3->3-5
4-10->10-4
13-7->7-13
9-16->16-9
11-2->2-11

lv 1- 4 secunde

1-12->12-1
8-14->14-8
15-6->6-15
5-3->3-5
4-10->10-4
13-7->7-13
9-16->16-9
11-2->2-11  

lv 2- 3.8 secunde

3-9 → 9-3
7-15 → 15-7
5-11 → 11-5
2-14 → 14-2
6-12 → 12-6
4-16 → 16-4
1-8 → 8-1
10-13 → 13-10  

lv 3- 3.5 secunde

6-13 → 13-6
9-4 → 4-9
7-2 → 2-7
11-15 → 15-11
3-16 → 16-3
12-5 → 5-12
8-10 → 10-8
1-14 → 14-1

lv 4- 3.3 secunde

5-14 → 14-5
8-12 → 12-8
3-10 → 10-3
7-16 → 16-7
1-6 → 6-1
9-11 → 11-9
2-15 → 15-2
4-13 → 13-4

lv 5- 3.0 secunde

10-2 → 2-10
6-14 → 14-6
9-1 → 1-9
12-4 → 4-12
15-3 → 3-15
8-5 → 5-8
13-11 → 11-13
7-16 → 16-7

lv 6- 2.8 secunde

7-12 → 12-7
3-5 → 5-3
9-14 → 14-9
10-1 → 1-10
6-16 → 16-6
2-8 → 8-2
4-13 → 13-4
11-15 → 15-11

lv 7- 2.5 secunde

1-15 → 15-1
4-7 → 7-4
12-9 → 9-12
2-6 → 6-2
10-14 → 14-10
8-3 → 3-8
16-5 → 5-16
13-11 → 11-13

lv 8- 2.3 secunde

14-6 → 6-14
3-9 → 9-3
8-16 → 16-8
2-12 → 12-2
1-11 → 11-1
10-4 → 4-10
7-15 → 15-7
5-13 → 13-5

lv 9- 2.0 secunde

11-8 → 8-11
5-3 → 3-5
2-14 → 14-2
6-10 → 10-6
7-13 → 13-7
12-16 → 16-12
1-9 → 9-1
4-15 → 15-4

lv 10- 1.3 secunde

11-2->2-11 
9-16->16-9
13-7->7-13
4-10->10-4
5-3->3-5
15-6->6-15
8-14->14-8
1-12->12-1


#Hard -> monedele adica banii per pereche intoarsa la lv easy este de 15 monede per pereche descoperita 


cartile se vor intoarce intoarce cu fata la incepul nivelul 3.5

dupa

vreau ca cartile sa se suprapuna cu o animatie pozitie 1-2-3 si tot asa pana la pozitia 16 la pozitia 16 sa vina tot pachetul de carti pe pozia 1 si sa lase o carte cu fata trece tot packetul pe poztia 2 cand a ajuns pe pozitia 2 lasa o carte cu spatele se va intoasrce cu fata ( cartile nu au voie sa ie indentice in acest proces)pachetul trece de poztia 2 si ajunge pe 3 si tot asa, dupa aceeia cartile se vor amesteca cum se amesteca la nivelul advance


1-2-3-4-5-6-7-8-9-10-11-12-13-14-15-16

si va lasa o carte jos

amestecate va fi in felul asta dar nu se vor amesteca cum era in levul anterior adica 2, asta va fi ordina lor puse

lv 1

1-12->12-1
8-14->14-8
15-6->6-15
5-3->3-5
4-10->10-4
13-7->7-13
9-16->16-9
11-2->2-11  

lv 2

3-9 → 9-3
7-15 → 15-7
5-11 → 11-5
2-14 → 14-2
6-12 → 12-6
4-16 → 16-4
1-8 → 8-1
10-13 → 13-10  

lv 3

6-13 → 13-6
9-4 → 4-9
7-2 → 2-7
11-15 → 15-11
3-16 → 16-3
12-5 → 5-12
8-10 → 10-8
1-14 → 14-1

lv 4

5-14 → 14-5
8-12 → 12-8
3-10 → 10-3
7-16 → 16-7
1-6 → 6-1
9-11 → 11-9
2-15 → 15-2
4-13 → 13-4

lv 5

10-2 → 2-10
6-14 → 14-6
9-1 → 1-9
12-4 → 4-12
15-3 → 3-15
8-5 → 5-8
13-11 → 11-13
7-16 → 16-7

lv 6

7-12 → 12-7
3-5 → 5-3
9-14 → 14-9
10-1 → 1-10
6-16 → 16-6
2-8 → 8-2
4-13 → 13-4
11-15 → 15-11

lv 7

1-15 → 15-1
4-7 → 7-4
12-9 → 9-12
2-6 → 6-2
10-14 → 14-10
8-3 → 3-8
16-5 → 5-16
13-11 → 11-13

lv 8

14-6 → 6-14
3-9 → 9-3
8-16 → 16-8
2-12 → 12-2
1-11 → 11-1
10-4 → 4-10
7-15 → 15-7
5-13 → 13-5

lv 9

11-8 → 8-11
5-3 → 3-5
2-14 → 14-2
6-10 → 10-6
7-13 → 13-7
12-16 → 16-12
1-9 → 9-1
4-15 → 15-4

lv 10

11-2->2-11 
9-16->16-9
13-7->7-13
4-10->10-4
5-3->3-5
15-6->6-15
8-14->14-8
1-12->12-1


DESIGN PROFIL JOC CARD CU CREIER


TUTORIAL LA FIECARE RUBRICA EASY ADVANCE HARD



SHOP


