class FileBrowser extends Phaser.Scene {

    static X = 200;
    static Y = 100;
    static contentX = FileBrowser.X + 40;
    static contentY = FileBrowser.Y + 90;
    static contentRowLength = 5;
    static contentSpacing = 110;

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
            "porniporn.avi": 'moviefile',
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
            "Browser-\nHistory.xml": 'file'
        },
        "C:\\System\\": {
            "sys.dll": 'file',
            "boot.inf": 'file',
            "lib.so": 'file',
            "lib.so.o": 'file',
            "README.txt": 'file',
            "CMakeCache.txt": 'file',
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
        this.load.image('filebrowserBG', "assets/os/filebrowserBG.png");
        this.load.spritesheet('filebrowserButtonX', "assets/os/filebrowserButtonX.png", {
            frameWidth: 48,
            frameHeight: 43
        });
        this.load.spritesheet('filebrowserButtonBack', "assets/os/filebrowserButtonBack.png", {
            frameWidth: 38,
            frameHeight: 38
        });
    }

    create() {
        this.bg = this.add.image(FileBrowser.X, FileBrowser.Y, 'filebrowserBG')
            .setOrigin(0, 0);
        this.buttonX = new SimpleButton(this, {
            'key': 'filebrowserButtonX',
            'up': 0,
            'over': 1,
            'down': 2,
            'x': FileBrowser.X + this.bg.width,
            'y': FileBrowser.Y,
            'onDown': () => {this.scene.stop();}
        }).setOrigin(1, 0);
        this.buttonBack = new SimpleButton(this, {
            'key': 'filebrowserButtonBack',
            'up': 0,
            'over': 1,
            'down': 2,
            'x': FileBrowser.X,
            'y': FileBrowser.Y,
            'onDown': () => {this.loadParentPath();}
        }).setOrigin(0, 0);

        this.statusBar = {
            'open': new TextButton(this, FileBrowser.X + 10, FileBrowser.Y + this.bg.height, 'open', {}, () => {})
        }
        Object.values(this.statusBar).forEach(item => this.add.existing(item));

        this.pathLabel = this.add.text(FileBrowser.X + 10, FileBrowser.Y + 40, '', {font: "25px Arial", fill:"black"});
        this.loadPath(this.path)
    }

    update() {
    }

    loadPath(path) {
        console.log(`load ${path}`)
        this.path = path
        this.pathLabel.setText(path)
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
        console.log(newContent)

        var counter = 0
        for(const [itemLabel, itemType] of Object.entries(newContent)) {
            let itemX = FileBrowser.contentX + FileBrowser.contentSpacing * (counter % FileBrowser.contentRowLength);
            let itemY = FileBrowser.contentY + FileBrowser.contentSpacing * Math.floor(counter / FileBrowser.contentRowLength);
            this.pathContent.push(
                new FileButton(this, itemX, itemY, itemLabel, itemType, () => {this.clickFile(path, itemLabel, itemType);})
            );
            counter++
        }
        this.update();
    }

    updateStatusBar(path) {
        console.log(`update ${path}`)
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
            this.updateStatusBar(fullPath);
        }
        else {
            this.loadPath(fullPath);
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
            this.updateStatusBar(fullPath);
        }
        else {
            switch (type) {

                case 'file':
                    console.log(`file ${fullPath}`)
                    break;

                case 'moviefile':
                    console.log(`movie ${fullPath}`)
                    this.openMoviePlayer(fullPath)
                    break;

            }
        }
    }

    openMoviePlayer(path) {
        this.scene.launch('ErrorMessage', {
            'parent': this,
            'message': 'MoviePlayer++ v.9 requires update\nor else you will get murdered\nwith a chainsaw!\n(and also deserve it)',
            'buttons': [
                {text: 'Update', deltaX: -120, deltaY: 0, onDown: () => {
                    console.log("update");
                }},
                {text: 'No Thx!', deltaX: 120, deltaY: 0, onDown: () => {
                    console.log("no update");
                }},
            ],
            'deltaX': Phaser.Math.Between(-400, 400),
            'deltaY': Phaser.Math.Between(-200, 200),
        });
    }

}
