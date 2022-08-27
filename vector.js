const Vector = (x,y) => ({x: x, y: y});

const add = (p1,p2) => {
    const x = p1.x + p2.x;
    const y = p1.y + p2.y;
    return Vector(x,y);
};

const subtract = (p1,p2) => {
    const x = p1.x - p2.x;
    const y = p1.y - p2.y;
    return Vector(x,y);
};

const magnitude = (v) => {
    const a = v.x;
    const b = v.y;
    const c = Math.sqrt(a**2 + b**2);
    return c;
};

const scale = (p, factor) => {
    const x = p.x * factor;
    const y = p.y * factor;
    return Vector(x,y);
};

const dotProduct = (p1,p2) => {
    const x = p1.x * p2.x;
    const y = p1.y * p2.y;
    return x + y;
};

const normalize = (v) => {
    const bigness = magnitude(v);
    const reciprocal = bigness === 0 ? 0 : 1/bigness;
    const normalizedX = v.x * reciprocal;
    const normalizedY = v.y * reciprocal;
    return Vector(normalizedX, normalizedY);
};

const cross = (v) => {
    const x = -v.y;
    const y = v.x;
    return Vector(x,y);
};