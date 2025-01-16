import React, { useEffect, useState } from 'react';
import { BAO_CAO_Service } from '../services/quanlythinghiem/BAO_CAO_Service';
import { useRouter } from 'next/router';
import ThongKe_SL_ChuKy from '../utils/Components/DasboardThongKeChuKy';

const Dashboard = () => {
    const router = useRouter();
    const [dashboard, setDashboard] = useState({
        "total_kyso_waiting": 0,
        "total_YCTN": 0,
        "total_kyso_fail": 0,
        "total_kyso_success": 0
    });

    const [user, setUser] = useState(null);

    useEffect(() => {
        // Kiểm tra nếu đang chạy ở phía client (trình duyệt)
        if (typeof window !== 'undefined') {
            const storedUser = JSON.parse(sessionStorage.getItem('user'));
            setUser(storedUser);
        }
    }, []); // Chạy 1 lần khi component được mount

    useEffect(() => {
        if (user) {
            const getData = async () => {
                let res = await BAO_CAO_Service.getDashboard(user?.id);
                res && setDashboard(res);
            };
            getData();
        }
    }, [user]);

    return (
        <div style={{ minHeight: '85vh' }} className='bg-white p-4 border-round-2xl'>
            <div className="grid mb-2">
                <div style={{ cursor: "pointer" }} className="col-12 lg:col-3" onClick={() => router.push('/quanlythinghiem/kyso?status=1')}>
                    <div className="card mb-0 border-blue-500 bg-blue-50">
                        <div className="flex justify-content-between mb-3">
                            <div>
                                <span className="block h-3rem flex text-blue-500 font-medium text-xl mb-3">Yêu cầu chờ ký</span>
                                <div className="text-blue-900 font-medium text-xl">{dashboard.total_kyso_waiting} yêu cầu đang chờ</div>
                            </div>
                            <div className="flex align-items-center justify-content-center bg-blue-500 border-round" style={{ width: '3rem', height: '3rem' }}>
                                <i className="pi pi-file text-white text-2xl" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-12 lg:col-3">
                    <div className="card mb-0 border-cyan-500 bg-white">
                        <div className="flex justify-content-between mb-3">
                            <div>
                                <span className="block h-3rem flex text-gray-700 font-medium text-xl mb-3">Yêu cầu đã ký</span>
                                <div className="text-gray-900 font-medium text-xl">{dashboard.total_kyso_success} đã ký thành công</div>
                            </div>
                            <div className="flex align-items-center justify-content-center bg-teal-500 border-round" style={{ width: '3rem', height: '3rem' }}>
                                <i className="pi pi-check text-white text-2xl" />
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{ cursor: "pointer" }} className="col-12 lg:col-3" onClick={() => router.push('/quanlythinghiem/yeucauthinghiem/danhsach')}>
                    <div className="card mb-0 border-cyan-500 bg-cyan-50">
                        <div className="flex justify-content-between mb-3">
                            <div>
                                <span className="block h-3rem flex text-cyan-500 font-medium text-xl mb-3">Số lượng yêu cầu thí nghiệm</span>
                                <div className="text-cyan-900 font-medium text-xl">{dashboard.total_YCTN} yêu cầu đã tạo</div>
                            </div>
                            <div className="flex align-items-center justify-content-center bg-cyan-500 border-round" style={{ width: '3rem', height: '3rem' }}>
                                <i className="pi pi-inbox text-white text-2xl" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-12 lg:col-3">
                    <div className="card mb-0 border-red-500 bg-red-50">
                        <div className="flex justify-content-between mb-3">
                            <div>
                                <span className="block h-3rem flex text-red-500 font-medium text-xl mb-3">Yêu cầu ký thất bại</span>
                                <div className="text-red-900 font-medium text-xl">{dashboard.total_kyso_fail} ký số thất bại</div>
                            </div>
                            <div className="flex align-items-center justify-content-center bg-red-500 border-round" style={{ width: '3rem', height: '3rem' }}>
                                <i className="pi pi-times text-white text-2xl" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ThongKe_SL_ChuKy />
        </div>
    );
};

export default Dashboard;
