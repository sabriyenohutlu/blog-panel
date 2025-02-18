import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, NavLink } from 'react-router-dom';
import { AppDispatch, IRootState } from '../../../store/index';
import { fetchReviews } from '../../../store/novelReviewSlice';
import { BiEdit } from 'react-icons/bi';
import { FcApproval } from 'react-icons/fc';
import { FcCancel } from 'react-icons/fc';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import Swal from 'sweetalert2';

const NovelReviewTable = () => {
    const dispatch = useDispatch<AppDispatch>();
    const reviewData = useSelector((state: IRootState) => state.novelReview.reviews);
    const loading = useSelector((state: IRootState) => state.novelReview.loading);
    const error = useSelector((state: IRootState) => state.novelReview.error);

    useEffect(() => {
        dispatch(fetchReviews());
    }, [dispatch]);

    const [page, setPage] = useState(1);
    const PAGE_SIZES = [10, 20, 30, 50, 100];
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const initialRecords = reviewData.slice(0, pageSize);
    const [recordsData, setRecordsData] = useState(initialRecords);

    useEffect(() => {
        setPage(1);
    }, [pageSize]);

    useEffect(() => {
        const from = (page - 1) * pageSize;
        const to = from + pageSize;
        setRecordsData(reviewData.slice(from, to));
    }, [page, pageSize]);

    // const sorttedReviewData = reviewData?.sort((a,b)=>{
    //     const dateA:any = new Date(a.createdAt);
    //     console.log(dateA)
    //     const dateB:any = new Date(b.createdAt);

    //     return dateA-dateB
    // })

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

    const approvalBtnClickHandler = async (e: any, novel_reviewId: number) => {
        try {
            // Firestore'daki ilgili kaydın referansını alıyoruz
            const reviewRef = doc(db, 'novelReview', novel_reviewId.toString()); // 'novelReview' koleksiyonunda `reviewId`'ye göre dokümanı buluyoruz

            // Kaydın 'status' bilgisini güncelliyoruz
            await updateDoc(reviewRef, {
                status: 'completed', // Durumu 'completed' olarak güncelliyoruz
                updatedAt: new Date(), // 'updatedAt' zamanını da güncelliyoruz
            });
            showMessage2('Yazı Onaylandı.', 'success');
            dispatch(fetchReviews());
            console.log('Review status updated to completed!');
        } catch (error) {
            // Hata durumunda kullanıcıyı bilgilendirebiliriz
            console.error('Error updating status:', error);
        }
    };

    const canceledBtnClickHandler = async (e: any, novel_reviewId: number) => {
        try {
            const reviewRef = doc(db, 'novelReview', novel_reviewId.toString()); // Firestore'daki kaydın referansı

            const newStatus = 'canceled'; // 'canceled' durumu için manuel olarak ayarlandı

            await updateDoc(reviewRef, {
                status: newStatus, // Durumu 'canceled' yapıyoruz
                updatedAt: new Date(), // 'updatedAt' zamanını güncelliyoruz
            });
            showMessage2('Yazı Geri Alındı.', 'danger');
            dispatch(fetchReviews());
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
        completed: 'Tamamlandı',
        pending: 'Onay bekliyor',
        inProgress: 'Devam Ediyor',
        canceled: 'İptal Edildi',
        default: 'Tamamlandı',
    };

    return (
        <div className="panel mt-6 flex flex-col gap-4">
            <Link className="block" to="/icerik-yonetimi/roman/roman-incelemesi-ekle">
                <button className="btn btn-sm btn-primary">Yeni İnceleme Yazısı Ekle</button>
            </Link>
            <div className="table-responsive mb-5">
                <table>
                    <thead>
                        <tr>
                            <th>İnceleme Başlığı</th>
                            <th>Romanın Adı</th>
                            <th>Editör</th>
                            <th>Yayınlanma Tarihi</th>
                            <th>Durum</th>
                            <th className="text-center">İşlemler</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reviewData?.map((data: any) => {
                            return (
                                <tr key={data.novel_reviewId}>
                                    <td>
                                        <div className="whitespace-nowrap">{data.novel_reviewTitle}</div>
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
                                        <div className="flex flex-row justify-start gap-1">
                                            <button onClick={(e: any) => approvalBtnClickHandler(e, data.novel_reviewId)} disabled={data.status === 'completed'}>
                                                {data.status === 'completed' ? '' : <FcApproval size={24} />}
                                            </button>
                                            <button onClick={(e: any) => canceledBtnClickHandler(e, data.novel_reviewId)} disabled={data.status === 'canceled'}>
                                                {data.status === 'canceled' ? '' : <FcCancel size={24} />}
                                            </button>
                                            <NavLink to={`/icerik-yonetimi/roman/roman-incelemesi-guncelle-${data.novel_reviewId}`}>
                                                <BiEdit size={24} />
                                            </NavLink>
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

export default NovelReviewTable;
