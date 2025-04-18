import { useSupabase } from "../lib/supabase";

export default defineNuxtRouteMiddleware(async (to) => {
  const supabase = useSupabase();

  const { data } = await supabase.auth.getSession();
  const session = data.session;

  console.log("\n== session ==\n", session, "\n");
  // If not logged in, redirect to signup
  if (!session) {
    return navigateTo('/signup?existing=true');
  }

  // Check if username exists (only for routes with username param)
  if (to.params.username) {
    const { data: userExists } = await supabase
      .from('profiles')
      .select('id')
      .eq('username', to.params.username)
      .single();

    if (!userExists) {
      return navigateTo('/not-found');
    }
  }
})
