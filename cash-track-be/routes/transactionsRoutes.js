import express from 'express'
import pool from '../db.js'


const router = express.Router()

router.post('/add', async (req, res) => {
    try {
        const { categoryId, walletId, amount, spendType,spendDate } = req.body;

        if (!categoryId || !walletId || !amount || spendType == null|| spendDate == null) {
            return res.status(400).json({
                success: false,
                message: "category_id, wallet_id, amount, spend_type, and spendDate are required"
            });
        }

        const result = await pool.query(
            `INSERT INTO transactions
            (category_id, wallet_id, amount, spend_type, spend_date)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *`,
            [categoryId, walletId, amount, spendType,spendDate]
        );

        res.json({
            success: true,
            data: result.rows[0]
        });

    } catch (error) {
        console.error("Add transaction error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

router.get('/all', async (req, res) => {
  try {
    const userId = req.userId; // from JWT middleware

    let { 
      wallet_id, 
      category_id, 
      start_date, 
      end_date 
    } = req.query;



    // Build dynamic WHERE conditions
    let whereClauses = ["w.user_id = $1"];  // Only show user’s own wallets
    let params = [userId];
    let paramIndex = 2;

    if (wallet_id) {
      whereClauses.push(`t.wallet_id = $${paramIndex}`);
      params.push(wallet_id);
      paramIndex++;
    }

    if (category_id) {
      whereClauses.push(`t.category_id = $${paramIndex}`);
      params.push(category_id);
      paramIndex++;
    }

    if (start_date) {
      whereClauses.push(`t.create_date >= $${paramIndex}`);
      params.push(start_date);
      paramIndex++;
    }

    if (end_date) {
      whereClauses.push(`t.create_date <= $${paramIndex}`);
      params.push(end_date);
      paramIndex++;
    }

    const whereSQL = whereClauses.length > 0 ? `WHERE ${whereClauses.join(" AND ")}` : "";

    // Fetch transactions
    const transactionsQuery = `
      SELECT 
        t.*, 
        c.name AS category_name,
        w.name AS wallet_name
      FROM transactions t
      JOIN categories c ON c.id = t.category_id
      JOIN wallets w ON w.id = t.wallet_id
      ${whereSQL}
      ORDER BY t.create_date DESC
    `;

    const dataResult = await pool.query(transactionsQuery, params);

    // Fetch sum of amounts
    const sumQuery = `
      SELECT SUM(amount) AS total_amount
      FROM transactions t
      JOIN wallets w ON w.id = t.wallet_id
      ${whereSQL}
    `;

    const sumResult = await pool.query(sumQuery, params);

    res.json({
      success: true,
      filters: {
        wallet_id,
        category_id,
        start_date,
        end_date
      },
      total_amount: sumResult.rows[0].total_amount || 0,
      count: dataResult.rowCount,
      data: dataResult.rows
    });

  } catch (error) {
    console.error("Get all transactions error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
});


router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `SELECT t.*, 
            c.name AS category_name,
            w.name AS wallet_name FROM transactions t 
            JOIN categories c ON c.id = t.category_id
            JOIN wallets w ON w.id = t.wallet_id 
            WHERE t.id = $1`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Not found" });
        }

        res.json({
            success: true,
            data: result.rows[0]
        });

    } catch (error) {
        console.error("Get transaction error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

router.put('/update', async (req, res) => {
    try {
        const { id, categoryId, walletId, amount, spendType, spendDate } = req.body;

        const result = await pool.query(
            `UPDATE transactions
       SET category_id = $1,
           wallet_id = $2,
           amount = $3,
           spend_type = $4,
           spend_date = $6,
           mod_date = NOW()
       WHERE id = $5
       RETURNING *`,
            [categoryId, walletId, amount, spendType, id,spendDate]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Not found" });
        }

        res.json({
            success: true,
            data: result.rows[0]
        });

    } catch (error) {
        console.error("Update transaction error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

router.delete('/delete', async (req, res) => {
    try {
        const { id } = req.body;

        const result = await pool.query(
            `DELETE FROM transactions WHERE id = $1 RETURNING *`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Not found" });
        }

        res.json({
            success: true,
            message: "Transaction deleted",
            data: result.rows[0]
        });

    } catch (error) {
        console.error("Delete transaction error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});


export default router
