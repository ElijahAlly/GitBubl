import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import type { RouteLocationNormalizedGeneric, RouteLocationNormalizedLoadedGeneric, NavigationGuardNext } from 'vue-router';
import { supabase } from '@/lib/supabase';

const authMiddleware = async (to: RouteLocationNormalizedGeneric, from: RouteLocationNormalizedLoadedGeneric, next: NavigationGuardNext) => {
  const { data } = await supabase.auth.getSession();

  const session = data.session;

  if (!session) {
    next('/signup'); // redirect if not logged in

  } else {
    // Get all users and check if username exists
    const { data: { users }, error } = await supabase.auth.admin.listUsers();

    console.log("\n== users ==\n", users, "\n");
    console.log("\n== to.params.username ==\n", to.params.username, "\n");
    const userExists = users?.some(user =>
      user.user_metadata?.username === to.params.username
    );

    console.log("\n== error ==\n", error, "\n");

    if (error || !userExists) {
      next({ name: 'not-found' });

    } else {
      next(); // proceed if username exists
    }
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/signup',
      name: 'signup',
      component: () => import('../views/SignupView.vue'),
    },
    {
      path: '/:username',
      name: 'user-profile',
      component: () => import('../views/UserView.vue'),
      beforeEnter: authMiddleware,
      children: [
        {
          path: 'projects',
          name: 'user-projects',
          component: () => import('../views/ProjectsView.vue'),
          children: [
            {
              path: 'bubls',
              name: 'project-bubls',
              component: () => import('../views/BublsView.vue'),
            }
          ]
        },
      ]
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/NotFoundView.vue')
    }
  ],
})

export default router
