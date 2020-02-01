class StartMenu extends Phaser.GameObjects.Image {

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
}
