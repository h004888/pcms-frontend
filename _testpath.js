const fs = require('fs');
const p = 'C:/Users/ADMIN/Downloads/temp_v12/pcms-frontend/src/(customer)/flash-sale';
console.log('Trying:', p);
try {
  const d = fs.readdirSync(p);
  console.log('OK:', d);
} catch (e) {
  console.log('FAIL:', e.code, e.message);
}