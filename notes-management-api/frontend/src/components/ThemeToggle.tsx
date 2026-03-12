import { Moon, Sun } from 'lucide-react';
import { useThemeStore } from '../context/store';

export function ThemeToggle() {
  const { isDark, toggleTheme } = useThemeStore();

  return (
    <button
      onClick={toggleTheme}
      className="p-2.5 rounded-lg bg-primary-500/20 hover:bg-primary-500/30 text-primary-300 hover:text-primary-200 transition-all hover:shadow-md hover:shadow-primary-500/50"
      aria-label="Toggle theme"
      type="button"
    >
      {isDark ? <Sun size={20} strokeWidth={2} /> : <Moon size={20} strokeWidth={2} />}
    </button>
  );
}
