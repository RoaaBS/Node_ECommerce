import cors from 'cors'
import AuthRouter from './modules/Auth/auth.router.js'
import AuthCategory from './modules/Category/category.router.js'
const initApp = async (app, express) => {
    app.use(express.json());
    app.use(cors());

    app.get('/', (req, res) => {
        return res.status(200).json({ message: "welcome ..." });
    });


    app.use('/auth', AuthRouter);
    app.use('/categories', AuthCategory);

    app.get('*', (req, res) => {
        return res.status(404).json({ message: "page not found ..." });
    });
};

export default initApp;
