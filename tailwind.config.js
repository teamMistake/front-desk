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
        "primary-1": "#0DCEDA",
        "primary-2": "#6EF3D6", 
        "primary-3": "#C6FCE5",
        "primary-4": "#EBFFFA",
        "secondary-1": "#02E675",
        "secondary-2": "##62F08A",
        "error-1": "#EF6262",
        "error-2": "#FF8282",
        "greyscale-1": "#F5F5F5",
        "greyscale-2": "#CCCCCC"
      },
      textColor: {  
        "primary": "#025FE6",
        "secondary": "#22A347",
        "error": "#A33333",
        "content": "#7F7F7F"
      },
    },
  },
  plugins: [],
}
