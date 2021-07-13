const { guessProductionMode } = require("@ngneat/tailwind");

module.exports = {
    prefix: '',
    purge: {
      enabled: guessProductionMode(),
      content: [
        './src/**/*.{html,ts}',
      ]
    },
    darkMode: false, // or 'media' or 'class'
    theme: {
      extend: {},
    },
    variants: {
      extend: {
        opacity: ['disabled'],
        backgroundColor: ['disabled', 'hover']},
    },
    plugins: [require('@tailwindcss/forms')],
};
