import { createRouter, createWebHistory } from "vue-router";
import SummonView from "../views/SummonView.vue";

const routes = [
  {
    path: "/",
    name: "summon",
    component: SummonView,
  },
  {
    path: "/register",
    name: "register",
    component: () => import("../views/RegisterView.vue"),
  },
  {
    path: "/login",
    name: "login",
    component: () => import("../views/LoginView.vue"),
  },
  {
    path: "/dashboard",
    name: "dashboard",
    component: () => import("../views/DashboardView.vue"),
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// Global nav guard
router.beforeEach((to, _from, next) => {
  if (to.meta.requiresAuth) {
    const token = localStorage.getItem("lsToken");
    if (!token) {
      return next({ name: "login" });
    }
  }
  next();
});

export default router;
