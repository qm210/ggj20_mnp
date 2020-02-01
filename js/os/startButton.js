class StartButton extends Phaser.GameObjects.Image {

    constructor(scene, x, y, texture, textureClicked, scale) {
        super(scene, x, y, texture);
        this.scene = scene;

        this.setInteractive({
            useHandCursor: true,
        });
        this.setOrigin(0, 1);
        this.setScale(scale);

        this.on('pointerdown', () => {
            this.setTexture(textureClicked);
            setTimeout(() => {
                this.setTexture(texture);
            }, 100);
        });
    }

}
