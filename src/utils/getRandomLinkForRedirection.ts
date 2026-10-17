import { env } from '@/configs/env';

export function getRandomLinkForRedirection() {
  const links = [
    env.LINKEDIN_URL,
    env.INSTAGRAM_URL,
    env.PORTFOLIO_URL,
  ];

  return links[Math.floor(Math.random() * links.length)];
}
