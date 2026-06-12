const lgLayouts = [{x: 0, y: 0, w: 4, h: 4}];
const w = 4; const h = 4;
let finalX, finalY;
const grid = [];
let maxY = 0;
lgLayouts.forEach(l => {
  maxY = Math.max(maxY, l.y + l.h);
  for (let dy = 0; dy < l.h; dy++) {
    if (!grid[l.y + dy]) grid[l.y + dy] = [];
    for (let dx = 0; dx < l.w; dx++) {
      grid[l.y + dy][l.x + dx] = true;
    }
  }
});
let found = false;
for (let sy = 0; sy <= Math.max(0, maxY + h); sy++) {
  for (let sx = 0; sx <= 12 - w; sx++) {
    let canFit = true;
    for (let dy = 0; dy < h; dy++) {
      for (let dx = 0; dx < w; dx++) {
        if (grid[sy + dy] && grid[sy + dy][sx + dx]) { canFit = false; break; }
      }
      if (!canFit) break;
    }
    if (canFit) { finalX = sx; finalY = sy; found = true; break; }
  }
  if (found) break;
}
console.log({finalX, finalY});
