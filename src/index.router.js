import cors from "cors";
import AuthRouter from "./modules/Auth/auth.router.js";
import AuthCategory from "./modules/Category/category.router.js";
import Authproduct from "./modules/Product/product.router.js";
import Authcoupon from "./modules/Coupon/coupon.router.js";
import Authcarts from "./modules/Cart/cart.router.js";
import Authorders from "./modules/Order/order.router.js"

const initApp = async (app, express) => {
  app.use(express.json());
  app.use(cors());

  app.get("/", (req, res) => {
    return res.status(200).json({ message: "welcome ..." });
  });

  app.use("/auth", AuthRouter);
  app.use("/categories", AuthCategory);
  app.use("/products", Authproduct);
  app.use("/coupon", Authcoupon);
  app.use("/carts", Authcarts);
  app.use("/orders", Authorders);
  app.get("*", (req, res) => {
    return res.status(404).json({ message: "page not found ..." });
  });
};

export default initApp;
