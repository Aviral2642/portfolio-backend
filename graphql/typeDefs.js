const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    id: ID!
    email: String!
    name: String!
    role: String!
    createdAt: String!
    updatedAt: String!
  }

  type Project {
    id: ID!
    title: String!
    description: String!
    longDescription: String
    technologies: [String!]!
    githubUrl: String
    liveUrl: String
    imageUrl: String
    featured: Boolean!
    category: String!
    status: String!
    createdAt: String!
    updatedAt: String!
  }

  type Research {
    id: ID!
    title: String!
    authors: [String!]!
    venue: String!
    year: Int!
    description: String!
    abstract: String
    pdfUrl: String
    featured: Boolean!
    status: String!
    createdAt: String!
    updatedAt: String!
  }

  type Experience {
    id: ID!
    company: String!
    position: String!
    description: String!
    startDate: String!
    endDate: String
    current: Boolean!
    location: String
    technologies: [String!]!
    achievements: [String!]!
    createdAt: String!
    updatedAt: String!
  }

  type Education {
    id: ID!
    institution: String!
    degree: String!
    field: String!
    startDate: String!
    endDate: String
    gpa: String
    description: String
    achievements: [String!]!
    createdAt: String!
    updatedAt: String!
  }

  type Award {
    id: ID!
    title: String!
    organization: String!
    year: Int!
    description: String!
    category: String!
    featured: Boolean!
    createdAt: String!
    updatedAt: String!
  }

  type Speaking {
    id: ID!
    title: String!
    event: String!
    date: String!
    location: String!
    description: String!
    slidesUrl: String
    videoUrl: String
    featured: Boolean!
    createdAt: String!
    updatedAt: String!
  }

  type Skill {
    id: ID!
    name: String!
    category: String!
    level: Int!
    description: String!
    icon: String
    featured: Boolean!
    createdAt: String!
    updatedAt: String!
  }

  type ContactMessage {
    id: ID!
    name: String!
    email: String!
    subject: String!
    message: String!
    status: String!
    createdAt: String!
    updatedAt: String!
  }

  type Analytics {
    id: ID!
    page: String!
    views: Int!
    uniqueViews: Int!
    date: String!
    createdAt: String!
    updatedAt: String!
  }

  type PortfolioStats {
    totalProjects: Int!
    totalResearch: Int!
    totalAwards: Int!
    totalSpeaking: Int!
    totalViews: Int!
    lastUpdated: String!
  }

  input ProjectInput {
    title: String!
    description: String!
    longDescription: String
    technologies: [String!]!
    githubUrl: String
    liveUrl: String
    imageUrl: String
    featured: Boolean
    category: String!
    status: String!
  }

  input ResearchInput {
    title: String!
    authors: [String!]!
    venue: String!
    year: Int!
    description: String!
    abstract: String
    pdfUrl: String
    featured: Boolean
    status: String!
  }

  input ExperienceInput {
    company: String!
    position: String!
    description: String!
    startDate: String!
    endDate: String
    current: Boolean!
    location: String
    technologies: [String!]!
    achievements: [String!]!
  }

  input EducationInput {
    institution: String!
    degree: String!
    field: String!
    startDate: String!
    endDate: String
    gpa: String
    description: String
    achievements: [String!]!
  }

  input AwardInput {
    title: String!
    organization: String!
    year: Int!
    description: String!
    category: String!
    featured: Boolean
  }

  input SpeakingInput {
    title: String!
    event: String!
    date: String!
    location: String!
    description: String!
    slidesUrl: String
    videoUrl: String
    featured: Boolean
  }

  input SkillInput {
    name: String!
    category: String!
    level: Int!
    description: String!
    icon: String
    featured: Boolean
  }

  input ContactInput {
    name: String!
    email: String!
    subject: String!
    message: String!
  }

  type Query {
    # Portfolio Data
    getPortfolioStats: PortfolioStats!
    
    # Projects
    getProjects(featured: Boolean, category: String, limit: Int): [Project!]!
    getProject(id: ID!): Project
    
    # Research
    getResearch(featured: Boolean, venue: String, limit: Int): [Research!]!
    getResearchById(id: ID!): Research
    
    # Experience
    getExperience: [Experience!]!
    getExperienceById(id: ID!): Experience
    
    # Education
    getEducation: [Education!]!
    getEducationById(id: ID!): Education
    
    # Awards
    getAwards(featured: Boolean, category: String): [Award!]!
    getAwardById(id: ID!): Award
    
    # Speaking
    getSpeaking(featured: Boolean, limit: Int): [Speaking!]!
    getSpeakingById(id: ID!): Speaking
    
    # Skills
    getSkills(category: String, featured: Boolean): [Skill!]!
    getSkillById(id: ID!): Skill
    
    # Contact Messages
    getContactMessages(status: String, limit: Int): [ContactMessage!]!
    getContactMessageById(id: ID!): ContactMessage
    
    # Analytics
    getAnalytics(page: String, date: String): [Analytics!]!
    getAnalyticsStats: PortfolioStats!
  }

  type Mutation {
    # Authentication
    login(email: String!, password: String!): String!
    register(email: String!, password: String!, name: String!): String!
    
    # Projects
    createProject(input: ProjectInput!): Project!
    updateProject(id: ID!, input: ProjectInput!): Project!
    deleteProject(id: ID!): Boolean!
    
    # Research
    createResearch(input: ResearchInput!): Research!
    updateResearch(id: ID!, input: ResearchInput!): Research!
    deleteResearch(id: ID!): Boolean!
    
    # Experience
    createExperience(input: ExperienceInput!): Experience!
    updateExperience(id: ID!, input: ExperienceInput!): Experience!
    deleteExperience(id: ID!): Boolean!
    
    # Education
    createEducation(input: EducationInput!): Education!
    updateEducation(id: ID!, input: EducationInput!): Education!
    deleteEducation(id: ID!): Boolean!
    
    # Awards
    createAward(input: AwardInput!): Award!
    updateAward(id: ID!, input: AwardInput!): Award!
    deleteAward(id: ID!): Boolean!
    
    # Speaking
    createSpeaking(input: SpeakingInput!): Speaking!
    updateSpeaking(id: ID!, input: SpeakingInput!): Speaking!
    deleteSpeaking(id: ID!): Boolean!
    
    # Skills
    createSkill(input: SkillInput!): Skill!
    updateSkill(id: ID!, input: SkillInput!): Skill!
    deleteSkill(id: ID!): Boolean!
    
    # Contact
    sendContactMessage(input: ContactInput!): ContactMessage!
    updateContactMessageStatus(id: ID!, status: String!): ContactMessage!
    
    # Analytics
    trackPageView(page: String!): Analytics!
  }

  type Subscription {
    # Real-time updates
    projectUpdated: Project!
    researchUpdated: Research!
    contactMessageReceived: ContactMessage!
    analyticsUpdated: Analytics!
  }
`;

module.exports = typeDefs;
