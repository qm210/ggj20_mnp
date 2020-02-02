class FileBrowser extends Phaser.Scene {

    static X = 200;
    static Y = 130;
    static contentX = FileBrowser.X + 167;
    static contentY = FileBrowser.Y + 179;
    static contentRowLength = 4;
    static contentColSpacingX = 154;
    static contentColSpacingY = 4;
    static contentRowSpacing = 110;
    static maxContent = 12;

    // stupid hack, which i despise
    static Drive = {
        "My\ Computer": {
            "C:\\": 'drive',
            "F:\\": 'usb'
        },
        "C:\\": {
            "Users": 'folder',
            "Programs": 'folder',
            "\'School\'": 'folder',
            "Temp": 'folder',
            "System": 'folder',
        },
        "C:\\Users\\": {
            "NIX": 'folder',
            "NR4": 'folder',
            "Peter Weinreuter": 'folder',
        },
        "C:\\Users\\NIX\\": {
            "hier is nix.txt": 'file',
        },
        "C:\\Users\\NR4\\": {
            "Memes": 'folder',
            "Demos": 'folder',
            "Exfreundinnen-\nVerzeichnis": 'folder',
            "NSBM": 'folder',
            "Hatespeech": 'folder',
        },
        "C:\\Users\\Peter Weinreuter\\": {
            "Pictures": 'folder',
            "Movies": 'folder',
            "Important Stuff": 'folder',
            "Work" : 'folder',
            "Games": 'folder',
        },
        "C:\\Users\\Peter Weinreuter\\Movies\\": {
            "LotW_1.avi": 'moviefile',
            "LotW_2.avi": 'moviefile',
            "LotW_3.avi": 'moviefile',
        },
        "C:\\Temp\\": {
            "Browser-\nHistory.xml": 'file',
            "test (probably p0rn).avi": 'moviefile',
        },
        "C:\\System\\": {
            "sys.dll": 'file',
            "boot.inf": 'file',
            "lib.so": 'file',
            "lib.so.o": 'file',
            "README.txt": 'file',
            "CMakeCache.txt": 'file',
            "autorun.bat": 'file',
            "bootScreen.mov": 'moviefile'
        }
    }

    constructor() {
        super('SceneFileBrowser');
    }

    init(data) {
        this.parent = data.parent || null;
        this.path = "My Computer"
        this.pathContent = []
        this.lastClicked = null;
    }

    preload() {
        this.load.image('filebrowserBG', "assets/os/Frame.png");
        this.load.spritesheet('filebrowserButtonX', "assets/os/Close.png", {
            frameWidth: 47,
            frameHeight: 42
        });
        this.load.spritesheet('filebrowserButtonBack', "assets/os/Back.png", {
            frameWidth: 46,
            frameHeight: 41
        });
        this.load.spritesheet('filebrowserOpen', "assets/os/Open.png", {
            frameWidth: 52,
            frameHeight: 51
        });
        this.load.spritesheet('filebrowserCopyUSB', "assets/os/Copy.png", {
            frameWidth: 93,
            frameHeight: 34
        });
        this.load.spritesheet('filebrowserFormatUSB', "assets/os/Format.png", {
            frameWidth: 38,
            frameHeight: 43
        });
        this.load.spritesheet('filebrowserEjectUSB', "assets/os/Eject.png", {
            frameWidth: 32,
            frameHeight: 27
        });
    }

    create() {
        this.bg = this.add.image(FileBrowser.X, FileBrowser.Y, 'filebrowserBG')
            .setOrigin(0, 0);
        this.buttonX = new SimpleButton(this, {
            'key': 'filebrowserButtonX',
            'up': 0,
            'over': 1,
            'x': FileBrowser.X + 729,
            'y': FileBrowser.Y + 46,
            'onDown': () => {this.scene.stop();}
        }).setOrigin(1, 0);
        this.buttonBack = new SimpleButton(this, {
            'key': 'filebrowserButtonBack',
            'up': 0,
            'over': 1,
            'x': FileBrowser.X + 75,
            'y': FileBrowser.Y + 60,
            'onDown': () => {this.loadParentPath();}
        }).setOrigin(0, 0);

        this.statusBarOpen = new SimpleButton(this, {
            'key': 'filebrowserOpen',
            'up': 0,
            'over': 1,
            'x': FileBrowser.X + 90,
            'y': FileBrowser.Y + 445,
            'onDown': () => {this.openCurrentSelection();},
            'deactivated': true
        }).setOrigin(0, 0);
        this.statusBarCopyUSB = new SimpleButton(this, {
            'key': 'filebrowserCopyUSB',
            'up': 0,
            'over': 1,
            'x': FileBrowser.X + 215,
            'y': FileBrowser.Y + 460,
            'onDown': () => {this.copyCurrentSelectionToUSB();},
            'deactivated': true
        }).setOrigin(0, 0);
        this.statusBarFormatUSB = new SimpleButton(this, {
            'key': 'filebrowserFormatUSB',
            'up': 0,
            'over': 1,
            'x': FileBrowser.X + 400,
            'y': FileBrowser.Y + 465,
            'onDown': () => {this.formatUSB();},
            'deactivated': true
        }).setOrigin(0, 0);
        this.statusBarEjectUSB = new SimpleButton(this, {
            'key': 'filebrowserEjectUSB',
            'up': 0,
            'over': 1,
            'x': FileBrowser.X + 560,
            'y': FileBrowser.Y + 485,
            'onDown': () => {this.ejectUSB();},
        }).setOrigin(0, 0);

        this.statusBar = {
            'open': new TextButton(this, FileBrowser.X + 10, FileBrowser.Y + this.bg.height, 'open', {}, () => {})
        }
        Object.values(this.statusBar).forEach(item => this.add.existing(item));

        //this.pathLabel = this.add.text(FileBrowser.X + 10, FileBrowser.Y + 40, '', {font: "25px Arial", fill:"black"});
        this.loadPath(this.path)
    }

    update() {
    }

    loadPath(path) {
        this.path = path
        this.pathContent.forEach(item => {
            item.labelText.destroy(); // another dirty hack, I'll think about this... elsewhen.
            item.destroy();
        });
        this.pathContent = [];
        this.lastClicked = null;

        var newContent = FileBrowser.Drive[path]
        if (!newContent) {
            return;
        }

        var counter = 0
        for(const [itemLabel, itemType] of Object.entries(newContent)) {
            let itemX = FileBrowser.contentX + FileBrowser.contentColSpacingX * (counter % FileBrowser.contentRowLength);
            let itemY = FileBrowser.contentY + FileBrowser.contentColSpacingY * (counter % FileBrowser.contentRowLength)
                      + FileBrowser.contentRowSpacing * Math.floor(counter / FileBrowser.contentRowLength);
            this.pathContent.push(
                new FileDoubleButton(this, itemX, itemY, itemLabel, itemType, () => {this.clickFile(path, itemLabel, itemType);})
            );
            counter++;
            if (counter == FileBrowser.maxContent) {
                break;
            }
        }
        this.update();
    }

    updateStatusBar(path, stateOpen, stateCopy, stateFormat, stateEject) {
        this.statusBarOpen.setActive(stateOpen);
        this.statusBarCopyUSB.setActive(stateCopy);
        this.statusBarFormatUSB.setActive(stateFormat);
        this.statusBarEjectUSB.setActive(stateEject);
    }

    loadParentPath() {
        if (this.path.length == 3) { // C:\ etc
            this.loadPath("My\ Computer");
        }
        else if (this.path != "My\ Computer") {
            this.loadPath(this.path.split('\\').slice(0, -2).join('\\') + '\\');
        }
    }

    clickFolder(path, folder) {
        let fullPath = path == "My Computer" ? folder : `${path}${folder}\\`.replace('\n', '');
        if (this.lastClicked != fullPath) {
            this.lastClicked = fullPath
            this.updateStatusBar(fullPath, true, false, true, true);
        }
        else {
            this.loadPath(fullPath);
            this.updateStatusBar(fullPath, false, false, true, true);
        }
    }

    clickFile(path, file, type) {
        if (['folder', 'drive', 'usb'].includes(type)) {
            this.clickFolder(path, file);
            return;
        }

        let fullPath = `${path}${file}`;
        if (this.lastClicked != fullPath) {
            this.lastClicked = fullPath
            this.updateStatusBar(fullPath, true, true, true, true);
        }
        else {
            this.updateStatusBar(fullPath, false, false, true, true)
            switch (type) {

                case 'file':
                    console.log(`file ${fullPath}`)
                    break;

                case 'moviefile':
                    console.log(`movie ${fullPath}`)
                    this.openMoviePlayer(fullPath);
                    break;

            }
            this.lastClicked = null
        }
    }

    getFileName(fullPath) {
        let pathParts = fullPath.split('\\');
        return pathParts[pathParts.length - 1];
    }

    openCurrentSelection() {
        console.log('would do somethign, but just use the double click');
    }

    copyCurrentSelectionToUSB() {
        let fileToCopy = this.getFileName(this.lastClicked);
        console.log(`copy ${fileToCopy}`);

        if (!this.parent.usbState.content.includes(fileToCopy)) {
            // this would need to check the filesize, the usb drive size and its formatting... anyway.
            this.parent.usbState.content.push(fileToCopy)
        }
        else {
            console.log(`file ${fileToCopy} already on USB drive!`);
        }
    }

    formatUSB() {
        console.log('would open the Format USB dialog')
    }

    ejectUSB() {
        let youWonTheGame = false;
        let infoMessage = youWonTheGame ? 'Your mom is pleased!' : 'Wrong! Your Mom beats the shit out of you!'
        let contentMessage = this.parent.usbState.content.length == 0 ? '(nothing.)' : '';
        if (this.parent.usbState.content.length > 0) {
            for (let count = 0; count < 7; ++count) {
                if (count == 6) {
                    contentMessage += '... and more';
                    break;
                }
                contentMessage += this.parent.usbState.content[count];
                if (count == this.parent.usbState.content.length - 1) {
                    break;
                }
                contentMessage += ', '
                if (count == 2) {
                    contentMessage += '\n'
                }
            }
        }
        this.scene.launch('InfoMessage', {
            'parent': this,
            'message': `Ejected USB drive, the content is:\n${contentMessage}\n\n${infoMessage}`,
            'messageDeltaX': 30,
            'deltaX': Phaser.Math.Between(-400, 400),
            'deltaY': Phaser.Math.Between(-200, 200),
        });
    }

    openMoviePlayer(path) {
        this.scene.launch('ErrorMessage', {
            'parent': this,
            'message': 'MoviePlayer++ v.9 requires update\nor else you will get murdered\nwith a chainsaw...\nand rightfully so!',
            'buttons': [
                {text: 'Update', deltaX: -120, deltaY: 0, onDown: () => {
                    this.askForPermissionToDisableFirewall();
                }},
                {text: 'No Thx!', deltaX: 120, deltaY: 0, onDown: () => {
                    console.log("no update");
                }},
            ],
            'deltaX': Phaser.Math.Between(-400, 400),
            'deltaY': Phaser.Math.Between(-200, 200),
        });
    }

    askForPermissionToDisableFirewall() {
        this.scene.launch('ConfirmMessage', {
            'parent': this,
            'message': 'MoviePlayer++ Update requires to\nSWITCH OFF your firewall!\nThis is really totally absolutely truly normal!\n\nDo it?',
            'deltaX': Phaser.Math.Between(-400, 400),
            'deltaY': Phaser.Math.Between(-200, 200),
            'messageHandler': (confirmed) => {
                if(confirmed) {
                    this.parent.firewallRunning = false;
                }
            }
        });
    }

}
