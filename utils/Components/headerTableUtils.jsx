/**
 * Tạo header template với icon sắp xếp
 * @param {string} field - Tên trường của cột để sắp xếp
 * @param {function} handleSort - Hàm xử lý sắp xếp
 * @param {string} sortField - Trường hiện đang được sắp xếp
 * @param {number} sortOrder - Thứ tự sắp xếp hiện tại (1: tăng, -1: giảm)
 * @param {string} headerText - Văn bản hiển thị trong header
 * @param {object} styles - Các style tùy chỉnh (không bắt buộc)
 * @returns {JSX.Element} Header template
 */
const headerTableSortUtils = (field, handleSort, sortField, sortOrder, headerText, styles = {}) => {
    const getSortIcon = () => {
        if (sortField === field) {
            return sortOrder === 1 ? 'pi pi-sort-amount-up-alt' : 'pi pi-sort-amount-down';
        }
        return 'pi pi-sort-alt'; // Icon mặc định khi chưa sắp xếp
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center', ...styles.headerContainer }}>
            <span style={{ flexGrow: 1, ...styles.text }}>{headerText}</span>
            <i
                className={`${getSortIcon()}`}
                style={{
                    fontSize: '1.5rem',
                    cursor: 'pointer',
                    marginLeft: '0.5rem',
                    ...styles.icon,
                }}
                onClick={() => handleSort(field)}
            ></i>
        </div>
    );
};

export default headerTableSortUtils;
