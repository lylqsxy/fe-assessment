export enum PricingOption {
  PAID = 0,
  FREE = 1,
  VIEW_ONLY = 2,
}

export interface ContentItem {
  id: string;
  title: string;
  creator: string;
  price: number | null;
  pricingOption: PricingOption;
  imagePath: string;
}

export async function fetchContents(): Promise<ContentItem[]> {
  const response = await fetch('https://closet-recruiting-api.azurewebsites.net/api/data');
  if (!response.ok) {
    throw new Error('Failed to fetch contents');
  }
  return response.json();
} 