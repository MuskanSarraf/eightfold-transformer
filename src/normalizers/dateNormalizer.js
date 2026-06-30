function normalizeDate(dateStr) {
    if (!dateStr) return null;
    
    // Very basic parsing. Try parsing it using Date.
    try {
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) {
            // handle formats like "2020", "01/2020", etc.
            const yearMatch = dateStr.toString().match(/\b(19|20)\d{2}\b/);
            if (yearMatch) return `${yearMatch[0]}-01`;
            return dateStr; 
        }
        
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        return `${year}-${month}`;
    } catch {
        return dateStr;
    }
}

module.exports = normalizeDate;
