function Card(letter, value, style, color, deck) {
    this.letter = letter;
    this.value = value;
    this.style = style;
    this.color = color;
    this.deck = deck;
    this.context = null;
    this.kineticImage = null;

    this.drawCardFace = function() {
        var canvas = document.createElement("canvas");
        canvas.width = this.deck.cardWidth;
        canvas.height = this.deck.cardHeight;
        canvas.id = "" + this.style + this.value + "FaceUp";
        this.context = canvas.getContext('2d');
        // this.context.fillStyle = "white";
        // this.context.fillRect(this.x,this.y,this.deck.cardWidth,this.deck.cardHeight);

        this.context.shadowBlur = 5;
        this.context.shadowColor = "black";
        this.context.strokeStyle = "black";
        this.context.strokeRect(5,5,this.deck.cardWidth-10,this.deck.cardHeight-10);

        this.context.shadowBlur = 0;
        var gradient = this.context.createLinearGradient(5,5,this.deck.cardWidth-10,this.deck.cardHeight-10);
        gradient.addColorStop(1,'white');
        gradient.addColorStop(0,this.color);
        this.context.fillStyle = gradient;
        this.context.fillRect(5,5,this.deck.cardWidth-10,this.deck.cardHeight-10);

        // draw letters and numbers
        this.context.fillStyle = "White";

        // draw letters
        this.context.shadowBlur = 2;
        this.context.shadowOffsetX = 1;
        this.context.shadowOffsetY = 1;

        this.context.font = this.deck.largeFontHeight + "px Times New Roman";

        // draw top this.letter
        this.context.textBaseline = 'top';
        this.context.fillText(this.letter,5+3, 5+3);
        var size = this.context.measureText(this.letter);

        // draw bottom this.letter
        this.context.textBaseline = 'bottom';
        this.context.textAlign = 'right';
        this.context.fillText(this.letter,this.deck.cardWidth-5-3, this.deck.cardHeight-5-3);


        /*
        // draw numbers
        this.context.font = this.deck.smallFontHeight + "px Times New Roman";
        this.context.shadowBlur = 1;
        this.context.fillStyle = "black";
        this.context.shadowColor = "white";

        // draw upper number
        this.context.textBaseline = 'top';
        this.context.textAlign = 'right';
        this.context.fillText(this.value + " Pts",this.deck.cardWidth-5-3, 5+3);

        // draw lower number
        this.context.textBaseline = "bottom";
        this.context.textAlign = 'left';
        this.context.fillText(this.value + " Pts",5+3, this.deck.cardHeight-5-3);
        */

        this.context.textBaseline = "alphabetic";
        this.context.textAlign = "start";
        this.context.shadowBlur = 0;
        this.context.shadowOffsetX = 0;
        this.context.shadowOffsetY = 0;

        return canvas;
    };

    this.moveTo = function(x,y) {
        this.kineticImage.setPosition(x,y);
    };

    this.flipOver = function() {
        var thisImage = this.kineticImage.image;
        this.kineticImage.setImage(this.kineticImage.otherImage);
        this.kineticImage.otherImage = thisImage;
        this.kineticImage.faceDown = false;
        this.kineticImage.topCard = true;
        this.kineticImage.draggable(true);
    };

    this.createKineticImage = function() {
        var faceUpCanvas = this.drawCardFace();
        var faceDownCanvas = deck.drawCardCoverCanvas();
        faceDownCanvas.id = "" + this.style + this.value + "FaceDown";

        this.kineticImage = new Kinetic.Image(
            {
                name: "" + this.style + this.letter + "",
                x: 0,
                y: 0,
                image: faceDownCanvas,
                width: this.deck.cardWidth,
                height: this.deck.cardHeight,
                draggable: false
            }
        );
        this.kineticImage.otherImage = faceUpCanvas;
        this.kineticImage.faceDown = true;
        this.kineticImage.topCard = false;
        this.kineticImage.gameObject = this;

        this.kineticImage.on("click", function(evt) {
            if (this.faceDown && this.topCard) {
                var thisImage = this.image;
                this.setImage(this.otherImage);
                this.otherImage = thisImage;
                this.parent.draw();
                this.faceDown = false;
                this.draggable(true);
                this.stack.shouldCatch(true);
            }
        });
        this.kineticImage.on("mouseover", function(evt) {
            if (this.topCard) {document.body.style.cursor = "pointer";}
        });
        this.kineticImage.on("mouseout", function(evt) {
            document.body.style.cursor = "default";
        });
        this.kineticImage.on("dragend", function(evt) {
            var eventStage = this.getStage();
            var pos = eventStage.getUserPosition();
            var stateNodeCatchers = eventStage.nodeCatchers;
            if (stateNodeCatchers.length > 0) { // check if there are catchers
                for (var i = 0; i < stateNodeCatchers.length; i++) {
                    var nodeCatcher = stateNodeCatchers[i]; // get the catcher node
                    if(nodeCatcher.intersects(pos) === true && nodeCatcher.canAddToStack(this)) { // if we're over it, snap to it (if we're allowed)
                        var caught = 0;
                        if (this.caughtBy === nodeCatcher) {
                            // we're already caught - we haven't left yet
                            caught = 1;
                        }
                        this.currentTrans = this.transitionToNode(
                            nodeCatcher,
                            {
                                duration: 0.5,
                                easing: "ease-in-out",
                                scale: { x:1, y:1 }
                            },
                            // if we're already caught, subtract us from stack size
                            (nodeCatcher.getStackSize()-caught) * GLOBAL.game.deck.stackOffset
                        );
                        this.setDragStart();
                        if (caught === 0) {
                            // we're not caught already
                            this.caughtBy = nodeCatcher;
                            nodeCatcher.addNode(this); // add this to the list nodes the catcher, caught
                        }
                        // regardless ...
                        nodeCatcher.awaitDrop(false); // we dropped into the catcher node

                    } else {

                        // this.transitionTo({ scale: { x:1, y:1 }, duration: 0.5, easing: "ease-in-out" });
                    }
                }
            }
            // we can't be dropped anywhere we like, we go back to where we were
            if (this.caughtBy === null) {
                this.transitionTo({
                    x: Kinetic.GlobalObject.drag.dragStart.x,
                    y: Kinetic.GlobalObject.drag.dragStart.y,
                    duration: 0.5,
                    easing: "ease-in"
                });
                var fab = 1;
            }
        });
        this.kineticImage.on("dragover", function(evt) {
            this.attrs.hoveringOver = evt.hoveringOver;
        });
        this.kineticImage.on("dragstart", function() {
            this.moveToTop();
            // this.transitionTo({ scale: { x:0.8, y:0.8 }, duration: 0.4, easing: "ease-in-out" });
            // if(this.stack){this.stack.nodeRemoved();}
        });
    };

    this.moveToStack = function(stack) {
        this.kineticImage.stack = stack;
        this.kineticImage.caughtBy = stack;
    };
}