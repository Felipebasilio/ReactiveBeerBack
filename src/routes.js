import { randomUUID } from "node:crypto";
import { Database } from "./database.js";
import { buildRoutePath } from "./utils/build-route-path.js";

const database = new Database();

// Rotas organizadas para produtos e estoque
export const routes = [
  // 🏷️ Products
  {
    method: "GET",
    path: buildRoutePath("/products"),
    handler: (req, res) => {
      const { search } = req.query;
      const products = database.select(
        "products",
        search ? { brand: search } : null
      );
      return res.end(JSON.stringify(products));
    },
  },
  {
    method: "POST",
    path: buildRoutePath("/products"),
    handler: (req, res) => {
      const { brand, image, style, substyle, abv, origin, information, skus } =
        req.body;
      if (!brand || !skus)
        return res
          .writeHead(400)
          .end(JSON.stringify({ error: "Invalid data" }));

      const newProduct = {
        id: randomUUID(),
        brand,
        image,
        style,
        substyle,
        abv,
        origin,
        information,
        skus,
      };

      database.insert("products", newProduct);
      return res.writeHead(201).end(JSON.stringify(newProduct));
    },
  },
  {
    method: "PUT",
    path: buildRoutePath("/products/:id"),
    handler: (req, res) => {
      const { id } = req.params;
      database.update("products", id, req.body);
      return res.writeHead(204).end();
    },
  },
  {
    method: "DELETE",
    path: buildRoutePath("/products/:id"),
    handler: (req, res) => {
      const { id } = req.params;
      database.delete("products", id);
      return res.writeHead(204).end();
    },
  },

  // 🏷️ Stock & Price
  {
    method: "GET",
    path: buildRoutePath("/stock-price/:sku"),
    handler: (req, res) => {
      const { sku } = req.params;
      const stockData = database
        .select("stockPrice")
        .find((item) => item.sku.toString() === sku.toString());

      if (!stockData)
        return res
          .writeHead(404)
          .end(JSON.stringify({ error: "Stock not found" }));

      return res.end(JSON.stringify(stockData));
    },
  },
  {
    method: "POST",
    path: buildRoutePath("/stock-price"),
    handler: (req, res) => {
      const { sku, stock, price } = req.body;
      if (!sku || stock == null || price == null)
        return res
          .writeHead(400)
          .end(JSON.stringify({ error: "Invalid data" }));

      const newStock = { sku, stock, price };
      database.insert("stockPrice", newStock);
      return res.writeHead(201).end(JSON.stringify(newStock));
    },
  },
  {
    method: "PUT",
    path: buildRoutePath("/stock-price/:sku"),
    handler: (req, res) => {
      const { sku } = req.params;
      database.update("stockPrice", sku, req.body);
      return res.writeHead(204).end();
    },
  },
  {
    method: "DELETE",
    path: buildRoutePath("/stock-price/:sku"),
    handler: (req, res) => {
      const { sku } = req.params;
      database.delete("stockPrice", sku);
      return res.writeHead(204).end();
    },
  },

  // 🏷️ Produtos + stock & price
  {
    method: "GET",
    path: buildRoutePath("/products-with-skus"),
    handler: (req, res) => {
      const { search } = req.query;
      const products = database.select(
        "products",
        search ? { brand: search } : null
      );
      const stockPriceData = database.select("stockPrice");

      const productsWithStock = products.map((product) => {
        return {
          ...product,
          skus: product.skus.map((sku) => {
            const stockInfo = stockPriceData.find(
              (s) => s.sku.toString() === sku.code.toString()
            ) || { stock: 0, price: 0 };
            return {
              ...sku,
              stock: stockInfo.stock,
              price: stockInfo.price,
            };
          }),
        };
      });

      return res.end(JSON.stringify(productsWithStock));
    },
  },
];
