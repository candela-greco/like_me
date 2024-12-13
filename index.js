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

    if(!titulo || !img || !descripcion){
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

app.put ("/posts/:id", async (req, res) => {
    const { id } = req.params;
    const { titulo, img, descripcion } = req.body;

    if (!titulo && !img && !descripcion) {
        return res.status(400).json({ message: "Se requiere al menos un campo para actualizar" });
    }
    try {
        const updatedPost = await likeMeModel.updatePost({ titulo, img, descripcion }, id);
        return res.json({ message: "Post actualizado con éxito", post: updatedPost });
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Error interno del servidor"});
    }
});

app.delete("/posts/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const postEliminado = await likeMeModel.deletePost(id);
        return res.json({
            message: "Post eliminado con exito",
            post: postEliminado
        });
    } catch (error) {
        if (error.code === 404) {
            res.status(404).json({ message: error.message });
        } else {
            console.error(error);
            res.status(500).json({ message: "Error interno del servidor" });
        }
    }
});

app.listen(PORT, () => {
    console.log(`Server listening on port http://localhost:${PORT}`);
});