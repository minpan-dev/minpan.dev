import sharp from 'sharp';
import { type CollectionEntry } from 'astro:content';
import postOgImage from './og-templates/post';
import siteOgImage from './og-templates/site';

async function svgToPngBuffer(svg: string) {
  return await sharp(Buffer.from(svg)).png().toBuffer();
}

export async function generateOgImageForPost(post: CollectionEntry<'blog'>) {
  const svg = await postOgImage(post);
  return await svgToPngBuffer(svg);
}

export async function generateOgImageForSite() {
  const svg = await siteOgImage();
  return await svgToPngBuffer(svg);
}
