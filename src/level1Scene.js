class Level1Scene extends Phaser.Scene {
    constructor() {
        super({ key: 'Level1Scene' });
    }

    preload() {
        this.load.image('background', 'assets/background/blue-preview.png');
        this.load.spritesheet('dino', 'assets/sprites/dnosa.png', { frameWidth: 16, frameHeight: 16 });
        this.load.image('coin', 'assets/sprites/coinGold.png');
        this.load.image('spike', 'assets/sprites/spikes.png');
        this.load.tilemapTiledJSON('level1', 'assets/tilemaps/map-joel.json');
        this.load.image('tiles', 'assets/tilesets/MorningSheet.png');
    }

    create() {
        // Mapa
        const map = this.make.tilemap({ key: 'level1' });
        const tileset = map.addTilesetImage('MorningSheet', 'tiles');
        const spikeTileset = map.addTilesetImage('spikes', 'spike');

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
            frames: this.anims.generateFrameNumbers('dino', { start: 0, end: 1 }), // Fila 1: 2 frames
            frameRate: 4,
            repeat: -1
        });
        this.anims.create({
            key: 'jump',
            frames: this.anims.generateFrameNumbers('dino', { start: 8, end: 9 }), // Fila 3: 2 frames
            frameRate: 4,
            repeat: 0
        });

        // Jugador (dinosaure)
        this.player = this.physics.add.sprite(100, 100, 'dino');
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);
        this.player.setScale(1); // Mida 16x16 píxels
        this.player.setVisible(true);
        this.player.anims.play('idle', true);
        this.physics.add.collider(this.player, platformLayer);

        // Monedes com a sprites dinàmics
        this.coins = this.physics.add.group();
        coinLayer.forEachTile(tile => {
            if (tile.index === 37) {
                const coin = this.coins.create(tile.pixelX + 8, tile.pixelY + 8, 'coin');
                coin.setScale(1);
                coin.body.allowGravity = false;
                coinLayer.removeTileAt(tile.x, tile.y);
            }
        });
        this.physics.add.overlap(this.player, this.coins, (player, coin) => {
            coin.destroy();
            score += 10;
            console.log(`Puntuació: ${score}`);
        });

        // Espigues com a sprites dinàmics (només tile ID 51)
        this.spikes = this.physics.add.group({ immovable: true, allowGravity: false });
        spikeLayer.forEachTile(tile => {
            if (tile.index === 51) {
                const spike = this.spikes.create(tile.pixelX + 8, tile.pixelY + 8, 'spike');
                spike.setScale(1);
                spike.setFrame(0); // Primer frame de spikes.png
                spike.body.setSize(16, 16); // Mida de col·lisió
                spikeLayer.removeTileAt(tile.x, tile.y);
                console.log('Espiga creada a:', tile.pixelX, tile.pixelY, 'ID:', tile.index); // Depuració
            }
        });
        console.log('Tiles usats a spikes:', spikeLayer.getTilesWithin().map(tile => tile.index).filter(index => index > 0));
        this.physics.add.collider(this.player, this.spikes, (player, spike) => {
            lives -= 1;
            console.log(`Col·lisió amb espiga! Vides restants: ${lives}`);
            if (lives <= 0) {
                this.scene.start('StartScene');
            } else {
                this.player.setPosition(100, 100);
                this.player.anims.play('idle', true);
            }
        });

        // Càmera
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        // Text de vides i puntuació
        this.livesText = this.add.text(16, 16, `Vides: ${lives}`, { fontSize: '16px', color: '#fff' }).setScrollFactor(0);
        this.scoreText = this.add.text(16, 40, `Puntuació: ${score}`, { fontSize: '16px', color: '#fff' }).setScrollFactor(0);

        // Límits del món
        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    }

    update() {
        // Controls
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

        // Assegura visibilitat
        this.player.setVisible(true);

        // Actualitza text
        this.livesText.setText(`Vides: ${lives}`);
        this.scoreText.setText(`Puntuació: ${score}`);

        // Transició al següent món
        if (this.player.x >= this.physics.world.bounds.width - 16) {
            this.scene.start('Level2Scene', { lives: this.lives, score: this.score });
        }
    }
}