import { web } from "./src/application/web.js";
const { PORT } = process.env;

web.listen(PORT, () => {
  console.info(`App start with port ${PORT}`);
});
