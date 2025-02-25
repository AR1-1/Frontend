import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './itemselection.css';
import SearchBox from '../../../../components/search-box/SearchBox';
import Pagination from '../../../../components/pagination/Pagination';
import { API } from '../../../../env';
import userVerification from '../../../../utils/userVerification';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import Loading from '../../../../components/loading/Loading';

const ItemSelection = ({ onSelectionChange }) => {
    const [query, setQuery] = useState('');
    const [page, setPage] = useState(1);
    const pageSize = 5;

    const [isLoading, setIsLoading] = useState(true);

    const [paginator, setPaginator] = useState({});

    const navigate = useNavigate();

    const [articles, setArticles] = useState([]);

    useEffect(() => {
        // Permission validation
        if (!userVerification().isAuthenticated) {
            localStorage.clear();
            navigate('/login');
            return;
        }

        // Query paginated data
        const data = new FormData();
        if (query.length > 0) {
            data.append('searchCriteria', query);
        }
        data.append('page', page);
        data.append('pageSize', pageSize);

        const url = new URL(`${API}/api/v1/article`);
        url.search = new URLSearchParams(data).toString();
        (async () => {
            await fetch(url)
                .then(response => response.json())
                .then(data => {
                    setPaginator(data);
                    setIsLoading(false);
                })
                .catch(error => console.log(error))
        })();
    }, [navigate, query, page]);

    const handleSearch = (query) => {
        setQuery(query);
    }

    const handlePage = (page) => {
        setPage(page);
    }

    const handleCheckboxChange = (article, isChecked) => {
        if (isChecked) {
            article.quantity = 1;
            setArticles([...articles, article]);
            onSelectionChange([...articles, article]);
        } else {
            setArticles(articles.filter(a => a.articleId !== article.articleId));
            onSelectionChange(articles.filter(a => a.articleId !== article.articleId));
        }
    }

    const handleQuantityChange = (article, newQuantity) => {
        if (newQuantity.length === 0) {
            newQuantity = 1;
        } else {
            newQuantity = parseInt(newQuantity, 10);
        }
        const updatedArticles = articles.map(
            a => a.articleId === article.articleId ? { ...a, quantity: newQuantity } : a
        );
        setArticles(updatedArticles);
        onSelectionChange(updatedArticles);
    }

    const calculateTotal = () => {
        return articles.reduce((total, article) => {
            return total + article.quantity * article.salePrice;
        }, 0);
    }

    return (
        <div className="item-selection-container">
            <div className="top-articles">
                <label>Select items</label>
                <div className="options">
                    <SearchBox onSearch={handleSearch} disabled={isLoading} />
                </div>
            </div>

            {!isLoading ? (
                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>NAME</th>
                                <th>BRAND</th>
                                <th>CATEGORIES</th>
                                <th>STOCK</th>
                                <th>PURCHASE PRICE</th>
                                <th>SALE PRICE</th>
                                <th>PROVIDORES</th>
                                <th>SELECT</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginator.articles && paginator.articles.length > 0 ? (
                                paginator.articles.map(article => (
                                    <tr key={article.articleId}>
                                        <td>{article.articleId}</td>
                                        <td>{article.name}</td>
                                        <td>{article.brand}</td>
                                        <td>{article.category.name}</td>
                                        <td>{article.stock}</td>
                                        <td>{article.purchasePrice.toLocaleString('es-NP', { style: 'currency', currency: 'NPR' })}</td>
                                        <td>{article.salePrice.toLocaleString('es-NP', { style: 'currency', currency: 'NPR' })}</td>
                                        <td>{article.provider.name}</td>
                                        <td>
                                            <label className="checkbox-container">
                                                <input
                                                    type="checkbox"
                                                    checked={!!articles.find(a => a.articleId === article.articleId)}
                                                    onChange={(event) => handleCheckboxChange(article, event.target.checked)}
                                                    disabled={article.stock === 0}
                                                />
                                                <span className="checkmark"></span>
                                            </label>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="9">No result</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    <Pagination paginator={paginator} onChangePage={handlePage} />
                </div>
            ) : (
                <Loading />
            )}

            {articles.length > 0 && (
                <div className="saleSummary">
                    <div className="top-sale">
                        <hr></hr>
                        <label>SALES SUMMARY</label>
                    </div>
                    <div className="table-container">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>NAME</th>
                                    <th>BRAND</th>
                                    <th>STOCK</th>
                                    <th>QUANTITY</th>
                                    <th>PRICE</th>
                                    <th>SUBTOTAL</th>
                                    <th>REMOVE</th>
                                </tr>
                            </thead>
                            <tbody>
                                {articles && articles.map(article => (
                                    <tr key={article.articleId}>
                                        <td>{article.articleId}</td>
                                        <td>{article.name}</td>
                                        <td>{article.brand}</td>
                                        <td>{article.stock}</td>
                                        <td>
                                            <input
                                                className="input"
                                                type="number"
                                                min="1"
                                                max={article.stock}
                                                value={article.quantity}
                                                onChange={(event) => handleQuantityChange(article, event.target.value)}
                                                required
                                            />
                                        </td>
                                        <td>{article.salePrice.toLocaleString('es-NP', { style: 'currency', currency: 'NPR' })}</td>
                                        <td>{(article.salePrice * article.quantity).toLocaleString('es-NP', { style: 'currency', currency: 'NPR' })}</td>
                                        <td>
                                            <FontAwesomeIcon icon={faTrashCan} className="trash-icon" onClick={() => handleCheckboxChange(article, false)} />
                                        </td>
                                    </tr>
                                ))}
                                <tr>
                                    <td colSpan="5"></td>
                                    <td className="total">TOTAL</td>
                                    <td className="total">{calculateTotal().toLocaleString('es-NP', { style: 'currency', currency: 'NPR' })}</td>
                                    <td></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ItemSelection;
