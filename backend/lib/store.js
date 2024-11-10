// store.js
import create from 'zustand';

export const useStore = create((set) => ({
  project: {
    title: 'Untitled Project',
    directory: [],
    images: [],
    settings: {
      background: {},
      characters: [],
      dialogue: []
    }
  },
  setProject: (newProject) => set((state) => ({ project: { ...state.project, ...newProject } })),
  saveProject: () => {/* Code to save project data */},
  loadProject: () => {/* Code to load project data */}
}));
