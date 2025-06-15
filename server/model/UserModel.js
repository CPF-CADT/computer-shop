"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toCustomerStructure = toCustomerStructure;
function toCustomerStructure(row) {
    return {
        phoneNumber: row.phone_number,
        name: row.name,
        profile_image: row.profile_img_path,
    };
}
