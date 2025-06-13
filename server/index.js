const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = 3000;
// If using local MongoDB server
//const MONGO_URI = 'mongodb://127.0.0.1:27017/ProfileDB';
// Online MongoDB server
const MONGO_URI = secrets.MONGODB_URI;

app.use(cors());
app.use(express.json());

mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

const profileSchema = new mongoose.Schema({
  deviceId: String,
  name: String,
  vehicleBrand: String,
  vehicleModel: String,
  licensePlate: String,
});

const Profile = mongoose.model('Profile', profileSchema);

// app.post('/api/profile', async (req, res) => {
//   try {
//     const newProfile = new Profile(req.body);
//     await newProfile.save();
//     res.status(201).json(newProfile);
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to save profile' });
//   }
// });

// To save the profile to database
app.post('/api/profile', async (req, res) => {
  const { deviceId, profileData } = req.body;

  try {
    const profile = await Profile.findOneAndUpdate(
      { deviceId },
      { profileData },
      { new: true, upsert: true } // create if not exists
    );

    res.status(201).json({ message: 'Profile saved successfully', profile });
  } catch (error) {
    res.status(500).json({ message: 'Failed to save profile', error });
  }
});


// app.get('/api/profile', async (req, res) => {
//   try {
//     const profiles = await Profile.find();
//     res.json(profiles);
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to get profiles' });
//   }
// });

// To retrieve the profile from database
app.get('/api/profile/:deviceId', async (req, res) => {
  try {
    const profile = await Profile.findOne({ deviceId: req.params.deviceId });
    if (profile) {
      res.json(profile);
    } else {
      res.status(404).json({ error: 'Profile not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://172.20.10.13:${PORT}`);
});