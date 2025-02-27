import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, NavLink } from 'react-router-dom';
import { AppDispatch, IRootState } from '../../store/index';
import { fetchStory } from '../../store/storySlice';
import { BiEdit } from 'react-icons/bi';
import { FcApproval } from 'react-icons/fc';
import { FcCancel } from 'react-icons/fc';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import Swal from 'sweetalert2';
import Tippy from '@tippyjs/react';
import '../TippyTooltip/tippy.css';
import { PiEye } from 'react-icons/pi';

const StoryTable = () => {
    const dispatch = useDispatch<AppDispatch>();
    const storyData = useSelector((state: IRootState) => state.story.stories);
    const loading = useSelector((state: IRootState) => state.story.loading);
    const error = useSelector((state: IRootState) => state.story.error);
    useEffect(() => {
        dispatch(fetchStory());
    }, [dispatch]);

    const [page, setPage] = useState(1);
    const PAGE_SIZES = [10, 20, 30, 50, 100];
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const initialRecords = storyData.slice(0, pageSize);
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

    const approvalBtnClickHandler = async (e: any, story_id: number) => {
        try {
            // Firestore'daki ilgili kaydın referansını alıyoruz
            const storyRef = doc(db, 'story', story_id.toString()); // 'novelReview' koleksiyonunda `reviewId`'ye göre dokümanı buluyoruz

            // Kaydın 'status' bilgisini güncelliyoruz
            await updateDoc(storyRef, {
                status: 'completed', // Durumu 'completed' olarak güncelliyoruz
                updatedAt: new Date(), // 'updatedAt' zamanını da güncelliyoruz
            });
            showMessage2('Yazı Onaylandı.', 'success');
            dispatch(fetchStory());
            console.log('Review status updated to completed!');
        } catch (error) {
            // Hata durumunda kullanıcıyı bilgilendirebiliriz
            console.error('Error updating status:', error);
        }
    };
    const canceledBtnClickHandler = async (e: any, story_id: number) => {
        try {
            const storyRef = doc(db, 'story', story_id.toString()); // Firestore'daki kaydın referansı

            const newStatus = 'canceled'; // 'canceled' durumu için manuel olarak ayarlandı

            await updateDoc(storyRef, {
                status: newStatus, // Durumu 'canceled' yapıyoruz
                updatedAt: new Date(), // 'updatedAt' zamanını güncelliyoruz
            });
            showMessage2('Yazı Geri Alındı.', 'danger');
            dispatch(fetchStory());
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
    return(
      <div className="panel mt-6 flex flex-col gap-4">
      <Link className="block" to="/icerik-yonetimi/roman/roman-incelemesi-ekle">
          <button className="btn btn-sm btn-primary">Yeni Hikaye Ekle</button>
      </Link>
      <div className="table-responsive mb-5">
          <table>
              <thead>
                  <tr>
                      <th>Hikaye Başlığı</th>
                      <th>Hikayenin Adı</th>
                      <th>Editör</th>
                      <th>Yayınlanma Tarihi</th>
                      <th>Durum</th>
                      <th className="text-center">İşlemler</th>
                      <th className="text-center">Sayfalar</th>
                  </tr>
              </thead>
              <tbody>
                  {storyData?.map((data: any) => {
                      return (
                          <tr key={data.story_id}>
                              <td>
                                  <div className="whitespace-nowrap">{data.story_title}</div>
                              </td>
                              <td>{data.story_name}</td>
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
                                          <button onClick={(e: any) => approvalBtnClickHandler(e, data.story_id)} disabled={data.status === 'completed'}>
                                              {data.status === 'completed' ? '' : <FcApproval size={24} />}
                                          </button>
                                      </Tippy>
                                      <Tippy content="Geri Al" allowHTML={true} delay={0} animation="fade" theme="light">
                                          <button onClick={(e: any) => canceledBtnClickHandler(e, data.story_id)} disabled={data.status === 'canceled'}>
                                              {data.status === 'canceled' ? '' : <FcCancel size={24} />}
                                          </button>
                                      </Tippy>
                                  </div>
                              </td>
                              <td>
                                  <div className="flex flex-row justify-start gap-2">
                                      <Tippy content="Detay" allowHTML={true} delay={0} animation="fade" theme="light">
                                          <NavLink to={`/icerik-yonetimi/hikaye/hikaye-detay/${data.story_id}`}>
                                              <PiEye size={24} />
                                          </NavLink>
                                      </Tippy>
                                      <Tippy content="Güncelle" allowHTML={true} delay={0} animation="fade" theme="light">
                                          <NavLink to={`/icerik-yonetimi/hikaye/hikaye-guncelle/${data.story_id}`}>
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
};

export default StoryTable;
