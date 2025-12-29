import React from 'react';
import './DataTable.css';

export default function DataTable({ columns, data, actions, onSort, sortColumn, sortDirection, isLoading, emptyImage, emptyTitle, emptySubtitle }) {
    const handleSort = (column) => {
        if (column.sortable && onSort) {
            onSort(column.key);
        }
    };

    if (isLoading) {
        return (
            <div className="table-loading">
                <img 
                    src="/images/admin/loading-animation.svg" 
                    alt="Loading" 
                    style={{ width: '200px', height: '150px', marginBottom: '10px' }}
                />
                <p className="loading-text" style={{ 
                    fontSize: '16px', 
                    color: '#6b7280',
                    fontWeight: '500'
                }}>Đang tải dữ liệu...</p>
            </div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <div className="table-empty">
                <img 
                    src={emptyImage || "/images/admin/empty-users.svg"} 
                    alt="No data" 
                    style={{ width: '250px', height: '200px', marginBottom: '10px' }}
                />
                <p className="empty-text" style={{ 
                    fontSize: '18px', 
                    fontWeight: '600', 
                    color: '#374151',
                    marginBottom: '8px'
                }}>{emptyTitle || 'Không có dữ liệu'}</p>
                <p className="empty-subtext" style={{ 
                    fontSize: '14px', 
                    color: '#9ca3af'
                }}>{emptySubtitle || 'Chưa có dữ liệu để hiển thị'}</p>
            </div>
        );
    }

    return (
        <div className="data-table-container">
            <table className="data-table">
                <thead>
                    <tr>
                        {columns.map((column) => (
                            <th
                                key={column.key}
                                className={column.sortable ? 'sortable' : ''}
                                onClick={() => handleSort(column)}
                            >
                                <div className="th-content">
                                    <span>{column.label}</span>
                                    {column.sortable && sortColumn === column.key && (
                                        <span className="sort-icon">
                                            {sortDirection === 'asc' ? '↑' : '↓'}
                                        </span>
                                    )}
                                </div>
                            </th>
                        ))}
                        {actions && <th className="actions-column">Hành động</th>}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, rowIndex) => (
                        <tr key={row.id || rowIndex}>
                            {columns.map((column) => (
                                <td key={column.key}>
                                    {column.render ? column.render(row[column.key], row) : row[column.key]}
                                </td>
                            ))}
                            {actions && (
                                <td className="actions-cell">
                                    <div className="action-buttons">
                                        {actions(row)}
                                    </div>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
