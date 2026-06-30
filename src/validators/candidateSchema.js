function validateOutput(output, config) {
    const errors = [];
    if (!config.fields) return { success: true };
    
    for (const field of config.fields) {
        const val = output[field.path];
        if (field.required && (val === undefined || val === null)) {
            errors.push({ path: field.path, message: "Required field missing" });
        }
    }
    
    if (errors.length > 0) return { success: false, error: { errors } };
    return { success: true };
}
module.exports = { validateOutput };