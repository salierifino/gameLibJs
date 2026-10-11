import * as fisik from "./physics.js"

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

WebGLRenderingContext.prototype.createElement = function(type) {
	if (type != "rectangle" && type != "circle") return null;
	element.need(20); 
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

	if (type == "rectangle") {
		element.list[ptr] = 1;
		return {
			id :ptr,
	                style : {
	                        _left : element.list[ptr+1],
	                        _top : element.list[ptr+2],
	                        _width : 120,
				_height : 120,
	                        _color : new Float32Array([1,0.5,0.1,1]),
	
	                        get left() {return this._left;},
	                        get top() {return this._top;},
	                        get width() {return this._width;},
				get height() {return this._height;},
	                        get color() {return this._color;},
	
	                        set left(x){this._left=x;element.list[ptr+1]=x;},
	                        set top(y){this._top=y;element.list[ptr+2]=y;},
	                        set width(w){this._width=w;element.list[ptr+3]=w;},
				set height(h){this._height=h;element.list[ptr+4]=h;},
	                        set color(c){this._color=c;element.list.set(c,ptr+6);}
	                },
			_dragable:false,
			get setDragable() {return this._dragable;},
			set setDragable(t){this._dragable=t;
				element.list[ptr+10] =(element.list[ptr+10] &= ~1) | t*1},
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
	} else if (type=="circle") {
		element.list[ptr] = 2;
		return {
			id :ptr,
			style : {           
				_left : element.list[ptr+1],
                                _top : element.list[ptr+2],
				_size : 120,
                                _color : new Float32Array([1,0.5,0.1,1]),                                                                         
				get left() {return this._left;},
				get top() {return this._top;},
                                get size() {return this._size;},  
				get color() {return this._color;},                                                                                                                   
				set left(x){this._left=x;element.list[ptr+1]=x;},
				set top(y){this._top=y;element.list[ptr+2]=y;},   
				set size(s){this._size=s;element.list[ptr+3]=s;},
				set color(c){this._color=c;element.list.set(c,ptr+6);}
                        },
			_dragable:false,
                        get setDragable() {return this._dragable;},
                        set setDragable(t){this._dragable=t;
				element.list[ptr+10] =(element.list[ptr+10] &= ~1) | t*1},
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
			const diizinkan = (element.list[i+10] & 1) != 0;
			const nilai = (element.list[i+11] == pointerId)*1*diizinkan;
			const xkotak = element.list[i+1];
			const ykotak = element.list[i+2];
			const targetX = xkotak*(1-nilai)+(x - element.list[i+12])*nilai;
			const targetY = ykotak*(1-nilai)+(y - element.list[i+13])*nilai;
			element.list[i+1] += (targetX-xkotak);
			element.list[i+2] += (targetY-ykotak);


			for(let j=0;j<element.pointer;j+=20) {
				if (j==i) continue;
				if(this.isCollision(i,j)){
					element.list[i+1] -= fisik.pushXY[0];
					element.list[i+2] -= fisik.pushXY[1];
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
	const satuElement = element.list.subarray(ptr,ptr+10);
	const type = satuElement[0];
	const x = satuElement[1];
	const y = satuElement[2];
	const w = satuElement[3];
	const h = satuElement[4];
	const rgba = satuElement.subarray(6,10);
	if (type==1) {
		this.renderRect(x,y,w,h,satuElement[5],50,50,rgba);
	} else if (type==2) {
		this.renderCircle(x,y,w/2,rgba);
	}
}
