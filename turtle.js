function turtle() {
    this.graphics = new PIXI.Graphics();
    //direction in degrees
    this.pointing = 0;
    this.position = [0,0];
    this.width = 1;
    this.currentColor = 0x000000;
    this.graphics.lineStyle(this.width, this.currentColor);
    this.turtlePicture = new PIXI.Graphics();
    this.container = new PIXI.Container();
    this.container.addChild(this.graphics)
    this.onResize();	
    this.penDown();

}
turtle.prototype.clear = function() {
    this.graphics.clear()
    this.graphics.lineStyle(this.width, this.currentColor);
    this.penDown();
    requestAnimationFrame(animate);
}
turtle.prototype.reset = function() {
    this.pointing = 0;
    this.turtlePicture.rotation = -this.pointing * 2*Math.PI / 360;
    this.goto(0,0);
    this.clear();
}
turtle.prototype.build = function() {
    stage.addChild(this.container)
//    var l = this.turtlePicture;

    /*
    l.lineStyle(1, this.currentColor);
    l.moveTo(-2*sx,0*sy);
    l.lineTo(-5*sx,2*sy);
    l.lineTo(6*sx,0*sy);
    l.lineTo(-5*sx,-2*sy);
    l.lineTo(-2*sx,0*sy);
    */
    this.drawTurtlePicture();
    this.container.addChild(this.turtlePicture);
//    this.graphics.moveTo(pos[0], pos[1])
    
}

turtle.prototype.drawTurtlePicture = function() {
    var l = this.turtlePicture;
    var sx = 2;
    var sy = 2;
    
    l.lineStyle(1, this.currentColor);
    l.moveTo(-2*sx,0*sy);
    l.lineTo(-5*sx,2*sy);
    l.lineTo(6*sx,0*sy);
    l.lineTo(-5*sx,-2*sy);
    l.lineTo(-2*sx,0*sy);

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
    this.graphics.moveTo(pos[0], pos[1]);
    this.graphics.lineTo(pos[0], pos[1]);
    this.drawing = true;
    this.container.visible = true;
}

turtle.prototype.penUp = function() {
    this.drawing = false;
    this.container.visible = true;
}
turtle.prototype.backward = function(distance) {
    return this.forward(-distance);
}
turtle.prototype.forward = function(distance) {
    if (!isNaN(distance)) {
	var newX = this.position[0] + Math.cos(2*Math.PI*this.pointing/360) * distance;
	var newY = this.position[1] + Math.sin(2*Math.PI*this.pointing/360) * distance;
	return this.goto(newX,newY);
    }
    else {
	return false;
    }
}

turtle.prototype.goto = function(x,y) {
    if ((typeof x === typeof y) && typeof x === 'number') {
	var pos = this.getPosition();
	this.graphics.moveTo(pos[0], pos[1])
	this.position[0] = x;
	this.position[1] = y;

	pos = this.getPosition();

	if (this.drawing) {
	    this.graphics.lineTo(pos[0], pos[1]);

	}
	else {
	    this.graphics.moveTo(pos[0], pos[1]);

	}
	this.turtlePicture.position.x = pos[0];
	this.turtlePicture.position.y = pos[1];
	requestAnimationFrame(animate);
	return true;
    }
    else{
	return false;
    }
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

turtle.prototype.color = function(newColor) {
    var colorNumber;
    if (typeof newColor === "string") {
	if (this.colors.hasOwnProperty(newColor)) {
	    colorNumber = this.colors[newColor];
	}
	else {
	    console.log("I don't know the color " + newColor);
	}
    }
    else if (typeof newColor === "number") {
	colorNumber = newColor;
    }

    if (typeof colorNumber !== 'undefined') {
	this.graphics.lineStyle(this.width, colorNumber);
	this.currentColor = colorNumber;
	this.drawTurtlePicture()
	if (this.drawing) {
	    this.penDown();
	}
	requestAnimationFrame(animate)
    }

}

turtle.prototype.help ="Turtle Command Reference:\n\
\tt.forward(x): Moves the turtle forward x pixels\n\
\tt.left(d°): Turns the turtle d° to the left\n\
\tt.right(d°): Turns the turtle d° to the right\n\
\tt.goto(x,y): Moves the turtle to the position (x,y). The center of the screen is the origin.\n\
\tt.penDown(): Tells the turtle to start drawing as it moves\n\
\tt.penUp(): Tells the turtle to stop drawing as it moves\n\
\tt.colors: An object that has a bunch of colors the turtle can draw\n\
\tt.color(newColor): Tells the turtle to switch its color to newColor. newColor is a string or a number.\n\
\tt.reset(): Resets the turtle to the center of the page."






new Promise(function(fulfill, reject) {
    $.getJSON("crayola.json", function(data) {
	var byName = {};
	for (color of data) {
	    var colorInt = parseInt("0x" + color.hex.substring(1));
	    byName[color.name] = colorInt;
	}
	fulfill(byName);
    }.bind(this));
}).then(function(colors) {
    turtle.prototype.colors = colors;
});
var stage = new PIXI.Stage(0xFFFFFF);

var renderer = new PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight, {
    resolution: window.devicePixelRatio || 1,
    autoResize: true
});
renderer.backgroundColor = 0xFFFFFF;
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

