const faker = require('faker');
const fs = require('fs');

faker.locale = 'vi';

const randomCategoryList = (n) => {
  if (n <= 0) return [];
  const categoryList = [];
  const usedIds = new Set();

  Array.from(new Array(n)).forEach(() => {
    let uniqueId;
    do {
      uniqueId = faker.datatype.number({ min: 1, max: 1000000 });
    } while (usedIds.has(uniqueId));

    usedIds.add(uniqueId);
    const category = {
      id: uniqueId,
      name: faker.commerce.department(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    categoryList.push(category);
  });
  return categoryList;
};

const randomProductList = (categoryList, numberOfProducts) => {
  if (numberOfProducts <= 0) return [];

  const productList = [];
  const usedIds = new Set();

  for (const category of categoryList) {
    Array.from(new Array(numberOfProducts)).forEach(() => {
      let uniqueId;
      do {
        uniqueId = faker.datatype.number({ min: 1, max: 1000000 });
      } while (usedIds.has(uniqueId));

      usedIds.add(uniqueId);
      const product = {
        id: uniqueId,
        categoryId: category.id,
        name: faker.commerce.productName(),
        color: faker.commerce.color(),
        price: Number.parseFloat(faker.commerce.price()),
        description: faker.commerce.productDescription(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
        thumbnailUrl: faker.image.imageUrl(600, 400),
      };
      productList.push(product);
    });
  }

  return productList;
};

(() => {
  const categoryList = randomCategoryList(4);
  const productList = randomProductList(categoryList, 5);

  const db = {
    categories: categoryList,
    products: productList,
    profile: {
      name: 'Po',
    },
  };

  fs.writeFile('db.json', JSON.stringify(db), () => {
    console.log('Generate data successfully !!! ');
  });
})();
