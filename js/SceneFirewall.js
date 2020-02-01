class Firewall extends Phaser.Scene {

    static X = 500;
    static Y = 100;

    constructor() {
        super('SceneFirewall');
        this.parent = null;
    }

    init(data) {
        this.parent = data.parent;
    }

    preload() {
        this.load.image('background', 'assets/firewalltool/background.png');
        this.load.spritesheet('buttonX', 'assets/firewalltool/X.png',{
            frameWidth: 56,
            frameHeight: 61,
        });
        this.load.image('lightGreen', 'assets/firewalltool/lightGreen.png');
        this.load.image('lightRed', 'assets/firewalltool/lightRed.png');
    }

    create() {
        // TODO: find out how to have a scene smaller than the screen; and how to find its borders
        this.bg = this.add.image(Firewall.X, Firewall.Y, 'background').setOrigin(0, 0);

        this.buttonX = new SimpleButton(this, {
            'key': 'buttonX',
            'up': 0,
            'over': 1,
            'down': 2,
            'x': Firewall.X + this.bg.width,
            'y': Firewall.Y,
            'onDown': () => {this.scene.stop();},
        }).setOrigin(1, 0);
        //.bind(this); // TODO: learn about bind(this)

        this.firewallLight = this.add.image(Firewall.X + 250, Firewall.Y + 250, 'lightGreen'); // TODO: solve this via spritesheet.... dumbass.

        this.disableButton = new TextButton(this, Firewall.X + 150, Firewall.Y + 530, '', {}, () => {
            this.parent.firewallRunning = !this.parent.firewallRunning;
        })

        this.russianCounter = this.add.text(Firewall.X + 220, Firewall.Y + 410, '0', {font: "30px Arial", fill: "white"});
    }

    update() {
        this.firewallLight.setTexture(this.parent.firewallRunning ? 'lightGreen' : 'lightRed');
        this.disableButton.setText(this.parent.firewallRunning ? 'DISABLE' : 'ENABLE');
        this.russianCounter.setText(this.parent.attacksFromRussians);
    }
}