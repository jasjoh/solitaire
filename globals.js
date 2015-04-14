window.onload = function() { main(); }; // call the main() function when fully loaded

window.onerror = function (message, url, lineNo) {
    alert(
        'Error: ' + message +
            '\n Url: ' + url +
            '\n Line Number: ' + lineNo);
    return false;
};


var GLOBAL = {
    cheat: function() {
        if (GLOBAL.canCheat) {
            for (stack in GLOBAL.game.stacks) {
                var stackContent = GLOBAL.game.stacks[stack].getStackContents()
                for (card in stackContent) {
                    if(stackContent[card].faceDown === true) {
                        var thisImage = stackContent[card].image;
                        stackContent[card].setImage(stackContent[card].otherImage);
                        stackContent[card].otherImage = thisImage;
                        stackContent[card].faceDown = false;
                        stackContent[card].topCard = true;
                        stackContent[card].draggable(true);
                    }
                }
            }
        }
        GLOBAL.canCheat = false;
    },
    canCheat: true,
    game: null,
    gameWidth: 800,
    gameHeight: 800,
    requestAnimationFrame: window.mozRequestAnimationFrame    ||
        window.webkitRequestAnimationFrame ||
        window.msRequestAnimationFrame     ||
        window.oRequestAnimationFrame // ensure the right RAF method is used
};
