export const ENDPOINTS = {
  auth: {
    signup:         "/auth/signup",
    login:          "/auth/login",
    forgotPassword: "/auth/forgot-password",
  },

  users: {
    updateProfile: "/users/update-profile",
    all:           "/users/allUsers",
  },

  cart: {
    get:      "/cart",
    add:      "/cart/add",
    updateQty:"/cart/update-qty",
    remove:   "/cart/remove",
    clear:    "/cart/clear",
    buyAll:   "/cart/buy-all",
  },

  orders: {
    create:       "/orders/create",
    myOrders:     "/orders/my-orders",
    all:          "/orders/all",
    updateStatus: (id) => `/orders/update-status/${id}`,
    cancel:       (id) => `/orders/cancel-order/${id}`,
  },

  genericProducts: {
    getByCategory:        (cat)  => `/products/getProducts?category=${encodeURIComponent(cat)}`,
    register:             "/products/regProduct",
    update:               (id)   => `/products/update/${id}`,
    delete:               (id)   => `/products/delete/${id}`,
    addVariant:           (id)       => `/products/${id}/add-variant`,
    updateVariant:        (id, vid)  => `/products/${id}/update-variant/${vid}`,
    deleteVariant:        (id, vid)  => `/products/${id}/delete-variant/${vid}`,
    defineCategory:       "/products/defineCategory",
    categorySchema:       (name) => `/products/categorySchema/${encodeURIComponent(name)}`,
    categorySchemas:      "/products/categorySchemas",
    deleteCategorySchema: (name) => `/products/categorySchema/${encodeURIComponent(name)}`,
  },
};
