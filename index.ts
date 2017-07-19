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
    public site:string = 'https://facebook.com/login.php'
  ) {
    this.driver.then(() => this.driver.get(this.site))
      .then(() => this.authInit())
      .catch((e) => this.errorHandler(e));
  }

  public authInit() {
    console.info(`Authenticating at ${this.site} with ${process.env['FB_USER']}`);
    this.driver.then(() => this.until.titleIs('Log in to Facebook | Facebook'))
      .then(() => this.authenticate())
      .catch((e) => this.errorHandler(e));
  }

  public authenticate() {
    this.driver.findElement(this.By.name('email')).sendKeys(process.env['FB_USER']);
    this.driver.findElement(this.By.name('pass')).sendKeys(process.env['FB_PASS']);
    this.driver.findElement(this.By.id('loginbutton')).click();
    this.driver.wait(this.until.titleIs('Facebook'), 1000)
      .then(() => this.takeScreen())
      .catch((e) => this.errorHandler(e));
  }

  public takeScreen() {
    this.driver.get(this.site)
      .catch((e) => this.errorHandler(e))
      .then(() => this.driver.takeScreenshot())
      .catch((e) => this.errorHandler(e))
      .then((screenShot) => this.writeScreenShot(screenShot));
  }

  public writeScreenShot(screenShot) {
    fs.writeFile('shot.png', screenShot, 'base64', (e) => {
      if (e) this.errorHandler(e);
      this.driver.quit();
    });
  }

  public errorHandler(e) {
    console.log(e);
    console.trace();
    this.driver.quit();
  }
}

/**
 * Call a website.
 * @constructor
 * @param {string} url - Url of the site.
 */
const options = process.env['URL'] || process.argv[2];
const scmd = new SeleniumCmd(options);
