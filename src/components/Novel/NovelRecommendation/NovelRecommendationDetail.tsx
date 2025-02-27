import { useState } from 'react';
const NovelRecommendationDetail:React.FC<any>=({novelRec,recBody}) => {
    const [open, setOpen] = useState(false);

    const deleteReviewHandler = (e: any) => {
        e.preventDefault();
        setOpen(!open);
    };
    return(  <div className="panel ">
        <label className="text-lg text-center mx-auto block w-1/2">Roman İncelemesi</label>
        <form className="form flex flex-col w-full mt-4  items-start gap-4  ">
            <div className="flex flex-row w-full justify-between">
                <div className="flex flex-col justify-between gap-2 w-3/1">
                    <label>İnceleme Başlığı</label>
                    <span>{novelRec.novel_recTitle}</span>
                    <label>Özet Bilgi</label>
                    <span>{novelRec.novel_summaryInfo}</span>
                    <label>Roman Adı</label>
                    <span>{novelRec.novel_name} </span>
                    <label htmlFor="ctnSelect1">Kitap Yazarı</label>
                    <span>{novelRec.bookauthor_name} </span>
                    <label htmlFor="ctnSelect2">Roman Dönemi</label>
                    <span>{novelRec.themes} </span>
                </div>

                <div className="flex flex-col gap-2   w-2/6">
                    <label htmlFor="ctnSelect1">Roman Kategorisi</label>
                    <div className="flex flex-row gap-2">
                        {novelRec.novel_bookCategory.map((i: any) => {
                            return <span>{i}</span>;
                        })}
                    </div>
                    <div className="w-full ">
                        <label>Taglar</label>
                        <div className="flex flex-row gap-2">
                            {novelRec.tags.map((i: any) => {
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
                        __html: recBody,
                    }}
                ></p>
            </div>
            <button className="btn btn-danger" onClick={deleteReviewHandler}>
                İnceleme Yazısını Sil
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
        </form>
    </div>)
}
export default NovelRecommendationDetail;