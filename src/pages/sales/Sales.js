import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faCartPlus } from '@fortawesome/free-solid-svg-icons';
import './sales.css';
import '../../styles/addbox.css';
import SearchBox from '../../components/search-box/SearchBox';
import Pagination from '../../components/pagination/Pagination';
import { Link, useNavigate } from 'react-router-dom';
import userVerification from '../../utils/userVerification';
import { API } from '../../env';
import formatDate from '../../utils/formatDate';
import Loading from '../../components/loading/Loading';

const Sales = () => {
    localStorage.setItem('selectedView', 'sales');
    const [query, setQuery] = useState('');
    const [page, setPage] = useState(1);
    const pageSize = 5;

    const [isLoading, setIsLoading] = useState(true);

    const [paginator, setPaginator] = useState({});

    const navigate = useNavigate();

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

        const url = new URL(`${API}/sale`);
        url.search = new URLSearchParams(data).toString();
        (async () => {
            console.log("here ------------");
            await fetch(url)
                .then(response => response.json())
                .then(data => {
                    console.log("chk point 2 ----");
                    console.log(data);
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

    return (
        <div className="sales-container">

            <div className="text">Sales</div>

            <div className="options">
                <SearchBox onSearch={handleSearch} disabled={isLoading} />
                <Link to="/new-sale" className="add-box">
                    <FontAwesomeIcon icon={faPlus} className="icon" />
                    <span className="text">New sale</span>
                </Link>
            </div>

            {!isLoading ? (
                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr style={{ fontWeight: 'bold', color: 'black' }}>
                                <th>ID</th>
                                <th>DATE</th>
                                <th>TOTAL</th>
                                <th>CUSTOMER</th>
                                <th>USER</th>
                                <th>DETAILES</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginator.sales && paginator.sales.length > 0 ? (
                                paginator.sales.map(sale => (
                                    <tr key={sale.saleId}>
                                        <td>{sale.saleId}</td>
                                        <td>{formatDate(sale.createdAt)}</td>
                                        <td>{sale.totalValue.toLocaleString('es-NP', { style: 'currency', currency: 'NPR' })}</td>
                                        <td>{sale.customer.name}</td>
                                        <td>{sale.user.name}</td>
                                        <td>
                                            <Link to={`/detail-sale/${sale.saleId}`}>
                                                <FontAwesomeIcon icon={faCartPlus} className="details-icon" />
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6">No result</td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    <Pagination paginator={paginator} onChangePage={handlePage} />
                </div>
            ) : (
                <Loading />
            )}

        </div>
    );
}

export default Sales;
