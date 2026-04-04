const fs = require('fs');
const path = require('path');
const routesDir = path.join(__dirname, '../routes');

const files = fs.readdirSync(routesDir).filter(f => f.endsWith('.js') && f !== 'index.js');
files.forEach(file => {
    const tag = file.replace('.js', '');
    const tagName = tag.charAt(0).toUpperCase() + tag.slice(1);
    let content = fs.readFileSync(path.join(routesDir, file), 'utf8');

    // Only inject if not already injected
    if (!content.includes('#swagger.tags')) {
        const regex = /(router\.(?:get|post|put|delete|patch)\s*\(\s*['"`][^'"`]+['"`]\s*,)/g;
        const updated = content.replace(regex, `$1\n    /* #swagger.tags = ['${tagName}'] */\n`);
        fs.writeFileSync(path.join(routesDir, file), updated);
        console.log(`Updated ${file}`);
    }
});
console.log("Done adding tags.");
