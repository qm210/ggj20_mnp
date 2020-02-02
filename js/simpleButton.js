class SimpleButton extends Phaser.GameObjects.Sprite {

    constructor(scene, config) {
        config.over = config.over || config.up;
        config.down = config.down || config.over;
        super(scene, config.x, config.y, config.key, config.up);
        this.onDown = config.onDown || (() => {});
        config.postOver = config.postOver || config.over;
        this.deactivated = config.deactivated || false;

        scene.add.existing(this);
        this.setOrigin(.5, .5);
        this.setInteractive();
        this.on('pointerdown', () => {
            if (!this.deactivated) {
                this.setFrame(config.down);
                this.onDown();
                setTimeout(() => {
                    this.setFrame(config.postOver);
                }, 100);
            }
        }, scene);
        this.on('pointerover', () => {
            if (!this.deactivated) {
                this.setFrame(config.over);
            }
        }, scene);
        this.on('pointerout', () => {
            this.setFrame(config.up)
        }, scene);
    }

    setActive(activated) {
        this.deactivated = !activated;
    }

}