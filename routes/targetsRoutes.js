import express from 'express'
import pool from '../db.js'


const router = express.Router()

router.post('/add', async (req, res) => {
  try {
    const userId = req.userId;

    const { name, amount, walletId } = req.body;

    if (!userId || !name || !amount) {
      return res.status(400).json({ message: "user_id, amount, and name are required" });
    }

    // Insert with unique validation
    const result = await pool.query(
      "INSERT INTO targets (user_id, name,amount,wallet_id) VALUES ($1, $2, $3,$4) RETURNING *",
      [userId, name, amount, walletId]
    );

    return res.json({
      message: "Target created",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Add target error:", error);

    // Handle unique constraint error
    if (error.code === "23505") {
      return res
        .status(400)
        .json({ message: "Target name already exists for this user" });
    }

    return res.status(500).json({ message: error.detail });
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
      `SELECT *
       FROM targets
       WHERE user_id = $1
       ORDER BY name ASC`,
      [userId]
    );

    res.json({
      success: true,
      data: result.rows
    });

  } catch (error) {
    console.error("getAll targets error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
})

router.put('/update', async (req, res) => {
  try {
    const userId = req.userId;

    const { id, name, amount, walletId } = req.body;

    if (!id || !userId || !name || !amount) {
      return res.status(400).json({ message: "id, amount, user_id, and name are required" });
    }

    const result = await pool.query(
      `UPDATE targets 
       SET name = $1, mod_date = NOW(), amount = $4, wallet_id = $5
       WHERE id = $2 AND user_id = $3
       RETURNING *`,
      [name, id, userId, amount, walletId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Target not found" });
    }

    return res.json({
      message: "Target updated",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Update target error:", error);

    if (error.code === "23505") {
      return res
        .status(400)
        .json({ message: "Target name already exists for this user" });
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
      "DELETE FROM targets WHERE id = $1 AND user_id = $2 RETURNING *",
      [id, userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Target not found" });
    }

    return res.json({ message: "Target deleted successfully" });
  } catch (error) {
    console.error("Delete target error:", error);
    return res.status(500).json({ message: "Server error" });
  }
})


export default router
