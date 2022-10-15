import auth from "./auth";
import { createRouter, createWebHashHistory } from "vue-router";

import Home from "./views/home-page";
import Profile from "./views/profile-page";
import Tasks from "./views/tasks-page";
import Grid from "./views/grid-page";
import Infoflot from "./views/grid-sg";
import Orders from "./views/rv/orders-gr";
import Contractors from "./views/rv/contractors-gr";
import defaultLayout from "./layouts/side-nav-outer-toolbar";
import simpleLayout from "./layouts/single-card";

function loadView(view) {
  return () => import (/* webpackChunkName: "login" */ `./views/${view}.vue`)
}

const router = new createRouter({
  routes: [
    {
      path: "/home",
      name: "home",
      meta: {
        requiresAuth: false,
        layout: defaultLayout
      },
      component: Home
    },
    {
      path: "/profile",
      name: "profile",
      meta: {
        requiresAuth: true,
        layout: defaultLayout
      },
      component: Profile
    },
    {
      path: "/tasks",
      name: "tasks",
      meta: {
        requiresAuth: true,
        layout: defaultLayout
      },
      component: Tasks
    },
    {
      path: "/grid",
      name: "grid",
      meta: {
        requiresAuth: true,
        layout: defaultLayout
      },
      component: Grid
    },
    {
      path: "/infoflot",
      name: "infoflot",
      meta: {
        requiresAuth: true,
        layout: defaultLayout
      },
      component: Infoflot
    },
    {
      path: "/endpoints",
      name: "endpoints",
      meta: {
        requiresAuth: true,
        layout: defaultLayout
      },
      component: Orders
    },
    {
      path: "/contractors",
      name: "contractors",
      meta: {
        requiresAuth: true,
        layout: defaultLayout
      },
      component: Contractors
    },    
    {
      path: "/login-form",
      name: "login-form",
      meta: {
        requiresAuth: false,
        layout: simpleLayout,
        title: "Войти"
      },
      component: loadView("login-form")
    },
    {
      path: "/reset-password",
      name: "reset-password",
      meta: {
        requiresAuth: false,
        layout: simpleLayout,
        title: "Сбросить пароль",
        description: "Введите корректный email. На него будет отправлена ссылка для сброса пароля"
      },
      component: loadView("reset-password-form")
    },
    {
      path: "/create-account",
      name: "create-account",
      meta: {
        requiresAuth: false,
        layout: simpleLayout,
        title: "Зарегистрироваться"
      },
      component: loadView("create-account-form"),
    },
    {
      path: "/change-password/:recoveryCode",
      name: "change-password",
      meta: {
        requiresAuth: false,
        layout: simpleLayout,
        title: "Изменить пароль"
      },
      component: loadView("change-password-form")
    },
    {
      path: "/",
      redirect: "/home"
    },
    {
      path: "/recovery",
      redirect: "/home"
    },
    {
      path: "/:pathMatch(.*)*",
      redirect: "/home"
    }
  ],
  history: createWebHashHistory()
});

router.beforeEach((to, from, next) => {

  if (to.name === "login-form" && auth.loggedIn()) {
    next({ name: "home" });
  }

  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!auth.loggedIn()) {
      next({
        name: "login-form",
        query: { redirect: to.fullPath }
      });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
