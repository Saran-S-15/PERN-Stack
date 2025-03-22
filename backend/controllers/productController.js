import { sql } from "../config/db.js";

export const getAllProducts = async (req, res) => {
    try {
        const products = await sql`SELECT * FROM products ORDER BY created_at DESC`
        res.status(200).json({
            success: true,
            data: products
        });
    } catch (error) {
        console.log("Error in getAllProducts Controller", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

export const getProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await sql`SELECT * FROM products WHERE id=${id}`
        if (product.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Product not Found"
            });
        }
        res.status(200).json({
            success: true,
            data: product[0]
        });
    } catch (error) {
        console.log("Error in getProduct Controller", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

export const createProduct = async (req, res) => {
    try {
        const { name, price, image } = req.body;
        if (!name || !price || !image) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }
        const newProduct = await sql`INSERT INTO products (name,price,image) VALUES (${name},${price},${image}) RETURNING *`
        res.status(201).json({
            success: true,
            data: newProduct[0]
        });
    } catch (error) {
        console.log("Error in createProduct Controller", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, price, image } = req.body;
        const updatedProduct = await sql`UPDATE products SET name=${name}, price=${price}, image=${image} WHERE id=${id} RETURNING *`
        if (updatedProduct.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Product not Found"
            });
        }
        res.status(201).json({
            success: true,
            data: updatedProduct[0]
        });
    } catch (error) {
        console.log("Error in updateProduct Controller", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const deletetedProduct = await sql`DELETE FROM products WHERE id=${id} RETURNING *`
        if (deletetedProduct.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Product not Found"
            });
        }
        res.status(200).json({
            success: true,
            data: deleteProduct[0]
        });
    } catch (error) {
        console.log("Error in deleteProduct Controller", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};
