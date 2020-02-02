class ConfirmMessage extends Phaser.Scene {

    static X = 800;
    static Y = 450;
    static messageCenterDeltaX = 0;
    static messageCenterDeltaY = -120;

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
        super('ConfirmMessage');
        this.parent = null;
        this.messageEmitter = new Phaser.Events.EventEmitter();
    }

    init(data) {
        this.parent = data.parent || null;
        this.message = data.message || '<unknown error>'
        this.deltaX = data.deltaX || 0
        this.deltaY = data.deltaY || 0
        this.messageHandler = data.messageHandler || (() => {});
        this.messageEmitter.on('confirm', this.messageHandler, this);

        if(!data.buttons) {
            let yesButton = ConfirmMessage.defaultButton(this);
            yesButton.x -= 200;
            yesButton.setText("YES SIR!");
            yesButton.onDown = (() => {
                this.messageEmitter.emit('confirm', true);
                this.scene.stop();
            });
            let noButton = ConfirmMessage.defaultButton(this);
            noButton.x += 200;
            noButton.setText("NO PLS!");
            noButton.onDown = (() => {
                this.messageEmitter.emit('confirm', false);
                this.scene.stop();
            });
            this.buttons = [yesButton, noButton];
        }
        else { // buttons given as objects: {deltaX: 40, deltaY: 0, text: 'Cancel'}
            this.buttons = []
            data.buttons.forEach(buttonPar => {
                let templateButton = ConfirmMessage.defaultButton(this);
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

        this.X = ConfirmMessage.X + this.deltaX;
        this.Y = ConfirmMessage.Y + this.deltaY;
        this.buttons.forEach(button => {
            button.x += this.deltaX;
            button.y += this.deltaY;
        });
    }

    static defaultButton(scene) {
        return new TextButton(scene,
            this.X + ConfirmMessage.messageCenterDeltaX,
            this.Y + ConfirmMessage.messageCenterDeltaY + 190,
            '',
            ConfirmMessage.textButtonStyles,
            () => {
                scene.scene.stop();
            })
            .setOrigin(0.5, 0)
    }

    preload() {
        this.load.image('ConfirmMessageBG', 'assets/os/messageConfirm.png');
    }

    create() {
        // TODO: find out how to have a scene smaller than the screen; and how to find its borders
        this.bg = this.add.image(this.X, this.Y, 'ConfirmMessageBG')
            .setOrigin(0.5, 0.5);

        this.add.text(
            this.X + ConfirmMessage.messageCenterDeltaX,
            this.Y + ConfirmMessage.messageCenterDeltaY,
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