import axios from 'axios';

// Cache using a Map
const cache = new Map<string, any>();

// add new functions and link types here for further expansion
const scraperMap = new Map<string, (url: string) => Promise<any>>([
    ['.json', (url: string) => retryWithBackoff(() => scrapeJSON(url), 3, 1000)],
    ['.html', (url: string) => retryWithBackoff(() => scrapeHTML(url), 3, 1000)],
]);

/**
 * Function to scrape full JSON object from /entity-{slug}-{uuid}.json
 */
async function scrapeJSON(url: string): Promise<any> {
    // Check if the URL is cached
    // TODO: cache this in redis.
    // Thought is that crawler might bring in same url for scrapping 
    // having cache reduces repeatitive work and loops.
    if (cache.has(url)) {
        console.log(`Fetching cached result for ${url}`);
        return cache.get(url);
    }

    try {
        const response = await axios.get(url);
        const data = response.data;

        // Cache the result
        cache.set(url, data);
        return data;
    } catch (error) {
        console.error(`Error scraping JSON from ${url}:`, error.message);
        cache.set(url, null);  // Cache the failure as null to avoid retries
        throw error;
    }
}

/**
 * Function to scrape full HTML from /product-{slug}.html
 */
async function scrapeHTML(url: string): Promise<any> {
    // Check if the URL is cached
    if (cache.has(url)) {
        console.log(`Fetching cached result for ${url}`);
        return cache.get(url);
    }

    try {
        const response = await axios.get(url);
        const html = response.data;
       
        if (!html) {
            throw new Error('Invalid HTML response');
        }

        // Cache the result
        cache.set(url, html);
        return html;
    } catch (error) {
        console.error(`Error scraping HTML from ${url}:`, error.message);
        cache.set(url, null);  // Cache the failure as null to avoid retries
        throw error;
    }
}

/**
 * Exponential backoff retry logic
 */
async function retryWithBackoff<T>(fn: () => Promise<T>, retries: number, delay: number): Promise<T> {
    for (let attempt = 0; attempt <= retries; attempt++) {
        try {
            return await fn();
        } catch (error) {
            if (attempt === retries) throw error;
            const backoff = delay * 2 ** attempt;
            console.log(`Retrying in ${backoff}ms...`);
            await new Promise(res => setTimeout(res, backoff));
        }
    }
    throw new Error('Exceeded max retries');
}

/**
 * Function to determine URL type and scrape accordingly
 */
async function scrape(url: string): Promise<any> {
    // Find the appropriate scrape function by matching the extension
    for (const [extension, scraperFunction] of scraperMap) {
        if (url.endsWith(extension)) {
            return scraperFunction(url); 
        }
    }

    // If no handler found, throw an error
    throw new Error('Invalid Link');
}

export { scrape };
