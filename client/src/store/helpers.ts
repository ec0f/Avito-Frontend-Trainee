import {
  CATEGORY_FIELD_CONFIG,
  DRAFT_STORAGE_PREFIX,
  FIELD_LABELS,
} from '../utils/consts';
import {
  AnnouncementCategory,
  AnnouncementItem,
  EditAnnouncementForm,
  ParamKey,
} from './types';

export const createEmptyParams = (
  category: AnnouncementCategory
): Partial<Record<ParamKey, string>> => {
  const params: Partial<Record<ParamKey, string>> = {};

  CATEGORY_FIELD_CONFIG[category].forEach((field) => {
    params[field.name as ParamKey] = '';
  });

  return params;
};

export const mapAnnouncementParamsToForm = (
  category: AnnouncementCategory,
  params: Record<string, unknown>
): Partial<Record<ParamKey, string>> => {
  const nextParams = createEmptyParams(category);

  CATEGORY_FIELD_CONFIG[category].forEach((field) => {
    const rawValue = params?.[field.name];

    if (rawValue === undefined || rawValue === null) {
      return;
    }

    nextParams[field.name as ParamKey] = String(rawValue);
  });

  return nextParams;
};

export const buildEditFormFromAnnouncement = (
  item: AnnouncementItem
): EditAnnouncementForm => {
  return {
    category: item.category,
    title: item.title ?? '',
    price: item.price === null ? '' : String(item.price),
    description: item.description ?? '',
    params: mapAnnouncementParamsToForm(item.category, item.params ?? {}),
  };
};

export const buildUpdatePayload = (form: EditAnnouncementForm) => {
  const payload: {
    category: AnnouncementCategory;
    title: string;
    description: string;
    price: number;
    params: Record<string, string | number>;
  } = {
    category: form.category,
    title: form.title.trim(),
    description: form.description.trim(),
    price: Number(form.price),
    params: {},
  };

  CATEGORY_FIELD_CONFIG[form.category].forEach((field) => {
    const rawValue = form.params[field.name as ParamKey];

    if (rawValue === undefined || rawValue === null || String(rawValue).trim() === '') {
      return;
    }

    if (field.kind === 'number') {
      payload.params[field.name] = Number(rawValue);
    } else {
      payload.params[field.name] = String(rawValue).trim();
    }
  });

  return payload;
};

export const getMissingFieldKeysFromForm = (form: EditAnnouncementForm): string[] => {
  const missingKeys: string[] = [];

  if (!form.title.trim()) {
    missingKeys.push('title');
  }

  if (!form.description.trim()) {
    missingKeys.push('description');
  }

  const priceValue = Number(form.price);

  if (form.price.trim() === '' || Number.isNaN(priceValue) || priceValue < 0) {
    missingKeys.push('price');
  }

  CATEGORY_FIELD_CONFIG[form.category].forEach((field) => {
    if (!field.required) {
      return;
    }

    const value = form.params[field.name as ParamKey];

    if (value === undefined || value === null || String(value).trim() === '') {
      missingKeys.push(field.name);
    }
  });

  return missingKeys;
};

export const getMissingFieldLabelsFromForm = (form: EditAnnouncementForm): string[] => {
  return getMissingFieldKeysFromForm(form).map((key) => FIELD_LABELS[key] ?? key);
};

export const getMissingFieldsForAnnouncement = (item: AnnouncementItem): string[] => {
  const formLike = buildEditFormFromAnnouncement(item);

  return getMissingFieldLabelsFromForm(formLike);
};

export const getDraftKey = (id: number) => `${DRAFT_STORAGE_PREFIX}:${id}`;

export const readDraft = (id: number): EditAnnouncementForm | null => {
  try {
    const rawValue = localStorage.getItem(getDraftKey(id));

    if (!rawValue) {
      return null;
    }

    return JSON.parse(rawValue) as EditAnnouncementForm;
  } catch {
    return null;
  }
};

export const writeDraft = (id: number, form: EditAnnouncementForm) => {
  localStorage.setItem(getDraftKey(id), JSON.stringify(form));
};

export const removeDraft = (id: number) => {
  localStorage.removeItem(getDraftKey(id));
};
