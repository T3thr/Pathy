import mongodbConnect from "@/backend/lib/mongodb";
import Project from '@/backend/models/Project';

export default async function handler(req, res) {
    await mongodbConnect();
    
    switch (req.method) {
      case 'POST': // Save or create a project
        try {
          const project = await Project.create(req.body);
          res.status(200).json({ success: true, data: project });
        } catch (error) {
          res.status(400).json({ success: false, error });
        }
        break;
      case 'GET': // Load user projects
        try {
          const projects = await Project.find({ user: req.query.userId });
          res.status(200).json({ success: true, data: projects });
        } catch (error) {
          res.status(400).json({ success: false, error });
        }
        break;
      default:
        res.status(400).json({ success: false });
        break;
    }
  }