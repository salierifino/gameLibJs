export const element = {
	list : new Float32Array(100),
	pointer : 0,
	need(n) {
                /*Jika wadah yang dibutuhkan kurang*/
                if (this.pointer + n > this.list.length){
                        /*Buat wadah baru dengan ukuran 2× lebih besar*/
                        const bigger = new Float32Array(this.list.length * 2);
                        bigger.set(this.list);
                        this.list = bigger; /*Ganti wadah dengan yang baru*/
                }
        },
	funcList : new Array(10),
	funcPtr : 1,
	funcNeed(n) {
		if (this.funcPtr + n > this.funcList.length){
                        const bigger = new Float32Array(this.funcList.length * 2);
                        bigger.set(this.funcList);
                        this.funcList = bigger;
                }
	}
}

const _DRAG = 1;
const _COLLID = 2;
const _ANIM = 4;

WebGLRenderingContext.prototype.createElement = function(type) {
	if (type != "rectangle" && type != "circle") return null;
	element.need(20);
	/* shape, x, y, w, h, kemiringan, r, g, b, a,
	 * permission, idx pointer, offsetX, offsetY, idx funct1, func2
	 * gambar src, playbackarate, velocityX, velocityY*/
        const ptr = element.pointer;
        element.pointer += 20;
	element.list.set(new Float32Array([120,120,0,1.0,0.5,0.1,1.0]),ptr+3);

	if (ptr == 0) { /* Jika belum ada element, taruh pojok kiri atas*/ 
		 element.list.set(new Float32Array([0,75,75]),ptr);
        /* Jika sudah ada taruh sebelah kanan nya
                 * Jika sudah mentok kanan, taruh bawahnya*/
        } else if (element.list[ptr-19] + 200 >= this.canvas.width) {
                const y = element.list[ptr-18] + 150
                element.list.set(new Float32Array([0,75,y]),ptr);
        } else { /* jika belum mentok */                              
		const x = element.list[ptr-19] + 150;
		const y = element.list[ptr-18];
                element.list.set(new Float32Array([0,x,y]),ptr);
	}
	element.list[ptr+17] = 1.0;
	element.list[ptr+18] = 1.0;
	element.list[ptr+19] = 1.0;

	if (type == "rectangle") {
		element.list[ptr] = 1;
		return {
			id :ptr,
	                style : {
	                        _left : element.list[ptr+1],
	                        _top : element.list[ptr+2],
	                        _width : 120,
				_height : 120,
				_rotate : 0,
	                        _color : new Float32Array([1,0.5,0.1,1]),
	
	                        get left() {this._left=element.list[ptr+1];
					return this._left;},
	                        get top() {this._top=element.list[ptr+2];
					return this._top;},
	                        get width() {this._width=element.list[ptr+3];
					return this._width;},
				get height() {this._height=element.list[ptr+4];
					return this._height;},
				get rotate() {this._rotate=element.list[ptr+5];
					return this._rotate;},
	                        get color() {return this._color;},
	
	                        set left(x){this._left=x;element.list[ptr+1]=x;},
	                        set top(y){this._top=y;element.list[ptr+2]=y;},
	                        set width(w){this._width=w;element.list[ptr+3]=w;},
				set height(h){this._height=h;element.list[ptr+4]=h;},
				set rotate(deg){this._rotate=deg;element.list[ptr+5]=deg;},
	                        set color(c){this._color=c;element.list.set(c,ptr+6);}

	                },
			_dragable:false,
			_collidable:false,
			_velocityX:1,
			_velocityY:1,
			_animated:false,
			setAttribute(attr,val) {
				if (attr=="dragable") {
					this._dragable = val;
					element.list[ptr+10] =
						(element.list[ptr+10] &= ~_DRAG) | (_DRAG*val);
				} else if (attr=="collidable") {
					this._collidable = val;
                                        element.list[ptr+10] =
                                                (element.list[ptr+10] &= ~_COLLID) | (_COLLID*val);
				} else if (attr=="velocityX") {
					this._velocityX = val;
					element.list[ptr+18] = val;
				} else if (attr=="velocityY") {
                                        this._velocityY = val;
                                        element.list[ptr+19] = val;
				} else if (attr=="animated") {
					this._animated = val;     
					element.list[ptr+10] =
                                                (element.list[ptr+10] &= ~_ANIM) | (_ANIM*val);
                                }
			},
			getAttribute(attr) {return this["_"+attr]; },

			addEventListener(type,func) {
				element.funcNeed(1);
				const fptr = element.funcPtr;
				element.funcPtr += 1;
				element.funcList[fptr] = func;
				const isUp = (type=="pointerup")+(type=="click");
				const isDown = (type=="pointerdown")*1;
				element.list[ptr+14]=fptr*isUp || element.list[ptr+14];
				element.list[ptr+15]=fptr*isDown || element.list[ptr+15];
			},
			_src:1,
			get src() {return this._src;},
			set src(s) {this._src = s; element.list[ptr+16] = s;},
			_playbackRate : 1.0,
			get playbackRate() {return this._playbackRate},
                        set playbackRate(s) {this._playbackRate = s; element.list[ptr+17] = s;}
	        };
	} else if (type=="circle") {
		element.list[ptr] = 2;
		return {
			id :ptr,
			style : {           
				_left : element.list[ptr+1],
                                _top : element.list[ptr+2],
				_size : 120,
                                _color : new Float32Array([1,0.5,0.1,1]),       

				get left() {this._left=element.list[ptr+1];     
					return this._left;},                          
				get top() {this._top=element.list[ptr+2];
                                        return this._top;},
                                get size() {this._size=element.list[ptr+3];
					return this._size;},  
				get color() {return this._color;},

				set left(x){this._left=x;element.list[ptr+1]=x;},
				set top(y){this._top=y;element.list[ptr+2]=y;},   
				set size(s){this._size=s;element.list[ptr+3]=s;},
				set color(c){this._color=c;element.list.set(c,ptr+6);}
                        },
			_dragable:false,
                        _collidable:false,    
			_velocityX:0,
                        _velocityY:0,
                        _animated:false,
                        setAttribute(attr,val) {
                                if (attr=="dragable") {
                                        this._dragable = val;
                                        element.list[ptr+10] =
                                                (element.list[ptr+10] &= ~_DRAG) | (_DRAG*val);
                                } else if (attr=="collidable") {
                                        this._collidable = val;                              
					element.list[ptr+10] =
                                                (element.list[ptr+10] &= ~_COLLID) | (_COLLID*val);
                                } else if (attr=="velocityX") {
                                        this._velocityX = val;
                                        element.list[ptr+18] = val;
                                } else if (attr=="velocityY") {
                                        this._velocityY = val;
                                        element.list[ptr+19] = val;
                                } else if (attr=="animated") {
                                        this._animated = val;
                                        element.list[ptr+10] =
                                                (element.list[ptr+10] &= ~_ANIM) | (_ANIM*val);    
				}
                        },
			getAttribute(attr) {return this["_"+attr]; },

			addEventListener(type,func) {          
				element.funcNeed(1);                                    
				const fptr = element.funcPtr;
                                element.funcPtr += 1;
                                element.funcList[fptr] = func;
                                const isUp = (type=="pointerup")+(type=="click");
                                const isDown = (type=="pointerdown")*1;
                                element.list[ptr+14]=fptr*isUp || element.list[ptr+14];
				element.list[ptr+15]=fptr*isDown || element.list[ptr+15];
			}
		};
	}
}

const nyentuh = (type,x,y,k,h,a,b,m=0) => {
	m = m*Math.PI/180; /*degres to radian*/
	if (m != 0) {
		/*rotasi dulu koordinat nya*/
		const nx = k + (x-k)*Math.cos(m)+(y-h)*Math.sin(m);
		const ny = h - (x-k)*Math.sin(m)+(y-h)*Math.cos(m);
		x = nx; y = ny; /* kembalikan nilainya*/
	}
        if (type==2) {
		/* Rumus lingkaran */
		return ((x - k)**2 + (y - h)**2 < a*a);
	} else {
		/* rumus pemgecekan 4 langkah persegi panjang*/
		return (x>(k-a)&&x<(k+a)&&y>(h-b)&&y<(h+b));
	}
}


WebGLRenderingContext.prototype.checkElement = function() {
	const rect = this.canvas.getBoundingClientRect();
        const rleft = rect.left;
        const rtop = rect.top;
	this.canvas.addEventListener("pointerdown",(e)=> {
		const pointerId = e.pointerId || 1;
		const x = e.clientX-rleft;
		const y = e.clientY-rtop;
		let belumada = 1;
		for(let i=element.pointer-20;i>=0;i-=20) {
			const elX = element.list[i+1];
			const elY = element.list[i+2];
			const nilai = nyentuh(element.list[i],x,y,elX,elY,element.list[i+3]/2,
				element.list[i+4]/2,element.list[i+5])*belumada*1;
			const fungsi = element.funcList[element.list[i+15]];
                        nilai && fungsi && fungsi();
			belumada-=nilai;
			element.list[i+11] = element.list[i+11]*(1-nilai) + pointerId*nilai;
			element.list[i+12] = element.list[i+12]*(1-nilai) + (x - elX)*nilai;
			element.list[i+13] = element.list[i+13]*(1-nilai) + (y - elY)*nilai;
		}
	});
	this.canvas.addEventListener("pointermove",(e) => {
		const pointerId = e.pointerId || 1;
		const x = e.clientX-rleft;
                const y = e.clientY-rtop;                   
		for(let i=0;i<element.pointer;i+=20) {
			const diizinkan = (element.list[i+10] & _DRAG) != 0;
			const nilai = (element.list[i+11] == pointerId)*1*diizinkan;
			const xkotak = element.list[i+1];
			const ykotak = element.list[i+2];
			const targetX = xkotak*(1-nilai)+(x - element.list[i+12])*nilai;
			const targetY = ykotak*(1-nilai)+(y - element.list[i+13])*nilai;
			element.list[i+1] += (targetX-xkotak);
			element.list[i+2] += (targetY-ykotak);


			if ((element.list[i+10] & _COLLID) == 0) continue;
			for(let j=0;j<element.pointer;j+=20) {
				if (j==i || (element.list[j+10] & _COLLID) == 0) continue;
				if(this.isCollision(i,j)){
					element.list[i+1] -= pushXY[0];
					element.list[i+2] -= pushXY[1];
				}
			}
			
		}
	});
	function endDrag(e) {
		const pointerId = e.pointerId || 1;
                for(let i=0;i<element.pointer;i+=20) {
                        const nilai = (element.list[i+11]==pointerId)*1;
			const fungsi = element.funcList[element.list[i+14]];
			nilai && fungsi && fungsi();
			const nilaiNeg = 1-nilai;
                        element.list[i+11] = element.list[i+11]*nilaiNeg;
                        element.list[i+12] = element.list[i+12]*nilaiNeg;
                        element.list[i+13] = element.list[i+13]*nilaiNeg;
                }
	}
	this.canvas.addEventListener("pointerup",endDrag);
	this.canvas.addEventListener("pointerclose",endDrag);
}

WebGLRenderingContext.prototype.renderElement = function(idx) {
	const ptr = idx*20;
        const satuElement = element.list.subarray(ptr,ptr+20);
	/*Movement*/
	
	if ((satuElement[10] & _ANIM) != 0) {
		element.list[ptr+1] += satuElement[18];
		element.list[ptr+2] += satuElement[19];
	}


	/*Physics*/
	if ((satuElement[10] & _COLLID) != 0) {
                for(let j=0;j<element.pointer;j+=20) {
                        if (j==ptr || (element.list[j+10] & _COLLID) == 0) continue;   
			if(this.isCollision(ptr, j)){                
				element.list[ptr+1] -= pushXY[0];
				element.list[ptr+2] -= pushXY[1];
                        }
		}
	}
	/*Draw*/
	const type = satuElement[0];
	const x = satuElement[1];
	const y = satuElement[2];
	const w = satuElement[3];
	const h = satuElement[4];
	const rgba = satuElement.subarray(6,10);
	if (type==1) {
		const kotak = this.renderRect(x,y,w,h,satuElement[5],50,50,rgba);
		const gambar = satuElement[16];
		gambar && this.renderImg(kotak,gambar,12*satuElement[17]);
	} else if (type==2) {
		this.renderCircle(x,y,w/2,rgba);
	}
}


/* collision */

export const pushXY = new Float32Array(2);

WebGLRenderingContext.prototype.isCollision = function (objek1, objek2) {
	/*Ambil data dari  element.list (20 float per objek)*/
	const o1 = element.list.subarray(objek1, objek1 + 20);
	const o2 = element.list.subarray(objek2, objek2 + 20);

	const type1 = o1[0]; 
	const type2 = o2[0];

	const x1 = o1[1]; const y1 = o1[2];
	const x2 = o2[1]; const y2 = o2[2];

	const sudut1 = o1[5] * 0.0174533; /* Ke radian */
	const sudut2 = o2[5] * 0.0174533;

	const w1 = o1[3] / 2; const h1 = o1[4] / 2;
	const w2 = o2[3] / 2; const h2 = o2[4] / 2;
	const dot = (a, b) => a[0] * b[0] + a[1] * b[1];

	if (type1 === 2 && type2 === 2) {
		const Tx = x2 - x1;
		const Ty = y2 - y1;

		const jarak = Math.sqrt(Tx * Tx + Ty * Ty);
		const r1 = w1; 
		const r2 = w2;
		const overlap = (r1 + r2) - jarak;

		if (jarak > 0) {
			const nx = Tx / jarak;
			const ny = Ty / jarak;
			pushXY[0] = -nx * overlap;
			pushXY[1] = -ny * overlap;
		} else {
			pushXY[0] = overlap;
			pushXY[1] = 0;
		}

		return overlap >= 0;

	} 
    
	else if (type1 === 1 && type2 === 1) {

		const sinSudut1 = Math.sin(sudut1);
		const cosSudut1 = Math.cos(sudut1);
		const sinSudut2 = Math.sin(sudut2);
		const cosSudut2 = Math.cos(sudut2);
		
		const Ax = [cosSudut1, sinSudut1];
		const Ay = [-sinSudut1, cosSudut1];
		const Bx = [cosSudut2, sinSudut2];
		const By = [-sinSudut2, cosSudut2];

		const T = [x2 - x1, y2 - y1];
		const abdot = (a, b) => Math.abs(a[0] * b[0] + a[1] * b[1]);

		const overlapAx = (w1 + w2 * abdot(Bx, Ax) + h2 * abdot(By, Ax)) - abdot(T, Ax);
		const overlapAy = (h1 + w2 * abdot(Bx, Ay) + h2 * abdot(By, Ay)) - abdot(T, Ay);
		const overlapBx = (w1 * abdot(Ax, Bx) + h1 * abdot(Ay, Bx) + w2) - abdot(T, Bx);
		const overlapBy = (w1 * abdot(Ax, By) + h1 * abdot(Ay, By) + h2) - abdot(T, By);

		const minOverlap = Math.min(overlapAx, overlapAy, overlapBx, overlapBy);
		const sumbus = [Ax, Ay, Bx, By];
		let sumbu = sumbus[[overlapAx, overlapAy, overlapBx, overlapBy].indexOf(minOverlap)];
        
		const jarak = T[0] * sumbu[0] + T[1] * sumbu[1];
		sumbu = jarak < 0 ? sumbu.map(x => -x) : sumbu;

		pushXY[0] = sumbu[0] * minOverlap;
		pushXY[1] = sumbu[1] * minOverlap;

		return overlapAx >= 0 && overlapAy >= 0 && overlapBx >= 0 && overlapBy >= 0;
	} else {
		const isO1Circle = type1 === 2;
		const circ = isO1Circle ? o1 : o2;
		const rect = isO1Circle ? o2 : o1;
		const normal = isO1Circle ? -1 : 1;

		const w = rect[3] / 2; 
		const h = rect[4] / 2; 
		const r = circ[3] / 2;
		const sudutRect = rect[5] * 0.0174533;

		const Ax = [Math.cos(sudutRect), Math.sin(sudutRect)];
		const Ay = [-Math.sin(sudutRect), Math.cos(sudutRect)];
        
		const T = [circ[1] - rect[1], circ[2] - rect[2]];

		const localX = dot(T, Ax);
		const localY = dot(T, Ay);

		const closestX = Math.max(-w, Math.min(localX, w));
		const closestY = Math.max(-h, Math.min(localY, h));

		const TLoc = [localX - closestX, localY - closestY];

		const jarak = Math.sqrt(dot(TLoc, TLoc));
		const overlap = r - jarak;

		let nx = 0, ny = 0;
		if (jarak > 0) {
			nx = TLoc[0] / jarak;
			ny = TLoc[1] / jarak;
		} else {
			const dx = w - Math.abs(localX);
			const dy = h - Math.abs(localY);
			if (dx < dy) {
				nx = localX >= 0 ? 1 : -1;
			} else {
				ny = localY >= 0 ? 1 : -1;
			}
		}

		const localPushX = nx * Ax[0] + ny * Ay[0];
		const localPushY = nx * Ax[1] + ny * Ay[1];
		
		pushXY[0] = localPushX * overlap * normal;
		pushXY[1] = localPushY * overlap * normal;
		return overlap >= 0;
	}
}; 
