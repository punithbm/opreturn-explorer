import express from "express";
import { DatabaseService } from "../services/databaseService";

const router = express.Router();
const databaseService = new DatabaseService();

// GET /api/opreturns - Paginated OP_RETURN transactions
router.get("/opreturns", async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(parseInt(req.query.limit as string) || 10, 100); // Max 100 per page

    const result = await databaseService.getOpReturnTransactions(page, limit);

    res.json({
      success: true,
      data: result.transactions,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error("Error fetching OP_RETURN transactions:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});

// GET /api/stats - Statistics
router.get("/stats", async (req, res) => {
  try {
    const stats = await databaseService.getStats();

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});

export default router;
