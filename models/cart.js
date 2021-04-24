const fs = require('fs');
const path = require('path');

const p = path.join(path.dirname(process.mainModule.filename), 'data', 'cart.json');

module.exports = class Cart {
	static addProduct(id, price) {
		fs.readFile(p, (err, fileContent) => {
			let cart = {
				products: [],
				totalPrice: 0,
			};
			if (!err) {
				cart = JSON.parse(fileContent);
			}

			const existingProduct = cart.products.find((prod) => prod.id === id);
			if (existingProduct) {
				cart.products = cart.products.map((prod) =>
					prod.id === existingProduct.id
						? { ...existingProduct, qty: existingProduct.qty + 1 }
						: prod
				);
			} else {
				cart.products.push({ id, qty: 1 });
			}
			cart.totalPrice = cart.totalPrice + +price;
			fs.writeFile(p, JSON.stringify(cart), (err) => {
				if (err) {
					console.log(err);
				}
			});
		});
	}

	static deleteProduct(id, price) {
		fs.readFile(p, (err, fileContent) => {
			if (err) {
				return
			}
			let cart = {...JSON.parse(fileContent)};
			const product = cart.products.find((prod) => prod.id === id);
			if(!product){
				return;
			}
			cart.products = cart.products.filter((prod) => prod.id !== id);
			cart.totalPrice = cart.totalPrice - product.qty * price;
			fs.writeFile(p, JSON.stringify(cart), (err) => {
				if (err) {
					console.log(err);
				}
			});
		});
	}
	
	static getCartItems(cb) {
		fs.readFile(p, (err, fileContent) => {
			if (err) {
				return cb(null)
			}
			const cart = JSON.parse(fileContent);
			cb(cart);
		});
	}
};