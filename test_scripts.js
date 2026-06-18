const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const scriptRegex = /<script.*?>([\s\S]*?)<\/script>/gi;
let match;
while ((match = scriptRegex.exec(html)) !== null) {
    if(match[1].trim() !== '') {
        try {
            new Function(match[1]);
        } catch (e) {
            console.error("Syntax Error in script block starting near index " + match.index);
            console.error(e.message);
            console.error(match[1].substring(0, 100) + "...");
        }
    }
}
