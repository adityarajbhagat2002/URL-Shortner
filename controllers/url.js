const {nanoid}  =require('nanoid');
const URL =require('../models/url');


async function handleGenerateNewShortURL(req,res){
    const body = req.body; 
    if(!body.url) return res.status(400).json({error : 'URL is required'})
    const  shortID = nanoid(5);
    await URL.create({
        shortID : shortID,
        redirectURL : body.url,
        visitHistory:[],

    });

    return res.json({id : shortID})
}

async function handleGetAnalytics(req,res){
    const shortID = req.params.shortID;
    const result = await URL.findOne({shortID});
    return res.json({
        totalClicks : result.visitHistory.length,
        analytics : result.visitHistory
    })
}

module.exports = {
    handleGenerateNewShortURL,
    handleGetAnalytics,

}