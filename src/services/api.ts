const API = "https://ecommerce-api.fariqshop62.workers.dev";

/* ---------- Products ---------- */
export const productsApi = {
  getAll: async () => {
    const res = await fetch(API + "/products");
    return res.json();
  },

  getOne: async (slug: string) => {
    const res = await fetch(API + "/products/" + slug);
    return res.json();
  },

  add: async (data: any) => {
    const res = await fetch(API + "/add-product", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  },
};

/* ---------- Orders ---------- */
export const ordersApi = {
  create: async (order: any) => {
    const res = await fetch(API + "/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order),
    });
    return res.json();
  },

  getMyOrders: async () => {
    const res = await fetch(API + "/orders");
    return res.json();
  },
};

/* ---------- Auth ---------- */
export const authApi = {
  login: async (data: any) => {
    const res = await fetch(API + "/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  register: async (data: any) => {
    const res = await fetch(API + "/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  },
};

/* ---------- Cart / Coupon ---------- */
export const couponApi = {
  apply: async (code: string) => {
    const res = await fetch(API + "/apply-coupon", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });
    return res.json();
  },
};

/* ---------- Categories ---------- */
export const categoriesApi = {
  getAll: async () => {
    const res = await fetch(API + "/categories");
    return res.json();
  },
};

/* ---------- Reviews ---------- */
export const reviewsApi = {
  add: async (data: any) => {
    const res = await fetch(API + "/add-review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  },
};