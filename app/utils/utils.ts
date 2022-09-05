export const getColor = (hue: number) => `hsl(${hue}, 100%, 70%)`;
export const getBgColor = (hue: number) => `hsl(${hue}, 100%, 87%)`;
export const getContrast = (hue: number) =>
	hue > 40 && hue < 220 ? "rgb(55, 65, 81)" : "rgb(255, 255, 255)";
