class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOverScene' });
    }

    create() {
        this.add.text(400, 300, 'Joc Acabat! Prem ESPAI per reiniciar', {
            fontSize: '32px',
            fill: '#fff'
        }).setOrigin(0.5);

        this.input.keyboard.on('keydown-SPACE', () => {
            this.scene.start('StartScene');
        });
    }
}