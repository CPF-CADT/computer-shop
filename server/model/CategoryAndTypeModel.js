"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toCategoryStructure = toCategoryStructure;
exports.toTypeProductStructure = toTypeProductStructure;
exports.toBrandStructure = toBrandStructure;
function toCategoryStructure(row) {
    return {
        id: row.category_id,
        title: row.title,
        description: row.description
    };
}
function toTypeProductStructure(row) {
    return {
        id: row.type_id,
        title: row.name,
        description: row.description
    };
}
function toBrandStructure(row) {
    return {
        id: row.id,
        name: row.name,
        url_logo: row.logo_url,
        website: row.website,
        country: row.country,
    };
}
