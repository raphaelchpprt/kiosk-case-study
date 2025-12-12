import { Router } from 'express';
import { QuestionService } from '../services/QuestionService';

export function createQuestionRoutes(service: QuestionService): Router {
  const router = Router();

  /**
   * GET /api/questions/tree
   * hirarchical structure of questions
   */
  router.get('/tree', async (req, res) => {
    try {
      const tree = await service.getQuestionTree();
      res.json({ success: true, data: tree });
    } catch (error) {
      console.error('Error in GET /tree:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch question tree',
      });
    }
  });

  return router;
}
