export function useTheme() {
  const isDarkMode = ref(false);

  onMounted(() => {
    // Only access localStorage on client-side
    isDarkMode.value = localStorage.getItem('darkMode') === 'true';

    // Initialize dark mode on page load
    if (isDarkMode.value) {
      document.documentElement.classList.add('dark');
    }
  })

  watch(isDarkMode, (newValue) => {
    // Only run on client-side
    // Update localStorage
    localStorage.setItem('darkMode', newValue.toString());

    // Update document class
    if (newValue) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  })

  const toggleDarkMode = () => {
    isDarkMode.value = !isDarkMode.value;
  }

  return {
    isDarkMode,
    toggleDarkMode
  }
}
