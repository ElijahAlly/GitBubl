import { ref, onMounted, computed } from 'vue';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'vue-router';
import type { Session } from '@supabase/supabase-js';
import { useUserStore } from '../stores/user';
import { storeToRefs } from 'pinia';

export function useAuth() {
  const router = useRouter();
  const userStore = useUserStore();
  const { setUser, clearUser } = userStore;
  const { user, username } = storeToRefs(userStore);
  const loading = ref(false);
  const isLoggedIn = computed(() => !!user.value);

  const getProfile = async (session: Session) => {
    try {
      loading.value = true;
      const { user } = session;

      const { data, error } = await supabase
        .from('profiles')
        .select(`*`)
        .eq('id', user.id)
        .single();

      if (error) throw error;

      // If username is not present in the profiles table
      if (!data.username) {
        const { data: profileData, error } = await supabase
          .from('profiles')
          .update({ ...data, username: session.user.user_metadata.username })
          .eq('id', user.id)
          .single();

        if (error) throw error;

        setUser(profileData);
        loading.value = false;
        return;
      }

      setUser(data);
    } catch (error) {
      console.log(error);
    } finally {
      loading.value = false;
    }
  }

  const goToProfile = () => {
    if (user.value) {
      router.push({
        name: 'user-profile',
        params: { username: user.value.user_metadata.username }
      })
    }
  }

  const initializeAuth = () => {
    supabase.auth.getSession().then(async ({ data }) => {
      if (data.session) {
        await getProfile(data.session);
        goToProfile();
      }
    })

    supabase.auth.onAuthStateChange(async (_, _session) => {
      if (_session) {
        try {
          await getProfile(_session);
        } catch (err) {
          console.error(err, 'Error getting profile');
        }
        goToProfile();
      }
    })
  }

  const handleSignUp = async (email: string, username: string) => {
    try {
      loading.value = true;
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          data: { username }
        }
      })
      if (error) throw error;
    } catch (error) {
      console.log(error);
    } finally {
      loading.value = false;
    }
  }

  const handleLogin = async (email: string) => {
    try {
      loading.value = true;
      const { error } = await supabase.auth.signInWithOtp({ email })
      if (error) throw error;
    } catch (error) {
      console.log(error);
    } finally {
      loading.value = false;
    }
  }

  const signOut = async () => {
    try {
      loading.value = true;
      clearUser();
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      router.push({
        name: 'signup',
        query: { existing: 'true' }
      });
    } catch (error) {
      console.log(error);
    } finally {
      loading.value = false;
    }
  }

  onMounted(() => {
    initializeAuth();
  })

  return {
    user,
    username,
    isLoggedIn,
    loading,
    initializeAuth,
    handleLogin,
    handleSignUp,
    signOut,
  }
}
