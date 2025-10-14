const express = require('express');
const Feedback = require('../models/Feedback');
const auth = require('../middleware/auth');

const router = express.Router();

// Submit feedback
router.post('/', auth, async (req, res) => {
  try {
    const {
      type,
      category,
      title,
      description,
      rating,
      priority = 'medium',
      tags = [],
      isAnonymous = false
    } = req.body;

    const feedback = new Feedback({
      userId: req.userId,
      type,
      category,
      title,
      description,
      rating,
      priority,
      tags,
      isAnonymous,
      metadata: {
        userAgent: req.get('User-Agent'),
        timestamp: new Date()
      }
    });

    await feedback.save();

    res.status(201).json({
      message: 'Feedback submitted successfully',
      feedbackId: feedback._id
    });
  } catch (error) {
    console.error('Submit feedback error:', error);
    res.status(500).json({ message: 'Error submitting feedback' });
  }
});

// Get user's feedback
router.get('/my', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, type, status } = req.query;

    const query = { userId: req.userId };
    if (type) query.type = type;
    if (status) query.status = status;

    const feedback = await Feedback.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit) * 1)
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Feedback.countDocuments(query);

    res.json({
      feedback,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total
      }
    });
  } catch (error) {
    console.error('Get user feedback error:', error);
    res.status(500).json({ message: 'Error fetching feedback' });
  }
});

// Get all feedback (admin)
router.get('/all', auth, async (req, res) => {
  try {
    // Check if user is admin (in real app, implement proper admin check)
    const { page = 1, limit = 20, type, category, status, priority } = req.query;

    const query = {};
    if (type) query.type = type;
    if (category) query.category = category;
    if (status) query.status = status;
    if (priority) query.priority = priority;

    const feedback = await Feedback.find(query)
      .populate('userId', 'username email firstName lastName')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit) * 1)
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Feedback.countDocuments(query);

    res.json({
      feedback,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total
      }
    });
  } catch (error) {
    console.error('Get all feedback error:', error);
    res.status(500).json({ message: 'Error fetching feedback' });
  }
});

// Update feedback status
router.put('/:feedbackId/status', auth, async (req, res) => {
  try {
    const { feedbackId } = req.params;
    const { status, response } = req.body;

    const feedback = await Feedback.findById(feedbackId);
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    feedback.status = status;
    
    if (response) {
      feedback.responses.push({
        responderId: req.userId,
        response,
        respondedAt: new Date()
      });
    }

    await feedback.save();

    res.json({
      message: 'Feedback status updated successfully',
      feedback
    });
  } catch (error) {
    console.error('Update feedback status error:', error);
    res.status(500).json({ message: 'Error updating feedback status' });
  }
});

// Get feedback analytics
router.get('/analytics', auth, async (req, res) => {
  try {
    const { days = 30 } = req.query;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const analytics = await Feedback.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: null,
          totalFeedback: { $sum: 1 },
          avgRating: { $avg: '$rating' },
          typeDistribution: {
            $push: {
              type: '$type',
              count: 1
            }
          },
          categoryDistribution: {
            $push: {
              category: '$category',
              count: 1
            }
          },
          statusDistribution: {
            $push: {
              status: '$status',
              count: 1
            }
          },
          priorityDistribution: {
            $push: {
              priority: '$priority',
              count: 1
            }
          }
        }
      },
      {
        $project: {
          totalFeedback: 1,
          avgRating: { $round: ['$avgRating', 2] },
          typeDistribution: {
            $reduce: {
              input: '$typeDistribution',
              initialValue: {},
              in: {
                $mergeObjects: [
                  '$$value',
                  {
                    $arrayToObject: [
                      [
                        {
                          k: '$$this.type',
                          v: {
                            $add: [
                              { $ifNull: [{ $getField: { field: '$$this.type', input: '$$value' } }, 0] },
                              1
                            ]
                          }
                        }
                      ]
                    ]
                  }
                ]
              }
            }
          },
          categoryDistribution: {
            $reduce: {
              input: '$categoryDistribution',
              initialValue: {},
              in: {
                $mergeObjects: [
                  '$$value',
                  {
                    $arrayToObject: [
                      [
                        {
                          k: '$$this.category',
                          v: {
                            $add: [
                              { $ifNull: [{ $getField: { field: '$$this.category', input: '$$value' } }, 0] },
                              1
                            ]
                          }
                        }
                      ]
                    ]
                  }
                ]
              }
            }
          },
          statusDistribution: {
            $reduce: {
              input: '$statusDistribution',
              initialValue: {},
              in: {
                $mergeObjects: [
                  '$$value',
                  {
                    $arrayToObject: [
                      [
                        {
                          k: '$$this.status',
                          v: {
                            $add: [
                              { $ifNull: [{ $getField: { field: '$$this.status', input: '$$value' } }, 0] },
                              1
                            ]
                          }
                        }
                      ]
                    ]
                  }
                ]
              }
            }
          },
          priorityDistribution: {
            $reduce: {
              input: '$priorityDistribution',
              initialValue: {},
              in: {
                $mergeObjects: [
                  '$$value',
                  {
                    $arrayToObject: [
                      [
                        {
                          k: '$$this.priority',
                          v: {
                            $add: [
                              { $ifNull: [{ $getField: { field: '$$this.priority', input: '$$value' } }, 0] },
                              1
                            ]
                          }
                        }
                      ]
                    ]
                  }
                ]
              }
            }
          }
        }
      }
    ]);

    res.json({
      period: `${days} days`,
      analytics: analytics[0] || {
        totalFeedback: 0,
        avgRating: 0,
        typeDistribution: {},
        categoryDistribution: {},
        statusDistribution: {},
        priorityDistribution: {}
      }
    });
  } catch (error) {
    console.error('Get feedback analytics error:', error);
    res.status(500).json({ message: 'Error fetching feedback analytics' });
  }
});

// Submit survey response
router.post('/survey', auth, async (req, res) => {
  try {
    const {
      surveyId,
      responses,
      completionTime
    } = req.body;

    const feedback = new Feedback({
      userId: req.userId,
      type: 'survey',
      category: 'ui_ux',
      title: `Survey Response - ${surveyId}`,
      description: JSON.stringify(responses),
      metadata: {
        surveyId,
        completionTime,
        userAgent: req.get('User-Agent'),
        timestamp: new Date()
      }
    });

    await feedback.save();

    res.status(201).json({
      message: 'Survey response submitted successfully',
      feedbackId: feedback._id
    });
  } catch (error) {
    console.error('Submit survey error:', error);
    res.status(500).json({ message: 'Error submitting survey response' });
  }
});

// Get feedback by ID
router.get('/:feedbackId', auth, async (req, res) => {
  try {
    const { feedbackId } = req.params;

    const feedback = await Feedback.findById(feedbackId)
      .populate('userId', 'username email firstName lastName');

    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    // Check if user owns this feedback or is admin
    if (feedback.userId._id.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({ feedback });
  } catch (error) {
    console.error('Get feedback by ID error:', error);
    res.status(500).json({ message: 'Error fetching feedback' });
  }
});

module.exports = router;