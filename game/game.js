//matter aliasing
var Engine = Matter.Engine,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
Composite = Matter.Composite;

//matter engine
var engine = Engine.create();

//univeral alliasing
var xbound = 750,
ybound = 750;


class Player {
    constructor(){
        var player_box = Bodies.rectangle(200,200, 60, 60);
    }
    movement_player(){

    }
}

class World {
    constructor(){

    }
}

function move(){
}

function setup() {
    createCanvas(xbound, ybound);
    //create all objects
    //create world
    //add all bodies to the world
    //runner
}

function draw(){
    background(51);
}