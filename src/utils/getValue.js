function getValue(obj, path) {
    if (!path) return obj;
    const normalizedPath = path.replace(/\[(\d+)\]/g, '.$1').replace(/\[\]/g, '.[]');
    const parts = normalizedPath.split('.');
    
    let current = obj;
    for (let i = 0; i < parts.length; i++) {
        const key = parts[i];
        if (current == null) return undefined;
        
        if (key === '[]') {
            const remainingPath = parts.slice(i + 1).join('.');
            if (!Array.isArray(current)) return undefined;
            return remainingPath ? current.map(item => getValue(item, remainingPath)).filter(v => v !== undefined) : current;
        }
        
        current = current[key];
    }
    return current;
}
module.exports = getValue;