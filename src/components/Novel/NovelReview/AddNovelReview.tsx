import JoditEditor from 'jodit-react';
import 'jodit';
import { useEffect, useMemo, useRef, useState } from 'react';
import authorsData from '../../../utils/authorsData.json';
import { collection, doc, setDoc, Timestamp } from 'firebase/firestore';
import { db, getDownloadURL, ref, storage, uploadBytes } from '../../../firebase';
import Select, { SingleValue, ActionMeta } from 'react-select';
import periodData from '../../../utils/periodData.json';
import Swal from 'sweetalert2';
import { TagsInput } from 'react-tag-input-component';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from 'store';
import { fetchPostCategories } from '../../../store/postCategorySlice';
import { fetchAuthors } from '../../../store/authorSlice';
interface AuthorOption {
    value: string;
    label: string;
    author_id: number;
}
type Props = {
    placeholder?: string;
};
type novelCategoryType = {
    id: number;
    name: string;
    description: string;
};

type NewNovelReviewType = {
    novel_id: number;
    novel_name: string;
    novel_headImage: string;
    novel_reviewTitle: string;
    novel_summaryInfo: string;
    body: string;
    category_id: number;
    subCategory_id: number;
    subCategory_name: string;
    author_id: string;
    status: string;
    tags: string[];
    url: string;
    bookauthor_id: string;
    bookauthor_name: string;
    novel_recordedDate: any;
    comments: string[];
    likes: number;
    dislikes: number;
    subCategory_title: string;
    view_count: number;
    createdAt: any;
    updatedAt: any;
    rating: number;
    novel_bookCategory: string[]; // Array of category IDs
    period: string;
};

interface Tag {
    id: string;
    text: string;
    className: string; // className'ı opsiyonel olarak ekliyoruz
}
const AddNovelReview: React.FC<Props> = ({ placeholder }) => {
    const editor = useRef<any>(null);
    const [content, setContent] = useState('');
    const dispatch = useDispatch<AppDispatch>();
     const postCategories = useSelector((state: any) => state.postCategories.postCategories);
     const authors = useSelector((state: any) => state.author.authors);
    const [selectedImage, setSelectedImage] = useState<number | null>(0);
    const [preview, setPreview] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const thisUser = useSelector((state: any) => state.users.user);
    const [newNovelReview, setNewNovelReview] = useState({
        novel_reviewId: 0,
        novel_name: '',
        novel_headImage: '',
        novel_reviewTitle: '',
        novel_summaryInfo: '',
        category_id: 176816,
        subCategory_id: 176801,
        subCategory_name: 'novelReview',
        subCategory_title: 'roman-incelemesi',
        author_id: '',
        status: 'pending',
        tags: [], //gönderirken tags ekle yolla
        bookauthor_id: '',
        bookauthor_name: '',
        novel_recordedDate: new Date(),
        comments: [],
        likes: 0,
        dislikes: 0,
        url: '',
        view_count: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        rating: 0,
        novel_bookCategory: [],
        period: ''
    });
    useEffect(() => {
        dispatch(fetchPostCategories());
        dispatch(fetchAuthors());
    }, [dispatch]);

    let groupNames = postCategories?.reduce((result, item) => {
        result[item.whatsCategory] = []
        return result;
      }, {});
    
    
      Object.keys(groupNames).forEach(whatsCategory => {
        let findCategories = postCategories.filter(i => i.whatsCategory == whatsCategory);
        groupNames[whatsCategory] =  Object.values(findCategories);
      });

        const options = groupNames["Roman"]
       ?.map(({ postCategory_name }) => ({
           value: postCategory_name,
          label: postCategory_name,
        }));

    const [fancyboxIsActive, setFancyboxIsActive] = useState(false);

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

    const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Dosyanın bir referansını al
        const fileRef = ref(storage, `novelImages/${file.name}`);

        try {
            // Dosyayı Firebase Storage'a yükle
            await uploadBytes(fileRef, file);

            // Yükleme tamamlandıktan sonra dosyanın URL'sini al
            const fileURL = await getDownloadURL(fileRef);

            // URL'yi form alanına kaydet
            setNewNovelReview((prev) => ({
                ...prev,
                novel_headImage: fileURL,
            }));

            // Görselin önizlemesini göster
            setPreview(URL.createObjectURL(file));
        } catch (error) {
            console.error('Error uploading file: ', error);
        }
    };

    const [tags, setTags] = useState<string[]>([]);

    const onSelectChange = (selectedOption: SingleValue<AuthorOption>, actionMeta: ActionMeta<AuthorOption>) => {
        // Seçilen seçenek varsa
        if (selectedOption) {
            setNewNovelReview((prev: any) => ({
                ...prev,
                bookauthor_name: selectedOption.value, // Seçilen yazarın adı
                bookauthor_id: selectedOption.author_id, // Yazarın ID'si
            }));
        }
    };


    const formattedAuthors = authors.map((author) => ({
        value: author.author_name, // label ve value olarak kullanacağımız değer
        label: author.author_name, // label değeri
        author_id: author.author_id, // Yazarın ID'si
    }));

    const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        let newValue: string | string[] | boolean;

        if (e.target instanceof HTMLSelectElement && e.target.multiple) {
            // Eğer multiple select ise, seçili değerleri array olarak al
            newValue = Array.from(e.target.selectedOptions, (option) => option.value);
        } else if (e.target instanceof HTMLInputElement && e.target.type === 'checkbox') {
            // Checkbox için checked değerini al
            newValue = e.target.checked;
        } else {
            // Diğer inputlar için value al
            newValue = value;
        }

        setNewNovelReview((prev) => ({
            ...prev,
            [name]: newValue,
        }));
    };

    const selectOnChange = (e: any) => {
        setNewNovelReview((prev) => ({
            ...prev,
            novel_bookCategory: e.map((item: any) => item.label),
        }));
    };

    const formSubmit = async (e: React.MouseEvent<HTMLButtonElement>, status: string) => {
        e.preventDefault();

        const post_id = Math.floor(100000 + Math.random() * 900000).toString();
        const novelReviewRef = doc(db, 'novelReview', post_id);
        setUploading(true);
        let urledTitle = '';
        const now = new Date();
        const author = thisUser?.uid;

        const regex: RegExp = /[^a-zA-Z0-9çğıİöşüÇĞIÖŞÜ-\s]/g;

        const createUrlTitle = (title: string) => {
            const post_id = Math.floor(100000 + Math.random() * 900000).toString(); // Post id oluşturuluyor
            const lowerCasedTitle = title.trim().toLowerCase().split(' ').join('-'); // Başlığı küçük harfe dönüştürüp, boşlukları tireye çevir
            const englishedTitle = lowerCasedTitle.replace(/ı/g, 'i').replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ö/g, 'o').replace(/ç/g, 'c'); // Türkçe karakterleri İngilizce'ye dönüştür

            const urledTitle = englishedTitle.replace(regex, ''); // Regex ile geçersiz karakterleri kaldır
            return { urledTitle, post_id }; // Her iki değeri döndürüyoruz
        };

        const finalUrlTitle = createUrlTitle(newNovelReview.novel_name);
        try {
            // b = await uploadImage(urledTitle);
            await setDoc(novelReviewRef, {
                ...newNovelReview,
                url: finalUrlTitle, // URL'yi formdan alıp Firestore'a ekle
                createdAt: now,
                updatedAt: now,
                tags: tags,
                novel_reviewId: post_id,
                status: status,
                author_id: author
            });

            // Alt koleksiyon (reviewBody) ekleme
            const reviewBodyRef = collection(novelReviewRef, 'reviewBody');
            await setDoc(doc(reviewBodyRef,post_id), {
                body: content,
            });

            Swal.fire({
                title: 'Saved successfully',
                text: 'Your novel review has been saved!',
                icon: 'success',
                padding: '2em',
            });
            setNewNovelReview({
                novel_reviewId: 0,
                novel_name: '',
                novel_headImage: '',
                novel_reviewTitle: '',
                novel_summaryInfo: '',
                category_id: 176816,
                subCategory_title: 'roman-incelemesi',
                subCategory_id: 176801,
                subCategory_name: 'novelReview',
                author_id: '',
                status: 'pending',
                tags: [], //gönderirken tags ekle yolla
                bookauthor_id: '',
                bookauthor_name: '',
                novel_recordedDate: new Date(),
                comments: [],
                likes: 0,
                dislikes: 0,
                url: '',
                view_count: 0,
                createdAt: new Date(),
                updatedAt: new Date(),
                rating: 0,
                novel_bookCategory: [],
                period: '',
            });
            setTags([]);
            setContent('');
            setUploading(false);
            // Başarılı işlem sonrası yapılacaklar
            console.log('Novel review has been successfully submitted!');
            setUploading(false);
        } catch (e) {
            console.log(e);
            Swal.fire({
                title: 'Error',
                text: 'There was an error while saving your review.',
                icon: 'error',
                padding: '2em',
            });
        }
    };

    return (
        <div className="panel ">
            <label className="text-lg text-center mx-auto block w-1/2">Roman İncelemesi</label>
            <form className="form flex flex-col w-full mt-4  items-start gap-4  ">
                <div className="flex flex-row w-full justify-between">
                    <div className="flex flex-col justify-between gap-2 w-3/1">
                        <label>İnceleme Başlığı</label>
                        <input name="novel_reviewTitle" type="text" placeholder="..." className="form-input" required onChange={onChange} value={newNovelReview.novel_reviewTitle} />
                        <label>Özet Bilgi</label>
                        <input name="novel_summaryInfo" type="text" placeholder="..." className="form-input" required onChange={onChange} value={newNovelReview.novel_summaryInfo} />
                        <label>Roman Adı</label>
                        <input name="novel_name" type="text" placeholder="..." className="form-input" required onChange={onChange} value={newNovelReview.novel_name} />
                        <label htmlFor="ctnSelect1">Kitap Yazarı</label>
                        <Select isSearchable placeholder="Yazar seçiniz" onChange={onSelectChange} options={formattedAuthors} />
                        <label htmlFor="ctnSelect2">Roman Dönemi</label>
                        <select onChange={onChange} id="ctnSelect1" className="form-multiselect  w-96 text-white-dark" name="period" value={newNovelReview.period}>
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
                        <Select closeMenuOnSelect={false} className="text-white-dark " isMulti options={options} placeholder="Kategori Seçiniz..." onChange={selectOnChange} />
                        <div className="flex flex-col  flex-wrap mt-4">
                            <span>Seçilen Kategoriler</span>
                            {Array.isArray(newNovelReview.novel_bookCategory) && newNovelReview.novel_bookCategory.length > 0
                                ? newNovelReview.novel_bookCategory.map((item: any) => <span key={item}>{item}</span>)
                                : ''}
                        </div>
                        <div className="w-full ">
                            <label>Taglar</label>
                            <TagsInput value={tags} onChange={setTags} name="fruits" placeHolder="Tag giriniz" />
                        </div>
                    </div>
                </div>

                <div>
                    <JoditEditor
                        ref={editor}
                        value={content}
                        config={config}
                        onBlur={(newContent) => setContent(newContent)} // preferred to use only this option to update the content for performance reasons
                        onChange={(newContent) => {}}
                    />
                    <div className="flex flex-row gap-2">
                        <button type="submit" className="btn btn-success mt-6 " onClick={(e) => formSubmit(e, 'pending')}>
                            Onaya Gönder
                        </button>
                        <button type="submit" className="btn btn-secondary mt-6 " onClick={(e) => formSubmit(e, 'inProgress')}>
                            Taslak Olarak Kaydet
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default AddNovelReview;
