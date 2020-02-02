class StartButton extends Phaser.GameObjects.Sprite {

    constructor(scene, x, y, texture, frameUp, frameDown, scale) {
        super(scene, x, y, texture, frameUp);
        this.scene = scene;
        this.frameUp = frameUp;

        this.setInteractive({
            useHandCursor: true,
        });
        this.setOrigin(0, 1);
        this.setScale(scale);

        this.on('pointerdown', () => {
            this.setFrame(frameDown);
        });
    }

    snapBack() {
        this.setFrame(this.frameUp);
    }

}
