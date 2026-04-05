import { makeAutoObservable, reaction, runInAction } from 'mobx';
import { API_URL, PAGE_SIZE } from '../utils/consts';
import {
  AnnouncementCategory,
  AnnouncementListItem,
  LayoutValue,
  SortValue,
} from './types';

class AnnouncementsStore {
  search = '';
  selectedCategories: AnnouncementCategory[] = [];
  needsRevisionOnly = false;
  sort: SortValue = 'createdAt_desc';
  layout: LayoutValue = 'grid';
  page = 1;

  items: AnnouncementListItem[] = [];
  total = 0;
  isLoading = false;
  error = '';

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });

    reaction(
      () => [
        this.search,
        this.selectedCategories.slice().sort().join(','),
        this.needsRevisionOnly,
        this.sort,
        this.page,
      ],
      () => {
        void this.fetchAnnouncements();
      },
      { fireImmediately: true }
    );
  }

  get totalPages() {
    return Math.max(1, Math.ceil(this.total / PAGE_SIZE));
  }

  setSearch(value: string) {
    this.search = value;
    this.page = 1;
  }

  toggleCategory(value: AnnouncementCategory) {
    if (this.selectedCategories.includes(value)) {
      this.selectedCategories = this.selectedCategories.filter((item) => item !== value);
    } else {
      this.selectedCategories = [...this.selectedCategories, value];
    }

    this.page = 1;
  }

  setNeedsRevisionOnly(value: boolean) {
    this.needsRevisionOnly = value;
    this.page = 1;
  }

  setSort(value: SortValue) {
    this.sort = value;
    this.page = 1;
  }

  setLayout(value: LayoutValue) {
    this.layout = value;
  }

  setPage(value: number) {
    this.page = value;
  }

  resetFilters() {
    this.search = '';
    this.selectedCategories = [];
    this.needsRevisionOnly = false;
    this.sort = 'createdAt_desc';
    this.page = 1;
  }

  async fetchAnnouncements() {
    this.isLoading = true;
    this.error = '';

    try {
      const params = new URLSearchParams();

      if (this.search.trim()) {
        params.set('q', this.search.trim());
      }

      params.set('limit', String(PAGE_SIZE));
      params.set('skip', String((this.page - 1) * PAGE_SIZE));

      if (this.selectedCategories.length) {
        params.set('categories', this.selectedCategories.join(','));
      }

      if (this.needsRevisionOnly) {
        params.set('needsRevision', 'true');
      }

      const [sortColumn, sortDirection] = this.sort.split('_');
      params.set('sortColumn', sortColumn);
      params.set('sortDirection', sortDirection);

      const response = await fetch(`${API_URL}/items?${params.toString()}`);

      if (!response.ok) {
        throw new Error('Не удалось загрузить список объявлений');
      }

      const data = await response.json();

      runInAction(() => {
        this.items = data.items;
        this.total = data.total;
      });
    } catch (error) {
      runInAction(() => {
        this.error =
          error instanceof Error
            ? error.message
            : 'Не удалось загрузить список объявлений';
      });
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }
}

export default AnnouncementsStore;
