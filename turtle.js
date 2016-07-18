function turtle() {
    this.graphics = new PIXI.Graphics();
    //direction in degrees
    this.pointing = 0;
    this.position = [0,0];
    this.graphics.lineStyle(1, 0xFF0000);
    this.turtlePicture = new PIXI.Graphics();
    this.container = new PIXI.Container();
    this.container.addChild(this.graphics)
    this.onResize();	
    this.penDown();
    this.forward(0); // to fix: figure out why this is needed
}
turtle.prototype.build = function() {
    stage.addChild(this.container)
    var l = this.turtlePicture;

    var sx = 2;
    var sy = 2;
    l.lineStyle(1, 0xFFFFFF);
    l.moveTo(-2*sx,0*sy);
    l.lineTo(-5*sx,2*sy);
    l.lineTo(6*sx,0*sy);
    l.lineTo(-5*sx,-2*sy);
    l.lineTo(-2*sx,0*sy);
    this.container.addChild(l);
//    this.graphics.moveTo(pos[0], pos[1])
    
}
turtle.prototype.turn = function(degrees) {
    this.pointing += degrees;
    this.turtlePicture.rotation = -this.pointing * 2*Math.PI / 360;
    requestAnimationFrame(animate);
}

turtle.prototype.left = function(degrees) {
    this.turn(degrees);
}
turtle.prototype.right = function(degrees) {
    this.turn(-degrees);
}
turtle.prototype.penDown = function() {
    var pos = this.getPosition();
    this.graphics.moveTo(pos[0], pos[1])
    this.drawing = true;
    this.container.visible = true;
}

turtle.prototype.penUp = function() {
    this.drawing = false;
    this.container.visible = false;
}
turtle.prototype.forward = function(distance) {

    var pos = this.getPosition()
    this.graphics.moveTo(pos[0], pos[1])
    // if ((this.graphics.position.x != pos[0]) ||
    // 	(this.graphics.position.y != pos[1])) {
	
    // 	this.graphics.moveTo(pos[0], pos[1])
    // }
    this.position[0] += Math.cos(2*Math.PI*this.pointing/360) * distance;
    this.position[1] += Math.sin(2*Math.PI*this.pointing/360) * distance;
    pos = this.getPosition()

    if (this.drawing) {
	this.graphics.lineTo(pos[0], pos[1]);
	requestAnimationFrame(animate);
    }
    else {
	this.graphics.moveTo(pos[0], pos[1]);
    }
    this.turtlePicture.position.x = pos[0];
    this.turtlePicture.position.y = pos[1];

}

turtle.prototype.getPosition = function() {
    var x = this.position[0]
    var y = -this.position[1]
    return [x,y]
}

turtle.prototype.onResize = function() {
    var x =  window.innerWidth / 2
    var y =  window.innerHeight / 2
    this.container.position.x = x;
    this.container.position.y = y;


}
var stage = new PIXI.Stage(0xFFFFFF);

var renderer = new PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.view);
t = new turtle()
t.build()

requestAnimationFrame(animate);

function animate() {
    renderer.render(stage);
}



window.onresize = function() {
    t.onResize();
    renderer.resize(window.innerWidth, window.innerHeight)
    requestAnimationFrame(animate)
}
