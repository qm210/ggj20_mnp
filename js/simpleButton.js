class SimpleButton extends Phaser.GameObjects.Sprite {

    constructor(scene, config) {
        config.over = config.over || config.up;
        config.down = config.down || config.over;
        super(scene, config.x, config.y, config.key, config.up);
        this.onDown = config.onDown || (() => {});
        config.postOver = config.postOver || config.over;

        scene.add.existing(this);
        this.setOrigin(0, 1);
        this.setInteractive();
        this.on('pointerdown', () => {
            this.setFrame(config.down);
            this.onDown();
            setTimeout(() => {
                this.setFrame(config.postOver);
            }, 100);
        }, scene);
        this.on('pointerover', () => {this.setFrame(config.over)}, scene);
        this.on('pointerout', () => {this.setFrame(config.up)}, scene);
    }

}