import JoditEditor from 'jodit-react';
import 'jodit';
import authorsData from '../../../utils/authorsData.json';
import Select, { SingleValue, ActionMeta } from 'react-select';
import periodData from '../../../utils/periodData.json';
import novelCategoryData from '../../../utils/novelCategoryData.json';
import Swal from 'sweetalert2';
import { useMemo, useRef, useState } from 'react';
import { TagsInput } from 'react-tag-input-component';
import axios from 'axios';
import { collection, doc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase';

const UpdateNovelReview: React.FC<any> = ({ novelReview, reviewBody, placeholder }) => {
    const editor = useRef<any>(null);
    const [updatedReview, setUpdatedReview] = useState({
        novel_reviewTitle: novelReview.novel_reviewTitle,
        novel_summaryInfo: novelReview.novel_summaryInfo,
        novel_name: novelReview.novel_name,
        period: novelReview.period,
        novel_bookCategory: novelReview.novel_bookCategory,
        tags: novelReview.tags,
        content: reviewBody,
        bookauthor_name: novelReview.bookauthor_name,
        novel_headImage: novelReview.novel_headImage,
    });
    const [content, setContent] = useState(''); //content,tags sonradan gönder

    const config = useMemo(
        () => ({
            readonly: false, // all options from https://xdsoft.net/jodit/docs/,
            placeholder: placeholder || 'Start typings...',
            language: 'tr',
            uploader: {
                insertImageAsBase64URI: false,
            },
            style: {
                width: '100%',
                height: '500px',
                border: '1px solid #ccc',
                // backgroundColor:theme==="dark"?"#1F252B":"#fff",
                lineHeight: '20%',
            },
            // Custom CSS styles for the editor content
            contentStyle: {
                fontSize: '16px',
                // color: theme==="dark"?"#fff":"black",
                lineHeight: 'normal',
            },
        }),
        [placeholder]
    );

    const formattedAuthors = authorsData.authors.map((author) => ({
        value: author.bookauthor_name, // label ve value olarak kullanacağımız değer
        label: author.bookauthor_name, // label değeri
        author_id: author.bookauthor_id, // Yazarın ID'si
    }));

    const [tags, setTags] = useState<string[]>([]);

    // const updateEmployeeChangeHandler = (e: any) => {
    //     const { value, name } = e.target;
    //     if (name === 'employee_category') {
    //         const selected = filteredCategory.filter((i) => i.category_name === value);
    //         console.log(selected);
    //         if (selected) {
    //             setUpdatedEmployee((pre: any) => ({
    //                 ...pre,
    //                 [name]: value,
    //                 employee_category: selected[0].category_name,
    //             }));
    //         }
    //     } else {
    //         setUpdatedEmployee({
    //             ...updatedEmployee,
    //             [name]: value,
    //         });
    //     }
    // };
    type InputNames = 'bookauthor_name' | 'novel_bookCategory' | 'period';
    const updateReviewChangeHandler = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,selectedOption:any) => {
        const { value, name } = e.target as { value: string; name: InputNames };

        // When author name is selected
        if (name === 'bookauthor_name') {
            const selectedAuthor = authorsData.authors.find((i) => i.bookauthor_name === value);
            if (selectedAuthor) {
                setUpdatedReview((prev: any) => ({
                    ...prev,
                    bookauthor_name: selectedAuthor.bookauthor_name,
                    bookauthor_id: selectedAuthor.bookauthor_id,
                }));
                return;
            }
        }

        // When book category is selected
        if (name === 'novel_bookCategory') {
            setUpdatedReview((prev: any) => ({
                ...prev,
                novel_bookCategory: value,
            }));
            return;
        }

        if (name === 'period') {
            setUpdatedReview((prev: any) => ({
                ...prev,
                period: value, // Sadece seçilen dönemi alıyoruz
            }));
            return;
        }

        // Default behavior for other inputs
        setUpdatedReview((prev) => ({ ...prev, [name]: value }));
    };

    console.log(updatedReview);

    const updateFormSubmitHandler = async (e: any) => {
        e.preventDefault();
        try {
            // 🔥 Ana belgenin (novel review) referansını al
            const novelReviewRef = doc(db, 'novel_review', novelReview.novel_reviewId);

            // 🔥 Ana belgeyi güncelle
            const { content, ...novelReviewData } = updatedReview; // body'i ayrı al
            if (Object.keys(novelReviewData).length > 0) {
                await updateDoc(novelReviewRef, novelReviewData);
                console.log('Ana belge güncellendi.');
            }

            // 🔥 Alt koleksiyon (reviewBody) için güncelleme
            if (content) {
                const reviewBodyRef = collection(novelReviewRef, 'reviewBody');
                const reviewBodyDocRef = doc(reviewBodyRef, 'bodyDoc'); // 'bodyDoc' id'sini uygun şekilde değiştir

                await setDoc(reviewBodyDocRef, { content }, { merge: true });
                console.log('Body içeriği güncellendi.');
            }
        } catch (error) {
            console.error('Güncelleme sırasında hata oluştu:', error);
        }
    };

    return (
        <div className="panel ">
            <label className="text-lg text-center mx-auto block w-1/2">Roman İncelemesi</label>
            <form onSubmit={updateFormSubmitHandler} className="form flex flex-col w-full mt-4  items-start gap-4  ">
                <div className="flex flex-row w-full justify-between">
                    <div className="flex flex-col justify-between gap-2 w-3/1">
                        <label>İnceleme Başlığı</label>
                        <input
                            name="novel_reviewTitle"
                            type="text"
                            placeholder="..."
                            className="form-input"
                            required
                            onChange={(e) => updateReviewChangeHandler(e,"")}
                            value={updatedReview.novel_reviewTitle}
                        />
                        <label>Özet Bilgi</label>
                        <input
                            name="novel_summaryInfo"
                            type="text"
                            placeholder="..."
                            className="form-input"
                            required
                            onChange={(e) => updateReviewChangeHandler(e,"")}
                            value={updatedReview.novel_summaryInfo}
                        />
                        <label>Roman Adı</label>
                        <input name="novel_name" type="text" placeholder="..." className="form-input" required onChange={(e) => updateReviewChangeHandler(e,"")} value={updatedReview.novel_name} />
                        <label htmlFor="ctnSelect1">Kitap Yazarı</label>
                        <Select
                            isSearchable
                            placeholder="Yazar seçiniz"
                            onChange={(selectedOption: any,e:any) => updateReviewChangeHandler(e,selectedOption)}
                            value={formattedAuthors.find((opt) => opt.value === updatedReview.bookauthor_name)}
                            options={formattedAuthors}
                        />
                        <label htmlFor="ctnSelect2">Roman Dönemi</label>
                        <select
                            name="novel_bookCategory"
                            id="ctnSelect1"
                            multiple
                            className="form-multiselect text-white-dark h-40"
                            onChange={(e) =>
                                setUpdatedReview((prev) => ({
                                    ...prev,
                                    novel_bookCategory: Array.from(e.target.selectedOptions, (option) => option.value),
                                }))
                            }
                            required
                            value={updatedReview.novel_bookCategory || []}
                        >
                            <option>Dönem seçiniz</option>
                            {periodData.periods.map((item: any, key: number) => (
                                <>
                                    <option title={item.description} key={item.id}>
                                        {item.name} {item.startYear} {item.endYear} {}
                                    </option>
                                </>
                            ))}
                        </select>
                    </div>

                    <div className="flex flex-col gap-2   w-2/6">
                        <label htmlFor="ctnSelect1">Roman Kategorisi</label>
                        <select name="novel_bookCategory" id="ctnSelect1" multiple className="form-multiselect text-white-dark h-40" onChange={(e) => updateReviewChangeHandler(e,"")} required>
                            <option>Kategori seçiniz...</option>
                            {novelCategoryData.categories.map((item: any) => (
                                <option value={item.name} key={item.id}>
                                    {item.name}
                                </option>
                            ))}
                        </select>
                        <div className="flex flex-col  flex-wrap mt-4">
                            <span>Seçilen Kategoriler</span>
                            {Array.isArray(updatedReview.novel_bookCategory) && updatedReview.novel_bookCategory.length > 0
                                ? updatedReview.novel_bookCategory.map((item: any) => <span key={item}>{item}</span>)
                                : ''}
                        </div>
                        <div className="w-full ">
                            <label>Taglar</label>
                            <TagsInput value={updatedReview.tags || []} onChange={(newTags) => setUpdatedReview((prev) => ({ ...prev, tags: newTags }))} name="tags" placeHolder="Tag giriniz" />
                        </div>
                    </div>
                </div>

                <div>
                    <JoditEditor ref={editor} value={updatedReview.content || ''} config={config} onBlur={(newContent) => setUpdatedReview((prev) => ({ ...prev, content: newContent }))} />
                    <div className="flex flex-row gap-2">
                        <button type="submit" className="btn btn-success mt-6 ">
                            Onaya Gönder
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default UpdateNovelReview;
