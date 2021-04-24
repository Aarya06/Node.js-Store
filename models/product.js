const fs = require('fs');
const path = require('path');
const Cart = require('./cart');

const p = path.join(path.dirname(process.mainModule.filename), 'data', 'products.json');

const getProductsFromFile = (cb) => {
	fs.readFile(p, (err, fileContent) => {
		if (!err) {
			cb(JSON.parse(fileContent));
		} else {
			cb([]);
		}
	});
};

module.exports = class Product {
	constructor(id, title, imageUrl, description, price) {
		(this.id = id), (this.title = title);
		this.imageUrl = imageUrl;
		this.description = description;
		this.price = price;
	}

	save() {
		getProductsFromFile((products) => {
			if (this.id) {
				const updatedProduct = products.map((product) =>
					product.id === this.id ? this : product
				);
				fs.writeFile(p, JSON.stringify(updatedProduct), (err) => {
					if (err) {
						console.log(err);
					}
				});
			} else {
				this.id = Math.random().toString();
				products.push(this);
				fs.writeFile(p, JSON.stringify(products), (err) => {
					if (err) {
						console.log(err);
					}
				});
			}
		});
	}

	static fetchAll(cb) {
		getProductsFromFile(cb);
	}

	static findById(id, cb) {
		getProductsFromFile((prod) => {
			const product = prod.find((p) => p.id === id);
			cb(product);
		});
	}

	static deleteById(id) {
		getProductsFromFile((products) => {
			const product = products.find(product => product.id === id);
			const updatedProduct = products.filter((product) => product.id !== id);
			fs.writeFile(p, JSON.stringify(updatedProduct), (err) => {
				if (err) {
					console.log(err);
				}else{
					Cart.deleteProduct(id , product.price)
				}
			});
		});
	}
};