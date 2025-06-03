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

export async function fetchContents(page: number = 1, pageSize: number = 12): Promise<ContentItem[]> {
  const response = await fetch('https://closet-recruiting-api.azurewebsites.net/api/data');
  if (!response.ok) {
    throw new Error('Failed to fetch contents');
  }
  const allContents = await response.json();
  
  // Simulate pagination on the client side since the API doesn't support it
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  return allContents.slice(startIndex, endIndex);
} 