class FolderButton extends Phaser.GameObjects.Image {

    static labelStyle = {
        font: "18px Arial",
        fill: "lightgreen"
    }

    constructor(scene, x, y, label, texture, onDown) {
        super(scene, x, y, texture);
        this.scene = scene;
        this.onDown = onDown || (() => {})

        scene.add.existing(this);
        this.setOrigin(0, 0)
            .setInteractive({useHandCursor: true})
            .on('pointerdown', this.onDown, scene);

        scene.add.text(x + .5 * this.texture.getSourceImage().width, y + this.texture.getSourceImage().height + 10, label, FolderButton.labelStyle)
            .setOrigin(.5, .5)
            .setInteractive({useHandCursor: true})
            .on('pointerdown', this.onDown, scene);
    }

}
