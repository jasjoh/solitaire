function Deck() {

    this.init = function() {
        this.initTypes();
        this.initFormat();
        this.initStyles();
        this.initColors();
    };

    this.initTypes = function() {
        this.TYPES = {
            A: 1,
            K: 13,
            Q: 12,
            J: 11,
            10: 10,
            9: 9,
            8: 8,
            7: 7,
            6: 6,
            5: 5,
            4: 4,
            3: 3,
            2: 2
            // W: 50
        };
    };

    this.initFormat = function() {
        this.cardHeight = 100;
        this.cardWidth = 80;
        this.largeFontHeight = 15;
        this.smallFontHeight = 8;
        this.sets = 4;
        this.stackOffset = 15; // pixels to offset cards on a stack

        // this.canvas = canvas;
        // this.context = context;
        // this.numRows = this.canvas.height / this.cardHeight;
        // this.numCols = this.canvas.width / this.cardWidth;
    };

    this.initStyles = function() {
        // if we want to define a set of styles
        this.STYLES = {
            hearts: 'hearts',
            diamonds: 'diamonds',
            spades: 'spades',
            clubs: 'clubs'
        };
    };

    this.initColors = function() {
        // if we want to classify styles into color groups
        this.COLORS = {
            hearts: 'red',
            diamonds: 'red',
            spades: 'black',
            clubs: 'black'
        };
    };

    this.shuffle = function() {
        var i, j, k;
        var temp;

        for (i = 0; i < 3; i++) {
            for (j = 0; j < this.cards.length; j++) {
                k = Math.floor(Math.random() * this.cards.length);
                temp = this.cards[j]; // copy the card at position (j)
                this.cards[j] = this.cards[k]; // replace the card with another random card (k)
                this.cards[k] = temp; // put the copy where we took the random card from
            }
        }
    };

    this.dealCard = function() {
        if (this.cards.length > 0) { return this.cards.shift(); }
        else { return null; }
    };

    this.addCard = function() {
        this.cards.push(card);
    };

    this.createCards = function() {
        this.cards = [];
        for (var style in this.STYLES) {
            // run this for every type of style
            if (this.STYLES.hasOwnProperty(style)){
                for (var cardType in this.TYPES) {
                    // run this for every type of card (assume one of each)
                    if (this.TYPES.hasOwnProperty(cardType)){
                        var card = this.createCard(cardType,this.TYPES[cardType],this.STYLES[style],this.COLORS[style]);
                        this.cards.push(card);
                    }
                }
                // for loop ended, one of each card created for this this set
            }
        }
        // for loop ended, all sets created
    };

    this.createCard = function(letter, value, style, color) {
        var card = new Kinetic.Card({
            deck: this,
            letter: letter,
            value: value,
            style: style,
            color: color
        });
        card.on("click", function(evt) {
            if (this.attrs.faceDown && this.attrs.topCard) { this.flipOver(); }
        });
        card.on("mouseover", function(evt) {
            if (this.isTopCard()) {document.body.style.cursor = "pointer";}
        });
        card.on("mouseout", function(evt) {
            document.body.style.cursor = "default";
        });
        card.on("dragend", function(evt) {
            this.drop();
        });
        card.on("dragover", function(evt) {
            this.attrs.hoveringOver = evt.hoveringOver;
        });
        card.on("dragstart", function() {
            this.moveToTop();
            // this.transitionTo({ scale: { x:0.8, y:0.8 }, duration: 0.4, easing: "ease-in-out" });
            // if(this.stack){this.stack.nodeRemoved();}
        });
        return card;
    };

    /*
    this.createKineticCards = function() {
        for (var i = 0; i < this.cards.length; i++) {
            this.cards[i].createKineticImage();
        }
    };

    this.drawCardCoverCanvas = function() {
        var canvas = document.createElement("canvas");
        canvas.width = this.cardWidth;
        canvas.height = this.cardHeight;
        var context = canvas.getContext('2d');

        context.shadowBlur = 5;
        context.shadowColor = "black";
        context.strokeStyle = "black";
        context.strokeRect(5,5,this.cardWidth-10,this.cardHeight-10);

        context.shadowBlur = 0;
        var gradient = context.createLinearGradient(5,5,this.cardWidth-10,this.cardHeight-10);
        // gradient.addColorStop(2,'gray');
        gradient.addColorStop(1,'white');
        gradient.addColorStop(0,'gray');
        context.fillStyle = gradient;
        context.fillRect(5,5,this.cardWidth-10,this.cardHeight-10);

        return canvas;
    };
    */

    this.init();

}