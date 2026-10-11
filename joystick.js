
import {element} from './element.js'

export const joystick = {
	list: new Float32Array(8*5),
	pointer : 0,
	touchptr : 0,
	stylels : new Float32Array([
	/* i = in/dalam, o = out/luar
	 * b = border, bW = borderWidth
	 * iR iG iB iA  oR oG oB oA  bR bG bB bA bW*/
	   1, 0, 0, 1,  0, 0, 0, 1,  0, 0, 0, 1, 1,
	   1, 0, 0, 1,  0, 0, 0, 1,  0, 0, 0, 1, 1,
	   1, 0, 0, 1,  0, 0, 0, 1,  0, 0, 0, 1, 1,
	   1, 0, 0, 1,  0, 0, 0, 1,  0, 0, 0, 1, 1,
	   1, 0, 0, 1,  0, 0, 0, 1,  0, 0, 0, 1, 1
	])
};

/* Mendaftarkan JoyStick */
const createElementAsli = WebGLRenderingContext.prototype.createElement;
WebGLRenderingContext.prototype.createElement = function(type) {
	const ctx = createElementAsli && createElementAsli.call(this, type);
	if (type != 'joystick') return ctx;
	const idx = joystick.pointer;
	if (idx == 40) { /* 40 = 8x5 */
		console.error("Jumlah maksimum Joystick adalah 5");
		return -1;
		/* Saya tidak membuat alokasi jika melebihi maks
		 * karena joystick tidak perlu banyak-banyak */
	}
	if (idx == 0) { /* Jika belum ada joystick, taruh pojok kiri atas*/
		joystick.list.set(new Float32Array([75,75,60,75,75,30,0,0]),idx);

	/* Jika sudah ada taruh sebelah kanan nya
		 * Jika sudah mentok kanan, taruh bawahnya*/
	} else if (joystick.list[idx-8] + 200 >= this.canvas.width) {
		const y = joystick.list[idx-7] + 150
		joystick.list.set(new Float32Array([75,y,60,75,y,30,0,0]),idx);
	} else { /* jika belum mentok */
		const x = joystick.list[idx-8] + 150;
		const y = joystick.list[idx-7];
		joystick.list.set(new Float32Array([x,y,60,x,y,30,0,0]),idx);
	}
	joystick.pointer += 8;
	const idx2 = idx/8*13;
	
	return {
		style : {
			_left : joystick.list[idx],
			_top : joystick.list[idx+1],
			_size : 60,
			_padding : 30,
			_color : new Float32Array([1,0,0,1]),
			_backgroundColor : new Float32Array([0,0,0,1]),
			_borderColor : new Float32Array([0,0,0,1]),
			_borderWidth : 1,
			
			get left() {return this._left;},
			get top() {return this._top;},
			get size() {return this._size;},
			get padding() {return this._padding;},
			get color() {return this._color;},
			get backgroundColor() {return this._backgroundColor;},
			get borderColor() {return this._borderColor;},
			get borderWidth() {return this._borderWidth;},
	
			set left(x) {this._left=x;joystick.list[idx]=x;joystick.list[idx+3]=x;},
			set top(y){this._top=y;joystick.list[idx+1]=y;joystick.list[idx+4]=y;},
			set size(s){this._size=s;joystick.list[idx+5]=s/2;
				joystick.list[idx+2]=s/2+this._padding;},
			set padding(p){this._padding=p;joystick.list[idx+2]=joystick.list[idx+5]+p;},
			set color(c){this._color=c;joystick.stylels.set(c,idx2);}, 
			set backgroundColor(bc){this._backgroundColor=bc;
				joystick.stylels.set(bc,idx2+4);},
			set borderColor(bc){this._borderColor=bc;joystick.stylels.set(bc,idx2+8);},
			set borderWidth(bw){this._borderWidth=bw;joystick.stylels[idx2+12]=bw;}
		},
		_attach : 0,
		get attach() {return this._attach;},
		set attach(el) {el = el.id+20;this._attach=el;joystick.list[idx+7]=el;}
	}
}
WebGLRenderingContext.prototype.checkJoystick = function() {
	const rect = this.canvas.getBoundingClientRect();
	const rleft = rect.left;
	const rtop = rect.top;

	/* Joystick khusus sentuhan/hp */
	this.canvas.addEventListener('touchstart', (e) => {
		for(let t=0; t<e.touches.length; t++){
			const touch = e.touches[t];
			const x = touch.clientX - rleft;
			const y = touch.clientY - rtop;
			for(let i=0;i<5;i++){
				const xc = joystick.list[i*8+3];
				const yc = joystick.list[i*8+4];
				const r = joystick.list[i*8+5];
				if ((x-xc)**2 + (y-yc)**2 < r*r) {
					joystick.list[i*8+6] = touch.identifier+1; /* 0:tak aktif */
					break; /*1 touch cukup*/
				}
			}
		}
	}, {passive:false});

	this.canvas.addEventListener('touchmove', (e) => {
		e.preventDefault(); /* biar gak scroll */
		for(let t=0; t<e.touches.length; t++){      
			const touch = e.touches[t];     
			const x = touch.clientX - rleft;
			const y = touch.clientY - rtop;

			for(let i=0;i<5;i++){
				/* Jika joystick dipencet*/
				if(joystick.list[i*8+6] == touch.identifier+1){
					const ox = joystick.list[i*8];
					const oy = joystick.list[i*8+1];
					const br = joystick.list[i*8+2]; /* batas radius */
					/* jarak jari ke pusat */
					let dx = x - ox; /* jarak x */
					let dy = y - oy; /* jarak y */
					/* jarak miring pitagoras √(dx²+dy²) */
					const dist = Math.sqrt(dx*dx + dy*dy);

					const scale = br / dist;/*perbandingan batas/miring*/
					const batasX = dx*scale;
					const batasY = dy*scale;

					const over = (dist < br) * 1;
					/* true 1, false 0
					 * Jika jarak miring jari ke pusat < batas miring
					 * maka bola sesuai jari, tapi kalau melewati batas,
					 * maka bola ada di batas maksimal.*/

					dx = dx*over + batasX*(1-over);
					joystick.list[i*8+3] = ox + dx;

					dy = dy*over + batasY*(1-over);
					joystick.list[i*8+4] = oy + dy;
				}
			}
		}
	}, {passive:false});

	const reset = (e) => {
		for(let t=0; t<e.changedTouches.length; t++){
			/* Di touch end ngga ada touches, adanya changedTouches */
			for(let i=0;i<5;i++){
				/* Jika yang dilepas adalah loop sekarang, isMe = 1, else 0
				 * maka semua kembali ke pusat, dan index sentuhan menjadi 0*/
				const isMe = (joystick.list[i*8+6] == 
					e.changedTouches[t].identifier+1) * 1;

				joystick.list[i*8+3] = joystick.list[i*8]*isMe+
					joystick.list[i*8+3]*(1-isMe);
				joystick.list[i*8+4] = joystick.list[i*8+1]*isMe+
					joystick.list[i*8+4]*(1-isMe);
				joystick.list[i*8+6] = joystick.list[i*8+6]*(1-isMe);
			}
		}
    };
    this.canvas.addEventListener('touchend', reset, {passive:false});
    this.canvas.addEventListener('touchcancel',reset,{passive:false});
};


WebGLRenderingContext.prototype.loopJoystick = function(idx) {
	const satuJoy = joystick.list.subarray(idx*8,(idx+1)*8);
        const satuStyle = joystick.stylels.subarray(idx*13,(idx+1)*13);

	const xcover = satuJoy[0];
	const ycover = satuJoy[1];
	const radcover = satuJoy[2];

	const bind = satuJoy[7];
	const dx = satuJoy[3] - xcover;
	const dy = satuJoy[4] - ycover;
	element.list[bind-19] += dx*0.1;
	element.list[bind-18] += dy*0.1;
	let sudut = Math.atan2(dy,dx)*57.29578;
	element.list[bind-15] = (sudut != -180.00003724215995)*sudut || 
		element.list[bind-15]; /*Jika dilepas, 
		sudut tidak langsung kenbali*/

	/*render*/
	this.renderCircle(xcover,ycover,radcover,satuStyle.subarray(4,8));
	this.renderRing(xcover,ycover,radcover,satuStyle[12],satuStyle.subarray(8,12));
        this.renderCircle(satuJoy[3],satuJoy[4],satuJoy[5],satuStyle.subarray(0,4));
}
