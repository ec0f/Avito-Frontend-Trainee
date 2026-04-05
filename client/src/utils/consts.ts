export const ANNOUNCEMENTS_ROUTE = '/ads';
export const ANNOUNCEMENT_ITEM_ROUTE = '/ads/:id';
export const ANNOUNCEMENT_EDIT_ROUTE = '/ads/:id/edit';

export const getAnnouncementItemRoute = (id: number | string) =>
  `${ANNOUNCEMENTS_ROUTE}/${id}`;
export const getAnnouncementEditRoute = (id: number | string) =>
  `${ANNOUNCEMENTS_ROUTE}/${id}/edit`;

export const API_URL = process.env.REACT_APP_API_URL ?? 'http://localhost:8080';
export const AI_ENDPOINT = process.env.REACT_APP_AI_ENDPOINT ?? '';
export const PAGE_SIZE = 10;
export const DRAFT_STORAGE_PREFIX = 'avito-edit-draft';

export const CATEGORY_OPTIONS = [
  { value: 'electronics', label: 'Электроника' },
  { value: 'auto', label: 'Транспорт' },
  { value: 'real_estate', label: 'Недвижимость' },
] as const;

export const CATEGORY_LABELS: Record<string, string> = {
  electronics: 'Электроника',
  auto: 'Транспорт',
  real_estate: 'Недвижимость',
};

export const SORT_OPTIONS = [
  { value: 'createdAt_desc', label: 'Сначала новые' },
  { value: 'createdAt_asc', label: 'Сначала старые' },
  { value: 'title_asc', label: 'Название А-Я' },
  { value: 'title_desc', label: 'Название Я-А' },
] as const;

export const FIELD_LABELS: Record<string, string> = {
  category: 'Категория',
  title: 'Название',
  price: 'Цена',
  description: 'Описание',
  type: 'Тип',
  brand: 'Бренд',
  model: 'Модель',
  color: 'Цвет',
  condition: 'Состояние',
  yearOfManufacture: 'Год выпуска',
  transmission: 'Коробка передач',
  mileage: 'Пробег',
  enginePower: 'Мощность двигателя',
  address: 'Адрес',
  area: 'Площадь',
  floor: 'Этаж',
};

export const CATEGORY_FIELD_CONFIG = {
  electronics: [
    { name: 'type', label: 'Тип', kind: 'select', required: true },
    { name: 'brand', label: 'Бренд', kind: 'text', required: true },
    { name: 'model', label: 'Модель', kind: 'text', required: true },
    { name: 'color', label: 'Цвет', kind: 'text', required: true },
    { name: 'condition', label: 'Состояние', kind: 'select', required: true },
  ],
  auto: [
    { name: 'brand', label: 'Бренд', kind: 'text', required: true },
    { name: 'model', label: 'Модель', kind: 'text', required: true },
    { name: 'yearOfManufacture', label: 'Год выпуска', kind: 'number', required: true },
    { name: 'transmission', label: 'Коробка передач', kind: 'select', required: true },
    { name: 'mileage', label: 'Пробег', kind: 'number', required: true },
    { name: 'enginePower', label: 'Мощность двигателя', kind: 'number', required: true },
  ],
  real_estate: [
    { name: 'type', label: 'Тип', kind: 'select', required: true },
    { name: 'address', label: 'Адрес', kind: 'text', required: true },
    { name: 'area', label: 'Площадь', kind: 'number', required: true },
    { name: 'floor', label: 'Этаж', kind: 'number', required: true },
  ],
} as const;

export const FIELD_OPTIONS: Record<string, Array<{ value: string; label: string }>> = {
  type_electronics: [
    { value: 'phone', label: 'Телефон' },
    { value: 'laptop', label: 'Ноутбук' },
    { value: 'misc', label: 'Другое' },
  ],
  type_real_estate: [
    { value: 'flat', label: 'Квартира' },
    { value: 'house', label: 'Дом' },
    { value: 'room', label: 'Комната' },
  ],
  transmission: [
    { value: 'automatic', label: 'Автоматическая' },
    { value: 'manual', label: 'Механическая' },
  ],
  condition: [
    { value: 'new', label: 'Новый' },
    { value: 'used', label: 'Б/У' },
  ],
};
