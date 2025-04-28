import { db } from '../../firebase';
import { deleteDoc, doc } from 'firebase/firestore';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const BlogDetail:React.FC<any> = ({thisBlog,blogBody}) => {
    const [open, setOpen ] = useState(false);
    const navigate = useNavigate();
       const deleteBlogHandler = async (e: any) => {
            try {
                await deleteDoc(doc(db, 'blog', thisBlog.blog_id));
                console.log('Document successfully deleted!');
                Swal.fire({
                    title: 'Silindi!',
                    text: 'Blog başarıyla silindi.',
                    icon: 'success',
                    padding: '2em',
                });
                navigate("/icerik-yonetimi/blog/blog-yazilari")
            } catch (error) {
                console.error('Error removing document: ', error);
            }
            setOpen(!open);
        };
  return (
    <div className="panel ">
    <label className="text-lg text-center mx-auto block w-1/2">Blog Yazısı</label>
    <div className="form flex flex-col w-full mt-4  items-start gap-4  ">
        <div className="flex flex-row w-full justify-between">
            <div className="flex flex-col justify-between gap-2 w-3/1">
                <label>Blog Başlığı</label>
                <span>{thisBlog.blog_title}</span>
                <label>Özet Bilgi</label>
                <span>{thisBlog.blog_summaryInfo}</span>
                <label htmlFor="ctnSelect1">Blog Yazarı</label>
                <span>{thisBlog.author_name} </span>
            </div>

            <div className="flex flex-col gap-2   w-2/6">
                <div className="w-full ">
                    <label>Taglar</label>
                    <div className="flex flex-row gap-2">
                        {thisBlog.tags.map((i: any) => {
                            return <span>{i}</span>;
                        })}
                    </div>
                </div>
            </div>
        </div>
        <div>
            <p
                dangerouslySetInnerHTML={{
                    // __html: DOMPurify.sanitize(body),
                    __html: blogBody,
                }}
            ></p>
        </div>
        <button className="btn btn-danger" onClick={() => setOpen(true)}>
            Blog Yazısını Sil
        </button>
        {open && (
            <div className="fixed inset-0 bg-[black]/60 z-[999] overflow-y-auto" onClick={() => setOpen(false)}>
                <div
                    className="flex items-center justify-center min-h-screen px-4"
                    onClick={(e) => e.stopPropagation()} // Prevent modal from closing when clicking inside the modal
                >
                    <div className="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-lg my-8">
                        <div className="flex w-full bg-[#fbfbfb] dark:bg-[#121c2c] items-center justify-between px-5 py-3">
                            <h5 className="font-bold text-lg">Silmek İstediğinizden Emin Misiniz?</h5>
                            <button
                                type="button"
                                className="text-white-dark hover:text-dark"
                                //  onClick={toggleModal}
                            >
                                <svg> ... </svg>
                            </button>
                        </div>
                        <div className="p-5">
                            <div className="flex justify-end items-center mt-8">
                                <button
                                    type="button"
                                    className="btn btn-outline-danger"
                                    //  onClick={toggleModal}
                                >
                                    Vazgeç
                                </button>
                                <button
                                    type="button"
                                    onClick={deleteBlogHandler}
                                    className="btn btn-danger ltr:ml-4 rtl:mr-4"
                                    // onClick={toggleModal}
                                >
                                    Sil
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )}
    </div>
</div>
  )
}

export default BlogDetail