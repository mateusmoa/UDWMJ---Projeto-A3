const express = require('express');
const cors = require('cors');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

// Middleware para CORS e JSON
router.use(cors());
router.use(express.json());

// Cadastro e login
router.post('/register', userController.register);
router.post('/login', userController.login);

// Rota para obter dados do usuário logado
router.get('/profile', auth, userController.getCurrentUser);

// Perfil do usuário
router.get('/me', auth, userController.getCurrentUser);
router.put('/me', auth, userController.updateProfile);
// Atualização de senha
router.put('/me/password', auth, userController.updatePassword);

// Endereços do usuário
router.get('/me/addresses', auth, userController.getAddresses);
router.post('/me/addresses', auth, userController.addAddress);
router.put('/me/addresses/:id', auth, userController.updateAddress);

// Métricas e metas do usuário
router.get('/me/metrics', auth, userController.getMetrics);
router.get('/me/goals', auth, userController.getGoals);
router.put('/me/goals', auth, userController.updateGoals);

// Preferências do usuário
router.get('/me/preferences', auth, userController.getPreferences);
router.put('/me/preferences', auth, userController.updatePreferences);

// Histórico de pedidos do usuário
router.get('/me/orders', auth, userController.getUserOrders); 


module.exports = router;