class FileButton extends Phaser.GameObjects.Image {

    constructor(scene, x, y, label, texture, onDown, textColor) {
        textColor = textColor || "black"
        super(scene, x, y, texture);
        this.scene = scene;
        this.onDown = onDown || (() => {})

        scene.add.existing(this);
        this.setOrigin(.5, .5)
            .setInteractive({useHandCursor: true})
            .on('pointerdown', this.onDown, scene);

        this.labelText = scene.add.text(x, y + .5 * this.texture.getSourceImage().height, label, {
                font: "18px Arial",
                fill: textColor
            })
            .setOrigin(.5, 0)
            .setInteractive({useHandCursor: true})
            .on('pointerdown', () => {this.onDown();}, scene);
    }

}
