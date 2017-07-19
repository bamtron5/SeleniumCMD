import * as webdriver from 'selenium-webdriver';
import * as Promise from 'bluebird';
import * as fs from 'fs';

export class SeleniumCmd {
  public By = webdriver.By;
  public until = webdriver.until;
  public driver:webdriver.ThenableWebDriver = new webdriver.Builder()
                  .forBrowser('chrome')
                  .build();
  constructor (
    public site:string = 'https://google.com'
  ) {
    this.driver.then(() => this.takeScreen());
  }

  public takeScreen() {
    this.driver.get(this.site)
      .catch((e) => this.errorHandler(e))
      .then(() => this.driver.takeScreenshot())
      .catch((e) => this.errorHandler(e))
      .then((screenShot) => this.writeScreenShot(screenShot));
  }

  public writeScreenShot(screenShot) {
    fs.writeFile('screenShot.png', screenShot, 'base64', (e) => {
      if (e) this.errorHandler(e);
      this.quit();
    });
  }

  public errorHandler(e) {
    console.log(e);
    console.trace();
    this.driver.quit();
  }

  public quit() {
    this.driver.quit();
  }
}

/**
 * Call a website.
 * @constructor
 * @param {string} url - Url of the site.
 */
const options = process.argv[2];
const scmd = new SeleniumCmd(options);
