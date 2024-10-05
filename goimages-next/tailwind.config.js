/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--color-bg-primary)",
                primary: "var(--color-primary)",
                secondary: "var(--color-secondary)"
            },
            keyframes: {
                'fade-in-down': {
                    '0%': { opacity: 0, transform: 'translateY(-10px)' },
                    '100%': { opacity: 1, transform: 'translateY(0)' },
                },
            },
            animation: {
                'fade-in-down': 'fade-in-down 0.5s ease-in-out',
            },
        },
        fontSize: {
            'xs': '.75rem',
            'sm': '.875rem',
            'base': '1rem',
            'md': '1.125rem',
            'lg': '1.5rem',
            'xl': '2rem',
            '2xl': '2.5rem',
            '3xl': '3.5rem', // custom font size
            '4xl': '4rem', // custom font size
        },
    },
    plugins: [],
};
