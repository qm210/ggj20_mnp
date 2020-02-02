var config = {
    width: 1600,
    height: 900,
    backgroundColor: 0x000000,
    scene: [Main, FileBrowser, FormatDialog, Firewall, InfoMessage, ConfirmMessage, ErrorMessage],
    type: Phaser.WEBGL,
};

var game = new Phaser.Game(config);
