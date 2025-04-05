import { ref, watch } from 'vue'

export function useTheme() {
  const isDarkMode = ref(localStorage.getItem('darkMode') === 'true')

  watch(isDarkMode, (newValue) => {
    // Update localStorage
    localStorage.setItem('darkMode', newValue.toString())

    // Update document class
    if (newValue) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  })

  // Initialize dark mode on page load
  if (isDarkMode.value) {
    document.documentElement.classList.add('dark')
  }

  const toggleDarkMode = () => {
    isDarkMode.value = !isDarkMode.value
  }

  return {
    isDarkMode,
    toggleDarkMode
  }
}
