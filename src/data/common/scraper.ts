import BeautifulDom from "beautiful-dom";
import fetch from "node-fetch";

export class BaseScraper {
  protected static async fetchAsBeautifulDom(url: string): Promise<BeautifulDom> {
    const response = await fetch(url);
    const html = await response.text();
    return new BeautifulDom(html);
  }
}