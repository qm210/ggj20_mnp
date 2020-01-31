class SceneStart extends Phaser.Scene {
    constructor() {
        super("SceneStart")
    };

    preload() {
        this.load.image("buttonStart", "assets/os/startbutton.png");
        this.load.image("buttonStartClicked", "assets/os/startbutton_clicked.png");
        this.buttonScale = 0.5;
    }

    create() {
        this.add.text(20, 20, "Please your mom, please!", {font: "30px Arial", fill: "yellow"});

        this.buttonStart = new StartButton(this, 0, config.height, "buttonStart", "buttonStartClicked", 0, 1, this.buttonScale);
        this.add.existing(this.buttonStart);

        this.buttonStart.on('pointerdown', () => {
            console.log("clickediclick!");
        });

    }

}