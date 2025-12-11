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

  /**
   * GET /api/questions/:id
   * returns question by id
   */
  router.get('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const question = await service.getQuestionById(id);

      if (!question) {
        return res.status(404).json({
          success: false,
          error: `Question with ID "${id}" not found`,
        });
      }

      res.json({ success: true, data: question });
    } catch (error) {
      console.error(`Error in GET /:id:`, error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch question',
      });
    }
  });

  /**
   * GET /api/questions
   * returns all questions (flat list)
   */
  router.get('/', async (req, res) => {
    try {
      const questions = await service.getAllQuestions();
      res.json({ success: true, data: questions });
    } catch (error) {
      console.error('Error in GET /:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch questions',
      });
    }
  });

  return router;
}
