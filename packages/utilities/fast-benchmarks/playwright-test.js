/* eslint-disable */
const { chromium } = require("playwright");

(async () => {
    console.log("launching browser\n");
    const browser = await chromium.launch();
    console.log("creating browser context\n");
    const context = await browser.newContext();
    console.log("creating new page\n");
    const page = await context.newPage();
    console.log("navigating to test page");
    await page.goto("localhost:8080/a.html");
    // console.dir(Object.keys(test.default))
    const dimensions = await page.evaluate(() => {
        console.log(benchmark.default);
        // console.log(foobar.default.run())
        // return test.default.run()
        // return test.run();
    });

    console.log(dimensions);

    await browser.close();
})();
