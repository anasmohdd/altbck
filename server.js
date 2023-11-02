const express = require('express');
const request = require('request-promise');
const cheerio = require('cheerio');
const app = express();
const cors = require('cors');

app.use(cors());

app.get('/check', async (req, res) => {
    const url = req.query.url;
    if (!url) {
        return res.status(400).send('Missing URL parameter');
    }

    try {
        const body = await request(url);
        const $ = cheerio.load(body);
        const images = $('img');
        let missingAltTags = [];

        images.each((index, image) => {
            const alt = $(image).attr('alt');
            if (!alt) {
                missingAltTags.push($(image).attr('src'));
            }
        });

        res.json({
            totalImages: images.length,
            imagesMissingAlt: missingAltTags.length,
            images: missingAltTags
        });
    } catch (error) {
        res.status(500).send('Error fetching the webpage');
    }
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server running on port ${port}`));