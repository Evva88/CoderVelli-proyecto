import { faker } from "@faker-js/faker";

export const generateMockProduct = () => {
    let product = {
        _id: faker.database.mongodbObjectId(),
        code: faker.string.alphanumeric(7),
        nombre: faker.commerce.productName(),
        detalle: faker.commerce.productDescription(),
        precio: parseInt(faker.string.numeric(3)),
        stock: parseInt(faker.string.numeric(2)),
        categoria: faker.commerce.department(),
        img: faker.image.url()
    }
    product.available = product.stock > 0 ? true : false;
    return product;
};