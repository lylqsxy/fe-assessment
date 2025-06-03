import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { setSearchQuery, setSearchResults } from '../store/searchSlice';
import type { RootState } from '../store/store';
import styles from './ContentGallery.module.css';
import { fetchContents, ContentItem, PricingOption } from '../services/contentService';

const ITEMS_PER_PAGE = 12;

const ContentGallery: React.FC = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = useSelector((state: RootState) => state.search.query);
  const [filters, setFilters] = useState({ paid: false, free: false, view: false });
  const [data, setData] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [sortOption, setSortOption] = useState('name');

  // Initialize search query and filters from URL on component mount
  useEffect(() => {
    const queryFromUrl = searchParams.get('q') || '';
    const paidFromUrl = searchParams.get('paid') === 'true';
    const freeFromUrl = searchParams.get('free') === 'true';
    const viewFromUrl = searchParams.get('view') === 'true';
    
    dispatch(setSearchQuery(queryFromUrl));
    setFilters({
      paid: paidFromUrl,
      free: freeFromUrl,
      view: viewFromUrl
    });
  }, [dispatch, searchParams]);

  const loadInitialData = useCallback(async () => {
    setLoading(true);
    try {
      const contents = await fetchContents(1, ITEMS_PER_PAGE);
      setData(contents);
      dispatch(setSearchResults(contents));
      setHasMore(contents.length === ITEMS_PER_PAGE);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  const loadMoreData = useCallback(async () => {
    if (loadingMore || !hasMore) return;
    
    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const newContents = await fetchContents(nextPage, ITEMS_PER_PAGE);
      
      if (newContents.length > 0) {
        setData(prevData => [...prevData, ...newContents]);
        setPage(nextPage);
        setHasMore(newContents.length === ITEMS_PER_PAGE);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoadingMore(false);
    }
  }, [page, loadingMore, hasMore]);

  const handleScroll = useCallback(() => {
    if (window.innerHeight + document.documentElement.scrollTop
      >= document.documentElement.offsetHeight - 1000) {
      loadMoreData();
    }
  }, [loadMoreData]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFilters = { ...filters, [e.target.name]: e.target.checked };
    setFilters(newFilters);
    
    // Update URL with filter states
    const params: Record<string, string> = {};
    if (searchQuery) params.q = searchQuery;
    if (newFilters.paid) params.paid = 'true';
    if (newFilters.free) params.free = 'true';
    if (newFilters.view) params.view = 'true';
    setSearchParams(params);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    dispatch(setSearchQuery(query));
    
    // Update URL with search query and current filters
    const params: Record<string, string> = {};
    if (query) params.q = query;
    if (filters.paid) params.paid = 'true';
    if (filters.free) params.free = 'true';
    if (filters.view) params.view = 'true';
    setSearchParams(params);
  };

  const handleResetFilters = () => {
    setFilters({ paid: false, free: false, view: false });
    // Keep only search query in URL when resetting filters
    const params: Record<string, string> = {};
    if (searchQuery) params.q = searchQuery;
    setSearchParams(params);
  };

  const filteredData = data.filter(item => {
    if (filters.paid && item.pricingOption === PricingOption.PAID) return true;
    if (filters.free && item.pricingOption === PricingOption.FREE) return true;
    if (filters.view && item.pricingOption === PricingOption.VIEW_ONLY) return true;
    if (!filters.paid && !filters.free && !filters.view) return true;
    return false;
  }).filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.creator.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedData = React.useMemo(() => {
    let sorted = [...filteredData];
    if (sortOption === 'high') {
      sorted.sort((a, b) => (b.price || 0) - (a.price || 0));
    } else if (sortOption === 'low') {
      sorted.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else {
      sorted.sort((a, b) => a.title.localeCompare(b.title));
    }
    return sorted;
  }, [filteredData, sortOption]);

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(e.target.value);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.logo}>CONNECT</div>
      </header>
      <div className={styles.searchBarSection}>
        <input
          className={styles.searchBar}
          type="text"
          placeholder="Find the items you're looking for"
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <div className={styles.searchBtn}><svg viewBox="0 0 24 24"><path fill='currentcolor' fillRule="evenodd" color="inherit" clipRule="evenodd" d="M4.2 10.2C4.2 13.5137 6.88629 16.2 10.2 16.2C13.5137 16.2 16.2 13.5137 16.2 10.2C16.2 6.88629 13.5137 4.2 10.2 4.2C6.88629 4.2 4.2 6.88629 4.2 10.2ZM10.2 2C5.67127 2 2 5.67127 2 10.2C2 14.7287 5.67127 18.4 10.2 18.4C14.7287 18.4 18.4 14.7287 18.4 10.2C18.4 5.67127 14.7287 2 10.2 2Z"></path><path fill='currentcolor' color="inherit" d="M16.1213 14L20.8615 18.7401C21.4472 19.3259 21.4472 20.2757 20.8615 20.8614C20.2757 21.4472 19.3259 21.4472 18.7401 20.8614L14 16.1213L16.1213 14Z"></path></svg></div>
      </div>
      <div className={styles.filterSection}>
        <span>Pricing Option</span>
        <label><input type="checkbox" name="paid" checked={filters.paid} onChange={handleFilterChange} /> Paid</label>
        <label><input type="checkbox" name="free" checked={filters.free} onChange={handleFilterChange} /> Free</label>
        <label><input type="checkbox" name="view" checked={filters.view} onChange={handleFilterChange} /> View Only</label>
        <button className={styles.resetBtn} onClick={handleResetFilters}>RESET</button>
      </div>
      <div className={styles.contentsListSection}>
        {/* Sorting Bar */}
        <div className={styles.sortBarContainer}>
          <span className={styles.sortLabel}>Sort by</span>
          <select
            className={styles.sortDropdown}
            value={sortOption}
            onChange={handleSortChange}
          >
            <option value="name">Item Name</option>
            <option value="high">Higher Price</option>
            <option value="low">Lower Price</option>
          </select>
        </div>
        {loading && <div>Loading...</div>}
        {error && <div style={{ color: 'red' }}>{error}</div>}
        <div className={styles.grid}>
          {!loading && !error && sortedData.map((item, idx) => (
            <div className={styles.card} key={`${item.id}-${idx}`}>
              <img src={item.imagePath} alt={item.title} className={styles.cardImg} />
              <div className={styles.cardInfo}>
                <div className={styles.cardTitle}>{item.title}</div>
                <div className={styles.cardAuthor}>{item.creator}</div>
                <div className={styles.cardPrice}>
                  {item.pricingOption === PricingOption.PAID && `$${item.price?.toFixed(2)}`}
                  {item.pricingOption === PricingOption.FREE && <span className={styles.free}>FREE</span>}
                  {item.pricingOption === PricingOption.VIEW_ONLY && <span className={styles.viewOnly}>View Only</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
        {loadingMore && <div className={styles.loadingMore}>Loading more items...</div>}
        {!hasMore && !loading && !loadingMore && filteredData.length > 0 && (
          <div className={styles.noMoreItems}>No more items to load</div>
        )}
      </div>
    </div>
  );
};

export default ContentGallery; 