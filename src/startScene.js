class StartScene extends Phaser.Scene {
    constructor() {
        super({ key: 'StartScene' });
    }

    preload() {
        this.load.image('background', 'assets/background/blue-preview.png');
        this.load.audio('music', 'assets/music/uaauaa.mp3');
    }

    create() {
        // Fons
        this.add.image(320, 160, 'background').setOrigin(0.5);

        // Música
        if (!this.sound.get('music')) { // Evita múltiples instàncies
            const music = this.sound.add('music', { loop: true });
            music.play();
        }

        this.add.text(320, 100, 'Dino DESTROYER', { fontSize: '48px', color: '#fff' }).setOrigin(0.5);
        this.add.text(320, 180, 'Prem ESPAI per començar', { fontSize: '24px', color: '#fff' }).setOrigin(0.5);

        this.input.keyboard.on('keydown-SPACE', () => {
            lives = 3; // Reinicia les vides
            score = 0; // Reinicia la puntuació
            this.scene.start('Level1Scene');
        });
    }
}