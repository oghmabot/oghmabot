import BeautifulDom from 'beautiful-dom';
import cheerio from 'cheerio';
import fetch from 'node-fetch';

export class BaseScraper {
  protected static async fetchAsBeautifulDom(url: string): Promise<BeautifulDom> {
    const response = await fetch(url);
    const html = await response.text();
    return new BeautifulDom(html);
  }

  protected static async fetchAsCheerioRoot(url: string): Promise<cheerio.Root> {
    const response = await fetch(url);
    const html = await response.text();
    return cheerio.load(html);
  }
}
