import { Router } from 'express';
import multer from 'multer';
import { QuestionService } from '../services/QuestionService';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only CSV files are allowed.'));
    }
  },
});

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
   * POST api/questions/upload
   * Upload a data file and return the parsed question tree
   */
  router.post('/upload', upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: 'No file uploaded',
        });
      }

      const tree = await service.processUploadedDataFile(
        req.file.buffer,
        req.file.mimetype
      );
      res.json({ success: true, data: tree });
    } catch (error) {
      console.error('Error un POST /upload:', error);
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to process CSV',
      });
    }

    return router;
  });

  return router;
}
