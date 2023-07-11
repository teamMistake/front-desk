/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend:{
      backgroundColor: {
        "dblue": "#064273",
        "lblue": "#def3f6",
        "user": "#d1ffbd", 
        "computer": "#99edc3"
      },
      textColor: {
        "title": "#1da2d8",
        "content": "#76b6c4",
        "etc": "#76b6c4"
      },
    },
  },
  plugins: [],
}
