"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseBoolean = exports.parseNumber = exports.toStringValue = exports.toOptionalString = void 0;
const toOptionalString = (value) => {
    return typeof value === "string" ? value : undefined;
};
exports.toOptionalString = toOptionalString;
const toStringValue = (value) => {
    if (typeof value === "string") {
        return value;
    }
    return "";
};
exports.toStringValue = toStringValue;
const parseNumber = (value) => {
    if (typeof value === "number")
        return value;
    if (typeof value === "string") {
        const parsed = Number(value);
        if (!isNaN(parsed))
            return parsed;
    }
    return undefined;
};
exports.parseNumber = parseNumber;
const parseBoolean = (value) => {
    if (typeof value === "boolean")
        return value;
    if (typeof value === "string") {
        const normalized = value.trim().toLowerCase();
        if (["true", "1", "yes", "y"].includes(normalized))
            return true;
        if (["false", "0", "no", "n", ""].includes(normalized))
            return false;
    }
    return false;
};
exports.parseBoolean = parseBoolean;
//# sourceMappingURL=parsers.js.map