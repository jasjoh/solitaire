function Game() {
    this.stage = null;
    this.layers = {};
    this.deck = null;

    this.init = function() {
        this.createStage();
        this.createLayers();
        this.createDeck();

        this.PLAYERCARDROW = 300;
    };

    this.createStage = function() {
        this.stage = new Kinetic.Stage(
            {
                container: "container",
                width: 800,
                height: 800
            }
        );
    };

    this.createLayers = function() {
        this.createLayer("backgroundLayer");
        this.createLayer("cardsInPlayLayer");
        this.createLayer("tableLayer");
        this.createLayer("stackLayer");
    };

    this.createLayer = function(layerName) {
        this.layers[layerName] = new Kinetic.Layer();
        this.layers[layerName].name = layerName;
    };

    this.createDeck = function() {
        this.deck = new Deck();
        this.deck.createCards();
        this.deck.shuffle();
    };

    this.init();

    this.run = function() {
        this.addBackgroundLayer();
        this.addStackLayer();
        this.addTableLayer();
        this.addCardsInPlayLayer();
    };

    this.addBackgroundLayer = function() {
        this.backgroundBorderRect = new Kinetic.Rect(
            {
                name: "bkgrndRect",
                x: 0,
                y: 0,
                width: 800,
                height: 800,
                stroke: "black",
                strokeWidth: 1
            }
        );
        this.layers["backgroundLayer"].add(this.backgroundBorderRect);
        this.stage.add(this.layers["backgroundLayer"]);
    };

    this.addStackLayer = function() {
        this.stacks = [];
        this.createStack("playerStack1","player",50,this.PLAYERCARDROW);
        this.createStack("playerStack2","player",150,this.PLAYERCARDROW);
        this.createStack("playerStack3","player",250,this.PLAYERCARDROW);
        this.createStack("playerStack4","player",350,this.PLAYERCARDROW);
        this.createStack("playerStack5","player",450,this.PLAYERCARDROW);
        this.createStack("playerStack6","player",550,this.PLAYERCARDROW);
        this.createStack("playerStack7","player",650,this.PLAYERCARDROW);

        this.createStack("dropStack1","drop",300,50);
        this.createStack("dropStack2","drop",400,50);
        this.createStack("dropStack3","drop",500,50);
        this.createStack("dropStack4","drop",600,50);
        for (var i = 0; i < this.stacks.length; i++) {
            this.layers["stackLayer"].add(this.stacks[i]);
        }
        this.stage.add(this.layers["stackLayer"]);

    };

    this.addTableLayer = function() {
        this.cardDropOutlines = [];
        this.createCardDropOutline("cardDropOutline1",300,50);
        this.createCardDropOutline("cardDropOutline2",400,50);
        this.createCardDropOutline("cardDropOutline3",500,50);
        this.createCardDropOutline("cardDropOutline4",600,50);

        this.createCardDropOutline("cardStackOutline1",50,this.PLAYERCARDROW);
        this.createCardDropOutline("cardStackOutline2",150,this.PLAYERCARDROW);
        this.createCardDropOutline("cardStackOutline3",250,this.PLAYERCARDROW);
        this.createCardDropOutline("cardStackOutline4",350,this.PLAYERCARDROW);
        this.createCardDropOutline("cardStackOutline5",450,this.PLAYERCARDROW);
        this.createCardDropOutline("cardStackOutline6",550,this.PLAYERCARDROW);
        this.createCardDropOutline("cardStackOutline7",650,this.PLAYERCARDROW);

        for (var i = 0; i < this.cardDropOutlines.length; i++) {
            this.layers["tableLayer"].add(this.cardDropOutlines[i]);
        }
        this.createDeckImage(50,50);
        this.layers["tableLayer"].add(this.deckImage);
        this.stage.add(this.layers["tableLayer"]);
    };

    this.addCardsInPlayLayer = function() {
        this.dealPlayersCards(7);
        this.stage.add(this.layers["cardsInPlayLayer"]);

        // set initial drag positions for all cards in stacks
        /*
        for (stack in this.stacks) {
            var stackContent = this.stacks[stack].getStackContents()
            for (card in stackContent) {
                stackContent[card].setDragStart();
            }
        }
        */
    };

    this.createStack = function(name,type,x,y) {
        var newStack = new Kinetic.Stack({
            name: name,
            x: x,
            y: y,
            width: this.deck.cardWidth,
            height: this.deck.cardHeight,
            stackType: type
        });
        newStack.on("dragin", function(evt){
            this.awaitDrop(true);
        });
        newStack.on("dragout", function(evt){
            if (this.isStacked()) {
                if(this.isOnStack(Kinetic.GlobalObject.drag.node)) {
                    // only remote node if its on our stack
                    // otherwise its just random card being dragged over
                    this.nodeRemoved();
                }
                this.awaitDrop(false);
            }
        });
        newStack.on("dragover", function(evt){
            if (this.isStacked() || this.isAwaitingDrop()) {
                this.awaitDrop(true);
                return;
            }
            this._handleEvents("ondragin", evt);
        });
        this.stacks.push(newStack);
    };

    this.createCardDropOutline = function(name,x,y) {
        var cardDropOutline = new Kinetic.Rect(
            {
                name: name,
                x: x,
                y: y,
                width: this.deck.cardWidth,
                height: this.deck.cardHeight,
                stroke: "black",
                strokeWidth: 1
            }
        );

        this.cardDropOutlines.push(cardDropOutline);
    };

    this.createDeckImage = function(x,y) {
        /*this.deckRect = new Kinetic.Rect(
         {
         name: "deckRect",
         x: x,
         y: y,
         width: this.deck.cardWidth,
         height: this.deck.cardHeight,
         stroke: "black",
         fill: "black",
         strokeWidth: 1
         }
         );*/
        var canvas = this.deck.drawCardCoverCanvas();
        this.deckImage = new Kinetic.Image(
            {
                name: "deck",
                x: x,
                y: y,
                image: canvas,
                width: this.deck.cardWidth,
                height: this.deck.cardHeight
            }
        );

        this.deckImage.on("mousedown", function(evt) {
            if (GLOBAL.game.deck.cards.length === 0) {GLOBAL.cheat(); return;}
            var cardDealt = GLOBAL.game.deck.dealCard();
            cardDealt.moveTo(this.getAbsolutePosition().x, this.getAbsolutePosition().y);
            GLOBAL.game.layers["cardsInPlayLayer"].add(cardDealt.kineticImage);
            GLOBAL.game.layers["cardsInPlayLayer"].draw();
            cardDealt.kineticImage.transitionTo({
                x: this.getAbsolutePosition().x + 90,
                y: this.getAbsolutePosition().y,
                duration: 0.5,
                easing: "ease-in"
            });
            cardDealt.flipOver();
            cardDealt.kineticImage.setDragStart();
        });
        this.deckImage.on("mouseover", function(evt) {
            document.body.style.cursor = "pointer";
        });
        this.deckImage.on("mouseout", function(evt) {
            document.body.style.cursor = "default";
        });

    };

    this.dealPlayersCards = function(stacks) {
        var stackHeight = 1;
        var cardDealt = null;
        for (var i = 0; i < stacks; i++) {
            for (var n = 0; n < stackHeight; n++) {
                cardDealt = GLOBAL.game.deck.dealCard();
                cardDealt.moveTo((i*100)+50,this.PLAYERCARDROW+(n*this.deck.stackOffset));
                this.stacks[i].addNode(cardDealt.kineticImage);
                cardDealt.moveToStack(this.stacks[i]);
                GLOBAL.game.layers["cardsInPlayLayer"].add(cardDealt.kineticImage);
            }
            cardDealt.flipOver();
            stackHeight++;
        }
    };
}