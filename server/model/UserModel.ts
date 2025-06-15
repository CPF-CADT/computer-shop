export interface CustomerRegister {
    phoneNumber:string,
    password:string,
    name:string,
    profile_image?:string,
    registration_date:Date,
}
export interface CutomerLogin {
    phoneNumber:string,
    password:string,
}
export interface Customer {
    phoneNumber:string,
    name:string,
    profile_image?:string|null,
}
export function toCustomerStructure(row: any): Customer {
    return {
        phoneNumber : row.phone_number,
        name:row.name,
        profile_image:row.profile_img_path,
    }
}
