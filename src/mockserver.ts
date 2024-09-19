import express from 'express';

const app = express();

// Simulate JSON response for /entity-{slug}-{uuid}.json
app.get('/entity-:slug-:uuid.json', (req, res) => {
    res.json({
        title: 'My title',
        slug: req.params.slug,
        uuid: req.params.uuid
    });
});

// Simulate HTML response for /product-{slug}.html
app.get('/product-:slug.html', (req, res) => {
    res.send(`
        <html>
            <head></head>
            <body>
                <h1 class="product-title" data-id="${req.params.slug}-uuid">Product title</h1>
            </body>
        </html>
    `);
});

// Start the mock server on port 3000
app.listen(3000, () => {
    console.log('Mock server is running at http://localhost:3000');
});
