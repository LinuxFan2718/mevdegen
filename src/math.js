export const digits = 4;
export const gasPerSwap = 125000;
export const gweiFactor = 0.000000001;

export function roundUp(num, precision) {
  precision = Math.pow(10, precision)
  return Math.ceil(num * precision) / precision
}

export function dyAnswer(dx, reservesEx) {
  const xbignum = reservesEx["x"];
  const ybignum = reservesEx["y"];
  if (!xbignum || !ybignum) {
    return null;
  }
  const x = xbignum.toNumber();
  const y = ybignum.toNumber();
  const dy = (y * dx) / (x + dx);
  return dy;
}

export function dxAnswer(dy, reservesEx) {
  const xbignum = reservesEx["x"];
  const ybignum = reservesEx["y"];
  if (!xbignum || !ybignum) {
    return null;
  }
  const x = xbignum.toNumber();
  const y = ybignum.toNumber();
  const dx = (x * dy) / (y + dy);
  return dx;
}
