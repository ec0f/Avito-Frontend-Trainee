import { makeAutoObservable, runInAction } from 'mobx';
import { API_URL } from '../utils/consts';
import { AnnouncementItem } from './types';

class AnnouncementViewStore {
  selectedAnnouncement: AnnouncementItem | null = null;
  isLoading = false;
  error = '';

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  async fetchAnnouncement(id: number) {
    this.isLoading = true;
    this.error = '';
    this.selectedAnnouncement = null;

    try {
      const response = await fetch(`${API_URL}/items/${id}`);

      if (!response.ok) {
        throw new Error('Не удалось загрузить объявление');
      }

      const data = await response.json();

      runInAction(() => {
        this.selectedAnnouncement = data;
      });
    } catch (error) {
      runInAction(() => {
        this.error =
          error instanceof Error ? error.message : 'Не удалось загрузить объявление';
      });
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  clear() {
    this.selectedAnnouncement = null;
    this.isLoading = false;
    this.error = '';
  }
}

export default AnnouncementViewStore;
