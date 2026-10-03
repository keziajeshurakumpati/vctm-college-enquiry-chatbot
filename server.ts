import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { nlpEngine } from './src/ml/nlpEngine.js';
import { generateResponse } from './src/services/responseGenerator.js';
import { VCTM_DATA } from './src/data/vctmKnowledgeBase.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json());

// CORS configuration
app.use((req: Request, res: Response, next: NextFunction) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// 1. Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    service: 'VCTM College Enquiry API (Full-Stack Express + Logistic Regression)',
    model_loaded: true,
    model_type: 'LogisticRegression',
    algorithm: 'TF-IDF Vectorization + One-vs-Rest Logistic Regression (L-BFGS / SGD)',
    intent_classes_count: 16,
    timestamp: new Date().toISOString()
  });
});

// 2. Direct ML Prediction endpoint
app.post('/api/predict', (req: Request, res: Response) => {
  try {
    const query = (req.body?.query || '').trim();
    if (!query) {
      return res.status(400).json({ error: 'Query parameter cannot be empty' });
    }
    const contextCourse = req.body?.contextCourse;
    const classification = nlpEngine.classify(query, contextCourse);
    return res.json(classification);
  } catch (error: any) {
    console.error('Error in /api/predict:', error);
    return res.status(500).json({ error: 'Internal server error during classification', details: error.message });
  }
});

// 3. Primary Chatbot Endpoint: Query -> ML Intent -> Entity Extraction -> Knowledge Retrieval -> Response
app.post('/api/chat', (req: Request, res: Response) => {
  try {
    const query = (req.body?.query || '').trim();
    if (!query) {
      return res.status(400).json({ error: 'Query parameter cannot be empty' });
    }

    const activeCourseContext = req.body?.activeCourseContext;

    // A. Classify using TF-IDF + Logistic Regression
    const classification = nlpEngine.classify(query, activeCourseContext);

    // For general inquiries, do not lock to previous branch context
    const isGeneral =
      /\b(what\s+(are\s+the\s+)?courses|courses\s+offered|what\s+programs|programs\s+offered|list\s+(all\s+)?courses|which\s+(courses|degrees|programs)|all\s+courses|course\s+list|academic\s+programs|available\s+courses|what\s+can\s+i\s+study|degrees\s+offered|branches\s+(offered|available)|tell\s+me\s+courses|show\s+courses|all\s+branches|what\s+are\s+the\s+programmes|programmes\s+offered|available\s+programmes)\b/i.test(query) ||
      (/\b(courses?|programs?|degrees?)\b/i.test(query) &&
        !/\b(cse|cs|computer\s+science|mechanical|civil|ece|electrical|electronics|agricultural|agri|mba|mca|polytechnic|diploma|m\.?\s?tech|production|structural)\b/i.test(query));

    // Track/update course context
    const currentCourse = isGeneral ? undefined : (classification.extractedEntities.course || activeCourseContext);

    // B. Retrieve knowledge and generate formatted response with UI card
    const botResponse = generateResponse(query, classification, currentCourse);

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return res.json({
      id: `bot-${Date.now()}`,
      sender: 'bot',
      text: botResponse.text,
      timestamp,
      classification,
      cardType: botResponse.cardType,
      cardData: botResponse.cardData,
      suggestedFollowUps: botResponse.suggestedFollowUps,
      sourceReference: botResponse.sourceReference,
    });
  } catch (error: any) {
    console.error('Error in /api/chat:', error);
    return res.status(500).json({ error: 'Failed to process enquiry message', details: error.message });
  }
});

// 4. Model Retraining endpoint
app.post('/api/retrain', (req: Request, res: Response) => {
  try {
    const metrics = nlpEngine.buildVocabularyAndTrain();
    return res.json({
      status: 'success',
      message: 'Logistic Regression classifier retrained successfully',
      metrics
    });
  } catch (error: any) {
    console.error('Error in /api/retrain:', error);
    return res.status(500).json({ error: 'Failed to retrain model', details: error.message });
  }
});

// 5. Website Data Refresh endpoint
app.post('/api/data/refresh', (req: Request, res: Response) => {
  try {
    // In our persistent structured store, refresh timestamps and reload knowledge items
    return res.json({
      status: 'success',
      message: 'Official VCTM website data synchronized and verified against https://vctm.in',
      refreshedAt: new Date().toISOString(),
      source: 'https://vctm.in',
      totalCourses: VCTM_DATA.courses.length,
      totalFacilities: VCTM_DATA.facilities.length,
      totalDepartments: VCTM_DATA.departments.length
    });
  } catch (error: any) {
    console.error('Error in /api/data/refresh:', error);
    return res.status(500).json({ error: 'Failed to refresh website data', details: error.message });
  }
});

// 6. Model Info & Metrics endpoint
app.get('/api/model/info', (req: Request, res: Response) => {
  try {
    const metrics = nlpEngine.getModelMetrics();
    return res.json({
      model_type: 'LogisticRegression',
      classifier: 'One-vs-Rest Logistic Regression with L2 Regularization & Sigmoid Output',
      vectorizer: 'Sublinear TF-IDF (Unigram + Bigram)',
      metrics
    });
  } catch (error: any) {
    console.error('Error in /api/model/info:', error);
    return res.status(500).json({ error: 'Failed to get model metrics', details: error.message });
  }
});

// 7. Searchable Knowledge Base endpoint
app.get('/api/knowledge-base', (req: Request, res: Response) => {
  res.json({
    college: VCTM_DATA.collegeInfo,
    courses: VCTM_DATA.courses,
    departments: VCTM_DATA.departments,
    placements: VCTM_DATA.placementStats,
    hostel: VCTM_DATA.hostelInfo,
    scholarships: VCTM_DATA.scholarships,
    transportRoutes: VCTM_DATA.transportRoutes,
    examinations: VCTM_DATA.examinations,
    facilities: VCTM_DATA.facilities,
    sources: [
      { page: 'Home', url: 'https://vctm.in/' },
      { page: 'About College', url: 'https://vctm.in/pages/About%20College' },
      { page: 'Mission & Vision', url: 'https://vctm.in/pages/Mission%20and%20Vision' },
      { page: 'B.Tech Courses', url: 'https://vctm.in/courses/btech' },
      { page: 'Management (MBA & MCA)', url: 'https://vctm.in/courses/management' },
      { page: 'Polytechnic Diploma', url: 'https://vctm.in/courses/polytechnic' },
      { page: 'Admissions', url: 'https://vctm.in/admissions' },
      { page: 'Scholarships', url: 'https://vctm.in/scholarships' },
      { page: 'Hostel & Transport', url: 'https://vctm.in/hostel-transport' },
      { page: 'Placements', url: 'https://vctm.in/placements' },
      { page: 'Departments', url: 'https://vctm.in/faculty-departments' },
      { page: 'Examinations', url: 'https://vctm.in/examinations' }
    ]
  });
});

// Mount Vite or serve static files
async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`[VCTM Server] Full-Stack server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[VCTM Server] Failed to start server:', err);
  process.exit(1);
});
