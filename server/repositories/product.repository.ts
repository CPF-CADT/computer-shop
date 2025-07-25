import { QueryTypes } from "sequelize";
import { sequelize } from "../db/sequelize";
import { Product, ProductQueryParams, toProductStructure } from "../model/ProductModel";
import { Product as ProductModel, ProductFeedback } from "../db/models";

class ProductRepository {
    static async getAllProduct(
    nameProduct?: string,
    sortType: string = 'ASC',
    sortColumn: string = 'price', // Default to 'price' as per your view
    category?: string,
    typeProduct?: string,
    brand?: string,
    priceMin?: number,
    priceMax?: number,
    page: number = 1,
    limit: number = 10
  ): Promise<Product[] | null> {
    try {
      let query = 'SELECT * FROM productshowinformation';
      const conditions: string[] = [];
      const replacements: Record<string, any> = {};

      if (nameProduct) {
        conditions.push('name LIKE :product_name');
        replacements.product_name = `%${nameProduct}%`;
      }
      if (category) {
        // Use 'category_title' as per your view
        conditions.push('category_title = :category');
        replacements.category = category;
      }
      if (typeProduct) {
        // Use 'type_product' as per your view
        conditions.push('type_product = :typeProduct');
        replacements.typeProduct = typeProduct;
      }
      if (brand) {
        // Use 'brand_name' as per your view
        conditions.push('brand_name = :brandProduct');
        replacements.brandProduct = brand;
      }

      // NEW: Use 'price' column as per your view for filtering
      if (priceMin !== undefined && priceMin !== null) {
        conditions.push('price >= :priceMin'); // Use 'price' from the view
        replacements.priceMin = priceMin;
      }
      if (priceMax !== undefined && priceMax !== null) {
        conditions.push('price <= :priceMax'); // Use 'price' from the view
        replacements.priceMax = priceMax;
      }

      if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
      }

      // Whitelist allowed sort columns (using names from your view)
      const allowedSortColumns = ['price', 'name', 'category_title', 'brand_name','stock_quantity']; 
      if (!allowedSortColumns.includes(sortColumn)) {
        sortColumn = 'price'; 
      }

      // Whitelist sort types
      const allowedSortTypes = ['ASC', 'DESC'];
      if (!allowedSortTypes.includes(sortType.toUpperCase())) {
        sortType = 'ASC';
      } else {
        sortType = sortType.toUpperCase();
      }

      query += ` ORDER BY ${sortColumn} ${sortType} `;

      query += 'LIMIT :limit OFFSET :offset ';
      replacements.limit = limit;
      replacements.offset = (page - 1) * limit;

      const data = await sequelize.query(query, {
        replacements,
        type: QueryTypes.SELECT,
      });

      return data.map(toProductStructure);
    } catch (err) {
      throw err;
    }
  }


    static async getOneProduct(productCode: string): Promise<Product | null> {
        try {
            const data = await sequelize.query(
                'SELECT * FROM productshowinformation WHERE product_code = :id',{
                    replacements: { id: productCode },
                    type:QueryTypes.SELECT
                }
            );
            return toProductStructure(data[0]);
        } catch (err) {
            throw err;
        }
    }
    static async getProductDetail(productCode: string): Promise<Product | null> {
        try {
            let productDetail: Product | null = await this.getOneProduct(productCode);
            let customerFeedback = await sequelize.query(
                'select * from customerFeedbackForProduct where product_code = :id',{
                    replacements:{id:productCode},
                    type:QueryTypes.SELECT
                }
            );

            if (customerFeedback && customerFeedback.length > 0 && productDetail !== undefined && productDetail !== null) {
                productDetail.customerFeedback = customerFeedback.map((data: any) => ({
                    feedback_id: data.feedback_id,
                    rating: data.rating,
                    customerName: data.customer_name,
                    userProfilePath: data.user_profile_path,
                    comment: data.comment,
                    feedbackDate: new Date(data.feedback_date),
                }));
            }
            return productDetail;
        } catch (err) {
            throw err;
        }
    }
    static async addProduct(data: {
        code: string;
        name: string;
        price: number;
        quantity: number;
        description?: string;
        category?: number;
        brand?: number;
        type_product?: number;
        image?: string;
        }): Promise<boolean | null> {
        try {
            const created = await ProductModel.create({
            product_code: data.code,
            name: data.name,
            price: data.price,
            stock_quantity: data.quantity ?? 0,
            description: data.description,
            category_id: data.category,
            brand_id: data.brand,
            type_id: data.type_product,
            image_path: data.image,
            is_active: true,
            last_restock_date: new Date(),
            });
            if(created){
                return true;
            }
            return false;
        } catch (err) {
            console.error('Failed to add product:', err);
            return null;
        }
    }
    
    static async updateProduct(
      productCode: string,
      data: {
        name?: string;
        price?: number;
        stock_quantity?: number;
        description?: string;
        category?: number;
        brand?: number;
        type_product?: number;
        image?: string;
        is_active?: boolean;
      }
    ): Promise<boolean | null> {
      try {
        // Remove undefined fields
        const updateData: any = Object.entries(data).reduce((acc, [key, value]) => {
          if (value !== undefined) acc[key] = value;
          return acc;
        }, {} as Record<string, any>);

        // Add restock date (optional: only if quantity is updated)
        if (updateData.quantity !== undefined) {
          updateData.last_restock_date = new Date();
        }

        const [affectedCount] = await ProductModel.update(updateData, {
          where: { product_code: productCode },
        });

        if (affectedCount === 0) {
          const product = await ProductModel.findOne({ where: { product_code: productCode } });
          if (!product) {
            throw new Error(`Product with code ${productCode} not found.`);
          } else {
            console.warn(`Product with code ${productCode} found but no changes made.`);
            return true;
          }
        }

        return true;
      } catch (err: any) {
        console.error(`Failed to update product with code ${productCode}:`, err.message || err);
        return null;
      }
    }
  static async softDeleteProduct(productCode: string): Promise<boolean | null> {
    try {
      const [affectedCount] = await ProductModel.update(
        { is_active: false },
        { where: { product_code: productCode } }
      );

      if (affectedCount === 0) {
        const product = await ProductModel.findOne({ where: { product_code: productCode } });
        if (!product) {
          throw new Error(`Product with code ${productCode} not found.`);
        } else {
          console.warn(`Product with code ${productCode} found but no changes made.`);
          return true;
        }
      }

      return true;
    } catch (err: any) {
      console.error(`Failed to delete (soft) product with code ${productCode}:`, err.message || err);
      return null;
  }
}


}



export default ProductRepository;

export class ProductFeedBackRepositories{
    static async addFeedback(productCode:string,customerId:number,rating:number,comment:string):Promise<boolean>{
        try{
            ProductFeedback.create({
                customer_id:customerId,
                product_code:productCode,
                rating:rating,
                comment:comment,
                feedback_date:new Date().toISOString(),
            })
            return true;
        }catch(err){
            throw err;
        }
    }
}