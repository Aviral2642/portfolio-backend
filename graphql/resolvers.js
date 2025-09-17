const Project = require('../models/Project');
const Research = require('../models/Research');
const Experience = require('../models/Experience');
const Education = require('../models/Education');
const Award = require('../models/Award');
const Speaking = require('../models/Speaking');
const Skill = require('../models/Skill');
const ContactMessage = require('../models/ContactMessage');
const Analytics = require('../models/Analytics');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const resolvers = {
  Query: {
    // Portfolio Stats
    getPortfolioStats: async () => {
      try {
        const [projects, research, awards, speaking, analytics] = await Promise.all([
          Project.countDocuments(),
          Research.countDocuments(),
          Award.countDocuments(),
          Speaking.countDocuments(),
          Analytics.aggregate([
            { $group: { _id: null, totalViews: { $sum: '$views' } } }
          ])
        ]);

        return {
          totalProjects: projects,
          totalResearch: research,
          totalAwards: awards,
          totalSpeaking: speaking,
          totalViews: analytics[0]?.totalViews || 0,
          lastUpdated: new Date().toISOString()
        };
      } catch (error) {
        throw new Error('Failed to fetch portfolio stats');
      }
    },

    // Projects
    getProjects: async (_, { featured, category, limit = 10 }) => {
      try {
        let query = {};
        if (featured !== undefined) query.featured = featured;
        if (category) query.category = category;

        const projects = await Project.find(query)
          .sort({ createdAt: -1 })
          .limit(limit);
        return projects;
      } catch (error) {
        throw new Error('Failed to fetch projects');
      }
    },

    getProject: async (_, { id }) => {
      try {
        const project = await Project.findById(id);
        if (!project) throw new Error('Project not found');
        return project;
      } catch (error) {
        throw new Error('Failed to fetch project');
      }
    },

    // Research
    getResearch: async (_, { featured, venue, limit = 10 }) => {
      try {
        let query = {};
        if (featured !== undefined) query.featured = featured;
        if (venue) query.venue = venue;

        const research = await Research.find(query)
          .sort({ year: -1, createdAt: -1 })
          .limit(limit);
        return research;
      } catch (error) {
        throw new Error('Failed to fetch research');
      }
    },

    getResearchById: async (_, { id }) => {
      try {
        const research = await Research.findById(id);
        if (!research) throw new Error('Research not found');
        return research;
      } catch (error) {
        throw new Error('Failed to fetch research');
      }
    },

    // Experience
    getExperience: async () => {
      try {
        const experience = await Experience.find().sort({ startDate: -1 });
        return experience;
      } catch (error) {
        throw new Error('Failed to fetch experience');
      }
    },

    getExperienceById: async (_, { id }) => {
      try {
        const experience = await Experience.findById(id);
        if (!experience) throw new Error('Experience not found');
        return experience;
      } catch (error) {
        throw new Error('Failed to fetch experience');
      }
    },

    // Education
    getEducation: async () => {
      try {
        const education = await Education.find().sort({ startDate: -1 });
        return education;
      } catch (error) {
        throw new Error('Failed to fetch education');
      }
    },

    getEducationById: async (_, { id }) => {
      try {
        const education = await Education.findById(id);
        if (!education) throw new Error('Education not found');
        return education;
      } catch (error) {
        throw new Error('Failed to fetch education');
      }
    },

    // Awards
    getAwards: async (_, { featured, category }) => {
      try {
        let query = {};
        if (featured !== undefined) query.featured = featured;
        if (category) query.category = category;

        const awards = await Award.find(query).sort({ year: -1 });
        return awards;
      } catch (error) {
        throw new Error('Failed to fetch awards');
      }
    },

    getAwardById: async (_, { id }) => {
      try {
        const award = await Award.findById(id);
        if (!award) throw new Error('Award not found');
        return award;
      } catch (error) {
        throw new Error('Failed to fetch award');
      }
    },

    // Speaking
    getSpeaking: async (_, { featured, limit = 10 }) => {
      try {
        let query = {};
        if (featured !== undefined) query.featured = featured;

        const speaking = await Speaking.find(query)
          .sort({ date: -1 })
          .limit(limit);
        return speaking;
      } catch (error) {
        throw new Error('Failed to fetch speaking engagements');
      }
    },

    getSpeakingById: async (_, { id }) => {
      try {
        const speaking = await Speaking.findById(id);
        if (!speaking) throw new Error('Speaking engagement not found');
        return speaking;
      } catch (error) {
        throw new Error('Failed to fetch speaking engagement');
      }
    },

    // Skills
    getSkills: async (_, { category, featured }) => {
      try {
        let query = {};
        if (category) query.category = category;
        if (featured !== undefined) query.featured = featured;

        const skills = await Skill.find(query).sort({ level: -1 });
        return skills;
      } catch (error) {
        throw new Error('Failed to fetch skills');
      }
    },

    getSkillById: async (_, { id }) => {
      try {
        const skill = await Skill.findById(id);
        if (!skill) throw new Error('Skill not found');
        return skill;
      } catch (error) {
        throw new Error('Failed to fetch skill');
      }
    },

    // Contact Messages
    getContactMessages: async (_, { status, limit = 50 }) => {
      try {
        let query = {};
        if (status) query.status = status;

        const messages = await ContactMessage.find(query)
          .sort({ createdAt: -1 })
          .limit(limit);
        return messages;
      } catch (error) {
        throw new Error('Failed to fetch contact messages');
      }
    },

    getContactMessageById: async (_, { id }) => {
      try {
        const message = await ContactMessage.findById(id);
        if (!message) throw new Error('Contact message not found');
        return message;
      } catch (error) {
        throw new Error('Failed to fetch contact message');
      }
    },

    // Analytics
    getAnalytics: async (_, { page, date }) => {
      try {
        let query = {};
        if (page) query.page = page;
        if (date) query.date = date;

        const analytics = await Analytics.find(query).sort({ date: -1 });
        return analytics;
      } catch (error) {
        throw new Error('Failed to fetch analytics');
      }
    },

    getAnalyticsStats: async () => {
      try {
        const stats = await Analytics.aggregate([
          {
            $group: {
              _id: null,
              totalViews: { $sum: '$views' },
              totalUniqueViews: { $sum: '$uniqueViews' }
            }
          }
        ]);

        return {
          totalProjects: await Project.countDocuments(),
          totalResearch: await Research.countDocuments(),
          totalAwards: await Award.countDocuments(),
          totalSpeaking: await Speaking.countDocuments(),
          totalViews: stats[0]?.totalViews || 0,
          lastUpdated: new Date().toISOString()
        };
      } catch (error) {
        throw new Error('Failed to fetch analytics stats');
      }
    }
  },

  Mutation: {
    // Authentication
    login: async (_, { email, password }) => {
      try {
        const user = await User.findOne({ email });
        if (!user) throw new Error('Invalid credentials');

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) throw new Error('Invalid credentials');

        const token = jwt.sign(
          { userId: user.id, email: user.email },
          process.env.JWT_SECRET || 'your-secret-key',
          { expiresIn: '7d' }
        );

        return token;
      } catch (error) {
        throw new Error('Login failed');
      }
    },

    register: async (_, { email, password, name }) => {
      try {
        const existingUser = await User.findOne({ email });
        if (existingUser) throw new Error('User already exists');

        const hashedPassword = await bcrypt.hash(password, 12);
        const user = new User({
          email,
          password: hashedPassword,
          name,
          role: 'admin'
        });

        await user.save();

        const token = jwt.sign(
          { userId: user.id, email: user.email },
          process.env.JWT_SECRET || 'your-secret-key',
          { expiresIn: '7d' }
        );

        return token;
      } catch (error) {
        throw new Error('Registration failed');
      }
    },

    // Projects
    createProject: async (_, { input }) => {
      try {
        const project = new Project(input);
        await project.save();
        return project;
      } catch (error) {
        throw new Error('Failed to create project');
      }
    },

    updateProject: async (_, { id, input }) => {
      try {
        const project = await Project.findByIdAndUpdate(id, input, { new: true });
        if (!project) throw new Error('Project not found');
        return project;
      } catch (error) {
        throw new Error('Failed to update project');
      }
    },

    deleteProject: async (_, { id }) => {
      try {
        const project = await Project.findByIdAndDelete(id);
        if (!project) throw new Error('Project not found');
        return true;
      } catch (error) {
        throw new Error('Failed to delete project');
      }
    },

    // Research
    createResearch: async (_, { input }) => {
      try {
        const research = new Research(input);
        await research.save();
        return research;
      } catch (error) {
        throw new Error('Failed to create research');
      }
    },

    updateResearch: async (_, { id, input }) => {
      try {
        const research = await Research.findByIdAndUpdate(id, input, { new: true });
        if (!research) throw new Error('Research not found');
        return research;
      } catch (error) {
        throw new Error('Failed to update research');
      }
    },

    deleteResearch: async (_, { id }) => {
      try {
        const research = await Research.findByIdAndDelete(id);
        if (!research) throw new Error('Research not found');
        return true;
      } catch (error) {
        throw new Error('Failed to delete research');
      }
    },

    // Experience
    createExperience: async (_, { input }) => {
      try {
        const experience = new Experience(input);
        await experience.save();
        return experience;
      } catch (error) {
        throw new Error('Failed to create experience');
      }
    },

    updateExperience: async (_, { id, input }) => {
      try {
        const experience = await Experience.findByIdAndUpdate(id, input, { new: true });
        if (!experience) throw new Error('Experience not found');
        return experience;
      } catch (error) {
        throw new Error('Failed to update experience');
      }
    },

    deleteExperience: async (_, { id }) => {
      try {
        const experience = await Experience.findByIdAndDelete(id);
        if (!experience) throw new Error('Experience not found');
        return true;
      } catch (error) {
        throw new Error('Failed to delete experience');
      }
    },

    // Education
    createEducation: async (_, { input }) => {
      try {
        const education = new Education(input);
        await education.save();
        return education;
      } catch (error) {
        throw new Error('Failed to create education');
      }
    },

    updateEducation: async (_, { id, input }) => {
      try {
        const education = await Education.findByIdAndUpdate(id, input, { new: true });
        if (!education) throw new Error('Education not found');
        return education;
      } catch (error) {
        throw new Error('Failed to update education');
      }
    },

    deleteEducation: async (_, { id }) => {
      try {
        const education = await Education.findByIdAndDelete(id);
        if (!education) throw new Error('Education not found');
        return true;
      } catch (error) {
        throw new Error('Failed to delete education');
      }
    },

    // Awards
    createAward: async (_, { input }) => {
      try {
        const award = new Award(input);
        await award.save();
        return award;
      } catch (error) {
        throw new Error('Failed to create award');
      }
    },

    updateAward: async (_, { id, input }) => {
      try {
        const award = await Award.findByIdAndUpdate(id, input, { new: true });
        if (!award) throw new Error('Award not found');
        return award;
      } catch (error) {
        throw new Error('Failed to update award');
      }
    },

    deleteAward: async (_, { id }) => {
      try {
        const award = await Award.findByIdAndDelete(id);
        if (!award) throw new Error('Award not found');
        return true;
      } catch (error) {
        throw new Error('Failed to delete award');
      }
    },

    // Speaking
    createSpeaking: async (_, { input }) => {
      try {
        const speaking = new Speaking(input);
        await speaking.save();
        return speaking;
      } catch (error) {
        throw new Error('Failed to create speaking engagement');
      }
    },

    updateSpeaking: async (_, { id, input }) => {
      try {
        const speaking = await Speaking.findByIdAndUpdate(id, input, { new: true });
        if (!speaking) throw new Error('Speaking engagement not found');
        return speaking;
      } catch (error) {
        throw new Error('Failed to update speaking engagement');
      }
    },

    deleteSpeaking: async (_, { id }) => {
      try {
        const speaking = await Speaking.findByIdAndDelete(id);
        if (!speaking) throw new Error('Speaking engagement not found');
        return true;
      } catch (error) {
        throw new Error('Failed to delete speaking engagement');
      }
    },

    // Skills
    createSkill: async (_, { input }) => {
      try {
        const skill = new Skill(input);
        await skill.save();
        return skill;
      } catch (error) {
        throw new Error('Failed to create skill');
      }
    },

    updateSkill: async (_, { id, input }) => {
      try {
        const skill = await Skill.findByIdAndUpdate(id, input, { new: true });
        if (!skill) throw new Error('Skill not found');
        return skill;
      } catch (error) {
        throw new Error('Failed to update skill');
      }
    },

    deleteSkill: async (_, { id }) => {
      try {
        const skill = await Skill.findByIdAndDelete(id);
        if (!skill) throw new Error('Skill not found');
        return true;
      } catch (error) {
        throw new Error('Failed to delete skill');
      }
    },

    // Contact
    sendContactMessage: async (_, { input }) => {
      try {
        const message = new ContactMessage({
          ...input,
          status: 'new'
        });
        await message.save();
        return message;
      } catch (error) {
        throw new Error('Failed to send message');
      }
    },

    updateContactMessageStatus: async (_, { id, status }) => {
      try {
        const message = await ContactMessage.findByIdAndUpdate(
          id,
          { status },
          { new: true }
        );
        if (!message) throw new Error('Contact message not found');
        return message;
      } catch (error) {
        throw new Error('Failed to update message status');
      }
    },

    // Analytics
    trackPageView: async (_, { page }) => {
      try {
        const today = new Date().toISOString().split('T')[0];
        let analytics = await Analytics.findOne({ page, date: today });
        
        if (analytics) {
          analytics.views += 1;
          analytics.uniqueViews += 1; // In real app, track unique visitors
          await analytics.save();
        } else {
          analytics = new Analytics({
            page,
            views: 1,
            uniqueViews: 1,
            date: today
          });
          await analytics.save();
        }
        
        return analytics;
      } catch (error) {
        throw new Error('Failed to track page view');
      }
    }
  }
};

module.exports = resolvers;
