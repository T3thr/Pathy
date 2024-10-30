// scripts/createAdminUser.js
import mongoose from 'mongoose';
import User from '@/backend/models/User'; // Adjust the import based on your project structure
import bcrypt from 'bcryptjs';

const createAdminUser = async () => {
    await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    
    // Hash the password
    const hashedPassword = await bcrypt.hash('123456', 10);

    const admin = new User({
        username: 'admin',
        password: hashedPassword,
        email: 'admin@pathy.com',
        role: 'admin',
        avatar: 'admin-avatar.jpg',
    });

    await admin.save();
    console.log('Admin user created:', admin);
    await mongoose.disconnect();
};

createAdminUser().catch(console.error);
