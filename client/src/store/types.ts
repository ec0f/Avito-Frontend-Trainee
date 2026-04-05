export type AnnouncementCategory = 'auto' | 'real_estate' | 'electronics';
export type SortValue = 'createdAt_desc' | 'createdAt_asc' | 'title_asc' | 'title_desc';
export type LayoutValue = 'grid' | 'list';

export type ParamKey =
  | 'type'
  | 'brand'
  | 'model'
  | 'color'
  | 'condition'
  | 'yearOfManufacture'
  | 'transmission'
  | 'mileage'
  | 'enginePower'
  | 'address'
  | 'area'
  | 'floor';

export interface AnnouncementListItem {
  id: number;
  category: AnnouncementCategory;
  title: string;
  price: number;
  needsRevision: boolean;
}

export interface AnnouncementItem {
  id: number;
  category: AnnouncementCategory;
  title: string;
  description?: string;
  price: number | null;
  createdAt: string;
  updatedAt: string;
  needsRevision: boolean;
  params: Record<string, unknown>;
}

export interface EditAnnouncementForm {
  category: AnnouncementCategory;
  title: string;
  price: string;
  description: string;
  params: Partial<Record<ParamKey, string>>;
}
