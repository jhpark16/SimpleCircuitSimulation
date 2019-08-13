/**
 * 
 */
window.onload = function () {
}

class EElem {
	constructor(parent, indx, v, c, r, xloc, yloc, bLabel=true) {
		this.parent = parent;
		this.ctx = parent.ctx;
		this.indx = indx;
		this.voltage = v;
		this.current = c;
		this.bLabel = bLabel;
		if (this.indx == 3) // switch
		{
			if (r < 1e10)
				this.resist = 1e-20;
			else
				this.resist = 1e20;
		}
		else if (indx == 4) // wire
			this.resist = 1e-20;
		else if (indx == 5) // broken wire
			this.resist = 1e20;
		else
			this.resist = r;
		this.x = xloc;
		this.y = yloc;
		this.w = 83;
		this.h = 80;
	}
	change() {
		switch (this.indx) {
			case 1:
				this.resist += 1.0;
				if (this.resist > 10.0)
				  this.resist = 1.0;
				break;
			case 2:
				this.resist *= 2.0;
				if (this.resist > 100.0)
				  this.resist = 1.0;
				break;
			case 3:
				if (this.resist < 1e10)
				  this.resist = 1e20;
				else
				  this.resist = 1e-20;
				break;
			case 4:
				break;
			default:
				break;
		}
	}

	/**
	 * Answers whether the given coordinate is within this electric element's glyph
	 * area with true or false
	 */
	in(xloc, yloc) {
		var img;
		switch (this.indx) {
			case 1:
				img = this.parent.ib[0];
				break;
			case 2:
				img = this.parent.ir;
				break;
			case 3:
				img = this.parent.isw[0];
				break;
			case 4:
				img = this.parent.iw;
				break;
			default:
				img = this.parent.iempty;
				break;
		}
		this.w = img.width;
		this.h = img.height;
		if (this.w < 0)
		this.w = 83;
		if (this.h < 0)
		this.h = 80;
		if ((xloc > this.x) && (yloc > this.y) && (xloc < (this.x + this.w))
  		&& (yloc < (this.y + this.h)))
			return true;
		return false;
	}

	draw() {
		//var loc = {x:this.x, y:this.y};
    this.drawMoving({x:this.x, y:this.y});
	}
  /**
   * Paints an electric element at the given coordinates, and adds the voltage
   */
	drawMoving(loc) {
		var img, j, k, tmp, st1;
		switch (this.indx) {
			case 1:
				var tmp = this.voltage * this.current;
				j = (tmp / 0.135);
				if (j > 9) {
					if (tmp < 1.55)
						j = 10;
					else if (tmp < 1.8)
						j = 11;
					else if (tmp < 2.1)
						j = 12;
					else if (tmp < 2.7)
						j = 13;
					else if (tmp < 3.7)
						j = 14;
					else if (tmp < 5)
						j = 15;
					else
						j = 16;
				}
				img = this.parent.ib[Math.round(j)];
				this.ctx.drawImage(img, loc.x, loc.y);
				st1 =  Math.round(this.resist * 100) / 100 + " Ohms";
				j = loc.y + 15;
				var xShift = (img.width - this.ctx.measureText(st1).width)/2;
				this.ctx.fillText(st1, loc.x + xShift, j);
				if(this.bLabel) {
					if (this.parent.bshowW) {
					j -= 18;
					st1 = Math.round(this.voltage*this.current * 100) / 100 + " W";
					var xShift = (img.width - this.ctx.measureText(st1).width)/2;
					this.ctx.fillText(st1, loc.x + xShift, j);
				  }
				  if (this.parent.bshowC) {
					j -= 18;
					st1 = Math.round(this.current * 100) / 100 + " A";
					var xShift = (img.width - this.ctx.measureText(st1).width)/2;
					this.ctx.fillText(st1, loc.x + xShift, j);
				  }
				  if (this.parent.bshowV) {
					j -= 18;
					st1 = Math.round(this.voltage * 100) / 100 + " V";
					var xShift = (img.width - this.ctx.measureText(st1).width)/2;
					this.ctx.fillText(st1, loc.x + xShift, j);
				  }
			  }
				break;
			case 2:
				img = this.parent.ir;
				this.ctx.drawImage(img, loc.x, loc.y);
				st1 = Math.round(this.resist * 100) / 100 + " Ohms";
				j = loc.y;
				var xShift = (img.width - this.ctx.measureText(st1).width)/2;
				this.ctx.fillText(st1, loc.x + xShift, j);
				if(this.bLabel) {
					if (this.parent.bshowW) {
						j -= 18;
						st1 = Math.round(this.voltage*this.current * 100) / 100 + " W";
						var xShift = (img.width - this.ctx.measureText(st1).width)/2;
						this.ctx.fillText(st1, loc.x + xShift, j);
						}
					if (this.parent.bshowC) {
						j -= 18;
						st1 = Math.round(this.current * 100) / 100 + " A";
						var xShift = (img.width - this.ctx.measureText(st1).width)/2;
						this.ctx.fillText(st1, loc.x + xShift, j);
						}
					if (this.parent.bshowV) {
						j -= 18;
						st1 = Math.round(this.voltage * 100) / 100 + " V";
						var xShift = (img.width - this.ctx.measureText(st1).width)/2;
						this.ctx.fillText(st1, loc.x + xShift, j);
						}
  				}
				break;
			case 3:
				if (this.resist < 1e10)
					img = this.parent.isw[0];
				else
					img = this.parent.isw[1];
					this.ctx.drawImage(img, loc.x, loc.y);
				break;
			case 4:
				img = this.parent.iw;
				this.ctx.drawImage(img, loc.x, loc.y);
				break;
			default:
				img = this.parent.iempty;
				this.ctx.drawImage(img, loc.x, loc.y);
				break;
		}
	}
}

class Battery {
  /**
   * Create a battery with the glyph i, the voltage v,
   * and the x/y coordinates of (xloc, ylox)
   */
	constructor(parent, v, xloc, yloc) {
		this.parent = parent;
		this.ctx = parent.ctx;
		this.voltage = v;
		this.x = xloc;
		this.y = yloc;
	}

  /**
   * Changes the x and y coordinates of this battery
   */
	change(xloc, yloc) {
		this.x = xloc;
		this.y = yloc;
	}

  /**
   * Answers whether the given coordinate is within this battery's
   * glyph area with true or false
   */
	in(xloc, yloc) {
		if ((xloc > this.x) && (yloc > this.y) &&
			(xloc < (this.x + this.parent.ibatt.getWidth(this.parent))) &&
			(yloc < (this.y + this.parent.ibatt.getHeight(this.parent))))
			return true;
		return false;
	}

	draw() {
		//var loc = {x:this.x, y:this.y};
		this.drawMoving({x:this.x, y:this.y});
	}
  /**
   * Paints a battery at the given coordinates, and adds the voltage
   */
	drawMoving(loc) {
		var battery = this.parent.ibatt;
		this.ctx.drawImage(battery, loc.x, loc.y);
		var st1 = this.voltage + " V";
		var xShift = (battery.width - this.ctx.measureText(st1).width)/2;
		this.ctx.fillText(st1, loc.x + xShift, this.y - 3);
	}
}

class Circuit {
	constructor(divElem, circuitNo) {
		this.divElem = divElem;
		this.canvas = divElem.getElementsByTagName("canvas")[0]; // Get the first canvas
		this.ctx = this.canvas.getContext("2d");
		this.cvWidth = this.canvas.width;
		this.cvHeight = this.canvas.height;
		this.circuit_no = circuitNo;
		this.currentLoc = {x:0, y:0};
		this.NIMG = 17;
		this.NELEM = 8;
		this.nbulb = 3;
		this.selected = null;
		switch (this.circuit_no) {
			case 1:
				this.nelem = 4;
				break;
			case 2:
				this.nelem = 5;
				break;
			default:
				this.nelem = 4;
				break;
		}
		this.ibatt = document.getElementById("battery");
		this.iw = document.getElementById("wire");
		this.iempty = document.getElementById("empty");
		this.ir = document.getElementById("resistor");
		this.isw = [];
		this.isw[0] = document.getElementById("switchon");
		this.isw[1] = document.getElementById("switchoff");
		this.ib = [];
		for (var i = 0; i < this.NIMG; i++) {
			var st1 = "lightb" + (i + 1);
			this.ib[i] = document.getElementById(st1);
		}
		this.batt = [];
		this.batt[0] = new Battery(this, 1.5, 65, 400);
		this.batt[1] = new Battery(this, 1.5, 200, 400);
		this.bulb = [];
		for (var i = 0; i < this.nbulb; i++) {
			this.bulb[i] = new EElem(this, 1, 0, 0, 1.0 + i, 15 + i * 115, 10, false);
		}
		this.wire = new EElem(this, 4, 0, 0, 1e-20, 15 + 3 * 115, 10, false);
		this.el = [];
		this.el[0] = new EElem(this, 3, 0, 0, 1e20, 350, 360, false);
		switch (this.circuit_no) {
			case 1:
			default:
				for (var i = 1; i < this.nelem; i++) {
					this.el[i] = new EElem(this, 1, 0, 0, 1, i * 100, 200, true);
				}
				break;
			case 2:
				// left bulb
				this.el[1] = new EElem(this, 1, 0, 0, 1, 100, 230, true);
				// Centre bulbs
				this.el[2] = new EElem(this, 1, 0, 0, 1, 250, 160, true);
				this.el[3] = new EElem(this, 1, 0, 0, 1, 250, 300, true);
				// right bulb
				this.el[4] = new EElem(this, 1, 0, 0, 1, 400, 230, true);
				break;
		}
		  //this.setFont(new Font("TimesRoman", Font.BOLD, 14));
		//setLayout(null);
		var offsetY = this.canvas.offsetTop;
		var offsetX = this.canvas.offsetLeft;
		this.btn1 = document.createElement("BUTTON");   // Create a <button> element
		this.btn1.innerHTML = "Show Voltage";                   // Insert text
		var st1 = 'top:' + (offsetY+20) +'px;left:'+ (offsetX+460);
		this.btn1.setAttribute('style', 'position:absolute;'+st1+'px;width:120px;height:35px;'); //top:30px;left:470px;width:120px;height:35px;
		this.divElem.appendChild(this.btn1);               // Append <button> to <body>
		this.btn2 = document.createElement("BUTTON");   // Create a <button> element
		this.btn2.innerHTML = "Show Current";                   // Insert text
		st1 = 'top:' + (offsetY+65) +'px;left:'+ (offsetX+460);
		this.btn2.setAttribute('style', 'position:absolute;'+st1+'px;width:120px;height:35px;'); // 75px 470px
		this.divElem.appendChild(this.btn2);               // Append <button> to <body
		this.btn3 = document.createElement("BUTTON");   // Create a <button> element
		this.btn3.innerHTML = "Show Watts";                   // Insert text
		st1 = 'top:' + (offsetY+110) +'px;left:'+ (offsetX+460);
		this.btn3.setAttribute('style', 'position:absolute;'+st1+'px;width:120px;height:35px;');
		this.divElem.appendChild(this.btn3);               // Append <button> to <body
/*
		document.body.addEventListener("mousedown", this.onMouseDown.bind(this), false);		
		document.body.addEventListener("mouseup", this.onMouseUp.bind(this), false);		
		document.body.addEventListener("mousemove", this.onMouseMove.bind(this), false);		
		*/
		this.btn1.addEventListener("click", this.onButtonClick.bind(this),false);
		this.btn2.addEventListener("click", this.onButtonClick.bind(this),false);
		this.btn3.addEventListener("click", this.onButtonClick.bind(this),false);
		this.divElem.addEventListener("mousedown", this.onMouseDown.bind(this),false);
		this.divElem.addEventListener("mouseup", this.onMouseUp.bind(this),false);
		this.divElem.addEventListener("mousemove", this.onMouseMove.bind(this),false);
		this.draw();
	}

	onButtonClick(evt) {
		var source = evt.target;
		if (source == this.btn1) {
			this.selected = null;
			if (this.btn1.innerHTML == "Show Voltage")
	  		this.btn1.innerHTML = "Hide Voltage";
			else
				this.btn1.innerHTML = "Show Voltage";
		} else if (source == this.btn2) {
			this.selected = null;
			if (this.btn2.innerHTML == "Show Current")
			  this.btn2.innerHTML = "Hide Current";
			else
			  this.btn2.innerHTML = "Show Current";
		} else if (source == this.btn3) {
			this.selected = null;
			if (this.btn3.innerHTML == "Show Watts")
			  this.btn3.innerHTML = "Hide Watts";
			else
			  this.btn3.innerHTML = "Show Watts";
		}
		this.draw();
	}

	onMouseMove(evt) {
		// We are not currently dragging
		if (this.selected != null) {
			var x = evt.pageX - this.canvas.offsetLeft;
			var y = evt.pageY - this.canvas.offsetTop;
				this.currentLoc.x = x - this.selected.w / 2;
			this.currentLoc.y = y - this.selected.h / 2;
			this.draw();
		}
  }

	onMouseDown(evt) {
		// We are not currently dragging
		var x = evt.pageX - this.canvas.offsetLeft;
		var y = evt.pageY - this.canvas.offsetTop;
  	this.selected = null;
		for (var i = 0; i < this.nbulb; i++) {
			if (this.bulb[i].in(x, y)) {
				this.selected = this.bulb[i];
				this.selectadd = true;
				break;
			}
		}
		if (this.selected == null) {
			if (this.wire.in(x, y)) {
				this.selected = this.wire;
				this.selectadd = true;
			}
			else {
				for (var i = 0; i < this.nelem; i++) {
					if (this.el[i].in(x, y)) {
						this.selected = this.el[i];
						this.selectadd = false;
						break;
					}
				}
			}
		}
		if (this.selected != null) {
			if (this.selected.indx != 3) {
				var tmp = x - this.selected.w / 2;
				this.currentLoc.x = tmp;
				this.currentLoc.y = y - this.selected.h / 2;
			} else {
				this.selected.change();
				this.selected = null;
			}
			this.draw();
		}
  }

	onMouseUp(evt) {
		// We are not currently dragging
		var x = evt.pageX - this.canvas.offsetLeft;
		var y = evt.pageY - this.canvas.offsetTop;
		if (this.selected != null) {
			this.updated = false;
			if (this.selectadd) {
				for (var i = 0; i < this.nelem; i++) {
					if (this.el[i].in(x, y)) {
						if (this.el[i].indx != 3) {
							this.el[i].resist = this.selected.resist;
							this.el[i].indx = this.selected.indx;
						}
					}
				}
			} 
		  else if (!this.selected.in(x, y)) {
					for (var i = 0; i < this.nelem; i++) {
						if (this.selected == this.el[i]) {
							this.el[i].resist = 1e20;
							this.el[i].indx = 5;
							break;
						}
					}
		  }
  	  this.selected = null;
		  this.draw();
	  } 
  }
	/** 
	 * Draw a thick black polyline using the given path
	 * and thickness.
	 * Param: g: canvas 2D context
	 *        path: X, y locations arranged as 2D array
	 *        thickness: Line thickness
	 */
	drawThickPolyline(g, path, thickness) {
		g.lineWidth = thickness;
		g.beginPath();
		g.moveTo(path[0][0],path[0][1]);
		for (var i = 1; i < path.length; i++) {
			g.lineTo(path[i][0],path[i][1]);
		}
		g.stroke();
	}

	draw() {
		this.ctx.fillStyle = "rgba(255,245,230, 1)";//"beige";
		this.ctx.fillRect(0, 0, this.cvWidth, this.cvHeight);
		//this.ctx.clearRect(0,0,this.cvWidth,this.cvHeight);
		this.ctx.fillStyle = "blue";
		this.ctx.strokeStyle = "#FF00FF"
		var path = [];
		switch (this.circuit_no) {
			case 1:
			default:
				// Top Left loop. Line direction is counter clock wise
				path = [[100,263],[50,263],[50,423],[65,423]];
				this.drawThickPolyline(this.ctx, path, 3);
				// Bottom centre line
				path = [[335,423],[350,423]];
				this.drawThickPolyline(this.ctx, path, 3);
				// Bottom right corner
				path =[[400,263],[530,263],[530,423],[430,423]];
				this.drawThickPolyline(this.ctx, path, 3);
				// Three short lines at the bottom
				path = [[180,263],[200,263]];
				this.drawThickPolyline(this.ctx, path, 3);
				path = [[280,263],[300,263]];
				this.drawThickPolyline(this.ctx, path, 3);
				path = [[380,263],[400,263]];
				this.drawThickPolyline(this.ctx, path, 3);
				break;
			case 2:
				// Starting from top left line, rotate counter clockwise
				path = [[100,293],[50,293],[50,423],[65,423]];
				this.drawThickPolyline(this.ctx, path, 3);
				// Bottom centre line
				path = [[335,423],[350,423]];
				this.drawThickPolyline(this.ctx, path, 3);
				// Bottom right corner
				path = [[480,293],[530,293],[530,423],[430,423]];
				this.drawThickPolyline(this.ctx, path, 3);
				// A line right side of the small loop
				path = [[342,293],[400,293]];
				this.drawThickPolyline(this.ctx, path, 3);
				// A line left side of the small loop
				path = [[180,293],[240,293]];
				this.drawThickPolyline(this.ctx, path, 3);

				// Left part of the small loop
				path = [[250,363],[240,363],[240,223],[250,223]];
				this.drawThickPolyline(this.ctx, path, 3);
				// Right part of the small loop
				path = [[332,363],[342,363],[342,223],[332,223]];
				this.drawThickPolyline(this.ctx, path, 3);

				break;
		}
		this.ctx.font = "18px TimesRoman";
		this.batt[0].draw();
		this.batt[1].draw();
		this.bshowV = this.btn1.innerHTML == "Hide Voltage";
		this.bshowC = this.btn2.innerHTML == "Hide Current";
		this.bshowW = this.btn3.innerHTML == "Hide Watts";
		this.resist = 0.0;
		var voltage = this.batt[0].voltage+this.batt[1].voltage
		switch (this.circuit_no) {
		case 1:
		default:
			for (var i = 0; i < this.nelem; i++) {
				this.resist += this.el[i].resist;
			}
			this.current =  voltage/ this.resist;
			for (var i = 0; i < this.nelem; i++) {
				this.el[i].current = this.current;
				this.el[i].voltage = this.el[i].resist * this.current;
				if(this.selected == this.el[i])
					this.el[i].drawMoving(this.currentLoc)
			  else
				  this.el[i].draw();
			}
			break;
		case 2:
			this.resist += this.el[0].resist;
			this.resist += this.el[1].resist;
			this.resist += this.el[4].resist;
			var resist1 = this.el[2].resist * this.el[3].resist / (this.el[2].resist + this.el[3].resist);
			this.resist += resist1;
			this.current = voltage / this.resist;
			for (var i = 0; i < this.nelem; i++) {
				this.el[i].current = this.current;
				this.el[i].voltage = this.el[i].resist * this.current;
			}
			this.el[2].voltage = resist1 / this.resist * voltage;
			this.el[2].current = this.el[2].voltage / this.el[2].resist;
			this.el[3].voltage = resist1 / this.resist * voltage;
			this.el[3].current = this.el[3].voltage / this.el[3].resist;
			for (var i = 0; i < this.nelem; i++) {
				this.el[i].draw();
				if(this.selected == this.el[i])
					this.el[i].drawMoving(this.currentLoc);
			}
			break;
		}
		for (var i = 0; i < this.nbulb; i++) {
			if (this.bulb[i] != null) {
				this.bulb[i].draw();
				if(this.selected == this.bulb[i])
					this.bulb[i].drawMoving(this.currentLoc);
			}
		}
		this.wire.draw();
		if(this.selected == this.wire)
  		this.wire.drawMoving(this.currentLoc);
	}
}
//var c1 = document.getElementById("myCanvas1");
var d1 = document.getElementById("myDiv1");
var circuit1 = new Circuit(d1,1);
//var c2 = document.getElementById("myCanvas2");
var d2 = document.getElementById("myDiv2");
var circuit2 = new Circuit(d2,2);
