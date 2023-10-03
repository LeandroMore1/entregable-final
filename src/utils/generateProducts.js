import {faker } from "@faker-js/faker";

export function testFunction(){
    function getRandomCategory() {
        let categories = ["instruments", "accesories", "electronics"];
        let randomIndex = Math.floor(Math.random() * categories.length);
        return categories[randomIndex];
      }
      
      const price = parseInt(faker.commerce.price({ min: 1000, max: 100000, dec: 0 }))
    let products = []
    for (let i = 0; i <= 100; i++) {
        let randomCategory = getRandomCategory();
        products.push({
            title: faker.commerce.product(),
        description: faker.commerce.productName(),
        price: price,
        stock: faker.number.int({ min: 10, max: 100 }),
        code: faker.number.int({ min: 100, max: 999 }),
        thumbnail: faker.image.urlLoremFlickr(),
        category: randomCategory
        })
        
    }
   
    return products
    
}