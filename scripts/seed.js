require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const Therapist = require('../models/Therapist');

const therapists = [
  {
    name: 'Dr. Emily Chen',
    email: 'emily.chen@littleheartstherapy.com',
    licenseNo: 'SLP-12345',
    specialties: ['Speech Therapy', 'Social Skills'],
    yearsExperience: 12,
    title: 'Speech-Language Pathologist',
    bio: 'Dr. Chen specializes in early intervention speech therapy and has helped hundreds of children find their voice.'
  },
  {
    name: 'Marcus Williams',
    email: 'marcus.w@littleheartstherapy.com',
    licenseNo: 'BCBA-67890',
    specialties: ['Behavioral Therapy'],
    yearsExperience: 8,
    title: 'Board Certified Behavior Analyst',
    bio: 'Marcus uses positive, play-based ABA techniques to help children build essential life skills.'
  },
  {
    name: 'Sarah Patel',
    email: 'sarah.patel@littleheartstherapy.com',
    licenseNo: 'OTR-11223',
    specialties: ['Occupational Therapy', 'Sensory Processing'],
    yearsExperience: 10,
    title: 'Occupational Therapist',
    bio: 'Sarah helps children develop fine motor skills and navigate sensory challenges with creative, engaging activities.'
  },
  {
    name: 'Jessica Moore',
    email: 'jessica.moore@littleheartstherapy.com',
    licenseNo: 'RPT-44556',
    specialties: ['Play Therapy', 'Family Counseling'],
    yearsExperience: 7,
    title: 'Registered Play Therapist',
    bio: 'Jessica creates safe spaces where children can express emotions and heal through the power of play.'
  }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    await User.deleteMany({ email: { $in: therapists.map(t => t.email) } });
    await Therapist.deleteMany({});

    const passwordHash = await bcrypt.hash('password123', 12);

    for (const t of therapists) {
      const user = await User.create({
        name: t.name,
        email: t.email,
        passwordHash,
        role: 'therapist'
      });

      const availability = new Map();
      ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].forEach(day => {
        availability.set(day, ['9:00', '10:00', '11:00', '14:00', '15:00', '16:00']);
      });

      await Therapist.create({
        userId: user._id,
        licenseNo: t.licenseNo,
        specialties: t.specialties,
        yearsExperience: t.yearsExperience,
        title: t.title,
        bio: t.bio,
        availability
      });

      console.log(`Created therapist: ${t.name}`);
    }

    const parentExists = await User.findOne({ email: 'parent@example.com' });
    if (!parentExists) {
      await User.create({
        name: 'Demo Parent',
        email: 'parent@example.com',
        passwordHash,
        role: 'parent',
        phone: '(555) 987-6543'
      });
      console.log('Created demo parent: parent@example.com / password123');
    }

    console.log('\nSeed complete!');
    console.log('Therapist login: any seeded email / password123');
    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err);
    process.exit(1);
  }
}

seed();
