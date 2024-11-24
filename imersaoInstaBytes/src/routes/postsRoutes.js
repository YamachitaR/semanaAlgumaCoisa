import express from "express";
import multer from "multer"; 
import { listarPosts, postarNovoPost, uploadImagem } from "../controllers/postsController.js"; 


// seria necessario para Windons
/*
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
})

const upload = multer({ dest: "./uploads" , storage})
*/

const upload = multer({dest:"./uploads"}); 



const routes = (app) => {
    app.use(express.json());
    
    app.get("/posts", listarPosts);
     // Rota para criar um novo post
    app.post("/posts", postarNovoPost); // Chama a função controladora para criação de posts

    app.post("/upload", upload.single("imagem"), uploadImagem);
}

export default routes;