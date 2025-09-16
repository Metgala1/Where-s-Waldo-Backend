const { Router } = require('express');
const router = Router();
const gameController = require('../controller/gameController');

// Routes
router.get('/images', gameController.getImages);
router.get('/images/:id/characters', gameController.getImageCharacters);

router.post('/validate', gameController.validateCharacter);
router.post('/sessions', gameController.startSession);
router.post('/sessions/:id/complete', gameController.completeSession);

module.exports = router;
