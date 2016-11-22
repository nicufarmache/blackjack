import {Component} from '@angular/core';

const cardValueMap = {
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  7: 7,
  8: 8,
  9: 9,
  10: 10,
  ace: 11,
  jack: 10,
  queen: 10,
  king: 10
};
const cardNumbers = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'ace', 'jack', 'queen', 'king'];
const cardSuits = ['hearts', 'spades', 'clubs', 'diamonds'];

@Component({
  selector: 'fountain-app',
  template: require('./game.html')
})

export class GameComponent {
  constructor() {
    this.newGame();
  }

  newGame() {
    this.showBoard = true;
    this.showHoleCard = true;
    this.showButtons = true;
    this.playerStands = false;
    this.showNewGame = false;
    this.message = "";
    this.dealerCards = [this.pickRandomCard()];
    this.playerCards = [this.pickRandomCard(), this.pickRandomCard()];
    this.calculate();
  }

  dealCard() {
    this.playerCards.push(this.pickRandomCard());
    this.calculate();
  }

  dealDealerCard() {
    this.showHoleCard = false;
    this.dealerCards.push(this.pickRandomCard());
    this.calculate();
  }

  stand() {
    this.playerStands = true;
    this.showButtons = false;
    this.calculate();
  }

  calculate() {
    this.dealerScore = this.getPoints(this.dealerCards);
    this.playerScore = this.getPoints(this.playerCards);

    const playerBlackjack = (this.playerCards.length === 2) && (this.playerScore === 21);
    const dealerBlackjack = (this.dealerCards.length === 2) && (this.dealerScore === 21);
    const playerBust = (this.playerScore > 21);
    const dealerBust = (this.dealerScore > 21);
    const dealerOver17 = (this.dealerScore >= 17);

    // players turn
    if (this.playerScore === 21 && !this.playerStands) {
      return this.stand();
    }
    if (playerBust) {
      return this.playerLoses();
    }

    // Dealers turn
    if (playerBlackjack && dealerBlackjack) {
      return this.draw();
    }
    if (playerBlackjack && !dealerBlackjack && this.dealerCards.length >= 2) {
      return this.playerWins();
    }
    if (dealerBust) {
      return this.playerWins();
    }
    if (dealerOver17 && this.dealerScore > this.playerScore) {
      return this.playerLoses();
    }
    if (dealerOver17 && this.dealerScore === this.playerScore) {
      return this.draw();
    }
    if (dealerOver17 && this.dealerScore < this.playerScore) {
      return this.playerWins();
    }

    // hit dealer
    if (this.playerStands) {
      setTimeout(() => {
        this.dealDealerCard();
      }, 1000);
    }
  }

  playerWins() {
    this.showButtons = false;
    this.showNewGame = true;
    this.message = "You win!";
  }

  playerLoses() {
    this.showButtons = false;
    this.showNewGame = true;
    this.message = "Dealer wins!";
  }

  draw() {
    this.showButtons = false;
    this.showNewGame = true;
    this.message = "Draw!";
  }

  getPoints(cards) {
    const score = cards.reduce((sum, card) => sum + card.value, 0);
    // if score is over 21 and there are aces in the hand then replace first with value 1
    if (score > 21 && cards.map(card => card.value).includes(11)) {
      const index = cards.map(card => card.value).indexOf(11);
      cards[index].value = 1;
      return this.getPoints(cards);
    }
    return score;
  }

  pickRandomCard() {
    const number = cardNumbers[Math.floor(Math.random() * cardNumbers.length)];
    const suit = cardSuits[Math.floor(Math.random() * cardSuits.length)];
    return {number, value: cardValueMap[number], suit};
  }
}
