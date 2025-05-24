let lives = 3; // Sistema de vides
let score = 0; // Puntuació per monedes

const config = {
    type: Phaser.AUTO,
    width: 640, // 40 tiles * 16 píxels
    height: 320, // 20 tiles * 16 píxels
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: { gravity: { y: 300 } }
    },
    scene: [StartScene, Level1Scene, Level2Scene, GameOverScene],
    scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH }
};

const game = new Phaser.Game(config);