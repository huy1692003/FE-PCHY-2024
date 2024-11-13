import React, { useState, useEffect } from 'react';
import { Button, InputText, Dialog, Toast } from 'primereact';
import { insert_DM_DONVI, update_DM_DONVI, delete_DM_DONVI, getDM_DONVI_ByID, get_All_DM_DONVI } from './services/dm_donviService'; // Import your API services
import { DM_DONVI } from '../../../models/DM_DONVI';

const DM_DONVI_Management = () => {
    const [dmDonviData, setDmDonviData] = useState([]);
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);
    const [formData, setFormData] = useState(DM_DONVI);
    const [toast, setToast] = useState(null);

    useEffect(() => {
        fetchDM_DONVI();
    }, []);

    const fetchDM_DONVI = async () => {
        try {
            const data = await get_All_DM_DONVI();
            setDmDonviData(data);
        } catch (error) {
            console.error('Error fetching DM_DONVI data:', error);
        }
    };

    const handleAddClick = () => {
        setShowAddDialog(true);
    };

    const handleEditClick = async (id) => {
        try {
            const data = await getDM_DONVI_ByID(id);
            setFormData(data); // Set the form data with the existing item data
            setShowEditDialog(true);
        } catch (error) {
            console.error('Error fetching DM_DONVI by ID:', error);
        }
    };

    const handleDeleteClick = (id) => {
        setCurrentItem(id);
        setShowDeleteDialog(true);
    };

    const handleSave = async () => {
        try {
            if (formData.id) {
                // Update existing DM_DONVI
                await update_DM_DONVI(formData);
                showSuccess('Cập nhật thành công');
            } else {
                // Insert new DM_DONVI
                await insert_DM_DONVI(formData);
                showSuccess('Thêm mới thành công');
            }
            setShowAddDialog(false);
            setShowEditDialog(false);
            fetchDM_DONVI(); // Refresh the list
        } catch (error) {
            console.error('Error saving DM_DONVI:', error);
            showError('Lỗi khi lưu dữ liệu');
        }
    };

    const handleDelete = async () => {
        try {
            await delete_DM_DONVI(currentItem);
            showSuccess('Xóa thành công');
            setShowDeleteDialog(false);
            fetchDM_DONVI(); // Refresh the list
        } catch (error) {
            console.error('Error deleting DM_DONVI:', error);
            showError('Lỗi khi xóa');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const showSuccess = (message) => {
        toast.show({ severity: 'success', summary: 'Thành công', detail: message, life: 3000 });
    };

    const showError = (message) => {
        toast.show({ severity: 'error', summary: 'Lỗi', detail: message, life: 3000 });
    };

    return (
        <div>
            {/* Toast for success and error messages */}
            <Toast ref={(el) => setToast(el)} />

            {/* Button to add a new DM_DONVI */}
            <Button label="Thêm mới" icon="pi pi-plus" onClick={handleAddClick} />

            {/* Data table or list of DM_DONVI */}
            <div>
                <h3>Danh sách Đơn Vị</h3>
                <ul>
                    {dmDonviData.map(item => (
                        <li key={item.id}>
                            {item.name} - {item.DM_TINHTHANH_ID} - {item.DM_QUANHUYEN_ID}
                            <Button label="Sửa" icon="pi pi-pencil" onClick={() => handleEditClick(item.id)} />
                            <Button label="Xóa" icon="pi pi-trash" onClick={() => handleDeleteClick(item.id)} />
                        </li>
                    ))}
                </ul>
            </div>

            {/* Dialog for adding a new DM_DONVI */}
            <Dialog
                header="Thêm mới Đơn Vị"
                visible={showAddDialog}
                style={{ width: '50vw' }}
                onHide={() => setShowAddDialog(false)}
            >
                <div>
                    <InputText
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Tên Đơn Vị"
                        style={{ width: '100%', marginBottom: '10px' }}
                    />
                    {/* Add more form fields for DM_TINHTHANH_ID, DM_QUANHUYEN_ID as required */}
                    <Button label="Lưu" icon="pi pi-check" onClick={handleSave} />
                </div>
            </Dialog>

            {/* Dialog for editing a DM_DONVI */}
            <Dialog
                header="Sửa Đơn Vị"
                visible={showEditDialog}
                style={{ width: '50vw' }}
                onHide={() => setShowEditDialog(false)}
            >
                <div>
                    <InputText
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Tên Đơn Vị"
                        style={{ width: '100%', marginBottom: '10px' }}
                    />
                    {/* Add more form fields for DM_TINHTHANH_ID, DM_QUANHUYEN_ID as required */}
                    <Button label="Lưu" icon="pi pi-check" onClick={handleSave} />
                </div>
            </Dialog>

            {/* Dialog for confirming delete */}
            <Dialog
                header="Xóa Đơn Vị"
                visible={showDeleteDialog}
                style={{ width: '30vw' }}
                onHide={() => setShowDeleteDialog(false)}
            >
                <div>
                    <p>Bạn có chắc muốn xóa đơn vị này không?</p>
                    <Button label="Xóa" icon="pi pi-trash" onClick={handleDelete} />
                    <Button label="Hủy" icon="pi pi-times" onClick={() => setShowDeleteDialog(false)} />
                </div>
            </Dialog>
        </div>
    );
};

export default DM_DONVI_Management;
