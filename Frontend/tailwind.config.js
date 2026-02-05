/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    light: '#a855f7', // purple-500
                    DEFAULT: '#9333ea', // purple-600
                    dark: '#7e22ce', // purple-700
                },
                secondary: {
                    light: '#ec4899', // pink-500
                    DEFAULT: '#db2777', // pink-600
                    dark: '#be185d', // pink-700
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
