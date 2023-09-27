import { atom, createStore } from 'jotai';

const store = createStore();

const authAtom = atom({
  isLogged: true,
});

export { store, authAtom };
