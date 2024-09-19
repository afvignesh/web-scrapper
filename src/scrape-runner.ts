import fs from 'fs';
import { scrape } from './scraper';

// Function to read URLs from a text file and scrape them
async function readUrlsFromFile(filePath: string): Promise<void> {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        const urls = data.split('\n').filter(url => url.trim() !== ''); // Read and filter empty lines

        for (const url of urls) {
            // TODO : send this to a queue and let scrapper be an independent service
            // This will allow to process concurrently
            const data = await scrape(url.trim()); // Call the scrape function for each URL
            console.log(data)
        }
    } catch (error) {
        console.error(`Error reading file: ${filePath}, Error: ${error.message}`);
    }
}

// Main function to start the scraping process
async function startScraping() {
    const filePath = 'urls.txt'; // Text file containing the URLs
    await readUrlsFromFile(filePath);
}

startScraping();
