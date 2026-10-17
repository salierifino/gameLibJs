const element = {
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

 const pushXY = new Float32Array(2);

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

let postConv = new Float32Array(2);
function convPost(x,y,canvWidth,canvHeight) {
	if(canvHeight==null) {
		console.error("x,y, lebar dan tinggi canvas harus diisi!");
		x=0.0; y=0.0
	}
	postConv[0] = 2*x/canvWidth-1;
	postConv[1] = 1-2*y/canvHeight;
}

 const dataGL = {
	bigShaderData: new Float32Array(100 * 42),
	pointer: 0,
	need(n) {
		/*Jika wadah yang dibutuhkan kurang*/
		if (this.pointer + n > this.bigShaderData.length){
			/*Buat wadah baru dengan ukuran 2× lebih besar*/
			const bigger = new Float32Array(this.bigShaderData.length * 2);
			bigger.set(this.bigShaderData);
			this.bigShaderData = bigger; /*Ganti wadah dengan yang baru*/
		}
	},
	textPtr: 0
};
WebGLRenderingContext.prototype.reset = () => dataGL.pointer = 0;

 const warnaHitam = new Float32Array([0,0,0,1]);

WebGLRenderingContext.prototype.renderCircle = function (xpusat,ypusat,r,clr=warnaHitam){
	const op = clr[3] ?? 1.0;
	dataGL.need(1050); /*pesan tempat 1050(50×3×7)*/
	const ptr = dataGL.pointer; 
	dataGL.pointer += 1050; 
	const shaderData = dataGL.bigShaderData;
	if(xpusat==null || ypusat==null || r==null) {
		console.error('x,y, dan r harus diisi !');
		return null;
	}
	r = r*2; /*ubah ke diameter*/
	const canvWidth = this.canvas.width;
	const canvHeight = this.canvas.height;
	convPost(xpusat,ypusat,canvWidth,canvHeight);
	xpusat = postConv[0]; ypusat = postConv[1];
	/*1 lingkaran ada 50 segment*/
	const rx = r/canvWidth;   
	const ry = r/canvHeight;
	for(let i=0;i<50;i++) {
		/*0.12566 = 1/segment × 2π*/
		const theta1 = 0.12566*i; 
		const theta2 = 0.12566*(i+1);
		const x1 = xpusat+rx*Math.cos(theta1);
		const y1 = ypusat+ry*Math.sin(theta1);
		const x2 = xpusat+rx*Math.cos(theta2);
		const y2 = ypusat+ry*Math.sin(theta2);
		/*Masukan ke dalam shader*/
		shaderData[21*i+0+ptr] = xpusat;
		shaderData[21*i+1+ptr] = ypusat;
		shaderData[21*i+7+ptr] = x1;
		shaderData[21*i+8+ptr] = y1;
		shaderData[21*i+14+ptr] = x2;
		shaderData[21*i+15+ptr] = y2;
		for(let j=0;j<3;j++) {
			shaderData.set(clr,21*i+7*j+2+ptr);
			shaderData[21*i+7*j+5+ptr] = op;
			shaderData[21*i+7*j+6+ptr] = 0.0;
		}
	}

}

WebGLRenderingContext.prototype.renderRing = function (xpusat, ypusat, r, thickness, clr=warnaHitam) {
	const op = clr[3] ?? 1.0;
	dataGL.need(2100); /* Donat itu ada dua lingkaran luar dalam*/
	const ptr = dataGL.pointer; 
	dataGL.pointer += 2100; 
	const shaderData = dataGL.bigShaderData;

	if (xpusat == null || ypusat == null || r == null || thickness == null) {
		console.error('x, y, r, dan thickness harus diisi !');
		return null;
	}

	const canvWidth = this.canvas.width;
	const canvHeight = this.canvas.height;

	convPost(xpusat, ypusat, canvWidth, canvHeight);
	xpusat = postConv[0]; ypusat = postConv[1];
	/* adalah jari-jari luar
	 * thickness adalah ketebalan cincin */
	r = r*2; /*ubah ke diameter*/   
	const innerR = r;
	const outerR = r+thickness;

	const rxOut = outerR / canvWidth;  
	const ryOut = outerR / canvHeight;
	const rxIn = innerR / canvWidth;   
	const ryIn = innerR / canvHeight;

	for (let i = 0; i < 50; i++) {
		/*0.12566 = 1/segment × 2π*/
		const theta1 = 0.12566*i;
		const theta2 = 0.12566*(i+1);

		/*Titik-titik inner dan outer pada sudut theta1 dan theta2*/
		const xIn1 = xpusat + rxIn * Math.cos(theta1);
		const yIn1 = ypusat + ryIn * Math.sin(theta1);
		const xOut1 = xpusat + rxOut * Math.cos(theta1);
		const yOut1 = ypusat + ryOut * Math.sin(theta1);

		const xIn2 = xpusat + rxIn * Math.cos(theta2);
		const yIn2 = ypusat + ryIn * Math.sin(theta2);
		const xOut2 = xpusat + rxOut * Math.cos(theta2);
		const yOut2 = ypusat + ryOut * Math.sin(theta2);

		/* 6 Vertex per segmen
		 * membentuk 2 segitiga / quad untuk donat/cincin
		 * Kalau lingkaran 3 vertex saja, yaitu pusat, sudut1 dan 2
		 * Format per vertex: [x, y, r, g, b, opacity, idx] */

		const baseIndex = ptr + (i * 42);

		/* Vertex 1: Inner 1 */
		shaderData[baseIndex + 0] = xIn1;
		shaderData[baseIndex + 1] = yIn1;
		shaderData.set(clr, baseIndex + 2);
		shaderData[baseIndex + 5] = op;
		shaderData[baseIndex + 6] = 0.0;

		/* Vertex 2: Outer 1 */
		shaderData[baseIndex + 7] = xOut1;
		shaderData[baseIndex + 8] = yOut1;
		shaderData.set(clr, baseIndex + 9);
		shaderData[baseIndex + 12] = op;
		shaderData[baseIndex + 13] = 0.0;

		/* Vertex 3: Outer 2 */
		shaderData[baseIndex + 14] = xOut2;
		shaderData[baseIndex + 15] = yOut2;
		shaderData.set(clr, baseIndex + 16);
		shaderData[baseIndex + 19] = op;
		shaderData[baseIndex + 20] = 0.0;

		/* Vertex 4: Inner 1 */
		shaderData[baseIndex + 21] = xIn1;
		shaderData[baseIndex + 22] = yIn1;
		shaderData.set(clr, baseIndex + 23);
		shaderData[baseIndex + 26] = op;
		shaderData[baseIndex + 27] = 0.0;

		/* Vertex 5: Outer 2 */
		shaderData[baseIndex + 28] = xOut2;
		shaderData[baseIndex + 29] = yOut2;
		shaderData.set(clr, baseIndex + 30);
		shaderData[baseIndex + 33] = op;
		shaderData[baseIndex + 34] = 0.0;

		/* Vertex 6: Inner 2 */
		shaderData[baseIndex + 35] = xIn2;
		shaderData[baseIndex + 36] = yIn2;
		shaderData.set(clr, baseIndex + 37);
		shaderData[baseIndex + 40] = op;
		shaderData[baseIndex + 41] = 0.0;
	}
}

WebGLRenderingContext.prototype.renderRect = function (x,y,width,height=width,e=0,f=50,g=50,h=new Float32Array([0,0,0,0])) {
        dataGL.need(42); /* pesan tempat 42(7×6) */
	const ptr = dataGL.pointer;
        dataGL.pointer += 42;
	const shaderData = dataGL.bigShaderData;
	if(x==null || y==null || width==null) {
                console.error('x,y, dan width harus diisi !');
                return null;
        }
	const a = width/2;
	const b = height/2;
	const canvWidth = this.canvas.width;
	const canvHeight = this.canvas.height;
	let angle, axisX, axisY, clr;
	if (typeof e == 'object') {
		angle = 0; axisX = 50; axisY = 50; clr = e;
	} else if (typeof f == 'object') {
		angle = e; axisX = 50; axisY = 50; clr = f;
	} else {
		angle = e; axisX = f; axisY = g; clr = h;
	}
	const R = clr[0]; const G = clr[1];
	const B = clr[2]; const op = clr[3] ?? 1.0;
	const rad = angle*0.01745; /* π/180*/
	const sinRad = Math.sin(rad);
	const cosRad = Math.cos(rad);
	const xpusat = x+a*(axisX/50-1);
	const ypusat = y+b*(axisY/50-1);
	const dx1 = x-a-xpusat; 
	const dy1 = y-b-ypusat; 
	const dx2 = x+a-xpusat;
        const dy2 = y+b-ypusat;
	const Ax = xpusat + dx1*cosRad-dy1*sinRad;
	const Ay = ypusat + dx1*sinRad+dy1*cosRad;
	const Bx = xpusat + dx2*cosRad-dy1*sinRad;
	const By = ypusat + dx2*sinRad+dy1*cosRad;
	const Cx = xpusat + dx2*cosRad-dy2*sinRad;
	const Cy = ypusat + dx2*sinRad+dy2*cosRad;
	const Dx = xpusat + dx1*cosRad-dy2*sinRad;
	const Dy = ypusat + dx1*sinRad+dy2*cosRad;
	convPost(Ax,Ay,canvWidth,canvHeight); 
	const Ax2 = postConv[0];  const Ay2 = postConv[1];
	convPost(Bx,By,canvWidth,canvHeight); 
	const Bx2 = postConv[0];  const By2 = postConv[1];
	convPost(Cx,Cy,canvWidth,canvHeight); 
	const Cx2 = postConv[0];  const Cy2 = postConv[1];
	convPost(Dx,Dy,canvWidth,canvHeight);
	const Dx2 = postConv[0];  const Dy2 = postConv[1];
	/*Vertex 0 : A*/
	shaderData[ptr+0] = Ax2; /*X*/   shaderData[ptr+1] = Ay2; /*Y*/
	shaderData[ptr+2] = R; /*R*/    shaderData[ptr+3] = G; /*G*/
	shaderData[ptr+4] = B; /*B*/ 	shaderData[ptr+5] = op; /*A*/
	shaderData[ptr+6] = 0; /*Idx*/
 	/* vertex 1: B */
 	shaderData[ptr+7] = Bx2;shaderData[ptr+8] = By2;shaderData[ptr+9] = R;	
	shaderData[ptr+10] = G;	shaderData[ptr+11] = B;	shaderData[ptr+12] = op;
 	shaderData[ptr+13] = 0;
 	/* vertex 2: C */
	shaderData[ptr+14] = Cx2; shaderData[ptr+15] = Cy2; shaderData[ptr+16] = R; 
	shaderData[ptr+17] = G; shaderData[ptr+18] = B; shaderData[ptr+19] = op;
 	shaderData[ptr+20] = 0;
 	/*vertex 3: A lagi (segitiga kedua)*/
 	shaderData[ptr+21] = Ax2; shaderData[ptr+22] = Ay2; shaderData[ptr+23] = R;
 	shaderData[ptr+24] = G; shaderData[ptr+25] = B; shaderData[ptr+26] = op;
 	shaderData[ptr+27] = 0;
 	/* vertex 4: D */
	shaderData[ptr+28] = Dx2; shaderData[ptr+29] = Dy2; shaderData[ptr+30] = R;
	shaderData[ptr+31] = G; shaderData[ptr+32] = B; shaderData[ptr+33] = op;
 	shaderData[ptr+34] = 0;
 	/* vertex 5: C lagi */
 	shaderData[ptr+35] = Cx2; shaderData[ptr+36] = Cy2; shaderData[ptr+37] = R;
 	shaderData[ptr+38] = G; shaderData[ptr+39] = B; shaderData[ptr+40] = op;
 	shaderData[ptr+41] = 0;
	return ptr;
}


WebGLRenderingContext.prototype.imgList = {
	list : new Array(10),
	pointer : 1,
	need(n) {                                                                                    
		if (this.pointer + n > this.list.length){
			const bigger = new Float32Array(this.list.length*2);
                        bigger.set(this.list);  
			this.list = bigger; 
		}
        }
}

WebGLRenderingContext.prototype.getImg = function(src,idx=0,flipIdx) {
	if (typeof idx != 'object') {idx = [idx];}
	this.imgList.need(1);
	const imgpointer = this.imgList.pointer;
	this.imgList.pointer++;
	const mainData = new Float32Array(30*idx.length);
	for(let i = 0;i<(idx.length||1);i++) {
		const txtidx = src[0]+1;
		const hor = src[1];
		const ver = src[2];
		if(idx[i] >= hor*ver) {idx[i] = hor*ver-1;}
		const U = 1/hor;
		const V = 1/ver;
		const x = idx[i]%hor;
		const y = Math.floor(idx[i]/hor);
		const U1 = U*x;
		const U2 = U1+U;
		const V1 = V*y;
		const V2 = V1+V;
		const A = new Float32Array([U1,V1,0,1.0,txtidx]);
		const B = new Float32Array([U2,V1,0,1.0,txtidx]);
		const C = new Float32Array([U2,V2,0,1.0,txtidx]);
		const D = new Float32Array([U1,V2,0,1.0,txtidx]);

		const E = new Float32Array(30);
		switch(flipIdx){
			case 0:
				E.set(A,0);E.set(A,15);
				E.set(B,5);E.set(D,20);
				E.set(C,10);E.set(C,25);
				break;
			case 1:
				E.set(B,0);E.set(B,15);
                        	E.set(A,5);E.set(C,20);
 	                        E.set(D,10);E.set(D,25);
         	                break;
			case 2:
				E.set(D,0);E.set(D,15);
                	        E.set(C,5);E.set(A,20);
                        	E.set(B,10);E.set(B,25);
				break;
			default:
				E.set(A,0);E.set(A,15);
				E.set(B,5);E.set(D,20);
				E.set(C,10);E.set(C,25);
		}
		mainData.set(E,i*30);
	}
	this.imgList.list[imgpointer] = mainData;
	return imgpointer;
}

WebGLRenderingContext.prototype.millsecond = 0;

WebGLRenderingContext.prototype.renderImg = function(ptr,imgPtr,fps=12) {
	const data = this.imgList.list[imgPtr];
        const shaderData = dataGL.bigShaderData;
	const idx = Math.floor(this.millsecond/1000*fps)%(data.length/30);
	const i = idx*30;

	/* paling ngebut */
	shaderData.set(data.subarray(0+i,5+i),  ptr+2);
	shaderData.set(data.subarray(5+i,10+i),  ptr+9);
	shaderData.set(data.subarray(10+i,15+i), ptr+16);
	shaderData.set(data.subarray(15+i,20+i),ptr+23);
	shaderData.set(data.subarray(20+i,25+i),ptr+30);
	shaderData.set(data.subarray(25+i,30+i),ptr+37);
}




/* 1. Buat Vertex Shader untuk koordinat */
const vsSource = `
attribute vec2 aPosition;
attribute vec4 aColorOrTexture;
attribute float aTextureIdx;
varying vec4 vColorOrTexture;
varying float vTextureIdx;
void main() {
	gl_Position = vec4(aPosition,0.0, 1.0);
	vColorOrTexture = aColorOrTexture;
	vTextureIdx = aTextureIdx;
}
`;
/* 2. Buat Fragment shader untuk warna dan texture */
let samplerList = "";
let conditionalTexture = "";
for(let i=0;i<16;i++) {
	samplerList += `uniform sampler2D uSampler${i};\n`;
	conditionalTexture += `if(id==${i+1}) {
	gl_FragColor = texture2D(uSampler${i},vColorOrTexture.xy);
} else `; }
const fsSource = `
precision mediump float;
varying vec4 vColorOrTexture;
varying float vTextureIdx;
${samplerList}
void main() {
	int id = int(vTextureIdx + 0.5);
	${conditionalTexture} {
		gl_FragColor = vec4(vColorOrTexture);
	}
}
`;


/* 3. Compile vertex shader dan fragment shader */
function compileShader(gl,type,source) {
	const shader = gl.createShader(type);
	gl.shaderSource(shader,source);
	gl.compileShader(shader);
	if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS)){
		console.error("Gagal Compile :",gl.getShaderInfoLog(shader));
		gl.deleteShader(shader);
		return null;
	}
	return shader;
}

dataGL.FSIZE = 4;/* Float32Array.BYTES_PER_ELEMENT;  */
dataGL.STRIDE = 7*dataGL.FSIZE;



WebGLRenderingContext.prototype.initLib = function() {
	const canvas = this.canvas;
	const vertex = compileShader(this, this.VERTEX_SHADER, vsSource);
	const fragment = compileShader(this, this.FRAGMENT_SHADER, fsSource);
	
	dataGL.program = this.createProgram();
	this.attachShader(dataGL.program, vertex);
	this.attachShader(dataGL.program, fragment);
	this.linkProgram(dataGL.program);
	
	if(!this.getProgramParameter(dataGL.program, this.LINK_STATUS)) {
		console.error("Gagal menjadi Program :", this.getProgramInfoLog(dataGL.program));
		return;
	}
	this.useProgram(dataGL.program);

	dataGL.buffer = this.createBuffer();                          
	dataGL.aPosition = this.getAttribLocation(dataGL.program, 'aPosition');
	dataGL.aColorOrTexture = this.getAttribLocation(dataGL.program, 'aColorOrTexture');
	dataGL.aTextureIdx = this.getAttribLocation(dataGL.program, 'aTextureIdx');
	
	this.enableVertexAttribArray(dataGL.aPosition);
	this.enableVertexAttribArray(dataGL.aColorOrTexture);      
	this.enableVertexAttribArray(dataGL.aTextureIdx);
	requestAnimationFrame((now) => this.loop(now));

}


WebGLRenderingContext.prototype.initTexture = function (url,horizontSlots=1,vertikalSlots=1) {
	const textUnit = dataGL.textPtr;
	dataGL.textPtr++;
	const samplerName = `uSampler${textUnit}`;
	const texture = this.createTexture();
	this.activeTexture(this.TEXTURE0+textUnit);
	this.bindTexture(this.TEXTURE_2D, texture);
	this.texImage2D(this.TEXTURE_2D, 0, this.RGBA, 1, 1, 0, this.RGBA, this.UNSIGNED_BYTE, new Uint8Array([0, 0, 0, 0]));
	const image = new Image();
	
        this.texParameteri(this.TEXTURE_2D, this.TEXTURE_WRAP_S, this.CLAMP_TO_EDGE);
        this.texParameteri(this.TEXTURE_2D, this.TEXTURE_WRAP_T, this.CLAMP_TO_EDGE);
        this.texParameteri(this.TEXTURE_2D, this.TEXTURE_MIN_FILTER, this.LINEAR);
        this.texParameteri(this.TEXTURE_2D, this.TEXTURE_MAG_FILTER, this.LINEAR);

	image.onload = () => {
		this.activeTexture(this.TEXTURE0+textUnit);
		this.bindTexture(this.TEXTURE_2D, texture);
                this.texImage2D(this.TEXTURE_2D,0,this.RGBA,this.RGBA,this.UNSIGNED_BYTE,image);
	};
	
	image.crossOrigin = "anonymous";
        image.src = url;
	const uSamplerLocation = this.getUniformLocation(dataGL.program, samplerName);
	this.uniform1i(uSamplerLocation, textUnit);
	return new Float32Array([textUnit,horizontSlots,vertikalSlots]);
}

const bgClr = new Float32Array([0.1,0.1,0.1,1.0]);
WebGLRenderingContext.prototype.body={
	style : {
		_color: bgClr,
		get color() {return this._color;},
		set color(c) {this._color=c;bgClr.set(c,0);}
	}
}
WebGLRenderingContext.prototype.draw = function() {
        /* Buat hanya menggambar shaderData sampai pointer  */ 
	this.enable(this.BLEND);
	this.blendFunc(this.SRC_ALPHA, this.ONE_MINUS_SRC_ALPHA);
	this.bindBuffer(this.ARRAY_BUFFER,dataGL.buffer);
        this.vertexAttribPointer(dataGL.aPosition,2,this.FLOAT,false,dataGL.STRIDE,0);
        this.enableVertexAttribArray(dataGL.aPosition);
        this.vertexAttribPointer(dataGL.aColorOrTexture,4,this.FLOAT,false,dataGL.STRIDE,2*dataGL.FSIZE);
        this.enableVertexAttribArray(dataGL.aColorOrTexture);
        this.vertexAttribPointer(dataGL.aTextureIdx,1,this.FLOAT,false,dataGL.STRIDE,6*dataGL.FSIZE);
        this.enableVertexAttribArray(dataGL.aTextureIdx);
        
        this.clearColor(bgClr[0],bgClr[1],bgClr[2],bgClr[3]);
        this.clear(this.COLOR_BUFFER_BIT);    
	this.bufferData(this.ARRAY_BUFFER, dataGL.bigShaderData.subarray(0,
                dataGL.pointer),this.DYNAMIC_DRAW);
        this.drawArrays(this.TRIANGLES, 0, dataGL.pointer / 7);
}

                                                                              


 const joystick = {
	list: new Float32Array(9*5),
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
	if (idx == 45) { /* 45 = 9x5, 9 itu x,y,size, xdalam, ydalam, sizedalam,
			pointer idx, attach id,sudut */
		console.error("Jumlah maksimum Joystick adalah 5");
		return -1;
		/* Saya tidak membuat alokasi jika melebihi maks
		 * karena joystick tidak perlu banyak-banyak */
	}
	if (idx == 0) { /* Jika belum ada joystick, taruh pojok kiri atas*/
		joystick.list.set(new Float32Array([75,75,60,75,75,30,0,0,0]),idx);

	/* Jika sudah ada taruh sebelah kanan nya
		 * Jika sudah mentok kanan, taruh bawahnya*/
	} else if (joystick.list[idx-9] + 200 >= this.canvas.width) {
		const y = joystick.list[idx-8] + 150
		joystick.list.set(new Float32Array([75,y,60,75,y,30,0,0,0]),idx);
	} else { /* jika belum mentok */
		const x = joystick.list[idx-9] + 150;
		const y = joystick.list[idx-8];
		joystick.list.set(new Float32Array([x,y,60,x,y,30,0,0,0]),idx);
	}
	joystick.pointer += 9;
	const idx2 = idx/9*13;
	
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
		set attach(el) {
			el = el.id+20;
			this._attach=el;
			joystick.list[idx+7]=el;
		},
		_rotatable : false,
		get rotatable() {return this._rotatable;},
		set rotatable(rot) {
			const rotatable = (joystick.list[idx+8] >= 180)*360;
			joystick.list[idx+8] = (joystick.list[idx+8] -= rotatable) + rot*360;
		}
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
				const xc = joystick.list[i*9+3];
				const yc = joystick.list[i*9+4];
				const r = joystick.list[i*9+5];
				if ((x-xc)**2 + (y-yc)**2 < r*r) {
					joystick.list[i*9+6] = touch.identifier+1; /* 0:tak aktif */
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
				if(joystick.list[i*9+6] == touch.identifier+1){
					const ox = joystick.list[i*9];
					const oy = joystick.list[i*9+1];
					const br = joystick.list[i*9+2]; /* batas radius */
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
					joystick.list[i*9+3] = ox + dx;

					dy = dy*over + batasY*(1-over);
					joystick.list[i*9+4] = oy + dy;
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
				const isMe = (joystick.list[i*9+6] == 
					e.changedTouches[t].identifier+1) * 1;

				joystick.list[i*9+3] = joystick.list[i*9]*isMe+
					joystick.list[i*9+3]*(1-isMe);
				joystick.list[i*9+4] = joystick.list[i*9+1]*isMe+
					joystick.list[i*9+4]*(1-isMe);
				joystick.list[i*9+6] = joystick.list[i*9+6]*(1-isMe);
			}
		}
    };
    this.canvas.addEventListener('touchend', reset, {passive:false});
    this.canvas.addEventListener('touchcancel',reset,{passive:false});
};


WebGLRenderingContext.prototype.loopJoystick = function(idx) {
	const satuJoy = joystick.list.subarray(idx*9,(idx+1)*9);
        const satuStyle = joystick.stylels.subarray(idx*13,(idx+1)*13);

	const xcover = satuJoy[0];
	const ycover = satuJoy[1];
	const radcover = satuJoy[2];

	const bind = satuJoy[7];
	const dx = satuJoy[3] - xcover;
	const dy = satuJoy[4] - ycover;
	const i = bind-20;
	element.list[i+1] += dx*0.03*element.list[i+18];
	element.list[i+2] += dy*0.03*element.list[i+19];

	const rotatable = (satuJoy[8]>=180)*1;
	const rotateVal = rotatable*360; /*jika bener, nilainya 360*/
	/*Boolean + Sudut*/
	joystick.list[i+8] = rotateVal + Math.atan2(dy,dx)*57.29578;
	const sudut = joystick.list[i+8] - rotateVal;

	element.list[bind-15] = ((sudut != -180.00003724215995)*sudut || 
		element.list[bind-15])*rotatable; /*Jika dilepas, 
		sudut tidak langsung kenbali*/

	/*render*/
	this.renderCircle(xcover,ycover,radcover,satuStyle.subarray(4,8));
	this.renderRing(xcover,ycover,radcover,satuStyle[12],satuStyle.subarray(8,12));
        this.renderCircle(satuJoy[3],satuJoy[4],satuJoy[5],satuStyle.subarray(0,4));
}


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
		const elCount = element.pointer/10;
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

/* bisa langsung dipanggil dengan update(fungsi) */
window.update = (fn) => {
  if(typeof fn === 'function') window.update = fn;
};
