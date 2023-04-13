export enum BannerType {
  VERTICAL = 'vertical',
  HORIZONTAL = 'horizontal'
}

export interface Banner {
  id: string,
  ext: string,
  link?: string
}