import { createRouter, createWebHistory } from "vue-router";
import QuizView from "../views/QuizView.vue";

const routes = [
  {
    path: "/",
    name: "quiz",
    component: QuizView,
  },
  {
    path: "/bestiary",
    name: "bestiary",
    component: () => import("../views/BestiaryView.vue"),
  },
  {
    path: "/summon",
    name: "summon",
    component: () => import("../views/SummonView.vue"),
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
