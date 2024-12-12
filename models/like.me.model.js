import { pool } from "../database/conection.js";

const findAll = async () => {
    const { rows } = await pool.query("SELECT * FROM posts");
    return rows;
};

const create = async (posts) => {
    const query = "INSERT INTO posts (titulo, img, descripcion) VALUES ($1, $2, $3) RETURNING * ";
    const { rows } = await pool.query(query, [posts.titulo, posts.img, posts.descripcion]);
    return rows [0];
};

export const likeMeModel = {
    findAll,
    create,
}