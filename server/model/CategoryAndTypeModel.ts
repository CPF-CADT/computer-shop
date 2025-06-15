export function toCategoryStructure(row:any):Category{
    return {
        id:row.category_id,
        title:row.title,
        description:row.description
    }
}

export function toTypeProductStructure(row:any):TypeProduct{
    return {
        id:row.type_id,
        title:row.name,
        description:row.description
    }
}

export function toBrandStructure(row:any):Brand{
    return {
        id:row.id,
        name:row.name,
        url_logo:row.logo_url,
        website:row.website,
        country:row.country,
    }
}

export interface Category {
    id:number;
    title:string;
    description?:string;
}
export interface TypeProduct {
    id: number;
    title: string;
    description?:string;
}
export interface Brand {
    id:number;
    name:string;
    url_logo:string;
    website:string;
    country:string;
}