import { PlaywrightCrawler } from '@crawlee/playwright';

const crawler = new PlaywrightCrawler({
    maxRequestsPerCrawl: 10,
    async requestHandler({ request, page, enqueueLinks }) {
        console.log(`Processing: ${request.url}`);
            
        // Allow links to youtube.com, www.youtube.com
        await enqueueLinks({
            subdomainAliases: ['www'], 
        });
    },
});

// Should find and enqueue www.youtube.com links from the page
crawler.run(['https://youtube.com']);