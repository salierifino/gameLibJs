# gameLibJs

gameLibJs adalah sebuah library javascript untuk membuat game yang memanfaatkan API webGL.

drawGL.js : Library yang fungsinya untuk membantu pengguna menggambar di canvas webGL dengan lebih mudah.
element.js : Library yang fungsinya untuk mendaftarkan bentuk, agat dapat memberikan properti pada bentuk yang digambar, seperti *Velocity*/kecepatan dan pergerakan.
joystick.js : Library untuk menambahkan joystick pada pilihan element.
GLlib.js : Menggabungkan library drawGL, element, dan joystick menjadi satu, dan melakukan bantuan untuk membuat perulangan otomatis sesuai delta time.

allGLlib.js : Gabungan dari semua Library yang terpisah menjadi satu file besar. Dan tidak bersifat module.

## 1. Cara menggunakan
Ada dua cara untuk menggunakan library ini, yaitu cara klasik, dan cara modern/module.

**Cara klasik**
Menambahkan seperti ini pada file html:
```html
<script src="allGLlib.js"><script>
```
