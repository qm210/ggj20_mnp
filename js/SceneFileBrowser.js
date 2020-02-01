class FileBrowser extends Phaser.Scene {

    static X = 200;
    static Y = 200;

    constructor() {
        super('SceneFileBrowser');
        this.parent = null;
    }

    init(data) {
        this.parent = data.parent || null;
    }

    preload() {
        this.load.image('filebrowserBG', "assets/os/filebrowserBG.png");
        this.load.spritesheet('filebrowserButtonX', "assets/os/filebrowserButtonX.png", {
            frameWidth: 36,
            frameHeight: 43
        });
    }

    create() {
        this.bg = this.add.image(FileBrowser.X, FileBrowser.Y, 'filebrowserBG');
        this.buttonX = new SimpleButton(this, {
            'key': 'filebrowserButtonX',
            'up': 0,
            'over': 1,
            'down': 2,
            'x': FileBrowser.X + this.bg.width,
            'y': FileBrowser.Y,
            'onDown': this.scene.stop
        }).setOrigin(1, 0);
    }

}