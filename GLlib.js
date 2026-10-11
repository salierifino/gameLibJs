import * as element from './element.js'
import * as webgl from './drawGL.js'
import * as joystick from './joystick.js'
/*======*/

window.rgba = function(r,g,b,a=1.0) {
	if(r==null || g==null || b== null) {
		console.error("r, g, dan b harus diisi!");
		return new Float32Array([0.0,0.0,0.0,1.0]);
	}
	return new Float32Array([
		r/255,
		g/255,
		b/255,
		a
	]);
}


let firstTime = 0;                 
let lastTime = 0;
let waktuTertinggal = 0;
const satuFrame = 1000/30; /* untuk 30 fps */

WebGLRenderingContext.prototype.loop = function(now){
        firstTime = firstTime || now;
        waktuTertinggal += now - lastTime;
        lastTime = now;     
	this.millsecond = Math.floor(now-firstTime);
	while(waktuTertinggal >= satuFrame) {
                this.reset();
                window.update && window.update();
                waktuTertinggal -= satuFrame;
		const elCount = element.element.pointer/10;
		for (let i=0;i<elCount;i++) {
			this.renderElement(i);
		}
		for (let i=0;i<5;i++) {
			this.loopJoystick(i);
		}
	}
        this.draw();
        requestAnimationFrame((now) => this.loop(now));
}

const getContextAsli = HTMLCanvasElement.prototype.getContext;

HTMLCanvasElement.prototype.getContext = function(type, ...args) {
	const ctx = getContextAsli.call(this, type, ...args);
	/* Cuma webgl saja */
	if (type === 'webgl') {
		if (!ctx) {
			alert('WebGL Tidak didukung!');
			return null;
		}
		if (!ctx._sudahDiInit) {
			ctx.initLib();
			ctx.checkJoystick();
			ctx.checkElement();
			ctx._sudahDiInit = true;
		}
	}
	/* kalau experimental-webgl,
	 * webgl2, canvas2d langsung return */
	return ctx;
};

/* awokwok */
window.update = (fn) => {
  if(typeof fn === 'function') window.update = fn;
};
