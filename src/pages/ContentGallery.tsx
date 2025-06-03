import React, { useState } from 'react';
import styles from './ContentGallery.module.css';

const mockData = [
  { title: 'Porto', author: 'Marco Alves', price: null, type: 'view', img: 'https://via.placeholder.com/200x250?text=Image+1' },
  { title: 'Memphis', author: 'Marco Alves', price: 32, type: 'paid', img: 'https://via.placeholder.com/200x250?text=Image+2' },
  { title: 'Addis Ababa', author: 'Marco Alves', price: 16, type: 'paid', img: 'https://via.placeholder.com/200x250?text=Image+3' },
  { title: 'Cleveland', author: 'Marco Alves', price: 0, type: 'free', img: 'https://via.placeholder.com/200x250?text=Image+4' },
  { title: 'Porto', author: 'Marco Alves', price: null, type: 'view', img: 'https://via.placeholder.com/200x250?text=Image+5' },
];

const ContentGallery: React.FC = () => {
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ paid: false, free: false, view: false });

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.checked });
  };

  const filteredData = mockData.filter(item => {
    if (filters.paid && item.type === 'paid') return true;
    if (filters.free && item.type === 'free') return true;
    if (filters.view && item.type === 'view') return true;
    if (!filters.paid && !filters.free && !filters.view) return true;
    return false;
  }).filter(item => item.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.logo}>CONEXT</div>
      </header>
      <div className={styles.searchBarSection}>
        <input
          className={styles.searchBar}
          type="text"
          placeholder="Find the items you're looking for"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className={styles.searchBtn}><svg viewBox="0 0 24 24"><path fill='currentcolor' fillRule="evenodd" color="inherit" clipRule="evenodd" d="M4.2 10.2C4.2 13.5137 6.88629 16.2 10.2 16.2C13.5137 16.2 16.2 13.5137 16.2 10.2C16.2 6.88629 13.5137 4.2 10.2 4.2C6.88629 4.2 4.2 6.88629 4.2 10.2ZM10.2 2C5.67127 2 2 5.67127 2 10.2C2 14.7287 5.67127 18.4 10.2 18.4C14.7287 18.4 18.4 14.7287 18.4 10.2C18.4 5.67127 14.7287 2 10.2 2Z"></path><path fill='currentcolor' color="inherit" d="M16.1213 14L20.8615 18.7401C21.4472 19.3259 21.4472 20.2757 20.8615 20.8614C20.2757 21.4472 19.3259 21.4472 18.7401 20.8614L14 16.1213L16.1213 14Z"></path></svg></div>
      </div>
      <div className={styles.filterSection}>
        <span>Pricing Option</span>
        <label><input type="checkbox" name="paid" checked={filters.paid} onChange={handleFilterChange} /> Paid</label>
        <label><input type="checkbox" name="free" checked={filters.free} onChange={handleFilterChange} /> Free</label>
        <label><input type="checkbox" name="view" checked={filters.view} onChange={handleFilterChange} /> View Only</label>
        <button className={styles.resetBtn} onClick={() => setFilters({ paid: false, free: false, view: false })}>RESET</button>
      </div>
      <div className={styles.contentsListSection}>
        <div className={styles.grid}>
          {filteredData.map((item, idx) => (
            <div className={styles.card} key={idx}>
              <img src={item.img} alt={item.title} className={styles.cardImg} />
              <div className={styles.cardInfo}>
                <div className={styles.cardTitle}>{item.title}</div>
                <div className={styles.cardAuthor}>{item.author}</div>
                <div className={styles.cardPrice}>
                  {item.type === 'paid' && `$${item.price?.toFixed(2)}`}
                  {item.type === 'free' && <span className={styles.free}>FREE</span>}
                  {item.type === 'view' && <span className={styles.viewOnly}>View Only</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContentGallery; 