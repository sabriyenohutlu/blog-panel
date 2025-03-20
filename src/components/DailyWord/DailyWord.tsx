import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, NavLink } from 'react-router-dom';
import { fetchDailyWord } from '../../store/dailyWordSlice';
import { BiEdit } from 'react-icons/bi';
import { FcApproval } from 'react-icons/fc';
import { FcCancel } from 'react-icons/fc';
import Swal from 'sweetalert2';
import Tippy from '@tippyjs/react';
import '../TippyTooltip/tippy.css';
import { PiEye } from 'react-icons/pi';
import { AppDispatch } from 'store';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { fetchUsers } from '../../store/userSlice';
const DailyWord = () => {
    const dispatch = useDispatch<AppDispatch>();
    const dailyWordData = useSelector((state: any) => state.dailyWord.dailyWords);
    const loading = useSelector((state: any) => state.dailyWord.loading);
    const error = useSelector((state: any) => state.dailyWord.error);
    const usersList = useSelector((state: any) => state.user.usersList);
    useEffect(() => {
        dispatch(fetchDailyWord());
        dispatch(fetchUsers())
    }, [dispatch]);

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

    const approvalBtnClickHandler = async (e: any, dailyWord_id: number) => {
        try {
            // Firestore'daki ilgili kaydın referansını alıyoruz
            const dailyWordRef = doc(db, 'dailyWord', dailyWord_id.toString()); // 'novelReview' koleksiyonunda `reviewId`'ye göre dokümanı buluyoruz

            // Kaydın 'status' bilgisini güncelliyoruz
            await updateDoc(dailyWordRef, {
                status: 'completed', // Durumu 'completed' olarak güncelliyoruz
                updatedAt: new Date(), // 'updatedAt' zamanını da güncelliyoruz
            });
            showMessage2('Yazı Onaylandı.', 'success');
            dispatch(fetchDailyWord());
            console.log('Review status updated to completed!');
        } catch (error) {
            // Hata durumunda kullanıcıyı bilgilendirebiliriz
            console.error('Error updating status:', error);
        }
    };

    const canceledBtnClickHandler = async (e: any, dailyWord_id: number) => {
        try {
            const dailyWordRef = doc(db, 'dailyWord', dailyWord_id.toString()); // Firestore'daki kaydın referansı

            const newStatus = 'canceled'; // 'canceled' durumu için manuel olarak ayarlandı

            await updateDoc(dailyWordRef, {
                status: newStatus, // Durumu 'canceled' yapıyoruz
                updatedAt: new Date(), // 'updatedAt' zamanını güncelliyoruz
            });
            showMessage2('Yazı Geri Alındı.', 'danger');
            dispatch(fetchDailyWord());
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

    const userTranslations = usersList?.reduce((acc:any, user:any) => {
        acc[user?.userId] = user?.name;
        return acc;
      }, {});

    return (
        <div className="panel mt-6 flex flex-col gap-4">
            <Link className="block" to="/icerik-yonetimi/gunluk-soz/gunluk-soz-ekle">
                <button className="btn btn-sm btn-primary">Yeni Günlük Söz Ekle</button>
            </Link>
            <div className="table-responsive mb-5">
                <table>
                    <thead>
                        <tr>
                            <th>Söz</th>
                            <th>Yazarın Adı</th>
                            <th>Editör</th>
                            <th>Kategori</th>
                            <th>Yayınlanma Tarihi</th>
                            <th>Durum</th>
                            <th className="text-center">İşlemler</th>
                            <th className="text-center">Sayfalar</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dailyWordData?.map((data: any) => {
                            return (
                                <tr key={data.dailyWord_id}>
                                    <td>
                                        <div className="whitespace-nowrap">{data.dailyWord_title}</div>
                                    </td>
                                    <td>{data.dailyWord_authorName}</td>
                                    <td>{data.author_id}</td>
                                    {/* <td>{`${userTranslations[String(data?.author_id)] || ""} `}</td> */}
                                    <td>{data.dailyWord_category.map((i:any)=><div className='flex flex-row justify-evenly'><span>{i}</span></div>)}</td>
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
                                            <Tippy content="Yayınla" allowHTML={true} delay={0} animation="fade" theme="light">
                                                <button onClick={(e: any) => approvalBtnClickHandler(e, data.dailyWord_id)} disabled={data.status === 'completed'}>
                                                    {data.status === 'completed' ? '' : <FcApproval size={24} />}
                                                </button>
                                            </Tippy>
                                            <Tippy content="Geri Al" allowHTML={true} delay={0} animation="fade" theme="light">
                                                <button onClick={(e: any) => canceledBtnClickHandler(e, data.dailyWord_id)} disabled={data.status === 'canceled'}>
                                                    {data.status === 'canceled' ? '' : <FcCancel size={24} />}
                                                </button>
                                            </Tippy>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="flex flex-row justify-start gap-2">
                                            <Tippy content="Detay" allowHTML={true} delay={0} animation="fade" theme="light">
                                                <NavLink to={`/icerik-yonetimi/gunluk-soz/gunluk-soz-ekle/${data.dailyWord_id}`}>
                                                    <PiEye size={24} />
                                                </NavLink>
                                            </Tippy>
                                            <Tippy content="Güncelle" allowHTML={true} delay={0} animation="fade" theme="light">
                                                <NavLink to={`/icerik-yonetimi/gunluk-soz/gunluk-soz-ekle/${data.dailyWord_id}`}>
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

export default DailyWord;
