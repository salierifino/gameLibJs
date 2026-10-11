let postConv = new Float32Array(2);
function convPost(x,y,canvWidth,canvHeight) {
	if(canvHeight==null) {
		console.error("x,y, lebar dan tinggi canvas harus diisi!");
		x=0.0; y=0.0
	}
	postConv[0] = 2*x/canvWidth-1;
	postConv[1] = 1-2*y/canvHeight;
}

export const dataGL = {
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

export const warnaHitam = new Float32Array([0,0,0,1]);

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

WebGLRenderingContext.prototype.getImg = function(src,idx=0,flipIdx) {
	if (typeof idx != 'object') {idx = [idx];}
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
	return mainData;
}

WebGLRenderingContext.prototype.millsecond = 0;

WebGLRenderingContext.prototype.renderImg = function(ptr,data,fps=12) {
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
        
        this.clearColor(0.1,0.1,0.1,1.0);
        this.clear(this.COLOR_BUFFER_BIT);    
	this.bufferData(this.ARRAY_BUFFER, dataGL.bigShaderData.subarray(0,
                dataGL.pointer),this.DYNAMIC_DRAW);
        this.drawArrays(this.TRIANGLES, 0, dataGL.pointer / 7);
}

                                                                                

