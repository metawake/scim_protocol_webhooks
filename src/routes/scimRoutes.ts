import { Router } from 'express';
import { ScimController } from '../controllers/scimController';
import { authenticate } from '../middleware/auth';
import { validateScimUser } from '../middleware/validation';

const router = Router();
const scimController = new ScimController();

// Apply authentication middleware to all routes
router.use(authenticate);

// SCIM 2.0 Routes with validation
router.post('/Users', validateScimUser, (req, res) => scimController.createUser(req, res));
router.get('/Users', (req, res) => scimController.getUsers(req, res));
router.get('/Users/:id', (req, res) => scimController.getUserById(req, res));
router.put('/Users/:id', validateScimUser, (req, res) => scimController.updateUser(req, res));
router.delete('/Users/:id', (req, res) => scimController.deleteUser(req, res));

// Webhook endpoint for receiving SCIM data with validation
router.post('/webhook/users', validateScimUser, (req, res) => scimController.createUser(req, res));

export default router; 