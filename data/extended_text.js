var Querijn = Querijn || {};
Querijn.Text = PIXI.Text;

Querijn.Text.identifierBinding = [];
Querijn.Text.IdentifierBase = 56192;

const oldUpdateText = Querijn.Text.prototype.updateText;
Querijn.Text.prototype.updateText = function (respectDirty) {

    if (this.dirty)
        while (this.children.length)
            this.removeChild(this.children[0]);

    oldUpdateText.call(this, respectDirty);
}

Querijn.Text.prototype.drawLetterSpacing = function(text, x, y, isStroke) {
    var isStroke = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

    var style = this._style;

    // letterSpacing of 0 means normal
    var letterSpacing = style.letterSpacing;

    var characters = String.prototype.split.call(text, '');
    var currentPosition = x;
    var index = 0;
    var current = '';
    var currentWidth = 0;

    if (!this.usage) {
        this.usage = {};
        this.sprites = {};
    }

    while (index < text.length) {
        current = characters[index++];
        currentWidth = this.context.measureText(current).width;

        var charCode = current.charCodeAt(0);
        var specialCharacterIndex = charCode - Querijn.Text.IdentifierBase;
        if (specialCharacterIndex >= 0 && specialCharacterIndex < 255) {

            if (!this.usage[specialCharacterIndex]) {
                this.usage[specialCharacterIndex] = 0;
            }

            var spriteIndex = this.usage[specialCharacterIndex]++;
            var img = this.makeSprite(specialCharacterIndex);
            img.visible = true;

            var imgRescale = currentWidth / img.width;

            img.width = currentWidth;
            img.height = img.height * imgRescale;
            img.x = currentPosition;
            img.y = y;
        }
        else if (isStroke) {
            this.context.strokeText(current, currentPosition, y);
        } else {
            this.context.fillText(current, currentPosition, y);
        }
        currentPosition += currentWidth + letterSpacing;
    }
}

Querijn.Text.prototype.makeSprite = function(charIndex) {

    var img = new PIXI.Sprite(Querijn.Text.identifierBinding[charIndex]);

    // Due to the fact the updating of the widths happens inside the draw function, it won't happen until the next frame
    // This means I have to show the image before that happens which means i cannot make .visible = false, so I put it off the screen
    img.x = -9999;
    img.y = -9999;
    
    var characterWidth = this.context.measureText(Querijn.Text.identifierBinding[charIndex].character).width;
    var imgRescale = characterWidth / img.width;

    img.anchor.y = 0.9;
    img.width = characterWidth;
    img.height = img.height * imgRescale;
    
    this.addChild(img);
    
    if (!this.sprites[charIndex])
        this.sprites[charIndex] = [];

    this.sprites[charIndex].push(img);
    return img;
}

Querijn.Text.addImage = function(texture) {
    
    // calculate character
    var i = Querijn.Text.identifierBinding.length;
    var character = String.fromCharCode(Querijn.Text.IdentifierBase + i);

    // Add to our collection
    Querijn.Text.identifierBinding.push(texture);
    texture.character = character;

    return character;
}
