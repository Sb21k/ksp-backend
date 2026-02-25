const db = require('../config/db')

exports.newarticle = async(req,res) =>{
    try{
    const {title, category,content,tags} = req.body;
    const id  = req.user.id;

    const [result] = await db.query("INSERT into articles (content, title,category,tags, auth_id) values(?,?,?,?,?)",[content,title,category,tags,id]);
    res.status(201).json({message:'Successfully created a article'});
    }
    catch(error){
        console.log(error)
        res.status(500).json({error:'Unable to create a article'})
    }


};

exports.allArticles = async(req,res) =>{
    try{
        const query = "select a.id, a.title, a.category, a.created_at, substring(a.content, 1, 100) as short, u.username as Author from articles a join users u on a.auth_id = u.id;"
        const [articles] = await db.query(query);
        res.json(articles);

    }
    catch(error){
        console.error(error);
        res.status(500).json({error:"Unable to fetch articles"});
    }
}

exports.getOneArticle = async(req,res)=>{
    try{
        const articleId = req.params.id;
        const [article] = await db.query("select a.*, u.username from articles a join users u on a.auth_id = u.id where a.id =?",[articleId]);
        if(article.length === 0){
            return res.status(404).json({error:"No articles found!"})
        }
        res.json(article[0]);
    }
    catch(error){
        res.status(500).json({error:"Unable to fetch any article"})
    }
}

exports.updateArticle = async(req,res) =>{
    try{
        const articleId = req.params.id;
        const auth_id = req.user.id;
        const {title, category,content,tags} = req.body;

        const [result] = await db.query("update articles set title=?, content=?, tags = ?,category=? where auth_id=? and id =?",[title,content,tags,category,auth_id,articleId])
        if(result.affectedRows === 0) {
            return res.status(403).json({ error: 'Not authorized to edit this article or it does not exist' });
        }

        res.json({ message: 'Article updated successfully' })
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update article' });
    }
}

exports.deleteArticle = async (req, res) => {
    try {
        const articleId = req.params.id;
        const authorId = req.user.id;

        const [result] = await db.query(
            'DELETE FROM Articles WHERE id = ? AND author_id = ?',
            [articleId, authorId]
        );

        if (result.affectedRows === 0) {
            return res.status(403).json({ error: 'Not authorized to delete this article' });
        }

        res.json({ message: 'Article deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete article' });
    }
};