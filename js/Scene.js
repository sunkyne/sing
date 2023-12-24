class Scene extends Phaser.Scene {
    constructor() {
        super("playGame");
    }


    preload() {
        for (let i = 0; i <= 12; i++) {
            this.load.image(`person${i}`, `assets/images/person${i}.png`);
        }
        this.rows = 3;
        this.cols = 4;
        console.log("Preloaded images");

        this.context = new AudioContext();
        this.oscillator = null;
        this.gainNode = this.context.createGain();
        console.log("Initialized theremin");
    }

    create() {
        this.face = this.add.image(0, this.sys.game.config.height, 'person0').setOrigin(0, 1);
        this.face.setScale(0.4);
        console.log("Created image");

        this.input.on('pointerdown', this.handleMouseDown, this);
        this.input.on('pointerup', this.handleMouseUp, this);
    }
    
    update() {
        if (this.mouseDown) {
            this.updateFace();
            this.updateSound();
        }
    }

    handleMouseDown(pointer) {
        this.mouseDown = true;

        this.oscillator = this.context.createOscillator();
        this.oscillator.type = "triangle" // "sine" "square" "sawtooth" "triangle"
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
}