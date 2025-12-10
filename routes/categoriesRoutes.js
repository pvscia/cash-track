import express from 'express'
import pool from '../db.js'


const router = express.Router()

router.post('/add', async (req, res) => {
  try {
    const userId = req.userId;
    const { name } = req.body;

    if (!userId || !name) {
      return res.status(400).json({ message: "user_id and name are required" });
    }

    // Insert with unique validation
    const result = await pool.query(
      "INSERT INTO categories (user_id, name) VALUES ($1, $2) RETURNING *",
      [userId, name]
    );

    return res.json({
      message: "Category created",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Add category error:", error);

    // Handle unique constraint error
    if (error.code === "23505") {
      return res
        .status(400)
        .json({ message: "Category name already exists for this user" });
    }

    return res.status(500).json({ message: "Server error" });
  }
})

router.get('/getAll', async (req, res) => {
  try {
    const userId = req.userId; // or from token (recommended)

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "user_id is required"
      });
    }

    const result = await pool.query(
      `SELECT id, user_id, name
       FROM categories
       WHERE user_id = $1
       ORDER BY name ASC`,
      [userId]
    );

    res.json({
      success: true,
      data: result.rows
    });

  } catch (error) {
    console.error("getAll categories error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
})

router.put('/update', async (req, res) => {
  try {
    const userId = req.userId;
    const { id, name } = req.body;

    if (!id || !userId || !name) {
      return res.status(400).json({ message: "id, user_id, and name are required" });
    }

    const result = await pool.query(
      `UPDATE categories 
       SET name = $1, mod_date = NOW()
       WHERE id = $2 AND user_id = $3
       RETURNING *`,
      [name, id, userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Category not found" });
    }

    return res.json({
      message: "Category updated",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Update category error:", error);

    if (error.code === "23505") {
      return res
        .status(400)
        .json({ message: "Category name already exists for this user" });
    }

    return res.status(500).json({ message: "Server error" });
  }
})

router.delete('/delete', async (req, res) => {
  try {
    const userId = req.userId;

    const { id } = req.body;

    if (!id || !userId) {
      return res.status(400).json({ message: "id and user_id are required" });
    }

    const result = await pool.query(
      "DELETE FROM categories WHERE id = $1 AND user_id = $2 RETURNING *",
      [id, userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Category not found" });
    }

    return res.json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Delete category error:", error);
    return res.status(500).json({ message: "Server error" });
  }
})


export default router
