import express from "express";
import { likeMeModel } from "./models/like.me.model.js";
import "dotenv/config";

const apiUrl = process.env.API_URL;
const PORT = process.env.PORT || 3000;
const app = express();
app.use(express.json());

app.get("/posts", async (req, res) => {
    try {
        const posts = await likeMeModel.findAll();
        return res.json(posts);
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "Error interno de servidor"});
    }
});

app.post("/posts", async (req, res) => {
    const { titulo } = req.body;
    const { img } = req.body;
    const { descripcion } = req.body;

    if(!titulo){
        return res.status(400).json({message: "Todos los campos son requeridos"});
    }
    const newPost = {
        titulo,
        img,
        descripcion,
    };
    try {
        const post = await likeMeModel.create(newPost);
        return res.json(post);
    } catch (error){
        console.log(error);
        return res.status(500).json({message: "Error interno de servidor"});
    }
});

app.listen(PORT, () => {
    console.log(`Server listening on port http://localhost:${PORT}`);
});