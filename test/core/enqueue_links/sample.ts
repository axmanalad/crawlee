import { PlaywrightCrawler, Dataset } from '@crawlee/playwright';

// Test the equivalentSubdomains parameter
async function testEquivalentSubdomains() {
    const crawler = new PlaywrightCrawler({
        maxRequestsPerCrawl: 10,
        headless: false,
        launchContext: {
            launchOptions: {
                slowMo: 500,
            },
        },
        async requestHandler({ request, page, enqueueLinks }) {
            console.log(`Processing: ${request.url}`);
            
            // Extract title for demonstration
            const title = await page.title();
            console.log(`Page title: ${title}`);
            
            // Test with equivalentSubdomains parameter
            // This will treat 'www.reddit.com' and 'reddit.com' as equivalent
            await enqueueLinks({
                selector: 'a[href*="wordpress.com"]', // Only reddit links
                // equivalentSubdomains: ['blog'], // Treat www and no-www as equivalent
                // You can also test with: equivalentSubdomains: ['www', 'm', 'mobile']
            });

            
            
            // Save some data for verification
            await Dataset.pushData({
                url: request.url,
                title,
                timestamp: new Date().toISOString(),
            });
        },
    });

    console.log('Starting crawler with equivalentSubdomains test...');
    console.log('This will treat www.reddit.com and reddit.com as equivalent domains');
    
    await crawler.run(['https://blog.wordpress.com']);
    
    console.log('Crawling finished! Check the dataset for results.');
}

// Test without equivalentSubdomains for comparison
async function testWithoutEquivalentSubdomains() {
    const crawler = new PlaywrightCrawler({
        maxRequestsPerCrawl: 10,
        headless: false,
        launchContext: {
            launchOptions: {
                slowMo: 500,
            },
        },
        async requestHandler({ request, page, enqueueLinks }) {
            console.log(`Processing: ${request.url}`);
            
            const title = await page.title();
            console.log(`Page title: ${title}`);
            
            // Test WITHOUT equivalentSubdomains parameter
            // This will only enqueue links with exactly the same subdomain
            await enqueueLinks({
                selector: 'a[href*="reddit.com"]',
                // No equivalentSubdomains parameter - strict subdomain matching
            });
            
            await Dataset.pushData({
                url: request.url,
                title,
                timestamp: new Date().toISOString(),
                test: 'without_equivalent_subdomains',
            });
        },
    });

    console.log('Starting crawler WITHOUT equivalentSubdomains...');
    console.log('This will only enqueue links with exactly the same subdomain');
    
    await crawler.run(['https://reddit.com/r/legal']);
    
    console.log('Crawling finished! Check the dataset for results.');
}

// Run the tests
async function runTests() {
    console.log('=== Testing equivalentSubdomains parameter ===\n');
    
    // Test with equivalentSubdomains
    await testEquivalentSubdomains();
    
    console.log('\n=== Testing without equivalentSubdomains ===\n');
    
    // Test without equivalentSubdomains
    await testWithoutEquivalentSubdomains();
    
    console.log('\n=== Tests completed ===');
    console.log('Check the dataset to see the difference in enqueued URLs');
}

// Export for potential use in other tests
export { testEquivalentSubdomains, testWithoutEquivalentSubdomains, runTests };

// Run if this file is executed directly
if (require.main === module) {
    runTests().catch(console.error);
}