class StartButton extends Phaser.GameObjects.Image {
    constructor(scene, x, y, texture, textureClicked, originX, originY, scale) {
        super(scene, x, y, texture);
        this.scene = scene;

        this.setInteractive({
            useHandCursor: true,
        })
        this.setOrigin(originX, originY);
        this.setScale(scale);

        this.on('pointerdown', () => {
            this.setTexture("buttonStartClicked");
            setTimeout(() => {
                this.setTexture('buttonStart');
            }, 100)
        });
    }

        /* 
    openStartMenu() {
        this.startMenuEntryHeight = 80
        this.startMenuEntryWidth = 300
        this.startMenuEntries = ["Menu 1!", "Menu 2!", "Menu 3000!"];
        this.startRect = Array(this.startMenuEntries.length);

        this.graphics = this.scene.add.graphics({
            fillStyle: {
                color: 0xFFFFFF,
            },
        });

        this.startMenuEntries.forEach((text, index) => {
            console.log(`${index} ${text}`);
            let startRectTop = config.height - this.displayHeight - (this.startMenuEntries.length - index) * this.startMenuEntryHeight;
            this.startRect[index] = new Phaser.Geom.Rectangle(0, startRectTop, this.startMenuEntryWidth, this.startMenuEntryHeight - 5);
    
            this.scene.add.text(20, startRectTop + 20 + this.startMenuEntryHeight * index , text, {font: "30px Arial", fill: "black"});
            this.graphics.fillRectShape(this.startRect[index]);        
        });

        let startRectTop = config.height - this.displayHeight - (this.startMenuEntries.length - index) * this.startMenuEntryHeight;
        this.graphics.setInteractive(new Phaser.Geom.Rectangle(0, config.height - this.displayHeight - this.startMenuEntries.length * this.startMenuEntryHeight), Phaser.Geom.Rectangle.Contains);
        this.graphics.on('pointerdown', (pointer) => {
            console.log(pointer.y);
        });

        */

    }
}
