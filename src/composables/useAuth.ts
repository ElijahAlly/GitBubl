import { ref, onMounted } from 'vue';
import { supabase } from '../lib/supabase';
import { useRouter } from 'vue-router';
import type { Session } from '@supabase/supabase-js';
import { useUserStore } from '../stores/user';
import { storeToRefs } from 'pinia';

const supabaseAppId = import.meta.env.VITE_SUPABASE_APP_ID;

export function useAuth() {
  // const route = useRoute();
  const router = useRouter();
  const userStore = useUserStore();
  const session = ref<Session | null>(null);
  const { setUser, clearUser } = userStore;
  const { user, username } = storeToRefs(userStore);
  const loading = ref(false);
  const resendOtpLoading = ref(false);
  const otpError = ref<string | null>(null);
  const resendOtpError = ref<string | null>(null);
  const isVerifying = ref(false);

  const MAX_RETRIES = 3;
  const RETRY_DELAY = 33;

  onMounted(() => {
    initializeAuth();
  })

  const initializeAuth = async (retryCount = 0) => {
    try {
      const { data } = await supabase.auth.getSession();

      if (data.session) {
        session.value = data.session;
        await getProfile(data.session);
        // goToProfile();
      }

      // Set up auth state change listener
      supabase.auth.onAuthStateChange(async (_, _session) => {
        if (_session) {
          session.value = _session;
          try {
            await getProfile(_session);
            // goToProfile();
          } catch (err) {
            console.error(err, 'Error getting profile');
          }
        }
      });

    } catch (error) {
      console.error(`Auth initialization attempt ${retryCount + 1} failed:`, error);

      if (retryCount < MAX_RETRIES) {
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
        await initializeAuth(retryCount + 1);
      } else {
        signOut();
      }
    }
  };

  // const goToProfile = () => {
  //   if (user.value && route.name && route.name !== 'user-profile') {
  //     console.log("\n== route ==\n", route.name, "\n");
  //     router.push({
  //       name: 'user-profile',
  //       params: { username: user.value.username }
  //     })
  //   }
  // }

  const getProfile = async (session: Session) => {
    try {
      loading.value = true;

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (!data) {
        console.error('Supabase query error: could not find user.');
        router.push({
          name: 'signup',
          query: { existing: 'true' }
        });
      }

      setUser(data);
      loading.value = false;
    } catch (error) {
      console.error(error);
    }
  }

  const handleSignUp = async (email: string, username: string) => {
    try {
      loading.value = true;
      otpError.value = null;

      // Check if user exists
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email);

      if (existingUser?.length) {
        otpError.value = 'An account with this email already exists';
        loading.value = false;
        return;
      }

      const { error: signUpError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          data: { username },
          shouldCreateUser: true
        }
      });

      if (signUpError) throw signUpError;

      isVerifying.value = true;

    } catch (error) {
      console.error(error);
      otpError.value = 'An error occurred during signup';

      // TODO: figure out where sign up is stuck loading !!!!

    } finally {
      loading.value = false;
    }
  }

  const handleLogin = async (email: string) => {
    try {
      loading.value = true;
      otpError.value = null;

      // Check if user exists
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .single();

      if (!existingUser) {
        otpError.value = 'No account found with this email';
        return;
      }

      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: false,
        }
      });

      if (error) throw error;

      isVerifying.value = true;

    } catch (error) {
      console.error(error);
      otpError.value = 'An error occurred during login';

    } finally {
      loading.value = false;
    }
  }

  const signOut = async () => {
    try {
      loading.value = true;

      session.value = null;
      clearUser();
      if (window && supabaseAppId) window.localStorage.removeItem('sb-' + supabaseAppId + '-auth-token');

      // Create a promise that rejects after 5 seconds
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Sign out timed out')), 5000);
      });

      // Race between the signOut call and the timeout
      await Promise.race([
        supabase.auth.signOut(),
        timeoutPromise
      ]);

      router.push({
        name: 'signup',
        query: { existing: 'true' }
      });
    } catch (error) {
      console.error(error);
    } finally {
      loading.value = false;
    }
  }

  const verifyOtp = async (email: string, token: string): Promise<boolean> => {
    try {
      loading.value = true;
      otpError.value = null;

      const { error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: 'email'
      });

      if (error) throw error;

      const { data } = await supabase.auth.getSession();

      if (data.session) await getProfile(data.session);

      isVerifying.value = false;
      loading.value = false;
      return true;

    } catch (error) {
      console.error(error);
      otpError.value = 'Invalid or expired code';
      return false;
    }
  }

  const resendOtp = async (email: string): Promise<boolean> => {
    try {
      resendOtpLoading.value = true;
      resendOtpError.value = null;

      const { error } = await supabase.auth.resend({
        email,
        type: 'signup'
      });

      if (error) throw error;

      resendOtpLoading.value = false;
      return true;

    } catch (error) {
      console.error(error);
      resendOtpError.value = 'Error resending code.';
      return false;
    }
  }

  return {
    user,
    username,
    loading,
    otpError,
    isVerifying,
    resendOtpLoading,
    resendOtpError,
    session,
    initializeAuth,
    handleLogin,
    handleSignUp,
    signOut,
    verifyOtp,
    resendOtp
  }
}
