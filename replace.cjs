const fs = require('fs');
const path = require('path');

const replacements = {
  // Original : Champagne Gold
  '#C4714A': '#D4AF37', // sage -> metallic champagne gold
  '#F5EFE0': '#FDFBF7', // paper -> luminous ivory
  '#C9B99A': '#EAE0D1', // sand -> light champagne
  '#9C8470': '#B8A99A', // taupe -> warm taupe
  '#A84C2C': '#B89C54', // rust -> deep gold
  '#6B3D28': '#5A4D3B', // umber -> dark bronze
  '#8B4513': '#8C7752', // sienna -> antique gold
  // Lowercase versions too just in case
  '#c4714a': '#D4AF37',
  '#f5efe0': '#FDFBF7',
  '#c9b99a': '#EAE0D1',
  '#9c8470': '#B8A99A',
  '#a84c2c': '#B89C54',
  '#6b3d28': '#5A4D3B',
  '#8b4513': '#8C7752',
  
  // Also RGB versions from App.tsx
  'rgba(196,113,74,0.45)': 'rgba(212,175,55,0.45)', // sage rgba
  'rgba(196,113,74,0.4)': 'rgba(212,175,55,0.4)', // sage rgba
  'rgb(196 113 74)': 'rgb(212 175 55)', // sage rgb
  
  'rgba(156,132,112,0.4)': 'rgba(184,169,154,0.4)', // taupe rgba
  'rgb(156 132 112)': 'rgb(184 169 154)', // taupe rgb
  
  // Update palette comments in index.css
  'BOHO COLOR PALETTE': 'CHAMPAGNE GOLD COLOR PALETTE',
  'Terracotta': 'Champagne Gold',
  'Ivory': 'Luminous Ivory'
};

const filesToProcess = [
  path.join(__dirname, 'src', 'index.css'),
  path.join(__dirname, 'src', 'App.tsx')
];

for (const file of filesToProcess) {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    for (const [key, value] of Object.entries(replacements)) {
      // Create a global regular expression for the key, escaping parentheses if needed
      const escapeRegExp = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(escapeRegExp(key), 'g');
      content = content.replace(regex, value);
    }
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${file}`);
  }
}
