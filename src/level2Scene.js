class Level2Scene extends Phaser.Scene {
    constructor() {
        super({ key: 'Level2Scene' });
        this.lives = 3;
        this.score = 0;
    }

    init(data) {
        this.lives = data.lives || 3;
        this.score = data.score || 0;
    }

    preload() {
        this.load.image('background', 'assets/background/blue-preview.png?v=2');
        this.load.spritesheet('dino', 'assets/sprites/dnosa.png?v=2', { frameWidth: 16, frameHeight: 16 });
        this.load.image('coin', 'assets/sprites/coinGold.png?v=2');
        this.load.image('spike', 'assets/sprites/spikes.png?v=2');
        this.load.tilemapTiledJSON('level2', 'assets/tilemaps/map2-joel.json?v=2');
        this.load.image('tiles', 'assets/tilesets/MorningSheet.png?v=2');
        this.load.spritesheet('enemy', 'assets/sprites/programmerArt.png?v=2', { frameWidth: 16, frameHeight: 16 });
    }

    create() {
        // Mapa
        const map = this.make.tilemap({ key: 'level2' });
        const tileset = map.addTilesetImage('MorningSheet', 'tiles');
        const spikeTileset = map.addTilesetImage('spikes', 'spike');

        // Fons
        this.add.image(-77.3656957928802, -145.566343042071, 'background').setOrigin(0).setScrollFactor(0);

        // Capes
        const platformLayer = map.createLayer('terra', tileset, 0, 0);
        const coinLayer = map.createLayer('monedes', tileset, 0, 0);
        const spikeLayer = map.createLayer('spikes', spikeTileset, 0, 0);

        // Depuració: Comprovar IDs dels tiles a la capa terra
        console.log('Tiles usats a terra:', platformLayer.getTilesWithin().map(tile => tile.index).filter(index => index > 0));

        // Col·lisions per al terra
        platformLayer.setCollision([11, 12, 13, 14, 21, 22, 23, 24, 31, 32, 33, 34, 41, 42, 43, 44]);

        // Animacions del dinosaure
        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers('dino', { start: 0, end: 1 }),
            frameRate: 4,
            repeat: -1
        });
        this.anims.create({
            key: 'jump',
            frames: this.anims.generateFrameNumbers('dino', { start: 8, end: 9 }),
            frameRate: 4,
            repeat: 0
        });

        // Animació de l'enemic
        this.anims.create({
            key: 'enemy_walk',
            frames: this.anims.generateFrameNumbers('enemy', { start: 13, end: 19 }),
            frameRate: 10,
            repeat: -1
        });

        // Jugador (dinosaure)
        this.player = this.physics.add.sprite(100, 200, 'dino');
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);
        this.player.setScale(1);
        this.player.setVisible(true);
        this.player.anims.play('idle', true);
        this.physics.add.collider(this.player, platformLayer);

        // Enemic
        this.enemy = this.physics.add.sprite(208, 256, 'enemy');
        this.enemy.setScale(1);
        this.enemy.setVelocityX(50); // Velocitat inicial cap a la dreta
        this.enemy.anims.play('enemy_walk', true);
        this.physics.add.collider(this.enemy, platformLayer);
        this.physics.add.collider(this.player, this.enemy, (player, enemy) => {
            this.lives -= 1;
            this.livesText.setText(`Vides: ${this.lives}`);
            if (this.lives <= 0) {
                this.scene.start('StartScene');
            } else {
                this.player.setPosition(100, 200);
                this.player.anims.play('idle', true);
            }
        });

        // Monedes com a sprites dinàmics
        this.coins = this.physics.add.group();
        coinLayer.forEachTile(tile => {
            if (tile.index === 37) {
                const coin = this.coins.create(tile.pixelX + 8, tile.pixelY + 8, 'coin');
                coin.setScale(1);
                coin.body.allowGravity = false;
                coinLayer.removeTileAt(tile.x, tile.y);
                console.log('Moneda creada a:', tile.pixelX, tile.pixelY);
            }
        });
        this.physics.add.overlap(this.player, this.coins, (player, coin) => {
            coin.destroy();
            this.score += 10;
            this.scoreText.setText(`Puntuació: ${this.score}`);
        });

        // Espigues com a sprites dinàmics
        this.spikes = this.physics.add.group({ immovable: true, allowGravity: false });
        spikeLayer.forEachTile(tile => {
            if (tile.index === 51) {
                const spike = this.spikes.create(tile.pixelX + 8, tile.pixelY + 8, 'spike');
                spike.setScale(1);
                spike.setFrame(0);
                spike.body.setSize(16, 16);
                spikeLayer.removeTileAt(tile.x, tile.y);
                console.log('Espiga creada a:', tile.pixelX, tile.pixelY);
            }
        });
        console.log('Tiles usats a spikes:', spikeLayer.getTilesWithin().map(tile => tile.index).filter(index => index > 0));
        this.physics.add.collider(this.player, this.spikes, (player, spike) => {
            this.lives -= 1;
            this.livesText.setText(`Vides: ${this.lives}`);
            if (this.lives <= 0) {
                this.scene.start('StartScene');
            } else {
                this.player.setPosition(100, 200);
                this.player.anims.play('idle', true);
            }
        });

        // Càmera
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        // Text de vides i puntuació
        this.livesText = this.add.text(16, 16, `Vides: ${this.lives}`, { fontSize: '16px', color: '#fff' }).setScrollFactor(0);
        this.scoreText = this.add.text(16, 40, `Puntuació: ${this.score}`, { fontSize: '16px', color: '#fff' }).setScrollFactor(0);

        // Límits del món
        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    }

    update() {
        // Controls del jugador
        const cursors = this.input.keyboard.createCursorKeys();
        if (cursors.left.isDown) {
            this.player.setVelocityX(-160);
            this.player.anims.play('idle', true);
            this.player.flipX = true;
        } else if (cursors.right.isDown) {
            this.player.setVelocityX(160);
            this.player.anims.play('idle', true);
            this.player.flipX = false;
        } else {
            this.player.setVelocityX(0);
            this.player.anims.play('idle', true);
        }
        if (cursors.up.isDown && this.player.body.blocked.down) {
            this.player.setVelocityY(-200);
            this.player.anims.play('jump', true);
        }

        // Moviment de l'enemic
        if (this.enemy.x >= 384) {
            this.enemy.setVelocityX(-50);
            this.enemy.flipX = true;
            this.enemy.anims.play('enemy_walk', true);
        } else if (this.enemy.x <= 208) {
            this.enemy.setVelocityX(50);
            this.enemy.flipX = false;
            this.enemy.anims.play('enemy_walk', true);
        }

        // Assegura visibilitat
        this.player.setVisible(true);
        this.enemy.setVisible(true); // Forçar visibilitat de l'enemic

        // Actualitza text
        this.livesText.setText(`Vides: ${this.lives}`);
        this.scoreText.setText(`Puntuació: ${this.score}`);

        // Transició al final
        if (this.player.x >= this.physics.world.bounds.width - 16) {
            this.scene.start('GameOverScene', { score: this.score, lives: this.lives });
        }
    }
}