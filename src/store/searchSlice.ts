import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SearchState {
  results: any[];
  query: string;
}

const initialState: SearchState = {
  results: [],
  query: '',
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearchResults: (state, action: PayloadAction<any[]>) => {
      state.results = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.query = action.payload;
    },
    clearSearch: (state) => {
      state.results = [];
      state.query = '';
    },
  },
});

export const { setSearchResults, setSearchQuery, clearSearch } = searchSlice.actions;
export default searchSlice.reducer; 