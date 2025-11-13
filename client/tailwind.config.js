/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Indian Government Brand Colors
        govBlue: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#0b5aa2'
        },
        govOrange: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
          950: '#ff6600'
        },
        govGreen: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#138808'
        },
        govGray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827'
        },
        govGold: '#f2a900',
        tricolor: {
          saffron: '#FF9933',
          white: '#FFFFFF', 
          green: '#138808'
        }
      },
      fontFamily: {
        'hindi': ['Noto Sans Devanagari', 'system-ui', 'sans-serif'],
        'gov': ['Inter', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        'gov': '0 2px 4px 0 rgba(11, 90, 162, 0.1)',
        'gov-lg': '0 4px 6px -1px rgba(11, 90, 162, 0.1), 0 2px 4px -1px rgba(11, 90, 162, 0.06)'
      }
    }
  },
  plugins: []
}


