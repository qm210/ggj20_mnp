class FormatDialog extends Phaser.Scene {

    static X = 1071;
    static Y = 173;

    constructor() {
        super('SceneFormatDialog');
        this.parent = null;
    }

    init(data) {
        this.parent = data.parent;
    }

    preload() {
        this.load.image('formatBackground', 'assets/os/Formatbox.png');
        this.load.spritesheet('formatClose', "assets/os/Close.png", {
            frameWidth: 47,
            frameHeight: 42
        });
        this.load.spritesheet('formatOK', "assets/os/Doit.png", {
            frameWidth: 119,
            frameHeight: 61
        });
        this.load.spritesheet('formatCancel', "assets/os/Nah.png", {
            frameWidth: 86,
            frameHeight: 41,
        });

        this.load.image('radioX', "assets/os/CheckX.png");
    }

    create() {
        // TODO: find out how to have a scene smaller than the screen; and how to find its borders
        this.bg = this.add.image(FormatDialog.X, FormatDialog.Y, 'formatBackground')
            .setOrigin(0, 0);

        this.buttonX = new SimpleButton(this, {
            'key': 'formatClose',
            'up': 0,
            'over': 1,
            'x': 1435,
            'y': 182,
            'onDown': () => {this.scene.stop();}
        }).setOrigin(1, 0);

        this.buttonOK = new SimpleButton(this, {
            'key': 'formatOK',
            'up': 0,
            'over': 1,
            'down': 2,
            'x': 1237,
            'y': 538,
            'onDown': () => {this.scene.stop();}
        }).setOrigin(1, 0);

        this.buttonCancel = new SimpleButton(this, {
            'key': 'formatCancel',
            'up': 0,
            'over': 1,
            'down': 2,
            'x': 1337,
            'y': 542,
            'onDown': () => {this.scene.stop();}
        }).setOrigin(1, 0);

        this.modeSelector = this.add.image(1194, 253, 'radioX').setInteractive({useHandCursor: true}).setOrigin(.5, .5);

        this.formatSelector = this.add.image(1125, 322, 'radioX').setInteractive({useHandCursor: true}).setOrigin(.5, .5);

    }

}