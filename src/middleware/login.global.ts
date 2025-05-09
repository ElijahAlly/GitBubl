import { useSupabase } from "../lib/supabase";

export default defineNuxtRouteMiddleware(async (to) => {
  const supabase = useSupabase();
  const { data } = await supabase.auth.getSession();
  const session = data.session;

  // If not logged in, redirect to signup
  if (!session && to.path === '/login') {
    return navigateTo('/signup?existing=true');
  }

  return;
})
