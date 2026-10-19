# gameLibJs

gameLibJs adalah sebuah library javascript untuk membuat game yang memanfaatkan API webGL.

drawGL.js : Library yang fungsinya untuk membantu pengguna menggambar di canvas webGL dengan lebih mudah.
element.js : Library yang fungsinya untuk mendaftarkan bentuk, agat dapat memberikan properti pada bentuk yang digambar, seperti *Velocity*/kecepatan dan pergerakan.
joystick.js : Library untuk menambahkan joystick pada pilihan element.
GLlib.js : Menggabungkan library drawGL, element, dan joystick menjadi satu, dan melakukan bantuan untuk membuat perulangan otomatis sesuai delta time.

allGLlib.js : Gabungan dari semua Library yang terpisah menjadi satu file besar. Dan tidak bersifat module.

## 1. Instalasi
Ada tiga cara untuk menggunakan library ini, yaitu cara klasik, cara modern/module, dan cara daring/*online*.

**Cara klasik**
Unduh file *allGLlib.js*, kemudian tambahkan seperti ini pada file html:
```html
<script src="allGLlib.js"><script>
```
Kemudian sudah dapat digunakan.  
Keunggulan cara ini adalah mudah, dan hanya perlu menginstal satu file saja. Tapi akan ada kesulitan jika ingin memodifikasi library.

**Cara Modern/Online**
Unduh semua file-file yang dibutuhkan seperti :
- GLlib.js
- element.js
- drawGL.js
- joystick.js  
dalam satu folder yang sama dengan folder *index.html* dan *script.js* milik Anda. Pastikan *script.js* dipanggil dalam bentuk module.
```html
<script type="module src="script.js"></script>
```
Kemudian tambahkan pada file javascript seperti ini di paling atas :
```javascript
import * as gllib from './GLlib.js'
```
Setelah itu, sudah dapat digunakan.  
Keuntungan cara ini adalah, adanya kemudahan untuk memodifikasi library ini, seperti jika tidak ingin menggunakan joystick, dapat menghapus sintaks *import joystick.js* pada *GLlib.js*

**Cara Online**

## 2. Dokumentasi Penggunaan 
**Deklarasi context**
```javascript
const canvas = document.getElementById('gameCanvas');
const gl = canvas.getContext('webgl');
```
**Mengubah warna latar belakang**
```javascript
gl.body.style.color = rgba(0,255,255);
```
**Membuat perulangan**
```javascript
update(()=> {
 // Sintaks dalam perulangan
});
```
**Menggambar bentuk dasar**
Ini harus diletakkan dalam perulangan. 
```javascript
// Bikin warna
const merah = rgba(255,0,0);
//Rectangle
//5 Parameter: x,y,w,h,warna
gl.renderRect(40,70,50,70,merah);
// 6 Parameter: x,y,w,h,derajat kemiringan, warna
/* 8 Parameter : x,y,w,h,derajat kemiringan,
titik poros X, titik poros Y, warna  
*/
/*
Titik poros itu adalah poros ketika kemiringan persegi diputar,  
di mana jika isinya 0, maka titiknya ada diujung kiri/atas,  
jika isinya 100, maka titiknya ada di kanan/bawah,
dan jika isinya 50 atau diantara 0-100,
maka titik poros ada di tengah-tengah
*/

// Circle : x,y,r, warna 
gl.renderCircle(40,70,50,merah);
// Ring : x,y,r dalam, ketebalan, warna
gl.renderRing(40,70,50,10,merah);
```

**Membuat Element**  
Ini hanya dideklarasikan sekali di luar perulangan.  
```javascript
const kotak1 = gl.createElement("rectangle");
const bulat1 = gl.createElement("circle");

// Mengubah properti, mirip seperti css
kotak1.style.width = 500;
kotak1.style.color = rgba(220,56,0,1);


// Event Listener
kotak1.addEventListener("pointerup",()=> {
// Fungsi yang dijalankan sekali jika kotak dilepas
});
//Hanya aja click, pointerup, dan pointerdown
```

**Texture**  
```javascript
const sumbergambar1 = gl.initTexture("gambar.png",2,2);
// Params : url, banyak gambar di mendatar(horizontal), banyak gambar menurun(vertikal)
const gambar1 = gl.getImg(sumbergambar1,1,0)
// gambar, index, dan refleksi
/*
Kalau 0, Tidak terbalik.  
Kalau 1, terbalik horizontal.  
Kalau 2, terbalik vertikal.

index bisa berbentuk array jika  
yang dibuat adalah animasi, contoh [0,1,2,3]
*/

// Pakai
kotak1.src = gambar1;

// Atau jika Langsung gambar :
update(()=> {
const kotakan2 = gl.renderRect(200,200,30,50);
// Timpa 
gl.renderImg(kotakan2, gambar1,1)
// kotak yg ditimpa, gambar, fps jika animasi
});


```

## 3. Target
1. Rewrite beberapa fungsi ke WebAssembly
2. Mendukung API web Audio, baik file audio maupun audio sintesis.
3. Mendukung pembuatan game 3D
