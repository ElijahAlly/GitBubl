import { useSupabase } from "../lib/supabase";

export default defineNuxtRouteMiddleware(async (to) => {
  const { isAuthenticated } = storeToRefs(useUserStore());

  // If not logged in, redirect to signup
  if (!isAuthenticated) {
    return navigateTo('/signup?existing=true');
  }

  // Check if username exists (only for routes with username param)
  if (to.params.username) {
    const supabase = useSupabase();

    const { data: userExists } = await supabase
      .from('profiles')
      .select('id')
      .eq('username', to.params.username)
      .single();

    if (!userExists) {
      return navigateTo('/not-found');
    }
  }

  return;
})
