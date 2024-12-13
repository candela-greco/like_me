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

const updatePost = async (fields, id) => {
    const allowedFields = ["titulo", "img", "descripcion"];
    const updates = [];
    const values = [];
    let index = 1;

    for (const field of allowedFields){
        if (fields[field]) {
            updates.push(`${field} = $${index}`);
            values.push(fields[field]);
            index++;
        }
    }

    if (updates.lenght === 0) {
        throw { code: 404, message: "No se enviaron campos válidos para actualizar"};
    }

    values.push(id);

    const query = `UPDATE posts SET ${updates.join(", ")} WHERE id = $${index} RETURNING *`;

    const { rows } = await pool.query (query, values);

    if (rows.length === 0) {
        throw {code: 404, message: "Post no encontrado"};
    }

    return rows [0];
};

const deletePost = async (id) => {
    const query = "DELETE FROM posts WHERE id = $1";
    const { rowCount } = await pool.query(query, [id]);

    if (rowCount === 0) {
        throw { code: 404, message: "Post no encontrado" };
    }

    return { id };
}

export const likeMeModel = {
    findAll,
    create,
    updatePost,
    deletePost,
}