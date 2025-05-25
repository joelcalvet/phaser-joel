class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOverScene' });
    }

    init(data) {
        this.score = data.score || 0;
        this.lives = data.lives || 0;
        console.log('GameOverScene data:', data); // Depuració
    }

    preload() {
        this.load.image('background', 'assets/background/blue-preview.png?v=3');
    }

    create() {
        // Fons
        this.add.image(320, 160, 'background').setOrigin(0.5);

        // Vides i puntuació
        this.add.text(16, 16, `Vides: ${this.lives}`, {
            fontSize: '16px',
            color: '#fff'
        });
        this.add.text(16, 40, `Puntuació: ${this.score}`, {
            fontSize: '16px',
            color: '#fff'
        });

        // Textos centrals
        this.add.text(320, 100, 'Has completat el joc!', {
            fontSize: '48px',
            color: '#fff'
        }).setOrigin(0.5);
        this.add.text(320, 180, 'Prem ESPAI per reiniciar', {
            fontSize: '24px',
            color: '#fff'
        }).setOrigin(0.5);

        // Reiniciar amb ESPAI
        this.input.keyboard.on('keydown-SPACE', () => {
            this.scene.start('StartScene');
        });
    }
}