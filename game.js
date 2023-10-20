let game;
let debugGraphics;

const gameOptions = {
    SamuraiGravity: 800,
    SamuraiSpeed: 300
}
window.onload = function() {
    let gameConfig = {
        type: Phaser.AUTO,
        scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH,
            width: 1920,
            height: 1080,
        },
        pixelArt: true,
        physics: {
            default: "arcade",
            arcade: {
                gravity: {
                    y: 0
                },
                // debug: true
            }
        },
        scene: PlayGame
    }

    game = new Phaser.Game(gameConfig)
    window.focus();
}
class PlayGame extends Phaser.Scene {

    constructor() {
        super("PlayGame")
        this.score = 0;
    }


    preload() {
        this.load.image('background', 'background.jpg');
        this.load.spritesheet("Samurai", "Samurai/Idle.png", {frameWidth: 128, frameHeight: 128})
        this.load.spritesheet("SRight", "Samurai/Run.png",{frameWidth: 128, frameHeight: 128})
        this.load.spritesheet("SLeft", "Samurai/RunBack.png",{frameWidth: 128, frameHeight: 128})
        this.load.spritesheet("JRight", "Samurai/Jump.png",{frameWidth: 128, frameHeight: 128})
        this.load.spritesheet("JLeft", "Samurai/JumpBack.png",{frameWidth: 128, frameHeight: 128})
        this.load.spritesheet("attackR", "Samurai/Attack_1R.png",{frameWidth: 128, frameHeight: 128})
        this.load.spritesheet("attackL", "Samurai/Attack_1L.png",{frameWidth: 128, frameHeight: 128})
        this.load.image('heart', 'heart.png')
        this.load.image('ground', 'tile.png')
        this.load.image('coin', 'coin.png')
        // this.load.image('right', 'right.png')
        // this.load.image('left', 'left.png')

        this.load.spritesheet("Ghost", "ghostGold.png", {frameWidth: 231, frameHeight: 312})
    }

    create() {
        this.add.image(0, 0, 'background').setOrigin(0, 0);
        this.groundGroup = this.physics.add.group({
            immovable: true,
            allowGravity: false
        })
        this.enemies = this.physics.add.group({
            allowGravity: false
        })
        this.coinGroup = this.physics.add.group({
        })
        //Add the number of ghost wich will be spawned at the begining, it would not affect continuosly spawning 
        const quant_ghost = 3


        this.hitpointsGroup = this.physics.add.group({
            allowGravity: false
        })
        this.hitpoints1 = this.physics.add.sprite(150, 100, 'heart')
        this.hitpoints1.setScale(0.05, 0.05)
        this.hitpoints2 = this.physics.add.sprite(250, 100, 'heart')
        this.hitpoints2.setScale(0.05, 0.05)
        this.hitpoints3 = this.physics.add.sprite(350, 100, 'heart')
        this.hitpoints3.setScale(0.05, 0.05)
        this.hitpointsGroup.add(this.hitpoints1)
        this.hitpointsGroup.add(this.hitpoints2)
        this.hitpointsGroup.add(this.hitpoints3)




        this.AddGhost(0,quant_ghost,3000)


        this.cursors = this.input.keyboard.createCursorKeys()

        this.Samurai = this.physics.add.sprite(422, 610, "Samurai")
        this.Samurai.body.gravity.y = gameOptions.SamuraiGravity
        this.physics.add.collider(this.Samurai, this.groundGroup)
        this.Samurai.setScale(2, 2)
        this.Samurai.setSize(32, 80)
        this.Samurai.setOffset(48, 48)

        this.scoreText = this.add.text(50, 75, "0", {fontSize: "50px", fill: "#ffffff"})
        this.text1 = this.add.text(450, 75, "0", {fontSize: "45px", fill: "#ffffff"})
        this.text1.setText("Cursors to move, A - attack left, D - attack right")
        setTimeout(() => {
            this.text1.destroy()
        },5000)


        this.ground1 = this.physics.add.sprite(960, 900, 'ground');
        this.ground1.setScale(10,0.01)
        this.groundGroup.add(this.ground1)
        this.ground2 = this.physics.add.sprite(422, 810, 'ground');
        this.ground2.setScale(0.55,1)
        this.groundGroup.add(this.ground2)
        this.ground3 = this.physics.add.sprite(0, 540, 'ground');
        this.ground3.setScale(0.01,10)
        this.groundGroup.add(this.ground3)
        this.ground4 = this.physics.add.sprite(1920, 540, 'ground');
        this.ground4.setScale(0.01,10)
        this.groundGroup.add(this.ground4)
        this.physics.add.collider(this.enemies, this.enemies)

        this.attackHitboxR = this.physics.add.sprite(this.Samurai.x+80, this.Samurai.y+40, 'ground')
        this.attackHitboxR.setSize(200,160)
        
        
        this.attackHitboxL = this.physics.add.sprite(this.Samurai.x-80, this.Samurai.y+40, 'ground')
        this.attackHitboxL.setSize(200,160)

        this.SamuraiHitbox = this.physics.add.sprite(this.Samurai.x,this.Samurai.y, 'ground')
        this.SamuraiHitbox.setSize(40,60)

        this.physics.add.collider(this.SamuraiHitbox, this.enemies, () => {
            const hits = this.hitpointsGroup.getChildren()
            const lasthit = hits[0]
            setTimeout(() => {
                this.hitpointsGroup.remove(lasthit,true,true)
            },500)


        })
        this.physics.add.overlap(this.Samurai, this.coinGroup, this.collectCoin, null, this)

        this.physics.add.collider(this.coinGroup, this.groundGroup)


        this.anims.create({
            key: "left",
            frames: this.anims.generateFrameNumbers("SLeft", {start: 7, end: 0}),
            frameRate: 10,
            repeat: -1
        })
        this.anims.create({
            key: "stay",
            frames: this.anims.generateFrameNumbers("Samurai", {start: 0, end: 5}),
            frameRate: 10,
            repeat: -1
        })

        this.anims.create({
            key: "right",
            frames: this.anims.generateFrameNumbers("SRight", {start: 0, end:7 }),
            frameRate: 10,
            repeat: -1
        })

        this.anims.create({
            key: "attackR",
            frames: this.anims.generateFrameNumbers("attackR", {start: 0, end:5 }),
            frameRate: 10,
            repeat: 0
        })
        this.anims.create({
            key: "attackL",
            frames: this.anims.generateFrameNumbers("attackL", {start: 5, end:0 }),
            frameRate: 10,
            repeat: 0
        })
        this.input.keyboard.on('keydown-A', this.AttackL, this)
        this.input.keyboard.on('keydown-D', this.AttackR, this)

    }
    AddGhost(index, max, delay) {
        if (index<max) {
            this.ghost = this.physics.add.sprite(960, 540, 'Ghost');
            this.ghost.setScale(0.5, 0.5)
            this.ghost.setSize(115, 156)
            this.ghost.setOffset(48, 48)
            this.enemies.add(this.ghost)

            index++

            setTimeout(() => {
                this.AddGhost(index, max, delay);
              }, delay);
        }
    }
    AddCoin() {
        this.coin = this.physics.add.sprite(100+Math.random()*1820, 0, 'coin')
        this.coinGroup.add(this.coin)
        this.coin.body.gravity.y = gameOptions.SamuraiGravity/5

    }
    AttackL() {
        this.attack = true
        this.enemies.getChildren().forEach(ghost => {
            const overlapL = this.physics.overlap(this.attackHitboxL, ghost, () => {
                setTimeout(() => {
                    this.enemies.remove(ghost, true, true)
                    this.AddCoin()
                },300)
            },null, this)
        })
        this.Samurai.anims.play("attackL", true)
        setTimeout(() => {
            this.attack = false
        },700)
    }
    AttackR() {
        this.attack = true
        this.enemies.getChildren().forEach(ghost => {
            const overlapR  = this.physics.overlap(this.attackHitboxR, ghost, () => {
                setTimeout(() => {
                    this.enemies.remove(ghost, true, true)
                    this.AddCoin()
                },300)
            })
            setTimeout(() => {
            },300)
        })
        this.Samurai.anims.play("attackR", true)
        setTimeout(() => {
            this.attack = false
        },700)
    }
    collectCoin(Samurai, start) {
        start.destroy()
        this.score+=1
        this.scoreText.setText(this.score)
    }
    update() {
        if(this.hitpointsGroup.getLength() == 0) {
            this.score = 0
            this.scene.start("PlayGame")
        }
        if(this.cursors.left.isDown) {
            this.Samurai.body.velocity.x = -gameOptions.SamuraiSpeed
            if(!this.attack){
                this.Samurai.anims.play("left", true)
            }
       }
        else if(this.cursors.right.isDown) {
            this.Samurai.body.velocity.x = gameOptions.SamuraiSpeed
            if(!this.attack){
                this.Samurai.anims.play("right", true)
            }
        }
        else  {
            this.Samurai.body.velocity.x = 0
            if(!this.attack){
                this.Samurai.anims.play("stay", true)
            }
        }
        if(this.cursors.up.isDown && this.Samurai.body.touching.down) {
            this.Samurai.body.velocity.y = -gameOptions.SamuraiGravity / 1.2
        }

        if(this.Samurai.y > game.config.height || this.Samurai.y < 0) {
            this.scene.start("PlayGame")
        }
        this.SamuraiHitbox.x = this.Samurai.x
        this.SamuraiHitbox.y = this.Samurai.y+20
        this.attackHitboxR.x = this.Samurai.x+64
        this.attackHitboxR.y = this.Samurai.y+40
        this.attackHitboxL.x = this.Samurai.x-64
        this.attackHitboxL.y = this.Samurai.y+40
        if(this.enemies.getLength()>0) {
            this.enemies.getChildren().forEach(ghost => {
                    const playerX = this.Samurai.x;
                    const playerY = this.Samurai.y;
                    const GhostX = ghost.x;
                    const GhostY = ghost.y;
                
                    const angle = Phaser.Math.Angle.Between(GhostX, GhostY, playerX, playerY);
                    const GhostSpeed = 100;
                    try {
                        setTimeout(function() {
                            ghost.setVelocityX(Math.cos(angle) * GhostSpeed);
                            ghost.setVelocityY(Math.sin(angle) * GhostSpeed);
                        }, 1000)
                    } catch(error) {}
                
            })
        } else {
            this.AddGhost(0, 3, 3000)
        }
    
    
    }

}