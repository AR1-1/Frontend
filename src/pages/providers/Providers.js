import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faPen, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import './providers.css';
import '../../styles/addbox.css';
import SearchBox from '../../components/search-box/SearchBox';
import Pagination from '../../components/pagination/Pagination';
import { Link, useNavigate } from 'react-router-dom';
import userVerification from '../../utils/userVerification';
import { API } from '../../env';
import Loading from '../../components/loading/Loading';

const Providers = () => {
    localStorage.setItem('selectedView', 'providers');
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
        const API = 'http://localhost:8080';
        const url = new URL(`${API}/provider`);
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

    return (
        <div className="providers-container">

            <div className="text">Providers</div>

            <div className="options">
                <SearchBox onSearch={handleSearch} disabled={isLoading} />
                <Link to="/new-provider" className="add-box">
                    <FontAwesomeIcon icon={faPlus} className="icon" />
                    <span className="text">New providers</span>
                </Link>
            </div>

            {!isLoading ? (
                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr style={{ fontWeight: 'bold', color: 'black' }}>
                                <th>ID</th>
                                <th>Name</th>
                                <th>PhoneNo</th>
                                <th>EMAIL</th>
                                <th>EDIT</th>
                                {/* <th>DELETE</th> */}
                            </tr>
                        </thead>
                        <tbody>
                            {paginator.providers && paginator.providers.length > 0 ? (
                                paginator.providers.map(provider => (
                                    <tr key={provider.providerId}>
                                        <td>{provider.providerId}</td>
                                        <td>{provider.name}</td>
                                        <td>{provider.phoneNumber}</td>
                                        <td>{provider.email}</td>
                                        <td>
                                            <Link to={`/edit-provider/${provider.providerId}`}>
                                                <FontAwesomeIcon icon={faPen} className="pen-icon" />
                                            </Link>
                                        </td>
                                        {/* <td>
                                            <Link to={`/edit-provider/${provider.providerId}`}>
                                                <FontAwesomeIcon icon={faTrashCan} className="trash-icon" />
                                            </Link>
                                        </td> */}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5">No results</td>
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

export default Providers;
