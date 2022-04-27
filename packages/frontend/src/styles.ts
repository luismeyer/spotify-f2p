export const size = {
  mobile: "425px",
  tablet: "768px",
  laptop: "1024px",
};

export const device = {
  mobile: `@media (min-width: ${size.mobile})`,
  tablet: `@media (min-width: ${size.tablet})`,
  laptop: `@media (min-width: ${size.laptop})`,
};
