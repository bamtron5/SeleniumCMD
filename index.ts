import * as webdriver from 'selenium-webdriver';
import * as Promise from 'bluebird';
import * as fs from 'fs';

export class SeleniumCmd {
  public By = webdriver.By;
  public until = webdriver.until;
  public driver = new webdriver.Builder()
                  .forBrowser('chrome')
                  .build();
  public site:string = 'https://google.com';
  constructor () {
  }

  public takeScreen() {
    return new Promise((resolve, reject) => {
      this.driver.get(this.site)
        .catch((e) => reject(e))
        .then(() => this.driver.takeScreenshot())
        .catch((e) => reject(e))
        .then((screenShot) => fs.writeFile('screenShot.png', screenShot, 'base64', (err) => err ? reject(err) : resolve()));
    });
  }

  public quit() {
    this.driver.quit();
  }
}

const scmd = new SeleniumCmd();
scmd.takeScreen()
  .then(() => {
    scmd.quit();
  })
  .catch((e) => {
    console.log(e);
    scmd.quit();
  });


// var webdriver = require('selenium-webdriver'),
//     By = webdriver.By,
//     until = webdriver.until;
//
// var driver = new webdriver.Builder()
//     .forBrowser('chrome')
//     .build();
//
// driver.get('http://www.google.com/ncr');
// driver.findElement(By.name('q')).sendKeys('webdriver');
// driver.findElement(By.name('btnG')).click();
// driver.wait(until.titleIs('webdriver - Google Search'), 1000);
// driver.quit();