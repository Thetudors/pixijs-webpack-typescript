import * as PIXI from 'pixi.js';
import gsap from 'gsap';
import particles = require('pixi-particles');
import PixiFps from "pixi-fps";

const fpsCounter :PixiFps = new PixiFps();
var size = [1920, 1080];
var ratio = size[0] / size[1];
interface AppParams {
    containerId: string,
    canvasWidth: number,
    canvasHeight: number,
}
let buttonTextStyle = {
    fontFamily: 'Arial',
    fontSize: 60,
    fill: 0xffffff,
    align: 'center'
}
let randomTextStyle = {
    fontFamily: 'Arial',
    fontSize: 25,
    fill: 0x000000,
    align: 'center'
}
let taskOneContainer: PIXI.Container;
let taskTwoContainer: PIXI.Container;
let taskThreeContainer: PIXI.ParticleContainer = new PIXI.ParticleContainer();

//TaskOne Props
let cards: PIXI.Sprite[] = [];
const cardCount: number = 144;
let cardCounter: number = 0;
let cardTween: gsap.core.Tween;

//TaskTwo Props
let taskTwoInterval: any;
let textureCount: number = 7;

//TaskThree Props
const fireParticleConfig : particles.EmitterConfig = {
    alpha: {
        list: [
            {
                value: 0.75,
                time: 0
            },
            {
                value: 0,
                time: 1
            }
        ],
        isStepped: false
    },
    scale: {
        list: [
            {
                value: 0.4,
                time: 0
            },
            {
                value: 0.8,
                time: 1
            }
        ],
        isStepped: false
    },
    color: {
        list: [
            {
                value: "fff191",
                time: 0
            },
            {
                value: "ff622c",
                time: 1
            }
        ],
        isStepped: false
    },
    speed: {
        list: [
            {
                value: 50,
                time: 0
            },
            {
                value: 100,
                time: 1
            }
        ],
        isStepped: false
    },
    startRotation: {
        min: 240,
        max: 300
    },
    rotationSpeed: {
        min: 20,
        max: 40
    },
    lifetime: {
        min: 0.1,
        max: 0.3
    },
    frequency: 0.01,
    emitterLifetime: -1,
    maxParticles: 10,
    blendMode:"normal",
    pos: {
        x: 640,
        y: 500
    },
    addAtBack: false,
    spawnType: "point",
    spawnCircle: {
        x: 0,
        y: 0,
        r: 100
    }
};
let fireParticleEmitter : particles.Emitter;

class Engine {
    public app: PIXI.Application;
    public constructor(params: AppParams) {
        this.app = new PIXI.Application({ width: params.canvasWidth, height: params.canvasHeight, resolution: 1, backgroundColor: 0xfafafa, autoDensity: true });
        document.getElementById(params.containerId)?.appendChild(this.app.view)
        //Load Assets
        this.loadAssets();
        this.app.loader.onComplete.add(() => { this.onLoadComplete(); });
        this.app.loader.load();
        this.app.renderer.view.style.display = "block";
        this.app.renderer.view.style.marginLeft = "auto";
        this.app.renderer.view.style.marginRight = "auto";
    }
    private loadAssets(): void {
        this.app.loader.add('button', 'assets/button.png');
        this.app.loader.add('card_1', 'assets/card_1.png');
        this.app.loader.add('card_2', 'assets/card_2.png');
        this.app.loader.add('fire', 'assets/fire.png');
        this.app.loader.add('assets/texture.json');
    }
    private onLoadComplete(): void {
        create();
    }
}
const engine = new Engine({
    containerId: 'game',
    canvasWidth: 1920,
    canvasHeight: 1080,
})

let centerWidth: number = engine.app.renderer.width / 2;
let centerHeight: number = engine.app.renderer.height / 2;

function create() {
    engine.app.stage.addChild(fpsCounter);
    taskOneContainer = new PIXI.Container();
    taskTwoContainer = new PIXI.Container();
    engine.app.stage.addChild(taskOneContainer);
    engine.app.stage.addChild(taskTwoContainer);
    engine.app.stage.addChild(taskThreeContainer);
    let taskButtonOne = createMenuButton(100, centerHeight / 2 - 200, 'Task One', engine.app.stage);
    taskButtonOne.on("pointerdown", () => { changeTask(0) });
    let taskButtonTwo = createMenuButton(500, centerHeight / 2 - 200, 'Task Two', engine.app.stage);
    taskButtonTwo.on("pointerdown", () => { changeTask(1) });
    let taskButtonThree = createMenuButton(900, centerHeight / 2 - 200, 'Task Three', engine.app.stage);
    taskButtonThree.on("pointerdown", () => { changeTask(2) });
    initTaskOne();
}

function changeTask(taskid: number): void {
    taskOneContainer.removeChildren();
    taskTwoContainer.removeChildren();
    if (cardTween != null) {
        cardTween.kill();
    }
    cardCounter = 0;
    clearInterval(taskTwoInterval);
    if (fireParticleEmitter != null) {
        fireParticleEmitter.emit = false;
    }
    switch (taskid) {
        case 0:
            initTaskOne();
            break;
        case 1:
            initTaskTwo();
            break;
        case 2:
            initTaskThree();
            break;
        default:
            break;
    }
}

function initTaskOne() {
    for (let i = 0; i < cardCount; i++) {
        cards[i] = PIXI.Sprite.from('card_' + (i % 2 == 0 ? 1 : 2));
        cards[i].position.set((i * 6) + 150, 300);
        cards[i].name = "card " + i;
        cards[i].zIndex = i;
        taskOneContainer.addChild(cards[i]);
    }
    cardMoveAnimation(cards[cardCount - 1], cardCount - 1);
}
function initTaskTwo() {
    let textures: PIXI.Texture[] = [];
    for (let i = 0; i < textureCount; i++) {
        textures[i] = PIXI.Texture.from(i.toString());
    }
    let texts: string[] = ["Hi", "Sorry", "Welcome", "Bye", "Happy", "Sad"];

    taskTwoInterval = setInterval(() => { createImageAndTextMixed(textures, texts); }, 2000);
}
function initTaskThree() {
    fireParticleEmitter = new particles.Emitter(taskThreeContainer, ["fire"], fireParticleConfig
    )
    var elapsed = Date.now();
    var update = () => {
        requestAnimationFrame(update);
        var now = Date.now();
        fireParticleEmitter.update((now - elapsed) * 0.001);
        elapsed = now;
    };

    fireParticleEmitter.emit = true;
    update();
}

function createImageAndTextMixed(textures: PIXI.Texture[], texts: string[], objectcount: number = 3) {
    taskTwoContainer.removeChildren();
    for (let i = 0; i < objectcount; i++) {
        let randomSelection = Math.round(Math.random());
        let randomImageIndex = Math.round(Math.random() * (textures.length - 1));
        let randomTextIndex = Math.round(Math.random() * (texts.length - 1));
        switch (randomSelection) {
            case 0:
                let image = new PIXI.Sprite(textures[randomImageIndex]);
                image.position.set(640 + (i * 150), 360);
                taskTwoContainer.addChild(image);
                break;
            case 1:
                let text: PIXI.Text = new PIXI.Text(texts[randomTextIndex], randomTextStyle);
                text.style = { fontSize: 10 + (Math.round(Math.random() * 25)) };
                text.position.set(640 + (i * 150) + text.width, 360 + text.height);
                text.anchor.set(0.5, 0);
                taskTwoContainer.addChild(text);
                break;
            default:
                break;
        }
    }
}

//recursive function for Card Animation
function cardMoveAnimation(card: PIXI.Sprite, cardnumber: number): void {
    cardCounter++;
    cardTween = gsap.to(card.position, 2, {
        x: 150 + ((cardCount - cardnumber) * 6),
        y: 600,
        delay: 1,
        onComplete: () => {
            if (cardnumber == 0)
                return;
            cardMoveAnimation(cards[cardnumber - 1], cardnumber - 1);
        },
        onStart: () => {
            //Change Z Index
            card.zIndex = (cardCounter * 2) + cardnumber;
            card.parent.sortChildren();
        }
    })
}
//Create Button for menu
function createMenuButton(x: number, y: number, text: string, parent: any): PIXI.Sprite {
    let menuButton: PIXI.Sprite = new PIXI.Sprite(PIXI.Texture.from("button"));
    let buttonText: PIXI.Text = new PIXI.Text(text, buttonTextStyle);
    buttonText.anchor.set(0.5, 0.5);
    buttonText.position.set(325, 150);
    menuButton.position.set(x, y);
    menuButton.scale.set(0.5, 0.5);
    menuButton.addChild(buttonText);
    menuButton.buttonMode = true;
    menuButton.interactive = true;
    parent.addChild(menuButton);
    return menuButton;
}

function resize() {
    // Resize the renderer
    if (window.innerWidth / window.innerHeight >= ratio) {
        var w = window.innerHeight * ratio;
        var h = window.innerHeight;
    } else {
        var w = window.innerWidth;
        var h = window.innerWidth / ratio;
    }
    engine.app.renderer.view.style.width = w + 'px';
    engine.app.renderer.view.style.height = h + 'px';
}

function load() {
    resize();
}
window.addEventListener('resize', resize);
window.onload = load;
