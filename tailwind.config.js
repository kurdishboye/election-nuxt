module.exports = {
    content: [
        './components/**/*.{vue,js}',
        './layouts/**/*.vue',
        './pages/**/*.vue',
        './plugins/**/*.{js,ts}',
        './nuxt.config.{js,ts}',
    ],
    theme: {
        extend: {
            fontFamily: {
                'newrudaw': ['NewRudaw', 'sans-serif'],
            },
            colors: {
                'rudaw-orange': '#fe8f00',
                'rudaw-blue': '#189096',
            },
            backgroundColor: {
                'rudaw-dark': '#1e1d2a',
                'rudaw-darker': '#232432',
            },
            gradientColorStops: {
                'rudaw-gradient-start': '#1e1d29',
                'rudaw-gradient-end': '#2d3040',
            },
        },
    },
    plugins: [],
}