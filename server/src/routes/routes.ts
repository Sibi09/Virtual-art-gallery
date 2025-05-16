import { Router } from 'express';
import { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

import mongoose from 'mongoose';

import { User } from '../model/User';
import Artwork from '../model/Artwork';
import Exhibition from '../model/Exhibition';
import Transaction from '../model/Transaction';
import { checkAuth, checkRole } from '../middleware/auth';

import { RequestWithFile } from '../routes/RequestWithFile';

const storage = multer.diskStorage({
  destination: function (_, __, cb) {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: function (_, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage });

export function configureRoutes(passport: any, router: Router): Router {

  router.get('/users/me', checkAuth, async (req: Request, res: Response) => {
    const user = await User.findById((req as any).user.id).select('-password');
    res.json(user);
  });

  router.get('/artworks', async (_, res: Response) => {
    const artworks = await Artwork.find().populate('artist', 'username');
    res.json(artworks);
  });

  router.get('/artworks/mine', checkAuth, checkRole('artist'), async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const artworks = await Artwork.find({ artist: userId }).populate('artist', 'username');
    res.json(artworks);
  });

  router.post('/artworks', checkAuth, checkRole('artist'), upload.single('image'), async (req: RequestWithFile, res: Response) => {
    if (!req.file) return res.status(400).json({ message: 'Kép kötelező.' });
  
    const newArtwork = new Artwork({
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      imageUrl: `/uploads/${req.file.filename}`,
      artist: (req as any).user.id
    });
  
    await newArtwork.save();
    res.status(201).json(newArtwork);
  });

  router.put('/artworks/:id', checkAuth, checkRole('artist'), async (req: Request, res: Response) => {
    const updated = await Artwork.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  });

  router.delete('/artworks/:id', checkAuth, checkRole('artist'), async (req: Request, res: Response) => {
    try {
      const artwork = await Artwork.findById(req.params.id);
      if (!artwork) return res.status(404).json({ message: 'Artwork not found.' });
  
      if (artwork.imageUrl) {
        const imagePath = path.join(__dirname, '../../uploads', path.basename(artwork.imageUrl));
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }
  
      await artwork.deleteOne();
  
      res.status(204).end();
    } catch (err) {
      console.error('Artwork delete error:', err);
      res.status(500).json({ message: 'Error deleting artwork.' });
    }
  });

  router.get('/exhibitions', async (_, res: Response) => {
    const list = await Exhibition.find()
      .populate('artist', 'username')
      .populate('artworks', 'title imageUrl price');
  
    res.json(list);
  });
  

  router.post('/exhibitions', checkAuth, checkRole('artist'), async (req: Request, res: Response) => {
    const exhibition = new Exhibition({
      ...req.body,
      artist: (req as any).user.id
    });
    await exhibition.save();
    res.status(201).json(exhibition);
  });

  router.get('/exhibitions/mine', checkAuth, checkRole('artist'), async (req: Request, res: Response) => {
    const user = req.user as { id: string };
    const list = await Exhibition.find().populate('artist', 'username').populate('artworks');
    res.json(list);
  });

  router.get('/exhibitions/:id', async (req: Request, res: Response) => {
    try {
      const exhibition = await Exhibition.findById(req.params.id).populate('artist', 'username');
  
      if (!exhibition) {
        return res.status(404).json({ message: 'Exhibition not found.' });
      }
  
      res.json(exhibition);
    } catch (err) {
      console.error('GET /exhibitions/:id error:', err);
      res.status(500).json({ message: 'Server error.' });
    }
  });

  router.put('/exhibitions/:id', checkAuth, checkRole('artist'), async (req: Request, res: Response) => {
    try {
      const updated = await Exhibition.findByIdAndUpdate(req.params.id, req.body, { new: true });
  
      if (!updated) {
        return res.status(404).json({ message: 'Exhibition not found.' });
      }
  
      res.json(updated);
    } catch (err) {
      console.error('PUT /exhibitions/:id error:', err);
      res.status(500).json({ message: 'Server error during update.' });
    }
  });

  router.delete('/exhibitions/:id', checkAuth, checkRole('artist'), async (req: Request, res: Response) => {
    await Exhibition.findByIdAndDelete(req.params.id);
    res.status(204).end();
  });

  router.put('/exhibitions/:id/artworks', checkAuth, checkRole('artist'), async (req: Request, res: Response) => {
    try {
      const exhibition = await Exhibition.findById(req.params.id)
      .populate('artist', 'username')
      .populate('artworks', 'title price imageUrl')
  
      if (!exhibition) {
        return res.status(404).json({ message: 'Exhibition not found.' });
      }
  
      if (!exhibition.artist || String((exhibition.artist as any)._id || exhibition.artist) !== String((req.user as any).id)) {
        return res.status(403).json({ message: 'Unauthorized to modify this exhibition.' });
      }
  
      const { artworkIds } = req.body;
  
      if (!Array.isArray(artworkIds)) {
        return res.status(400).json({ message: 'Invalid input: artworkIds must be an array.' });
      }
  
      exhibition.artworks = artworkIds.map(id => new mongoose.Types.ObjectId(id)) as any;
      await exhibition.save();
  
      const populated = await exhibition.populate('artworks');
      res.status(200).json(populated);
  
    } catch (err) {
      console.error('PUT /exhibitions/:id/artworks error:', err);
      res.status(500).json({ message: 'Server error.' });
    }
  });
  

  router.post('/transactions', checkAuth, checkRole('collector'), async (req: Request, res: Response) => {
    const { artwork, price } = req.body;
    const tx = new Transaction({
      artwork,
      price,
      collector: (req as any).user.id
    });
    await tx.save();
    res.status(201).json(tx);
  });

  router.post('/users/register', async (req: Request, res: Response) => {
    try {
      const { username, email, password, role } = req.body;
      const existing = await User.findOne({ email });

      if (existing) {
        return res.status(409).json({ message: 'User already exists.' });
      }

      const user = new User({ username, email, password, role });
      await user.save();
      res.status(201).json({ message: 'User registered successfully.' });

    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ message: 'Server error during registration.' });
    }
  });

  router.post('/users/login', (req, res, next) => {
    passport.authenticate('local', async (err: Error | null, user: Express.User | false, info: any) => {
      if (err) return next(err);
      if (!user) return res.status(401).json({ message: info?.message || 'Bad credentials.' });

      req.logIn(user, async (err) => {
        if (err) return next(err);
        const cleanUser = await User.findById((user as any)._id).select('-password');
        return res.status(200).json({ message: 'Login successful.', user: cleanUser });
      });
    })(req, res, next);
  });

  router.post('/logout', (req, res) => {
    req.logout(err => {
      if (err) return res.status(500).json({ message: 'Logout failed', error: err });

      req.session.destroy(err => {
        if (err) return res.status(500).json({ message: 'Session destroy failed', error: err });

        res.clearCookie('connect.sid', { path: '/' });
        res.status(200).json({ message: 'Logged out successfully' });
      });
    });
  });

  return router;
}
