class SimpleButton extends Phaser.GameObjects.Sprite {

    constructor(scene, config) {
        config.over = config.over ||config.up;
        config.down = config.down || config.over;
        super(scene, config.x, config.y, config.key, config.up);
        this.onDown = config.onDown || (() => {});

        scene.add.existing(this);
        this.setOrigin(0, 1);
        this.setInteractive();
        this.on('pointerdown', () => {
            this.setFrame(config.down);
            setTimeout(() => {
                this.setFrame(config.up);
            }, 100);
            this.onDown();
        });
        this.on('pointerover', () => {this.setFrame(config.over)});
        this.on('pointerout', () => {this.setFrame(config.up)});
    }

}