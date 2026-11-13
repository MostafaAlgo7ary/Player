const express = require('express');
const axios = require('axios');
const app = express();

app.get('/', async (req, res) => {
    const targetUrl = req.query.url;
    
    if (!targetUrl) {
        return res.status(400).send('الرجاء إضافة رابط البث: /?url=YOUR_LINK');
    }

    try {
        const response = await axios({
            method: 'get',
            url: targetUrl,
            responseType: 'stream',
            headers: {
                // هذه الترويسات هي "السر" لتخطي حماية الموقع
                'Referer': 'https://www.123tv.fun/',
                'Origin': 'https://www.123tv.fun',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });

        // السماح للمتصفح بقراءة البث (تخطي CORS)
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Headers', '*');
        
        if (response.headers['content-type']) {
            res.setHeader('Content-Type', response.headers['content-type']);
        }

        // تمرير البث للمتصفح
        response.data.pipe(res);
        
    } catch (error) {
        console.error('Proxy Error:', error.message);
        res.status(500).send('فشل الاتصال بالسيرفر الأصلي. قد يكون الرابط منتهي الصلاحية.');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));
