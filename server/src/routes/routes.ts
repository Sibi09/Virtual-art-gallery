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
import Auction from '../model/Auction';
import Event from '../model/Event';
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

  router.put('/users/me', checkAuth, upload.single('image'), async (req: RequestWithFile, res: Response) => {
    try {
      const fields = (({ username, email, bio, location }) =>
        ({ username, email, bio, location }))(req.body) as any;
  
      if (req.file) {
        fields['profileImage'] = `/uploads/${req.file.filename}`;
      }
  
      const updated = await User.findByIdAndUpdate((req as any).user.id, fields, { new: true });
      res.status(200).json(updated);
    } catch (err) {
      console.error('PUT /users/me error:', err);
      res.status(500).json({ message: 'Nem sikerült frissíteni a profilt.' });
    }
  });
  
  

  router.get('/users/:id/public-profile', async (req: Request, res: Response) => {
    try {
      const user = await User.findById(req.params.id).select('username bio profileImage location role');
      if (!user || user.role !== 'artist') {
        return res.status(404).json({ message: 'Művész nem található' });
      }
  
      const artworks = await Artwork.find({ artist: user._id }).select('title imageUrl price');
      const exhibitions = await Exhibition.find({ artist: user._id }).select('title startDate');
  
      res.json({ user, artworks, exhibitions });
    } catch (err) {
      console.error('GET /users/:id/public-profile error:', err);
      res.status(500).json({ message: 'Hiba a művész profil lekérdezésénél' });
    }
  });

  router.get('/artworks', async (_, res: Response) => {
    const artworks = await Artwork.find().populate('artist', 'username');
    res.json(artworks);
  });

  router.get('/artworks/mine', checkAuth, checkRole('artist'), async (req, res) => {
    const userId = (req as any).user.id;
    const artworks = await Artwork.find({ artist: userId }).populate('artist', 'username');
  
    res.json(artworks);
  });

  router.get('/artworks/available', async (_req, res) => {
    try {
      const soldArtworkIds = await Auction.find({
        status: 'ended',
        currentBidderId: { $ne: null }
      }).distinct('artworkId');
  
      const artworks = await Artwork.find({
        _id: { $nin: soldArtworkIds },
        availableForImmediatePurchase: true
      }).populate('artist', 'username');
  
      res.json(artworks);
    } catch (err) {
      console.error('GET /artworks/available error:', err);
      res.status(500).json({ message: 'Nem sikerült a galéria betöltése.' });
    }
  });
  
  router.post('/artworks', checkAuth, checkRole('artist'), upload.single('image'), async (req: RequestWithFile, res: Response) => {
    if (!req.file) return res.status(400).json({ message: 'Kép kötelező.' });
  
    const newArtwork = new Artwork({
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      imageUrl: `/uploads/${req.file.filename}`,
      artist: (req as any).user.id,
      availableForImmediatePurchase: req.body.availableForImmediatePurchase === 'true'
    });
  
    await newArtwork.save();
    res.status(201).json(newArtwork);
  });

  router.post('/artworks/:id/purchase', checkAuth, checkRole('collector'), async (req: Request, res: Response) => {
    try {
      const artwork = await Artwork.findById(req.params.id);
  
      if (!artwork) {
        return res.status(404).json({ message: 'Műalkotás nem található.' });
      }
  
      if (!artwork.availableForImmediatePurchase) {
        return res.status(400).json({ message: 'Ez a műalkotás nem elérhető közvetlen vásárlásra.' });
      }
  
      const transaction = new Transaction({
        artwork: artwork._id,
        price: artwork.price,
        collector: (req as any).user.id,
        type: 'direct',
        date: new Date()
      });
  
      await transaction.save();
  
      artwork.availableForImmediatePurchase = false;
      artwork.artist = (req as any).user.id;
      await artwork.save();
  
      res.status(200).json({ message: 'Sikeres vásárlás.', transaction });
    } catch (err) {
      console.error('POST /artworks/:id/purchase error:', err);
      res.status(500).json({ message: 'Hiba történt a vásárlás során.' });
    }
  });
  
  router.put('/artworks/:id', checkAuth, checkRole('artist'), async (req: Request, res: Response) => {
    try {
      const updates: Partial<{
        title: string;
        description: string;
        price: number;
        availableForImmediatePurchase: boolean;
      }> = req.body;
  
      const updated = await Artwork.findByIdAndUpdate(
        req.params.id,
        {
          ...updates,
          availableForImmediatePurchase: updates.availableForImmediatePurchase === true
        },
        { new: true }
      );
  
      if (!updated) {
        return res.status(404).json({ message: 'Műalkotás nem található.' });
      }
  
      res.status(200).json(updated);
    } catch (err) {
      console.error('PUT /artworks/:id error:', err);
      res.status(500).json({ message: 'Frissítés sikertelen.' });
    }
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

  router.post('/auctions', checkAuth, checkRole('artist'), async (req: Request, res: Response) => {
    try {
      const existing = await Auction.findOne({
        artworkId: req.body.artworkId,
        status: { $in: ['upcoming', 'live'] }
      });
      
      if (existing) {
        return res.status(400).json({
          message: 'Ehhez a műalkotáshoz már van aktív vagy közelgő aukció.'
        });
      }

      const auction = new Auction({
        ...req.body,
        artistId: (req as any).user.id,
        currentBid: req.body.startingPrice
      });
      await auction.save();
      res.status(201).json(auction);
    } catch (err) {
      console.error('POST /auctions error:', err);
      res.status(400).json({ message: 'Aukció létrehozása sikertelen', details: err });
    }
  });

  router.get('/auctions/active', async (_req: Request, res: Response) => {
    try {
      const now = new Date();
  
      await Auction.updateMany(
        {
          status: 'upcoming',
          startTime: { $lte: now }
        },
        { $set: { status: 'live' } }
      );
  
      const expiredAuctions = await Auction.find({
        status: 'live',
        endTime: { $lte: now }
      });
  
      for (const auction of expiredAuctions) {
        auction.status = 'ended';
        await auction.save();
  
        if (auction.currentBidderId) {
          await Artwork.findByIdAndUpdate(auction.artworkId, {
            $set: { artist: auction.currentBidderId }
          });
        }
      }
  
      const auctions = await Auction.find({
        status: 'live',
        startTime: { $lte: now },
        endTime: { $gte: now }
      })
        .populate('artworkId')
        .populate('currentBidderId');
  
      res.json(auctions);
    } catch (err) {
      console.error('GET /auctions/active error:', err);
      res.status(500).json({ message: 'Aukciók lekérdezése sikertelen', details: err });
    }
  });

  router.get('/auctions/:id', async (req: Request, res: Response) => {
    try {
      const auction = await Auction.findById(req.params.id)
        .populate('artworkId')
        .populate('bidHistory.userId');

      if (!auction) {
        return res.status(404).json({ message: 'Aukció nem található' });
      }

      res.json(auction);
    } catch (err) {
      console.error('GET /auctions/:id error:', err);
      res.status(500).json({ message: 'Hiba aukció lekérdezésénél', details: err });
    }
  });

  router.post('/auctions/:id/bid', checkAuth, checkRole('collector'), async (req: Request, res: Response) => {
    try {
      const { amount } = req.body;
      const auction = await Auction.findById(req.params.id);

      if (!auction) return res.status(404).json({ message: 'Aukció nem található' });
      if (amount <= auction.currentBid) {
        return res.status(400).json({ message: 'Licit túl alacsony' });
      }

      auction.currentBid = amount;
      auction.currentBidderId = (req as any).user.id;
      auction.bidHistory.push({ userId: (req as any).user.id, amount });

      await auction.save();
      res.status(200).json({ success: true, newBid: amount });
    } catch (err) {
      console.error('POST /auctions/:id/bid error:', err);
      res.status(500).json({ message: 'Licitálás sikertelen', details: err });
    }
  });

  router.get('/artworks/owned', checkAuth, checkRole('collector'), async (req, res) => {
    const userId = (req as any).user.id;
    const artworks = await Artwork.find({ artist: userId }).populate('artist', 'username');
    res.json(artworks);
  });

  router.get('/events', async (_req, res) => {
    try {
      const events = await Event.find({})
        .sort({ date: -1 })
        .populate('artist', 'username profileImage');
  
      res.json(events);
    } catch (err) {
      console.error('GET /events error:', err);
      res.status(500).json({ message: 'Nem sikerült lekérni az eseményeket.' });
    }
  });
  

  router.post('/events', checkAuth, checkRole('artist'), async (req, res) => {
    try {
      const userId = (req as any).user?.id;
  
      if (!userId) {
        return res.status(401).json({ message: 'Nincs bejelentkezve.' });
      }
  
      const event = new Event({
        title: req.body.title,
        description: req.body.description,
        date: req.body.date,
        type: req.body.type || 'live',
        link: req.body.link,
        artist: userId
      });
  
      await event.save();
      res.status(201).json(event);
    } catch (err) {
      console.error('POST /events error:', err);
      res.status(400).json({ message: 'Esemény létrehozása sikertelen.', details: err });
    }
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
