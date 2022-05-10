const stats = new Stats();
stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
stats.domElement.style.position = "fixed";
stats.domElement.style.left = 0;
stats.domElement.style.top = 0;
document.body.appendChild( stats.domElement );

class Canvas {
	/**
	 * Canvas constructor
	 * @param  {Mixed} canvas Canvas element or CSS3 string
	 */
	constructor(canvas: HTMLElement) {
		this.canvas =
			typeof canvas === "string" ? document.querySelector(canvas) : canvas;
		this.ctx = this.canvas.getContext("2d");
	}

	/**
	 * Resize the canvas
	 * @param  {Number} w 	Width in px
	 * @param  {Number} h 	Height in px
	 * @return {Object}   	Instance  reference
	 */
	resize(w: number, h: number): Canvas {
		this.save();

		this.canvas.width = this.width = w;
		this.canvas.height = this.height = h;

		this.rects = this.canvas.getBoundingClientRect();

		this.load();

		return this;
	}

	bg(color: string): void {
		this.ctx.fillStyle = color;
		this.ctx.fillRect(0, 0, this.width, this.height);
	}

	/**
	 * Save the canvas data
	 * @param  {Boolean} data
	 * @return {Object} image data or instance reference
	 */
	save(data: ImageData) {
		this.data = this.ctx.getImageData(
			0,
			0,
			this.canvas.width,
			this.canvas.height
		);

		return data ? data : this;
	}

	/**
	 * Load the canvas data
	 * @param  {Boolean} data
	 * @return {Object} image data or instance reference
	 */
	load(data: ImageData) {
		this.ctx.putImageData(this.data, 0, 0);

		return data ? data : this;
	}

	/**
	 * Clear the canvas
	 * @return {Object} Instance reference
	 */
	clear(): Canvas {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

		return this;
	}
}

class Starfield {
	constructor(canvas: Canvas, options: object) {
		const defaults = {
			starColor: "rgba(255,255,255,1)",
			bgColor: "rgba(0,0,0,1)",
			speed: 3,
			quantity: 1000,
			ratio: 256,
		};
		this.canvas = canvas;
		this.ctx = canvas.ctx;
		this.options = Object.assign({}, defaults, options);
		
		this.init();
	}

	// Resize the canvas
	resizer(): void {
		
		var oldStar = this.star;
		var initW = this.canvas.width;
		var initH = this.canvas.height;

		this.w = window.innerWidth;
		this.h = window.innerHeight;
		this.x = Math.round(this.w / 2);
		this.y = Math.round(this.h / 2);

		// Check if the device is in portrait orientation
		this.portrait = this.w < this.h;
		
		// Get the ratio of the old height to the new height
		var ratX = this.w / initW;
		var ratY = this.h / initH;
		
		this.canvas.resize(this.w, this.h);

		// Recalculate the position of each star proportionally to new w and h
		for (var i = 0; i < this.n; i++) {
			this.star[i][0] = oldStar[i][0] * ratX;
			this.star[i][1] = oldStar[i][1] * ratY;

			this.star[i][3] =
				this.x + this.star[i][0] / this.star[i][2] * this.star_ratio;
			this.star[i][4] =
				this.y + this.star[i][1] / this.star[i][2] * this.star_ratio;
		}

	}

	init(): void {
		this.initialised = false;
		this.running = false;
		this.flag = true;
		this.test = true;
		this.w = 0;
		this.h = 0;
		this.x = 0;
		this.y = 0;
		this.z = 0;
		this.n = this.options.quantity;
		this.star_color_ratio = 0;
		this.star_x_save = 0;
		this.star_y_save = 0;
		this.star_ratio = this.options.ratio;
		this.star_speed = this.options.speed;
		this.star = new Array(this.n);
		this.color = this.options.starColor;
		this.opacity = 0.1;

		this.cursor_x = 0;
		this.cursor_y = 0;
		this.mouse_x = 0;
		this.mouse_y = 0;

		// Check for device orientation support
		this.desktop = !navigator.userAgent.match(
			/(iPhone|iPod|iPad|Android|BlackBerry|BB10|IEMobile)/
		);
		this.orientationSupport = window.DeviceOrientationEvent !== undefined;
		this.portrait = null;
		
		this.canvas.resize(window.innerWidth, window.innerHeight);	
		
		this.w			= this.canvas.width;
		this.h			= this.canvas.height;

		this.initW		= this.w;
		this.initH		= this.h;

		this.portrait	= this.w < this.h;

		// Create initial star array and canvas context

		this.x = Math.round(this.w / 2);
		this.y = Math.round(this.h / 2);
		this.z = (this.w + this.h) / 2;
		this.star_color_ratio = 1 / this.z;
		this.cursor_x = this.x;
		this.cursor_y = this.y;

		this.initStars();

		// Set the colors
		this.ctx.fillStyle = this.options.bgColor;
		this.ctx.strokeStyle = this.options.starColor;
		
		this.events = {
			loop: this.loop.bind(this),
			resizer: this.resizer.bind(this),
		};
		
		window.addEventListener(
			"resize",
			this.events.resizer,
			false
		);

		window.addEventListener(
			"orientationchange",
			this.events.resizer,
			false
		);		
	}
	
	initStars(): void {
		for (var i = 0; i < this.n; i++) {
			this.star[i] = new Array(5);

			this.star[i][0] = Math.random() * this.w * 2 - this.x * 2;
			this.star[i][1] = Math.random() * this.h * 2 - this.y * 2;
			this.star[i][2] = Math.round(Math.random() * this.z);
			this.star[i][3] = 0;
			this.star[i][4] = 0;
		}
	}

	animate(): void {
		stats.begin();
		this.canvas.bg(this.options.bgColor);

		this.ctx.strokeStyle = this.options.starColor;
		
		this.mouse_x = this.cursor_x - this.x;
		this.mouse_y = this.cursor_y - this.y;
		

		for (var i = 0; i < this.n; i++) {
			const star = this.star[i];
			this.test = true;
			this.star_x_save = star[3];
			this.star_y_save = star[4];
			// star[0] += this.mouse_x >> 4;

			// X coords
			if (star[0] > this.x << 1) {
				star[0] -= this.w << 1;
				this.test = false;
			}
			if (star[0] < -this.x << 1) {
				star[0] += this.w << 1;
				this.test = false;
			}

			// Y coords
			if (star[1] > this.y << 1) {
				star[1] -= this.h << 1;
				this.test = false;
			}
			if (star[1] < -this.y << 1) {
				star[1] += this.h << 1;
				this.test = false;
			}

			// Z coords
			star[2] -= this.star_speed;
			if (star[2] > this.z) {
				star[2] -= this.z;
				this.test = false;
			}
			if (star[2] < 0) {
				star[2] += this.z;
				this.test = false;
			}

			star[3] =
				this.x + star[0] / star[2] * this.star_ratio;
			star[4] =
				this.y + star[1] / star[2] * this.star_ratio;

			if (
				this.star_x_save > 0 &&
				this.star_x_save < this.w &&
				this.star_y_save > 0 &&
				this.star_y_save < this.h &&
				this.test
			) {
				this.ctx.lineWidth = (1 - this.star_color_ratio * star[2]) * 2;
				this.ctx.beginPath();
				this.ctx.moveTo(this.star_x_save, this.star_y_save);
				this.ctx.lineTo(star[3], star[4]);
				this.ctx.stroke();
				this.ctx.closePath();
			}
		}
		stats.end();
	}

	loop(): void {
		this.animate();

		this.tick = window.requestAnimationFrame(this.events.loop);
	}

	stop(): void {
		window.cancelAnimationFrame(this.tick);

		this.running = false;
	}

	start(): Starfield {
		if (!this.running) {
			this.running = true;
			this.loop();
		}

		return this;
	}
}

const CONFIG = {
	speed: 0.5
};

const CANVAS = new Canvas("#c").resize(window.innerWidth, window.innerHeight);

const FIELD = new Starfield(CANVAS, {
	speed: CONFIG.speed * 4
}).start();


/********** DAT GUI **********/

const GUI = new dat.GUI();

const FOLDER1 = GUI.addFolder("Config");
const FOLDER2 = GUI.addFolder("Simulation");

FOLDER1.add(FIELD, "n").name("Stars").min(0).step(10).max(4000).onChange(val => {
	FIELD.initStars();
});

FOLDER1.add(CONFIG, "speed").name("Warp Factor").min(0.1).step(0.1).max(10).onChange(val => {
	FIELD.star_speed = val * 4;
});

FOLDER1.open();

FOLDER2.add(FIELD, "start");
FOLDER2.add(FIELD, "stop");

FOLDER2.open();

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
}