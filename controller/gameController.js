const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

exports.getImages = async (req, res) => {
  try {
    const images = await prisma.image.findMany({
      select: { id: true, title: true, url: true },
    });
    res.json(images);
  } catch (error) {
    console.error('Error fetching images:', error);
    res.status(500).json({ error: 'Failed to fetch images' });
  }
};

exports.getImageCharacters = async (req, res) => {
  try {
    const { id } = req.params;
    const characters = await prisma.character.findMany({
      where: { imageId: parseInt(id) },
      select: { id: true, name: true }, // don’t expose coordinates
    });
    res.json(characters);
  } catch (error) {
    console.error('Error fetching characters:', error);
    res.status(500).json({ error: 'Failed to fetch characters' });
  }
};

exports.validateCharacter = async (req, res) => {
  try {
    const { imageId, characterId, clickX, clickY } = req.body;

    const character = await prisma.character.findFirst({
      where: { id: characterId, imageId: imageId },
    });

    if (!character) {
      return res.status(404).json({ success: false, message: 'Character not found' });
    }

    // Normalize coordinates if needed (assuming image is scaled)
    const deltaX = clickX - character.x;
    const deltaY = clickY - character.y;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    const threshold = 30; // pixels
    if (distance <= threshold) {
      res.json({ success: true, message: 'Correct!' });
    } else {
      res.json({ success: false, message: 'Try again!' });
    }
  } catch (error) {
    console.error('Error validating character:', error);
    res.status(500).json({ error: 'Validation failed' });
  }
};

exports.startSession = async (req, res) => {
  try {
    const { imageId } = req.body;
    const session = await prisma.gameSession.create({
      data: {
        imageId,
        startTime: new Date(),
        completed: false,
      },
    });
    res.json(session);
  } catch (error) {
    console.error('Error starting session:', error);
    res.status(500).json({ error: 'Failed to start session' });
  }
};

exports.completeSession = async (req, res) => {
  try {
    const { id } = req.params;
    const { playerName } = req.body;

    const session = await prisma.gameSession.update({
      where: { id: parseInt(id) },
      data: { endTime: new Date(), completed: true },
    });

    const duration = (session.endTime - session.startTime) / 1000; // in seconds

    const score = await prisma.score.create({
      data: {
        playerName,
        duration,
        sessionId: session.id,
      },
    });

    res.json({ success: true, duration, score });
  } catch (error) {
    console.error('Error completing session:', error);
    res.status(500).json({ error: 'Failed to complete session' });
  }
};
