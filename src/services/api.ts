const API = "https://ecommerce-api.fariqshop62.workers.dev";

/* ================= PRODUCTS ================= */

export const productsApi = {
  getAll: async () => fetch(API + "/products").then(r => r.json()),

  getOne: async (slug: string) => fetch(API + "/products/" + slug).then(r => r.json()),

  getBySlug: async (slug: string) => fetch(API + "/products/" + slug).then(r => r.json()),

  getFeatured: async () => fetch(API + "/products?featured=1").then(r => r.json()),

  getNewArrivals: async () => fetch(API + "/products?new=1").then(r => r.json()),

  getRelated: async (slug: string) => fetch(API + "/products/" + slug + "/related").then(r => r.json()),

  add: async (data: any) =>
    fetch(API + "/add-product", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then(r => r.json()),
};

/* ================= ORDERS ================= */

export const ordersApi = {
  create: async (order: any) =>
    fetch(API + "/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order),
    }).then(r => r.json()),

  getMyOrders: async () => fetch(API + "/orders/my").then(r => r.json()),

  getAll: async () => fetch(API + "/orders").then(r => r.json()),

  getById: async (id: string) => fetch(API + "/orders/" + id).then(r => r.json()),
};

/* ================= AUTH ================= */

export const authApi = {
  login: async (data: any) =>
    fetch(API + "/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then(r => r.json()),

  register: async (data: any) =>
    fetch(API + "/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then(r => r.json()),

  updateProfile: async (data: any) =>
    fetch(API + "/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then(r => r.json()),

  changePassword: async (data: any) =>
    fetch(API + "/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then(r => r.json()),
};

/* ================= COUPON ================= */

export const couponApi = {
  apply: async (code: string) =>
    fetch(API + "/apply-coupon", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    }).then(r => r.json()),

  validate: async (code: string) =>
    fetch(API + "/validate-coupon", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    }).then(r => r.json()),
};

/* ================= SEARCH ================= */

export const searchApi = {
  search: async (q: string) =>
    fetch(API + "/search?q=" + encodeURIComponent(q)).then(r => r.json()),
};

/* ================= CATEGORIES ================= */

export const categoriesApi = {
  getAll: async () => fetch(API + "/categories").then(r => r.json()),
};

/* ================= REVIEWS ================= */

export const reviewsApi = {
  add: async (data: any) =>
    fetch(API + "/add-review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then(r => r.json()),

  getByProduct: async (slug: string) =>
    fetch(API + "/products/" + slug + "/reviews").then(r => r.json()),
};