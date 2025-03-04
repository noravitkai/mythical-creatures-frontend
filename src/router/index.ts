import { createRouter, createWebHistory } from "vue-router";
import SummonView from "../views/SummonView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "summon",
      component: SummonView,
    },
    {
      path: "/admin",
      name: "admin",
      component: () => import("../views/AdminView.vue"),
    },
  ],
});

export default router;
