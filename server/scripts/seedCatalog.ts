import 'reflect-metadata';
import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
import { sequelize } from '../db/sequelize';
import { Brand, Category, Product, TypeProduct } from '../db/models';

dotenv.config();

type ImageKey = 'cpu' | 'gpu' | 'motherboard' | 'ram' | 'storage' | 'psu' | 'case';

const imageSources: Record<ImageKey, string> = {
  cpu: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Cpu.jpg',
  gpu: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Generic_block_diagram_of_a_GPU.svg',
  motherboard: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Computer_motherboard.jpg',
  ram: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/MEMORIARAM.png',
  storage: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/SAMSUNG_M.2_NVMe_SSD_990_PRO_4TB.jpg',
  psu: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Power_supply.JPG',
  case: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Midi_tower_PC_case.jpg',
};

const products = [
  { code: 'CPU-AMD-9600X', name: 'AMD Ryzen 5 9600X', brand: 'AMD', category: 'Processors', type: 'CPU', image: 'cpu', price: 249, stock: 18, description: '6-core, 12-thread AM5 desktop processor with up to 5.4 GHz boost and DDR5 support.' },
  { code: 'CPU-AMD-9800X3D', name: 'AMD Ryzen 7 9800X3D', brand: 'AMD', category: 'Processors', type: 'CPU', image: 'cpu', price: 479, stock: 10, description: '8-core AM5 gaming processor with 3D V-Cache, 16 threads, and a 120 W TDP.' },
  { code: 'CPU-INTEL-U5-225F', name: 'Intel Core Ultra 5 225F', brand: 'Intel', category: 'Processors', type: 'CPU', image: 'cpu', price: 199, stock: 16, description: '10-core LGA1851 desktop processor for affordable DDR5 systems; discrete graphics required.' },

  { code: 'GPU-ASUS-RTX5060TI', name: 'ASUS Dual GeForce RTX 5060 Ti 16GB', brand: 'ASUS', category: 'Graphics Cards', type: 'GPU', image: 'gpu', price: 449, stock: 8, description: '16 GB graphics card intended for high-refresh 1080p and 1440p gaming.' },
  { code: 'GPU-ASUS-RTX5070', name: 'ASUS Prime GeForce RTX 5070 12GB', brand: 'ASUS', category: 'Graphics Cards', type: 'GPU', image: 'gpu', price: 599, stock: 6, description: '12 GB performance graphics card for 1440p gaming and creator workloads.' },
  { code: 'GPU-ASUS-RX9070XT', name: 'ASUS Prime Radeon RX 9070 XT 16GB', brand: 'ASUS', category: 'Graphics Cards', type: 'GPU', image: 'gpu', price: 679, stock: 5, description: '16 GB Radeon graphics card for high-detail 1440p and 4K gaming.' },

  { code: 'MB-ASUS-B650PLUS', name: 'ASUS TUF Gaming B650-Plus WiFi', brand: 'ASUS', category: 'Motherboards', type: 'ATX Motherboard', image: 'motherboard', price: 199, stock: 12, description: 'AM5 ATX motherboard with DDR5, PCIe 4.0 storage, Wi-Fi, and 2.5 Gb Ethernet.' },
  { code: 'MB-MSI-B850TOMAHAWK', name: 'MSI MAG B850 Tomahawk Max WiFi', brand: 'MSI', category: 'Motherboards', type: 'ATX Motherboard', image: 'motherboard', price: 249, stock: 9, description: 'AM5 B850 ATX motherboard with DDR5, Wi-Fi, and modern high-speed connectivity.' },
  { code: 'MB-GIGABYTE-Z890', name: 'Gigabyte Z890 AORUS Elite WiFi7', brand: 'Gigabyte', category: 'Motherboards', type: 'ATX Motherboard', image: 'motherboard', price: 289, stock: 7, description: 'LGA1851 ATX motherboard with DDR5, Wi-Fi 7, and PCIe 5.0 expansion.' },

  { code: 'RAM-CORSAIR-32-6000', name: 'Corsair Vengeance 32GB DDR5-6000', brand: 'Corsair', category: 'Memory', type: 'DDR5 RAM', image: 'ram', price: 99, stock: 24, description: 'Dual-channel 2x16 GB DDR5-6000 desktop memory kit.' },
  { code: 'RAM-GSKILL-64-6000', name: 'G.Skill Trident Z5 Neo 64GB DDR5-6000', brand: 'G.Skill', category: 'Memory', type: 'DDR5 RAM', image: 'ram', price: 189, stock: 14, description: 'High-capacity 2x32 GB DDR5-6000 desktop memory kit for gaming and content creation.' },

  { code: 'SSD-WD-SN770-1TB', name: 'WD Black SN770 1TB NVMe SSD', brand: 'Western Digital', category: 'Storage', type: 'NVMe SSD', image: 'storage', price: 79, stock: 30, description: '1 TB PCIe 4.0 NVMe solid-state drive for responsive everyday and gaming storage.' },
  { code: 'SSD-SAMSUNG-990PRO-2TB', name: 'Samsung 990 PRO 2TB NVMe SSD', brand: 'Samsung', category: 'Storage', type: 'NVMe SSD', image: 'storage', price: 169, stock: 20, description: '2 TB high-performance PCIe 4.0 NVMe solid-state drive.' },
  { code: 'SSD-CRUCIAL-T705-2TB', name: 'Crucial T705 2TB NVMe SSD', brand: 'Crucial', category: 'Storage', type: 'NVMe SSD', image: 'storage', price: 249, stock: 11, description: '2 TB PCIe 5.0 NVMe solid-state drive for high-throughput workstation storage.' },

  { code: 'PSU-CORSAIR-RM750E', name: 'Corsair RM750e 750W 80+ Gold', brand: 'Corsair', category: 'Power Supplies', type: 'ATX PSU', image: 'psu', price: 109, stock: 17, description: 'Fully modular 750 W ATX power supply with 80 Plus Gold efficiency.' },
  { code: 'PSU-SEASONIC-850GX', name: 'Seasonic Focus GX-850 850W 80+ Gold', brand: 'Seasonic', category: 'Power Supplies', type: 'ATX PSU', image: 'psu', price: 149, stock: 13, description: 'Fully modular 850 W power supply for high-performance gaming systems.' },
  { code: 'PSU-CORSAIR-RM1000X', name: 'Corsair RM1000x 1000W 80+ Gold', brand: 'Corsair', category: 'Power Supplies', type: 'ATX PSU', image: 'psu', price: 199, stock: 8, description: 'Fully modular 1000 W ATX power supply for power-hungry graphics cards and workstations.' },

  { code: 'CASE-NZXT-H5FLOW', name: 'NZXT H5 Flow', brand: 'NZXT', category: 'Computer Cases', type: 'Mid Tower Case', image: 'case', price: 89, stock: 15, description: 'Airflow-focused ATX mid-tower case with a tempered-glass side panel.' },
  { code: 'CASE-CORSAIR-4000D', name: 'Corsair 4000D Airflow', brand: 'Corsair', category: 'Computer Cases', type: 'Mid Tower Case', image: 'case', price: 104, stock: 19, description: 'ATX mid-tower case with a high-airflow front panel and straightforward cable management.' },
  { code: 'CASE-FRACTAL-NORTH', name: 'Fractal Design North', brand: 'Fractal Design', category: 'Computer Cases', type: 'Mid Tower Case', image: 'case', price: 149, stock: 9, description: 'ATX mid-tower case combining strong airflow with a wood-accented front panel.' },
] as const;

async function uploadImages(): Promise<Record<ImageKey, string>> {
  const required = ['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'] as const;
  const missing = required.filter((name) => !process.env[name]);
  if (missing.length > 0) throw new Error(`Missing Cloudinary variables: ${missing.join(', ')}`);

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  const uploaded = {} as Record<ImageKey, string>;
  for (const [key, source] of Object.entries(imageSources) as [ImageKey, string][]) {
    const result = await cloudinary.uploader.upload(source, {
      public_id: key,
      folder: 'computer-shop/catalog',
      overwrite: true,
      resource_type: 'image',
      tags: ['computer-shop', 'catalog-seed', key],
    });
    uploaded[key] = result.secure_url;
    console.log(`Uploaded ${key} image`);
  }
  return uploaded;
}

async function seed(): Promise<void> {
  const images = await uploadImages();
  await sequelize.authenticate();
  await sequelize.sync();

  const categoryIds = new Map<string, number>();
  const typeIds = new Map<string, number>();
  const brandIds = new Map<string, number>();

  for (const item of products) {
    if (!categoryIds.has(item.category)) {
      const [category] = await Category.findOrCreate({
        where: { title: item.category },
        defaults: { title: item.category, description: `${item.category} available in the computer shop.` },
      });
      categoryIds.set(item.category, category.category_id);
    }
    if (!typeIds.has(item.type)) {
      const [type] = await TypeProduct.findOrCreate({
        where: { name: item.type },
        defaults: { name: item.type, description: `${item.type} product type.` },
      });
      typeIds.set(item.type, type.type_id);
    }
    if (!brandIds.has(item.brand)) {
      const [brand] = await Brand.findOrCreate({
        where: { name: item.brand },
        defaults: { name: item.brand },
      });
      brandIds.set(item.brand, brand.id);
    }

    await Product.upsert({
      product_code: item.code,
      name: item.name,
      description: item.description,
      price: item.price,
      stock_quantity: item.stock,
      image_path: images[item.image],
      is_active: true,
      last_restock_date: new Date(),
      brand_id: brandIds.get(item.brand),
      category_id: categoryIds.get(item.category),
      type_id: typeIds.get(item.type),
    });
  }

  await sequelize.query(`
    CREATE OR REPLACE VIEW productshowinformation AS
    SELECT
      p.product_code, p.name, p.description, p.price, p.stock_quantity,
      p.image_path, p.is_active, p.last_restock_date,
      p.brand_id, b.name AS brand_name,
      p.category_id, c.title AS category_title,
      p.type_id, t.name AS type_product,
      COALESCE((
        SELECT pr.discount_type
        FROM productpromotion pp
        JOIN promotion pr ON pr.promotion_id = pp.promotion_id
        WHERE pp.product_code = p.product_code
          AND NOW() BETWEEN pr.start_date AND pr.end_date
        ORDER BY pr.discount_value DESC LIMIT 1
      ), '') AS discount_type,
      COALESCE((
        SELECT pr.discount_value
        FROM productpromotion pp
        JOIN promotion pr ON pr.promotion_id = pp.promotion_id
        WHERE pp.product_code = p.product_code
          AND NOW() BETWEEN pr.start_date AND pr.end_date
        ORDER BY pr.discount_value DESC LIMIT 1
      ), 0) AS discount_value,
      COALESCE((SELECT AVG(pf.rating) FROM productfeedback pf WHERE pf.product_code = p.product_code), 0) AS average_rating,
      COALESCE((SELECT COUNT(*) FROM productfeedback pf WHERE pf.product_code = p.product_code), 0) AS feedback_count
    FROM product p
    LEFT JOIN brand b ON b.id = p.brand_id
    LEFT JOIN category c ON c.category_id = p.category_id
    LEFT JOIN typeproduct t ON t.type_id = p.type_id
  `);

  await sequelize.query(`
    CREATE OR REPLACE VIEW customerFeedbackForProduct AS
    SELECT
      pf.feedback_id,
      pf.product_code,
      pf.rating,
      c.name AS customer_name,
      c.profile_img_path AS user_profile_path,
      pf.comment,
      pf.feedback_date
    FROM productfeedback pf
    JOIN customer c ON c.customer_id = pf.customer_id
  `);

  console.log(`Seeded ${products.length} products.`);
}

seed()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await sequelize.close();
  });
