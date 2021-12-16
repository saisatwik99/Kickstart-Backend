const Trending = require('../models/trending');

exports.getTrending = async (req, res) => {
    const Trendings = await Trending.find();
    res.send(Trendings);
}

exports.postTrending = async (req, res) => {
    const {
        imageSrc,
        type,
        pricePerDay,
        title,
        trendingText,
        durationText,
        locationText  
    } = req.body;
    try {
        const result = await Trending.create({ 
            imageSrc, type, pricePerDay, title, trendingText, durationText, locationText
        });
        res.send(result);
    }
    catch (err){
        res.status(400).send(err.message);
    }
}