import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, NavLink } from 'react-router-dom';
import { AppDispatch, IRootState } from '../../store/index';
import { BiEdit } from 'react-icons/bi';
import { FcApproval } from 'react-icons/fc';
import { FcCancel } from 'react-icons/fc';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import Swal from 'sweetalert2';
import Tippy from '@tippyjs/react';
import '../TippyTooltip/tippy.css';
import { PiEye } from 'react-icons/pi';
import {fetchPoetry} from "../../store/poetrySlice"
const PoetryTable = () => {
  const dispatch = useDispatch<AppDispatch>();
    const poetryData = useSelector((state: IRootState) => state.poetry.poetries);
    const loading = useSelector((state: IRootState) => state.poetry.loading);
    const error = useSelector((state: IRootState) => state.poetry.error);
    useEffect(() => {
        dispatch(fetchPoetry());
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
                const approvalBtnClickHandler = async (e: any, poetry_id: number) => {
                  try {
                      // Firestore'daki ilgili kaydın referansını alıyoruz
                      const poetryRef = doc(db, 'poetry', poetry_id.toString()); // 'novelReview' koleksiyonunda `reviewId`'ye göre dokümanı buluyoruz
          
                      // Kaydın 'status' bilgisini güncelliyoruz
                      await updateDoc(poetryRef, {
                          status: 'completed', // Durumu 'completed' olarak güncelliyoruz
                          updatedAt: new Date(), // 'updatedAt' zamanını da güncelliyoruz
                      });
                      showMessage2('Yazı Onaylandı.', 'success');
                      dispatch(fetchPoetry());
                      console.log('Review status updated to completed!');
                  } catch (error) {
                      // Hata durumunda kullanıcıyı bilgilendirebiliriz
                      console.error('Error updating status:', error);
                  }
              };
               const canceledBtnClickHandler = async (e: any, poetry_id: number) => {
                 try {
                     const poetryRef = doc(db, 'poetry', poetry_id.toString()); // Firestore'daki kaydın referansı
           
                     const newStatus = 'canceled'; // 'canceled' durumu için manuel olarak ayarlandı
           
                     await updateDoc(poetryRef, {
                         status: newStatus, // Durumu 'canceled' yapıyoruz
                         updatedAt: new Date(), // 'updatedAt' zamanını güncelliyoruz
                     });
                     showMessage2('Yazı Geri Alındı.', 'danger');
                     dispatch(fetchPoetry());
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
            <Link className="block" to="/icerik-yonetimi/biyografi/biyografi-ekle">
                <button className="btn btn-sm btn-primary">Yeni Şiir Ekle</button>
            </Link>
            <div className="table-responsive mb-5">
                <table>
                    <thead>
                        <tr>
                            <th>Biyografi Başlığı</th>
                            <th>Yazarın Adı</th>
                            <th>Editör</th>
                            <th>Yayınlanma Tarihi</th>
                            <th>Durum</th>
                            <th className="text-center">İşlemler</th>
                            <th className="text-center">Sayfalar</th>
                        </tr>
                    </thead>
                    <tbody>
                        {poetryData?.map((data: any) => {
                            return (
                                <tr key={data.poetry_id}>
                                    <td>
                                        <div className="whitespace-nowrap">{data.poetry_title}</div>
                                    </td>
                                    <td>{data.poetryOfWho}</td>
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
                                            <Tippy content="Yayınla" allowHTML={true} delay={0} animation="fade" theme="light">
                                                <button onClick={(e: any) => approvalBtnClickHandler(e, data.poetry_id)} disabled={data.status === 'completed'}>
                                                    {data.status === 'completed' ? '' : <FcApproval size={24} />}
                                                </button>
                                            </Tippy>
                                            <Tippy content="Geri Al" allowHTML={true} delay={0} animation="fade" theme="light">
                                                <button onClick={(e: any) => canceledBtnClickHandler(e, data.poetry_id)} disabled={data.status === 'canceled'}>
                                                    {data.status === 'canceled' ? '' : <FcCancel size={24} />}
                                                </button>
                                            </Tippy>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="flex flex-row justify-start gap-2">
                                            <Tippy content="Detay" allowHTML={true} delay={0} animation="fade" theme="light">
                                                <NavLink to={`/icerik-yonetimi/siir/siir-detay/${data.poetry_id}`}>
                                                    <PiEye size={24} />
                                                </NavLink>
                                            </Tippy>
                                            <Tippy content="Güncelle" allowHTML={true} delay={0} animation="fade" theme="light">
                                                <NavLink to={`/icerik-yonetimi/siir/siir-guncelle/${data.poetry_id}`}>
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
          )
}

export default PoetryTable