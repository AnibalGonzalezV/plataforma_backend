import { NestFactory } from '@nestjs/core';
import { AppModule } from './infrastructure/modules/app.module';
import { ProductRepository } from './domain/repositories/product.repository';
import { CategoryRepository } from './domain/repositories/category.repository';
import { TagRepository } from './domain/repositories/tag.repository';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const productRepo = app.get(ProductRepository);
  const categoryRepo = app.get(CategoryRepository);
  const tagRepo = app.get(TagRepository);

  // Crear categorías si no existen
  const categoryNames = [
    { name: 'Alimentos', description: 'Productos comestibles' },
    { name: 'Limpieza', description: 'Artículos de limpieza' },
    { name: 'Tecnología', description: 'Electrónica y gadgets' },
  ];

  const categories = [];
  for (const catData of categoryNames) {
    let cat = await categoryRepo.findByName(catData.name);
    if (!cat) {
      cat = await categoryRepo.createCategory(catData);
      console.log(`Categoría creada: ${cat.name}`);
    } else {
      console.log(`Categoría ya existe: ${cat.name}`);
    }
    categories.push(cat);
  }

  // Crear tags si no existen
  const tagNames = ['vegano', 'natural', 'oferta', 'nuevo', 'popular'];
  const tags = [];
  for (const tagName of tagNames) {
    let tag = await tagRepo.findByName(tagName);
    if (!tag) {
      tag = await tagRepo.createTag({ name: tagName });
      console.log(`Tag creado: ${tag.name}`);
    } else {
      console.log(`Tag ya existe: ${tag.name}`);
    }
    tags.push(tag);
  }

  // Productos por tienda
  const stores = [
    {
      storeId: 1,
      products: [
        {
          name: 'Pan Integral',
          description: 'Pan saludable y fresco',
          price: 2000,
          quantity: 30,
          category: categories[0],
          tagSet: [tags[0], tags[1]], // vegano, natural
        },
        {
          name: 'Detergente Bio',
          description: 'Detergente ecológico para ropa',
          price: 3500,
          quantity: 20,
          category: categories[1],
          tagSet: [tags[1], tags[3]], // natural, nuevo
        },
        {
          name: 'Auriculares Bluetooth',
          description: 'Auriculares con cancelación de ruido',
          price: 12000,
          quantity: 15,
          category: categories[2],
          tagSet: [tags[3], tags[4]], // nuevo, popular
        },
        {
          name: 'Galletas de Avena',
          description: 'Galletas integrales sin azúcar',
          price: 2500,
          quantity: 25,
          category: categories[0],
          tagSet: [tags[0], tags[4]], // vegano, popular
        },
      ],
    },
    {
      storeId: 2,
      products: [
        {
          name: 'Jugo Natural',
          description: 'Jugo exprimido 100% natural',
          price: 1800,
          quantity: 35,
          category: categories[0],
          tagSet: [tags[1], tags[4]], // natural, popular
        },
        {
          name: 'Limpiador Multiuso',
          description: 'Limpieza eficaz para todo tipo de superficies',
          price: 2800,
          quantity: 22,
          category: categories[1],
          tagSet: [tags[2], tags[3]], // oferta, nuevo
        },
        {
          name: 'Smartwatch Deportivo',
          description: 'Reloj inteligente resistente al agua',
          price: 25000,
          quantity: 10,
          category: categories[2],
          tagSet: [tags[3], tags[4]], // nuevo, popular
        },
        {
          name: 'Mermelada Orgánica',
          description: 'Mermelada sin aditivos ni conservantes',
          price: 3200,
          quantity: 18,
          category: categories[0],
          tagSet: [tags[0], tags[1]], // vegano, natural
        },
      ],
    },
  ];

  for (const store of stores) {
    for (const productData of store.products) {
      const existing = await productRepo.findByNameAndStore(
        productData.name,
        store.storeId,
      );
      if (existing) {
        console.log(`Producto ya existe: ${productData.name}`);
        continue;
      }

      await productRepo.createProduct({
        name: productData.name,
        description: productData.description,
        price: productData.price,
        quantity: productData.quantity,
        storeId: store.storeId,
        imageUrl: null,
        categoryId: productData.category.categoryId,
        tagIds: productData.tagSet.map((tag) => tag.tagId),
      });

      console.log(`Producto creado: ${productData.name}`);
    }
  }

  console.log('Seeder completo con 8 productos únicos por tienda.');
  await app.close();
}

bootstrap();
