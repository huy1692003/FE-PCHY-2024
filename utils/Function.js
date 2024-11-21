/**
 * Kiểm tra tính hợp lệ của mật khẩu
 * @param {string} password - Mật khẩu cần kiểm tra
 * @param {object} toast - Toast component để hiển thị thông báo
 * @returns {boolean} - true nếu mật khẩu hợp lệ, false nếu không hợp lệ
 * 
 * Các điều kiện kiểm tra:
 * - Không được để trống
 * - Độ dài tối thiểu 8 ký tự
 * - Phải chứa ít nhất 1 chữ hoa
 * - Phải chứa ít nhất 1 ký tự đặc biệt (!@#$%^&*(),.?":{}|<>)
 */
export const validatePassword = (password, toast) => {
    if (!password) {
        toast.current.show({
            severity: 'error',
            summary: 'Thông báo!',
            detail: `Trường mật khẩu không được để trống.`,
            life: 3000
        });
        return false;
    }
    if (password.length <= 7) {
        toast.current.show({
            severity: 'error', 
            summary: 'Thông báo!',
            detail: `Mật khẩu phải từ 8 kí tự.`,
            life: 3000
        });
        return false;
    }
    if (!/[A-Z]/.test(password)) {
        toast.current.show({
            severity: 'error',
            summary: 'Thông báo!',
            detail: `Mật khẩu phải chứa ít nhất một chữ hoa.`,
            life: 3000
        });
        return false;
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        toast.current.show({
            severity: 'error',
            summary: 'Thông báo!',
            detail: `Mật khẩu phải chứa ít nhất một ký tự đặc biệt.`,
            life: 3000
        });
        return false;
    }
    return true;
}