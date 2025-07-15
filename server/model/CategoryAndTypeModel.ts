export function toCategoryStructure(row:any):CategoryStructure{
    return {
        id:row.category_id,
        title:row.title,
        description:row.description
    }
}

export function toTypeProductStructure(row:any):TypeProductStructure{
    return {
        id:row.type_id,
        name:row.name,
        description:row.description
    }
}

export function toBrandStructure(row:any):BrandStructure{
    return {
        id:row.id,
        name:row.name,
        url_logo:row.logo_url,
        website:row.website,
        country:row.country,
    }
}

export interface CategoryStructure {
    id:number;
    title:string;
    description?:string;
}
export interface TypeProductStructure {
    id: number;
    name: string;
    description?:string;
}
export interface BrandStructure {
    id:number;
    name:string;
    url_logo:string;
    website:string;
    country:string;
}