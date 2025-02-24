import fs from "node:fs/promises";
import path from "node:path";
import products from "./data/products.js";
import stockPrices from "./data/stock-price.js";

const databasePath = new URL("./db.json", import.meta.url);

export class Database {
  #database = {};

  constructor() {
    this.#loadDatabase();
  }

  async #loadDatabase() {
    try {
      const data = await fs.readFile(databasePath, "utf8");
      this.#database = JSON.parse(data);

      if (!this.#database.products || !this.#database.stockPrice) {
        this.#initializeDatabase();
      }
    } catch (error) {
      console.log("⚠️ Databasenot found. Creating a new one...");
      this.#initializeDatabase();
    }
  }

  #initializeDatabase() {
    this.#database = {
      products: products,
      stockPrice: Object.entries(stockPrices).map(([sku, value]) => ({
        sku: parseInt(sku),
        stock: value.stock,
        price: value.price,
      })),
    };
    this.#persist();
  }

  #persist() {
    fs.writeFile(databasePath, JSON.stringify(this.#database, null, 2));
  }

  select(table, search) {
    let data = this.#database[table] ?? [];

    if (search) {
      data = data.filter((row) =>
        Object.entries(search).some(([key, value]) =>
          row[key].toString().toLowerCase().includes(value.toString().toLowerCase())
        )
      );
    }

    return data;
  }

  insert(table, data) {
    if (Array.isArray(this.#database[table])) {
      this.#database[table].push(data);
    } else {
      this.#database[table] = [data];
    }

    this.#persist();
    return data;
  }

  delete(table, id) {
    const rowIndex = this.#database[table]?.findIndex((row) => row.id === id);

    if (rowIndex > -1) {
      this.#database[table].splice(rowIndex, 1);
      this.#persist();
    }
  }

  update(table, id, newData) {
    const rowIndex = this.#database[table]?.findIndex((row) => row.id === id);

    if (rowIndex > -1) {
      this.#database[table][rowIndex] = {
        ...this.#database[table][rowIndex],
        ...newData,
      };
      this.#persist();
    }
  }
}
