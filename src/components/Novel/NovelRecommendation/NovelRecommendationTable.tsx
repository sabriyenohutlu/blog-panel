import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, NavLink } from 'react-router-dom';
import { AppDispatch, IRootState } from '../../../store/index';
import { BiEdit } from 'react-icons/bi';
import { FcApproval } from 'react-icons/fc';
import { FcCancel } from 'react-icons/fc';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import Swal from 'sweetalert2';
import Tippy from '@tippyjs/react';
import '../../TippyTooltip/tippy.css';
import { PiEye } from 'react-icons/pi';
import { fetchRec } from '../../../store/novelRecSlice';
import PostCategory from '../../../utils/postCategory.jsx';
const NovelRecommendationTable = () => {
    const dispatch = useDispatch<AppDispatch>();
    const recData = useSelector((state: IRootState) => state.novelRec.recommendations);
    const loading = useSelector((state: IRootState) => state.novelRec.loading);
    const error = useSelector((state: IRootState) => state.novelRec.error);

    useEffect(() => {
        dispatch(fetchRec());
    }, [dispatch]);

    const [page, setPage] = useState(1);
    const PAGE_SIZES = [10, 20, 30, 50, 100];
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const initialRecords = recData.slice(0, pageSize);
    const [recordsData, setRecordsData] = useState(initialRecords);

    // useEffect(() => {
    //     setPage(1);
    // }, [pageSize]);

    // useEffect(() => {
    //     const from = (page - 1) * pageSize;
    //     const to = from + pageSize;
    //     setRecordsData(reviewData.slice(from, to));
    // }, [page, pageSize]);

      const showMessage2 = (title: string, color: string) => {
            Swal.fire({
                title: `${title}`,
                toast: true,
                position: 'top',
                showConfirmButton: false,
                timer: 3000,
                showCloseButton: true,
                customClass: {
                    popup: `color-${color}`,
                },
            });
        };
            const approvalBtnClickHandler = async (e: any, novel_recId: number) => {
                try {
                    // Firestore'daki ilgili kaydın referansını alıyoruz
                    const recRef = doc(db, 'novelRecommendation', novel_recId.toString()); 
        
                    // Kaydın 'status' bilgisini güncelliyoruz
                    await updateDoc(recRef, {
                        status: 'completed', // Durumu 'completed' olarak güncelliyoruz
                        updatedAt: new Date(), // 'updatedAt' zamanını da güncelliyoruz
                    });
                    showMessage2('Yazı Onaylandı.', 'success');
                    dispatch(fetchRec());
                    console.log('Review status updated to completed!');
                } catch (error) {
                    // Hata durumunda kullanıcıyı bilgilendirebiliriz
                    console.error('Error updating status:', error);
                }
            };
                const canceledBtnClickHandler = async (e: any, novel_recId: number) => {
                    try {
                        const recRef = doc(db, 'novelRecommendation', novel_recId.toString()); // Firestore'daki kaydın referansı
            
                        const newStatus = 'canceled'; // 'canceled' durumu için manuel olarak ayarlandı
            
                        await updateDoc(recRef, {
                            status: newStatus, // Durumu 'canceled' yapıyoruz
                            updatedAt: new Date(), // 'updatedAt' zamanını güncelliyoruz
                        });
                        showMessage2('Yazı Geri Alındı.', 'danger');
                        dispatch(fetchRec());
                        console.log(`Review status updated to ${newStatus}!`);
                    } catch (error) {
                        console.error('Error updating status:', error);
                    }
                };

                const statusColors: { [key: string]: string } = {
                    completed: 'text-success',
                    pending: 'text-secondary',
                    inProgress: 'text-info',
                    canceled: 'text-danger',
                    default: 'text-success',
                };
            
                const statusTranslations: { [key: string]: string } = {
                    completed: 'Yayında',
                    pending: 'Onay bekliyor',
                    inProgress: 'Taslak Aşamasında',
                    canceled: 'Geri Alındı',
                    default: 'Onay bekliyor',
                };
    return (
        <div className="panel mt-6 flex flex-col gap-4">
        <Link className="block" to="/icerik-yonetimi/roman/roman-onerisi-ekle">
            <button className="btn btn-sm btn-primary">Yeni Öneri Yazısı Ekle</button>
        </Link>
        <div className="table-responsive mb-5">
            <table>
                <thead>
                    <tr>
                        <th>Öneri Başlığı</th>
                        <th>Romanın Adı</th>
                        <th>Editör</th>
                        <th>Yayınlanma Tarihi</th>
                        <th>Durum</th>
                        <th className="text-center">İşlemler</th>
                        <th className="text-center">Sayfalar</th>
                    </tr>
                </thead>
                <tbody>
                    {recData?.map((data: any) => {
                        return (
                            <tr key={data.novel_recId}>
                                <td>
                                    <div className="whitespace-nowrap">{data.novel_recTitle}</div>
                                </td>
                                <td>{data.novel_name}</td>
                                <td>{data.author_id}</td>
                                <td>
                                    <td>{new Date(data.createdAt.seconds * 1000).toLocaleString()}</td>
                                </td>
                                {/* <td>{data.createdAt}</td> */}
                                <td>
                                    <div className={`whitespace-nowrap ${statusColors[data.status] || statusColors.default}`}>
                                        {`${statusTranslations[data.status] || statusTranslations.default}`}
                                    </div>
                                </td>
                                <td className="text-center">
                                    <div className="flex flex-row justify-start gap-2">
                                    <PostCategory/>
                                        <Tippy content="Yayınla" allowHTML={true} delay={0} animation="fade" theme="light">
                                            <button onClick={(e: any) => approvalBtnClickHandler(e, data.novel_recId)} disabled={data.status === 'completed'}>
                                                {data.status === 'completed' ? '' : <FcApproval size={24} />}
                                            </button>
                                        </Tippy>
                                        <Tippy content="Geri Al" allowHTML={true} delay={0} animation="fade" theme="light">
                                            <button onClick={(e: any) => canceledBtnClickHandler(e, data.novel_recId)} disabled={data.status === 'canceled'}>
                                                {data.status === 'canceled' ? '' : <FcCancel size={24} />}
                                            </button>
                                        </Tippy>
                                    </div>
                                </td>
                                <td>
                                    <div className="flex flex-row justify-start gap-2">
                                        <Tippy content="Detay" allowHTML={true} delay={0} animation="fade" theme="light">
                                            <NavLink to={`/icerik-yonetimi/roman/roman-onerisi-detay/${data.novel_recId}`}>
                                                <PiEye size={24} />
                                            </NavLink>
                                        </Tippy>
                                        <Tippy content="Güncelle" allowHTML={true} delay={0} animation="fade" theme="light">
                                            <NavLink to={`/icerik-yonetimi/roman/roman-onerisi-guncelle/${data.novel_recId}`}>
                                                <BiEdit size={24} />
                                            </NavLink>
                                        </Tippy>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    </div>
    );
};

export default NovelRecommendationTable;
