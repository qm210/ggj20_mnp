class ErrorMessage extends Phaser.Scene {

    static X = 800;
    static Y = 450;
    static messageCenterDeltaX = 80;
    static messageCenterDeltaY = -45;

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
        super('ErrorMessage');
        this.parent = null;
    }

    init(data) {
        console.log(data.parent);
        this.parent = data.parent || null;
        this.message = data.message || '<unknown error>'
        this.deltaX = data.deltaX || 0
        this.deltaY = data.deltaY || 0
        if(!data.buttons) {
            this.buttons = [ErrorMessage.defaultButton(this)];
        }
        else { // buttons given as objects: {deltaX: 40, deltaY: 0, text: 'Cancel'}
            this.buttons = []
            data.buttons.forEach(buttonPar => {
                let templateButton = ErrorMessage.defaultButton(this);
                templateButton.x += buttonPar.deltaX + this.deltaX;
                templateButton.y += buttonPar.deltaY + this.deltaY;
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

        this.X = ErrorMessage.X + this.deltaX
        this.Y = ErrorMessage.Y + this.deltaY
    }

    static defaultButton(scene) {
        return new TextButton(scene,
            this.X + ErrorMessage.messageCenterDeltaX,
            this.Y + ErrorMessage.messageCenterDeltaY + 130,
            'Ok Sorry!',
            ErrorMessage.textButtonStyles,
            () => {
                scene.scene.stop();
            })
            .setOrigin(0.5, 0)
    }

    preload() {
        this.load.image('errorMessageBG', 'assets/os/messageError.png');
    }

    create() {
        // TODO: find out how to have a scene smaller than the screen; and how to find its borders
        this.bg = this.add.image(this.X, this.Y, 'errorMessageBG')
            .setOrigin(0.5, 0.5);

        this.add.text(
            this.X + ErrorMessage.messageCenterDeltaX,
            this.Y + ErrorMessage.messageCenterDeltaY,
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