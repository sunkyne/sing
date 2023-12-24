class Scene extends Phaser.Scene {
    constructor() {
        super("playGame");
    }


    preload() {
        for (let i = 0; i <= 12; i++) {
            this.load.image(`person${i}`, `assets/images/person${i}.png`);
        }
        this.load.image("instructions", "assets/images/instructions.png");
        console.log("Preloaded images");

        this.rows = 3;
        this.cols = 4;

        this.context = new AudioContext();
        this.oscillator = null;
        this.gainNode = this.context.createGain();
        this.type = "sine";
        console.log("Initialized theremin");
    }

    create() {
        const width = this.sys.game.config.width
        const height = this.sys.game.config.height

        this.face = this.add.image(0, height, 'person0').setOrigin(0, 1);
        this.face.setScale(height / this.face.height * 0.4);

        this.instruct = this.add.image(width, height, "instructions").setOrigin(0.8, 1);
        this.instruct.setScale(height / this.instruct.height * 0.3);
        console.log("Created images");

        this.input.on('pointerdown', this.handleMouseDown, this);
        this.input.on('pointerup', this.handleMouseUp, this);

        this.key1 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE);
        this.key2 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TWO);
        this.key3 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.THREE);
        this.key4 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.FOUR);
    }
    
    update() {
        if (this.mouseDown) {
            this.updateFace();
            this.updateSound();
        }
        this.updateWave();
    }

    handleMouseDown(pointer) {
        this.mouseDown = true;

        this.oscillator = this.context.createOscillator();
        this.oscillator.type = this.type;
        this.oscillator.frequency.setTargetAtTime(this.calculateFrequency(), this.context.currentTime, 0.01);
        this.gainNode.gain.setTargetAtTime(this.calculateGain(), this.context.currentTime, 0.01);
        this.oscillator.connect(this.gainNode);
        this.gainNode.connect(this.context.destination)
        this.oscillator.start(this.context.currentTime);
    }

    handleMouseUp(pointer) {
        this.mouseDown = false;

        this.face.x = 0;
        this.face.y = this.sys.game.config.height;
        this.face.setOrigin(0, 1);
        this.face.setTexture(`person0`);

        if (this.oscillator) {
            this.oscillator.stop(this.context.currentTime);
            this.oscillator.disconnect();
        }
    }

    updateFace() {
        var x = this.input.x;
        var y = this.input.y;

        const sectionWidth = this.sys.game.config.width / this.cols;
        const sectionHeight = this.sys.game.config.height / this.rows;

        const col = Math.floor(x / sectionWidth);
        const row = this.rows - Math.floor(y / sectionHeight) - 1;
        
        const i = row + this.rows * col + 1;

        this.face.setTexture(`person${i}`);
        this.face.setOrigin(0, 0.5);
        this.face.y = y;
    }

    calculateFrequency() {
        const minFrequency = 80,
            maxFrequency = 392;
        
        const height = this.sys.game.config.height
        return (((height-this.input.y) / height) * maxFrequency) + minFrequency;
    };

    calculateGain() {
        const minGain = 0,
            maxGain = 1;
        
        const width = this.sys.game.config.width
        return (((this.input.x) / width) * maxGain) + minGain;
    };

    updateSound() {
        this.oscillator.frequency.setTargetAtTime(this.calculateFrequency(), this.context.currentTime, 0.01);
        this.gainNode.gain.setTargetAtTime(this.calculateGain(), this.context.currentTime, 0.01);
    }

    updateWave() {
        if (this.key1.isDown) {
            console.log('Sine wave');
            this.type = "sine";
        }
        if (this.key2.isDown) {
            console.log('Square wave');
            this.type = "square";
        }
        if (this.key3.isDown) {
            console.log('Sawtooth wave');
            this.type = "sawtooth";
        }
        if (this.key4.isDown) {
            console.log('Triangle wave');
            this.type = "triangle";
        }
    }
}