const Lead = require('../models/Lead');
const Message = require('../models/Message');
const Comment = require('../models/Comment');
const AutoReplyRule = require('../models/AutoReplyRule');
const Log = require('../models/Log');

exports.getDashboardStats = async (req, res) => {
  try {
    const totalLeads = await Lead.countDocuments();
    const wonLeads = await Lead.countDocuments({ stage: 'Won' });
    const conversionRate = totalLeads === 0 ? 0 : ((wonLeads / totalLeads) * 100).toFixed(1);

    const totalMessages = await Message.countDocuments();
    const automatedMessages = await Message.countDocuments({ isAutomated: true });
    
    const activeWorkflows = await AutoReplyRule.countDocuments({ isActive: true });

    // Recent activity
    const recentActivity = await Log.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('performedBy', 'name');

    res.status(200).json({
      success: true,
      data: {
        totalLeads,
        wonLeads,
        conversionRate,
        totalMessages,
        automatedMessages,
        activeWorkflows,
        recentActivity
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getWordCloud = async (req, res) => {
  try {
    const comments = await Comment.find({ direction: 'inbound' });
    
    // Stop words to ignore
    const stopWords = new Set([
      'the', 'is', 'in', 'at', 'of', 'on', 'and', 'a', 'to', 'for', 'with', 'it', 'this', 'that', 
      'i', 'you', 'my', 'your', 'we', 'they', 'he', 'she', 'was', 'are', 'as', 'by', 'be', 'or', 
      'an', 'not', 'have', 'has', 'had', 'from', 'but', 'what', 'all', 'were', 'when', 'there', 
      'can', 'so', 'if', 'out', 'up', 'about', 'who', 'which', 'their', 'how', 'will', 'just',
      'like', 'do', 'don', 'out', 'get', 'me', 'am', 'are'
    ]);

    const wordCounts = {};

    comments.forEach(comment => {
      if (!comment.text) return;
      
      const words = comment.text.toLowerCase().match(/\b[a-z]{3,}\b/g) || [];
      words.forEach(word => {
        if (!stopWords.has(word)) {
          wordCounts[word] = (wordCounts[word] || 0) + 1;
        }
      });
    });

    const wordCloudData = Object.keys(wordCounts)
      .map(word => ({ text: word, value: wordCounts[word] }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 50); // top 50 words

    res.status(200).json(wordCloudData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
