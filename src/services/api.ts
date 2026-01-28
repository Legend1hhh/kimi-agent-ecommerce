const API = "https://ecommerce-api.fariqshop62.workers.dev";

// Get all products
export async function getProducts() {
  const res = await fetch(API + "/products");
  return res.json();
}

// Add product (admin)
export async function addProduct(data: any) {
  const res = await fetch(API + "/add-product", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

// Create order
export async function createOrder(order: any) {
  const res = await fetch(API + "/create-order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(order),
  });
  return res.json();
}