import React, { useState, useEffect } from 'react';

function InsiderTrades() {
    const [filings, setFilings] = useState([]);
    const [sortConfig, setSortConfig] = useState({
        key: 'ticker', direction: 'asc'
    });

    useEffect(() => {
        fetch('/api/filings')
            .then(response => response.json())
            .then(data => {
                setFilings(data.data || []); // TODO Adjust based on your actual API response structure
            })
            .catch(error => console.error('Error fetching data: ', error));
    }, []);

    function requestSort(key) {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    }

    useEffect(() => {
        let sortedFilings = [...filings];
        if (sortConfig !== null) {
            sortedFilings.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        setFilings(sortedFilings);
    }, [sortConfig]);


    return (
        <div style={{ padding: '20px', marginTop: '-50px' }}> {/* TODO Adjust padding and margin as needed */}
            <style>
                {`
                table {
                    width: 100%;
                    border-collapse: collapse;
                }
                th, td {
                    border: 1px solid #ddd;
                    padding: 8px;
                    text-align: left;
                }
                th {
                    background-color: #f4f4f4;
                }
                tr:nth-child(even) {
                    background-color: #f9f9f9;
                }
                tr:hover {
                    background-color: #f1f1f1;
                }
                `}
            </style>
            <table>
                <thead>
                    <tr>
                        <th onClick={() => requestSort('ticker')}>Ticker</th>
                        <th onClick={() => requestSort('company')}>Company</th>
                        <th onClick={() => requestSort('report_date')}>Report Date</th>
                        <th onClick={() => requestSort('amount_of_shares')}>Amount of Shares</th>
                        <th onClick={() => requestSort('percentage_of_shares')}>Percentage of Shares</th>
                        <th>Owners</th>
                    </tr>
                </thead>
                <tbody>
                    {filings.map((filing, index) => (
                        <tr key={index}>
                            <td>{filing.ticker}</td>
                            <td>{filing.company}</td>
                            <td>{filing.report_date}</td>
                            <td>{filing.amount_of_shares}</td>
                            <td>{filing.percentage_of_shares || 'N/A'}</td>
                            <td>
                                {filing.owners.length > 0
                                    ? filing.owners.map(owner => `${owner.name} (${owner.job_title})`).join(', ')
                                    : 'No owners'}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default InsiderTrades;
