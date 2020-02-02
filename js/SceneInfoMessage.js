class InfoMessage extends Phaser.Scene {

    static X = 800;
    static Y = 450;
    static messageCenterDeltaX = -20;
    static messageCenterDeltaY = -50;

    static textButtonStyles = {
        normal: {
            font: "40px Arial",
            fill: "black",
        },
        over: {
            font: "40px Arial",
            fill: "#404000",
        },
        down: {
            font: "40px Arial",
            fill: "#400000",
        },
    }

    constructor() {
        super('InfoMessage');
        this.parent = null;
    }

    init(data) {
        this.parent = data.parent || null;
        this.message = data.message || '<unknown error>'
        this.deltaX = data.deltaX || 0
        this.deltaY = data.deltaY || 0
        this.messageDeltaX = data.messageDeltaX || 0
        this.messageDeltaY = data.messageDeltaY || 0

        if(!data.buttons) {
            this.buttons = [InfoMessage.defaultButton(this)];
        }
        else { // buttons given as objects: {deltaX: 40, deltaY: 0, text: 'Cancel'}
            this.buttons = []
            data.buttons.forEach(buttonPar => {
                let templateButton = InfoMessage.defaultButton(this);
                templateButton.x += buttonPar.deltaX;
                templateButton.y += buttonPar.deltaY;
                templateButton.setText(buttonPar.text)
                if (buttonPar.onDown) {
                    templateButton.onDown = (() => {
                        buttonPar.onDown();
                        this.scene.stop();
                    });
                }
                this.buttons.push(templateButton)
            })
        }

        this.X = InfoMessage.X + this.deltaX;
        this.Y = InfoMessage.Y + this.deltaY;
        this.buttons.forEach(button => {
            button.x += this.deltaX;
            button.y += this.deltaY;
        });
    }

    static defaultButton(scene) {
        return new TextButton(scene,
            this.X + InfoMessage.messageCenterDeltaX + 45,
            this.Y + InfoMessage.messageCenterDeltaY + 145,
            'OH WELL...',
            InfoMessage.textButtonStyles,
            () => {
                scene.scene.stop();
            })
            .setOrigin(0.5, 0)
    }

    preload() {
        this.load.image('InfoMessageBG', 'assets/os/InfoBox.png');
    }

    create() {
        // TODO: find out how to have a scene smaller than the screen; and how to find its borders
        this.bg = this.add.image(this.X, this.Y, 'InfoMessageBG')
            .setOrigin(0.5, 0.5);

        this.add.text(
            this.X + InfoMessage.messageCenterDeltaX + this.messageDeltaX,
            this.Y + InfoMessage.messageCenterDeltaY + this.messageDeltaY,
            this.message,
            {
                font: "25px Arial",
                fill: "black",
                align: "center"
            })
            .setOrigin(0.5, 0);

        this.buttons.forEach(button => {
            button.setDepth(10);
            this.add.existing(button);
        });
    }

    update() {
    }
}