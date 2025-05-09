export function useTheme() {
  const isDarkMode = ref(false);

  onMounted(() => {
    // Only access localStorage on client-side
    const curVal = localStorage.getItem('darkMode');
    isDarkMode.value = curVal === 'true';
    if (!curVal && curVal !== 'false') {
      localStorage.setItem('darkMode', 'true');
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
