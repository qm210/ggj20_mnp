class FileDoubleButton extends Phaser.GameObjects.Sprite {

    constructor(scene, x, y, label, texture, onFirstDown, onSecondDown, textColor) {
        textColor = textColor || "black"
        super(scene, x, y, texture);
        this.scene = scene;
        this.onFirstDown = onFirstDown || (() => {})
        this.onSecondDown = onSecondDown || this.onFirstDown
        this.firstState = true

        scene.add.existing(this);
        this.setOrigin(.5, .5)
            .setInteractive({useHandCursor: true})
            .on('pointerdown', () => {this.onDown();}, scene);

        this.labelText = scene.add.text(x, y + .5 * this.texture.getSourceImage().height, label, {
                font: "18px Arial",
                fill: textColor
            })
            .setOrigin(.5, 0)
            .setInteractive({useHandCursor: true})
            .on('pointerdown', () => {this.onDown();}, scene);
    }

    onDown() {
        if (this.firstState) {
            this.setFrame(1);
            this.onFirstDown();
        }
        else {
            this.setFrame(0);
            this.onSecondDown();
        }
        this.firstState = !this.firstState;
    }

}
