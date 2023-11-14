const faker = require('faker');
const fs = require('fs');

faker.locale = 'vi';

// Hàm chuyển đổi timestamp thành định dạng ngày tháng
const formatTimestamp = (timestamp) => {
  const dateObject = new Date(timestamp);
  return dateObject.toLocaleString('vi-VN'); // Chọn ngôn ngữ và định dạng phù hợp
};

const randomCategoryList = (n) => {
  if (n <= 0) return [];
  const categoryList = [];

  Array.from(new Array(n)).forEach(() => {
    const uniqueId = faker.datatype.number({ min: 1, max: 1000000 });
    const category = {
      id: uniqueId,
      name: faker.commerce.department(),
      createdAt: formatTimestamp(Date.now()),
      updatedAt: formatTimestamp(Date.now()),
    };
    categoryList.push(category);
  });

  return categoryList;
};

const randomProductList = (categoryList, numberOfProducts) => {
  if (numberOfProducts <= 0) return [];

  const productList = [];

  for (const category of categoryList) {
    Array.from(new Array(numberOfProducts)).forEach(() => {
      const uniqueId = faker.datatype.number({ min: 1, max: 1000000 });
      const product = {
        id: uniqueId,
        categoryId: category.id,
        name: faker.commerce.productName(),
        color: faker.commerce.color(),
        price: Number.parseFloat(faker.commerce.price()),
        description: faker.commerce.productDescription(),
        createdAt: formatTimestamp(Date.now()),
        updatedAt: formatTimestamp(Date.now()),
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
