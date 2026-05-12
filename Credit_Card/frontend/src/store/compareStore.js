import { create } from 'zustand';

const useCompareStore = create((set, get) => ({
  selectedCards: [],

  addCard: (card) => {
    const { selectedCards } = get();
    if (selectedCards.find((c) => c._id === card._id)) return;
    if (selectedCards.length >= 4) {
      return 'max';
    }
    set({ selectedCards: [...selectedCards, card] });
    return 'added';
  },

  removeCard: (cardId) => {
    set((state) => ({ selectedCards: state.selectedCards.filter((c) => c._id !== cardId) }));
  },

  clearAll: () => set({ selectedCards: [] }),

  isSelected: (cardId) => get().selectedCards.some((c) => c._id === cardId),
}));

export default useCompareStore;
