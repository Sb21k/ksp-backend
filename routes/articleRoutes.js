const express = require('express')
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware')
const{newarticle, allArticles,getOneArticle,updateArticle,deleteArticle} = require('../controllers/articleController')

router.get('/',allArticles);
router.get('/:id',getOneArticle)

router.post('/',verifyToken, newarticle); // these must be verified before carrying out op
router.put('/:id',verifyToken,updateArticle);// hence middleware of verifying
router.delete('/:id',verifyToken,deleteArticle);

module.exports = router;