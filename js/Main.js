class Main extends Phaser.Scene {

    static RussianAttackRate = .01;
    static GlitchPerAttackMin = 0.005;
    static GlitchPerAttackMax = 0.050;

    constructor() {
        super('SceneMain');
    };

    init() {
        // STATE VARIABLES ~ todo: good style to define these here..?
        this.firewallRunning = true;
        this.attacksFromRussians = 0;

        this.glitchLevel = 0;

        this.startMenuOpen = false;

        this.noteList = ['Give Mommy Some Porny', 'Repair Something', 'Feed the Cat'];
        this.usbState = {
            'filesystem': 'FAT32',
            'usedSpace': 0,
            'totalSpace': 8 * 1024 * 1024, // unit: kilobytes
            'content': []
        }
    }

    preload() {
        this.load.image('background', "assets/os/BG.png");
        this.load.spritesheet('buttonStart', "assets/os/startbutton.png", {frameWidth: 58, frameHeight: 42});
        this.load.spritesheet('folder', "assets/os/folder.png", {frameWidth: 71, frameHeight: 48});
        this.load.spritesheet('drive', "assets/os/hdd.png", {frameWidth: 124, frameHeight: 58});
        this.load.spritesheet('usb', "assets/os/usb.png", {frameWidth: 63, frameHeight: 68});
        this.load.spritesheet('file', "assets/os/file.png", {frameWidth: 44, frameHeight: 46});
        this.load.spritesheet('moviefile', "assets/os/mov.png", {frameWidth: 62, frameHeight: 46});
        this.load.spritesheet('startMenuReboot', "assets/os/Reboot.png", {frameWidth: 123, frameHeight: 33});
        this.load.spritesheet('startMenuSearch', "assets/os/Search.png", {frameWidth: 125, frameHeight: 38});
        this.load.spritesheet('startMenuUeX', "assets/os/UeX.png", {frameWidth: 123, frameHeight: 43});
        this.load.spritesheet('startMenuNotes', "assets/os/Notes.png", {frameWidth: 113, frameHeight: 47});
        this.load.image('startMenu', "assets/os/Startmenu.png");
        this.load.image('clockDate', "assets/os/ClockDate.png");

        this.load.glsl('glitch', 'frag/glitch.frag');

        this.load.audio('mainloop', 'ogg/mainloop.ogg');
    }

    inputHandler()
    {
        if (game.sound.context.state === 'suspended') {
            game.sound.context.resume();
        }
    }

    create() {
        this.renderTexture = this.add.renderTexture(0,0,screen.frameWidth, screen.frameHeight);

        this.background = this.add.image(0, 0, 'background').setOrigin(0, 0).setInteractive();
        this.background.on('pointerdown', this.clickBackground, this);

        this.add.text(20, 20, "Your mom wants some movies, find them and copy them to USB.\nIf something breaks; you have to repair it first!\n\nAlso, this is the best OS design ever.", {font: "30px Arial", fill: "yellow"});

        this.buttonStart = new StartButton(this, 0, config.height, 'buttonStart', 0, 1);
        this.add.existing(this.buttonStart);
        this.buttonStart.on('pointerdown', this.openStartMenu, this);

        this.startMenu = [];

        this.desktopButtons = [
            new FileButton(this, 85, 210, 'My Computer', 'folder', this.openFileBrowser, "lightgreen"),
        ]

        this.glitchShader = this.add.shader('glitch', 0., 0., config.width, config.height).setOrigin(0, 0);

        var sfxconfig = { loop:true };

        this.sfx = this.sound.add('mainloop', sfxconfig);
        this.sfx.play();

        this.input.on('pointerdown', this.inputHandler);
    }

    update() {
        this.handleRussianAttacks();
        this.glitchShader.uniforms.amount.value = this.glitchLevel;
    }

    // todo: move this somehow to startButton.js so this.scene is clear...
    openStartMenu() {
        if (this.startMenuOpen) {
            this.collapseStartMenu();
            return;
        }
        this.startMenuOpen = true;

        this.startMenuBG = this.add.image(this.buttonStart.getTopRight().x, this.buttonStart.getTopRight().y, 'startMenu').setOrigin(0, 1);

        this.startMenuButtonReboot = this.add.existing(new SimpleButton(this, {'key': 'startMenuReboot', 'up': 0, 'over': 1, 'down': 2,
            'x': this.buttonStart.getTopRight().x,
            'y': this.buttonStart.getTopRight().y - 30,
            'onDown': () => {this.clickRebootButton();}
        }));
        this.startMenuButtonSearch = this.add.existing(new SimpleButton(this, {'key': 'startMenuSearch', 'up': 0, 'over': 1, 'down': 2,
            'x': this.buttonStart.getTopRight().x + 100,
            'y': this.buttonStart.getTopRight().y - 30,
            'onDown': () => {this.clickSearchButton();}
        }));
        this.startMenuButtonUeX = this.add.existing(new SimpleButton(this, {'key': 'startMenuUeX', 'up': 0, 'over': 1, 'down': 2,
            'x': this.buttonStart.getTopRight().x + 200,
            'y': this.buttonStart.getTopRight().y - 30,
            'onDown': () => {this.openFileBrowser();}
        }));
        this.startMenuButtonNotes = this.add.existing(new SimpleButton(this, {'key': 'startMenuNotes', 'up': 0, 'over': 1, 'down': 2,
            'x': this.buttonStart.getTopRight().x + 300,
            'y': this.buttonStart.getTopRight().y - 30,
            'onDown': () => {this.openNotes();}
        }));

    }

    collapseStartMenu() {
        if (this.startMenuBG != undefined) {
            this.startMenuBG.destroy();
            this.startMenuButtonReboot.destroy();
            this.startMenuButtonSearch.destroy();
            this.startMenuButtonUeX.destroy();
            this.startMenuButtonNotes.destroy();
        }
        this.buttonStart.snapBack();
        this.startMenuOpen = false;
    }

    clickBackground() {
        this.collapseStartMenu();
    }

    openNotes() {
        console.log(`notelist: ${this.noteList}`);
    }

    openFileBrowser() {
        this.scene.launch('SceneFileBrowser', {'parent': this});
    }

    clickSearchButton() {
        this.scene.launch('SceneFirewall', {'parent': this});
        this.collapseStartMenu();
    }

    clickRebootButton() {
        this.collapseStartMenu();
    }

    handleRussianAttacks() {
        if (!this.firewallRunning) {
            if (Phaser.Math.Between(0, 1000) < Main.RussianAttackRate * 1000) {
                this.attacksFromRussians++;
                let glitchDelta = Phaser.Math.Between(1000 * Main.GlitchPerAttackMin, 1000 * Main.GlitchPerAttackMax) / 1000;
                this.glitchLevel = Math.min(this.glitchLevel + glitchDelta, 1);

                let hackingWasBad = glitchDelta > (Main.GlitchPerAttackMin + Main.GlitchPerAttackMax) / 2; // TODO: implement more annoying stuff for worse hacking

                this.scene.launch('InfoMessage', {
                    'parent': this,
                    'message': 'You got hacked! Check your Firewall!\n(which is called \'Search\' right now...)\n\nWhy did you turn it off, are you stupid??',
                    'deltaX': Phaser.Math.Between(-400, 400),
                    'deltaY': Phaser.Math.Between(-200, 200),
                });

            }
        }
    }
}

// TODO: usb drive menu (super complicated..!)
// TODO: task list
// TODO: progress bar
