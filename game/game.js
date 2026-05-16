//matter aliasing
var Engine = Matter.Engine,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Body = Matter.Body,
    Vector = Matter.Vector,
    Collision = Matter.Collision,
Composite = Matter.Composite;

//matter engine
var engine = Engine.create();
var runner = Runner.create();
Runner.run(runner,engine);

//univeral alliasing
var xbound = 750,
ybound = 750;

var game_phys_objects = [];

class Player {
    constructor(ground){
        this.body = Bodies.rectangle(200, 200, 60, 60, {inertia: Infinity});
        Composite.add(engine.world, this.body);
    }
    movement(){
        let pos = this.body.position;

        if (keyIsDown(LEFT_ARROW) && !keyIsDown(RIGHT_ARROW)){
            Body.setVelocity(this.body, Vector.create(-5, Body.getVelocity(this.body).y));
        } else if (keyIsDown(RIGHT_ARROW) && !keyIsDown(LEFT_ARROW)){
            Body.setVelocity(this.body, Vector.create(5, Body.getVelocity(this.body).y));
        }
        
        if (keyIsDown(UP_ARROW) && (Body.getVelocity(this.body).y <= 0)){
            Body.setVelocity(this.body, Vector.create(Body.getVelocity(this.body).x, -4));
        }
    }
    show(){
        this.movement();
        var pos = this.body.position;
        var angle = this.body.angle = 0;
        push();
        translate(pos.x, pos.y);
        rotate(angle);
        rect(0, 0, 60, 60);
        pop();
    }
}
var game_player = new Player();

/*
class World {
    constructor(){

    }
}
*/
//tests
class Box {
    constructor(x, y, w, h){
    this.body = Bodies.rectangle(x, y, w, h);
    this.w = w;
    this.h = h;
    Composite.add(engine.world, this.body);
    }
    show(){
        var pos = this.body.position;
        var angle = this.body.angle;

        push();
        translate(pos.x, pos.y);
        rotate(angle);
        rect(0, 0, this.w, this.h);
        pop();
    }

}

function mouseDragged() {
    game_phys_objects.push(new Box(mouseX, mouseY, 20,20));
}

function setup() {
    createCanvas(xbound, ybound);
    rectMode(CENTER);
    //create all objects
    //create world
    //add all bodies to the world
    //runner

    //test first
    var ground = Bodies.rectangle(0, ybound, 1500, 30, { isStatic: true });
    var leftwall = Bodies.rectangle(0, 0, 20, 1500, { isStatic: true });
    var rightwall = Bodies.rectangle(xbound, 0, 20, 1500, { isStatic: true });
    Composite.add(engine.world, [ground, leftwall, rightwall]);


}

function draw(){
    background(51);
    for (let i = 0; i < game_phys_objects.length; i++) {//showing all the objects in game_phys_objects
        game_phys_objects[i].show();
    }
    game_player.show();
}