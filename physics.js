import { element } from "./element.js";

export const pushXY = new Float32Array(2);

WebGLRenderingContext.prototype.isCollision = function (objek1, objek2) {
    // Ambil data dari TypedArray element.list (20 float per objek)
    const o1 = element.list.subarray(objek1, objek1 + 20);
    const o2 = element.list.subarray(objek2, objek2 + 20);

    const type1 = o1[0]; // Misal: 0 = Lingkaran, 1 = Persegi
    const type2 = o2[0];

    const x1 = o1[1]; const y1 = o2 ? o1[2] : 0; // Diperbaiki dari o1[2]
    const x2 = o2[1]; const y2 = o2[2];

    const sudut1 = o1[5] * 0.0174533; // Dibuat lebih presisi (Math.PI / 180)
    const sudut2 = o2[5] * 0.0174533;

    const w1 = o1[3] / 2; const h1 = o1[4] / 2;
    const w2 = o2[3] / 2; const h2 = o2[4] / 2;

    const dot = (a, b) => a[0] * b[0] + a[1] * b[1];

    // ==========================================
    // 1. LINGKARAN VS LINGKARAN (type1 == 0 && type2 == 0)
    // ==========================================
    if (type1 === 0 && type2 === 0) {
        const Tx = x2 - x1;
        const Ty = y2 - y1;
        const jarak = Math.sqrt(Tx * Tx + Ty * Ty);
        const r1 = w1; // Radius lingkaran disimpan di w (index 3 / 2)
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
    // ==========================================
    // 2. PERSEGI VS PERSEGI (type1 === 1 && type2 === 1)
    // ==========================================
    else if (type1 === 1 && type2 === 1) {
        const Ax = [Math.cos(sudut1), Math.sin(sudut1)];
        const Ay = [-Math.sin(sudut1), Math.cos(sudut1)];
        const Bx = [Math.cos(sudut2), Math.sin(sudut2)];
        const By = [-Math.sin(sudut2), Math.cos(sudut2)];
        
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
    } 
    // ==========================================
    // 3. LINGKARAN VS PERSEGI (Campuran)
    // ==========================================
    else {
        const isO1Circle = type1 === 0;
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
