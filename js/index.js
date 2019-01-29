
new Vue({
	el: "#app",
	data: {
		showSplash: false,
		dataCards : [
			{ name: "K", image: "http://www.totalnonsense.com/KS.png" },
			{ name: "J", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Jack_of_diamonds2.svg/2000px-Jack_of_diamonds2.svg.png" },
			{ name: "Q", image: "https://i.pinimg.com/originals/4a/c2/98/4ac2984435c4afd301636d3e90a4b1bf.jpg" },
			],
		cards: [],
		started: false,
		startTime: 0,
		flipBackTimer: null,
		timer: null,
		time: "00:00",
		},


	methods: {
		shuffleCards : function(cards){
			clonedCards = [].concat(_.cloneDeep(cards), _.cloneDeep(cards));
			return _.shuffle(clonedCards);
		} ,
		startGame: function () {
			this.showSplash = false;
			var cards = this.shuffleCards(this.dataCards);
			this.started = false;
			this.startTime = 0;


			cards.forEach(card => {
				card.flipped = false;
				card.found = false;
			});

			this.cards = cards;
		},

		flippedCards: function () {
			return this.cards.filter((card)=>{
				return card.flipped;
			})
		},

		sameFlippedCard: function () {
			var flippedCards = this.flippedCards();
			if (flippedCards.length == 2) {
				if (flippedCards[0].name == flippedCards[1].name)
				return true;
			}
		},

		setCardFounds: function () {
			this.cards.forEach(card => {
				if (card.flipped)
				card.found = true;
			});
		},

		checkAllFound: function () {
			var foundCards = _.filter(this.cards, function (card) {return card.found;});
			if (foundCards.length == this.cards.length)
			return true;
		},

		startTimer: function () {var _this = this;
			this.started = true;
			this.startTime = moment();

			this.timer = setInterval(function () {
				_this.time = moment(moment().diff(_this.startTime)).format("mm:ss");
			}, 1000);
		},

		finishGame: function () {
			this.started = false;
			clearInterval(this.timer);
			this.showSplash = true;
		},

		flipCard: function (card) {var _self = this;
			if (card.found || card.flipped) return;

			if (!this.started) {
				this.startTimer();
			}

			var flipCount = this.flippedCards().length;
			if (flipCount == 0) {
				card.flipped = !card.flipped;
			} else
			if (flipCount == 1) {
				card.flipped = !card.flipped;

				if (this.sameFlippedCard()) {
					this.flipBackTimer = setTimeout(function () {
						_self.clearFlipBackTimer();
						_self.setCardFounds();
						_self.clearFlips();
						if (_self.checkAllFound()) {
							_self.finishGame();
						}

					}, 200);
				} else
				{
					this.flipBackTimer = setTimeout(function () {
						_self.clearFlipBackTimer();
						_self.clearFlips();
					}, 1000);
				}
			}
		},

		clearFlips: function () {
			this.cards.map((card)=>{
				return card.flipped = false;
			})
		},


		clearFlipBackTimer: function () {
			clearTimeout(this.flipBackTimer);
			this.flipBackTimer = null;
		} },


	created: function () {
		this.startGame();
	} });