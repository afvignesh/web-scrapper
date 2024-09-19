
import nock from 'nock';
import { scrape } from '../src/scraper'; 

import chai from 'chai'
import { expect } from 'chai'; 
// chai.use(expect);

describe('Web Scraper Tests', () => {
    
    before(() => {
        // Mock JSON endpoint
        nock('http://localhost:3000')
            .get('/entity-test-slug-uuid.json')
            .reply(200, { title: 'My title', id: 'uuid-123', slug: 'test-slug' });

        // Mock HTML endpoint
        nock('http://localhost:3000')
            .get('/product-test-slug.html')
            .reply(200, '<html><body><h1 class="product-title">Product Title</h1></body></html>');
    });

    it('should scrape JSON and cache the result', async () => {
        const url = 'http://localhost:3000/entity-test-slug-uuid.json';
        
        // First scrape, cache should be empty
        const jsonData = await scrape(url);
        expect(jsonData).to.deep.equal({ title: 'My title', id: 'uuid-123', slug: 'test-slug' });

        // Second scrape, should be fetched from cache
        const cachedData = await scrape(url);
        expect(cachedData).to.deep.equal({ title: 'My title', id: 'uuid-123', slug: 'test-slug' });
    });

    it('should scrape HTML and cache the result', async () => {
        const url = 'http://localhost:3000/product-test-slug.html';
        
        // First scrape, cache should be empty
        const htmlData = await scrape(url);
        expect(htmlData).to.include('<h1 class="product-title">Product Title</h1>');

        // Second scrape, should be fetched from cache
        const cachedHTMLData = await scrape(url);
        expect(cachedHTMLData).to.include('<h1 class="product-title">Product Title</h1>');
    });

    after(() => {
        // Clean up Nock to prevent affecting other tests
        nock.cleanAll();
    });
});
