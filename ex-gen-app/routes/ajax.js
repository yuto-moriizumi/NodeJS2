const express = require('express');
const router = express.Router();

const data = [
    { name: 'Taro', age: 35, mail: 'taro@yamada' },
];

router.get('/', (req, res, next) => {
    const n = parseInt(req.query.id);
    if (n == NaN || n < 0 || data.length <= n) {
        res.send('none data');
    } else {
        res.json(data[n]);
    };
});

module.exports = router;