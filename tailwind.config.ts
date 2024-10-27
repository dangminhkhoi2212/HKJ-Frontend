import { COLORS_CONST } from './const';

import type { Config } from "tailwindcss";

const config: Config = {
	content: [
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./shared/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	important: true,
	theme: {
		extend: {
			colors: COLORS_CONST.colors,
			fontFamily: {
				sans: ["Roboto", "Helvetica", "Arial", "sans-serif"],
			},
			backgroundImage: {
				"gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
				"gradient-conic":
					"conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
				"chaos-pattern": "url('../public/patterns/chaos.svg')",
				"blurry-pattern": "url('../public/patterns/blurry.svg')",
				"sign-in": "url('../public/images/bg-sign-in.jpg')",
				header: "url('../public/images/banner/banner6.jpg')",
			},
		},
	},
	plugins: [],
};
export default config;
