class TextButton extends Phaser.GameObjects.Text {

    constructor(scene, x, y, text, styles, onDown) {
        if (!styles.normal) {
            styles.normal = {
                font: "30px Arial",
                fill: '#a0a0a0',
            };
        }
        if (!styles.over) {
            styles.over = {...styles.normal};
            styles.over.fill = '#ffffff'
        }
        if (!styles.down) {
            styles.down = {...styles.normal};
            styles.down.fill = '#ff0000';
        }

        super(scene, x, y, text, styles.normal);
        this.onDown = onDown;

        scene.add.existing(this);
        this.setInteractive({
            useHandCursor: true,
        })
            .setOrigin(0.5, 0.5)
            .on('pointerdown', () => {
                this.setStyle(styles.down);
                this.onDown();
            })
            .on('pointerover', () => {
                this.setStyle(styles.over);
            })
            .on('pointerout', () => {
                this.setStyle(styles.normal);
            });
    }

}