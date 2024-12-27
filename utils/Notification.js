/**
 * Đối tượng Notification chứa các phương thức để hiển thị thông báo.
 */
export const Notification = {
    /**
     * Hiển thị thông báo thành công.
     * @param {Object} toast - Tham chiếu tới Toast component (dùng ref từ PrimeReact).
     * @param {string} [message="Thao tác thành công"] - Nội dung chính của thông báo (mặc định là "Thao tác thành công").
     * @param {string} [title="Thông báo"] - Tiêu đề của thông báo (mặc định là "Thông báo").
     * @param {number} [life=3000] - Thời gian hiển thị thông báo (ms).
     */
    success: (toast, message = "Thao tác vừa thực hiện đã hoàn thành", title = "Thông báo", life = 3000) => {
        toast.current.show({
            severity: "success",
            summary: title,
            detail: message,
            life,
           
        });
    },

    /**
     * Hiển thị thông báo lỗi.
     * @param {Object} toast - Tham chiếu tới Toast component (dùng ref từ PrimeReact).
     * @param {string} [message="Đã xảy ra lỗi"] - Nội dung chính của thông báo (mặc định là "Đã xảy ra lỗi").
     * @param {string} [title="Thông báo"] - Tiêu đề của thông báo (mặc định là "Thông báo").
     * @param {number} [life=3000] - Thời gian hiển thị thông báo (ms).
     */
    error: (toast, message = "Đã xảy ra lỗi", title = "Thông báo", life = 3000) => {
        toast.current.show({
            severity: "error",
            summary: title,
            detail: message,
            life,
            process: true,
        });
    },

    /**
     * Hiển thị thông báo thông tin.
     * @param {Object} toast - Tham chiếu tới Toast component (dùng ref từ PrimeReact).
     * @param {string} [message="Đây là thông tin"] - Nội dung chính của thông báo (mặc định là "Đây là thông tin").
     * @param {string} [title="Thông báo"] - Tiêu đề của thông báo (mặc định là "Thông báo").
     * @param {number} [life=3000] - Thời gian hiển thị thông báo (ms).
     */
    info: (toast, message = "Thông tin đã được hiển thị", title = "Thông báo", life = 3000) => {
        toast.current.show({
            severity: "info",
            summary: title,
            detail: message,
            life,
        });
    },

    /**
     * Hiển thị thông báo cảnh báo.
     * @param {Object} toast - Tham chiếu tới Toast component (dùng ref từ PrimeReact).
     * @param {string} [message="Đây là cảnh báo"] - Nội dung chính của thông báo (mặc định là "Đây là cảnh báo").
     * @param {string} [title="Thông báo"] - Tiêu đề của thông báo (mặc định là "Thông báo").
     * @param {number} [life=3000] - Thời gian hiển thị thông báo (ms).
     */
    warn: (toast, message = "Bạn cần xem lại thao tác vừa làm", title = "Thông báo", life = 3000) => {
        toast.current.show({
            severity: "warn",
            summary: title,
            detail: message,
            life,
        });
    },
};
