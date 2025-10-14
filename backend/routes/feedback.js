const express = require('express');
const Feedback = require('../models/Feedback');
const Survey = require('../models/Survey');
const { authenticateToken, optionalAuth, requireRole } = require('../middleware/auth');

const router = express.Router();

// Submit feedback
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { type, title, content, rating, category, context, surveyId, responses, testId, variant } = req.body;

    if (!type || !content) {
      return res.status(400).json({ message: 'Type and content are required' });
    }

    const feedback = new Feedback({
      userId: req.user._id,
      type,
      title,
      content,
      rating,
      category,
      context,
      surveyId,
      responses,
      testId,
      variant
    });

    await feedback.save();

    res.status(201).json({
      message: 'Feedback submitted successfully',
      feedback: {
        id: feedback._id,
        type: feedback.type,
        title: feedback.title,
        status: feedback.status,
        createdAt: feedback.createdAt
      }
    });
  } catch (error) {
    console.error('Feedback submission error:', error);
    res.status(500).json({ message: 'Error submitting feedback' });
  }
});

// Get user's feedback history
router.get('/my-feedback', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 20, type, status } = req.query;
    
    const query = { userId: req.user._id };
    if (type) query.type = type;
    if (status) query.status = status;

    const feedback = await Feedback.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .populate('adminResponse.respondedBy', 'firstName lastName');

    const total = await Feedback.countDocuments(query);

    res.json({
      feedback,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Feedback history error:', error);
    res.status(500).json({ message: 'Error fetching feedback history' });
  }
});

// Get all feedback (admin only)
router.get('/', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const { page = 1, limit = 50, type, status, category, priority } = req.query;
    
    const query = {};
    if (type) query.type = type;
    if (status) query.status = status;
    if (category) query.category = category;
    if (priority) query.priority = priority;

    const feedback = await Feedback.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .populate('userId', 'username firstName lastName email')
      .populate('adminResponse.respondedBy', 'firstName lastName');

    const total = await Feedback.countDocuments(query);

    res.json({
      feedback,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Feedback list error:', error);
    res.status(500).json({ message: 'Error fetching feedback' });
  }
});

// Update feedback status (admin only)
router.put('/:feedbackId/status', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const { feedbackId } = req.params;
    const { status, response } = req.body;

    const feedback = await Feedback.findById(feedbackId);
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    feedback.status = status;
    
    if (response) {
      feedback.adminResponse = {
        respondedBy: req.user._id,
        response,
        respondedAt: new Date()
      };
    }

    await feedback.save();

    res.json({
      message: 'Feedback updated successfully',
      feedback
    });
  } catch (error) {
    console.error('Feedback update error:', error);
    res.status(500).json({ message: 'Error updating feedback' });
  }
});

// Get feedback statistics (admin only)
router.get('/stats', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const [
      totalFeedback,
      newFeedback,
      resolvedFeedback,
      averageRating,
      feedbackByType,
      feedbackByCategory
    ] = await Promise.all([
      Feedback.countDocuments(),
      Feedback.countDocuments({ status: 'new' }),
      Feedback.countDocuments({ status: 'resolved' }),
      Feedback.aggregate([
        { $match: { rating: { $exists: true } } },
        { $group: { _id: null, avgRating: { $avg: '$rating' } } }
      ]),
      Feedback.aggregate([
        { $group: { _id: '$type', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]),
      Feedback.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ])
    ]);

    res.json({
      overview: {
        total: totalFeedback,
        new: newFeedback,
        resolved: resolvedFeedback,
        averageRating: averageRating[0]?.avgRating || 0
      },
      breakdown: {
        byType: feedbackByType,
        byCategory: feedbackByCategory
      }
    });
  } catch (error) {
    console.error('Feedback statistics error:', error);
    res.status(500).json({ message: 'Error fetching feedback statistics' });
  }
});

// Create survey (admin only)
router.post('/surveys', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const surveyData = {
      ...req.body,
      createdBy: req.user._id
    };

    const survey = new Survey(surveyData);
    await survey.save();

    res.status(201).json({
      message: 'Survey created successfully',
      survey
    });
  } catch (error) {
    console.error('Survey creation error:', error);
    res.status(500).json({ message: 'Error creating survey' });
  }
});

// Get active surveys for user
router.get('/surveys/active', optionalAuth, async (req, res) => {
  try {
    const { page } = req.query;
    
    const now = new Date();
    const activeSurveys = await Survey.find({
      isActive: true,
      $or: [
        { 'schedule.startDate': { $exists: false } },
        { 'schedule.startDate': { $lte: now } }
      ],
      $or: [
        { 'schedule.endDate': { $exists: false } },
        { 'schedule.endDate': { $gte: now } }
      ]
    });

    // Filter surveys based on user targeting
    const eligibleSurveys = [];
    
    for (const survey of activeSurveys) {
      if (!req.user) {
        // Anonymous user - only show surveys targeting 'all'
        if (survey.targetAudience.userTypes.includes('all')) {
          eligibleSurveys.push(survey);
        }
      } else {
        // Check if survey should be shown to this user
        if (survey.shouldShowToUser(req.user, { page })) {
          eligibleSurveys.push(survey);
        }
      }
    }

    res.json({
      surveys: eligibleSurveys,
      count: eligibleSurveys.length
    });
  } catch (error) {
    console.error('Active surveys error:', error);
    res.status(500).json({ message: 'Error fetching active surveys' });
  }
});

// Submit survey response
router.post('/surveys/:surveyId/responses', authenticateToken, async (req, res) => {
  try {
    const { surveyId } = req.params;
    const { responses, variant } = req.body;

    const survey = await Survey.findById(surveyId);
    if (!survey) {
      return res.status(404).json({ message: 'Survey not found' });
    }

    // Create feedback entry for survey response
    const feedback = new Feedback({
      userId: req.user._id,
      type: 'survey',
      surveyId,
      content: 'Survey response',
      responses,
      variant,
      context: {
        timestamp: new Date()
      }
    });

    await feedback.save();

    // Update survey analytics
    survey.analytics.totalResponses += 1;
    survey.calculateResponseRate();
    await survey.save();

    res.json({
      message: 'Survey response submitted successfully',
      responseId: feedback._id
    });
  } catch (error) {
    console.error('Survey response error:', error);
    res.status(500).json({ message: 'Error submitting survey response' });
  }
});

// Get all surveys (admin only)
router.get('/surveys', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const { page = 1, limit = 20, isActive } = req.query;
    
    const query = {};
    if (typeof isActive === 'string') {
      query.isActive = isActive === 'true';
    }

    const surveys = await Survey.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .populate('createdBy', 'firstName lastName');

    const total = await Survey.countDocuments(query);

    res.json({
      surveys,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Surveys list error:', error);
    res.status(500).json({ message: 'Error fetching surveys' });
  }
});

// Get survey analytics (admin only)
router.get('/surveys/:surveyId/analytics', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const { surveyId } = req.params;

    const survey = await Survey.findById(surveyId);
    if (!survey) {
      return res.status(404).json({ message: 'Survey not found' });
    }

    // Get detailed response analytics
    const responses = await Feedback.find({
      surveyId,
      type: 'survey'
    }).populate('userId', 'subscription.plan');

    // Analyze responses by question
    const questionAnalytics = survey.questions.map(question => {
      const questionResponses = responses
        .map(r => r.responses.find(resp => resp.questionId === question.id))
        .filter(Boolean);

      const analytics = {
        questionId: question.id,
        question: question.question,
        type: question.type,
        totalResponses: questionResponses.length,
        responseRate: responses.length > 0 ? (questionResponses.length / responses.length * 100) : 0
      };

      // Type-specific analytics
      if (question.type === 'scale' || question.type === 'rating') {
        const values = questionResponses.map(r => r.answer).filter(a => typeof a === 'number');
        analytics.average = values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0;
        analytics.distribution = {};
        values.forEach(val => {
          analytics.distribution[val] = (analytics.distribution[val] || 0) + 1;
        });
      } else if (question.type === 'radio' || question.type === 'checkbox') {
        analytics.distribution = {};
        questionResponses.forEach(r => {
          const answer = Array.isArray(r.answer) ? r.answer : [r.answer];
          answer.forEach(ans => {
            analytics.distribution[ans] = (analytics.distribution[ans] || 0) + 1;
          });
        });
      }

      return analytics;
    });

    res.json({
      survey: {
        id: survey._id,
        title: survey.title,
        analytics: survey.analytics
      },
      responses: {
        total: responses.length,
        byUserType: responses.reduce((acc, r) => {
          const userType = r.userId?.subscription?.plan || 'unknown';
          acc[userType] = (acc[userType] || 0) + 1;
          return acc;
        }, {})
      },
      questions: questionAnalytics
    });
  } catch (error) {
    console.error('Survey analytics error:', error);
    res.status(500).json({ message: 'Error fetching survey analytics' });
  }
});

module.exports = router;