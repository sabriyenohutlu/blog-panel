import React, { useEffect } from 'react';
import JoditEditor from 'jodit-react';
import 'jodit';
import { useMemo, useRef, useState } from 'react';
import novelCategoryData from '../../../utils/novelCategoryData.json';
import authorsData from '../../../utils/authorsData.json';
import { collection, doc, setDoc, Timestamp } from 'firebase/firestore';
import { db, getDownloadURL, ref, storage, uploadBytes } from '../../../firebase';
import Select, { SingleValue, ActionMeta } from 'react-select';
import periodData from '../../../utils/periodData.json';
import Swal from 'sweetalert2';
import { TagsInput } from 'react-tag-input-component';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPostCategories } from '../../../store/postCategorySlice';
import { AppDispatch } from 'store';
import { fetchAuthors } from '../../../store/authorSlice';


interface AuthorOption {
    value: string;
    label: string;
    author_id: number;
}

type novelCategoryType = {
    id: number;
    name: string;
    description: string;
};
interface Tag {
    id: string;
    text: string;
    className: string; // className'ı opsiyonel olarak ekliyoruz
}
type NewNovelReviewType = {
    novel_recId: number;
    novel_name: string;
    novel_headImage: string;
    novel_recTitle: string;
    novel_summaryInfo: string;
    category_id: number;
    subCategory_id: number;
    subCategory_name: string;
    author_id: string;
    status: string;
    tags: string[]; //gönderirken tags ekle yolla
    bookauthor_id: string;
    bookauthor_name: string;
    novel_recordedDate: any;
    comments: string[];
    likes: number;
    dislikes: number;
    url: string;
    view_count: number;
    createdAt: any;
    updatedAt: any;
    rating: number;
    novel_bookCategory: string[];
    themes: string[];
};
type Props = {
    placeholder?: string;
};

const AddNovelRecommendation: React.FC<Props> = ({ placeholder }) => {
    const editor = useRef<any>(null);
    const [content, setContent] = useState('');
    const dispatch = useDispatch<AppDispatch>();
    const authors = useSelector((state: any) => state.author?.authors);
    const postCategories = useSelector((state: any) => state.postCategories.postCategories);
    const [selectedImage, setSelectedImage] = useState<number | null>(0);
    const [preview, setPreview] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const thisUser = useSelector((state: any) => state.users.user);
  
    const [newNovelRec, setNewNovelRec] = useState({
        novel_recId: 0,
        novel_name: '',
        novel_headImage: '',
        novel_recTitle: '',
        novel_summaryInfo: '',
        category_id: 176816,
        subCategory_id: 176802,
        subCategory_name: 'novelRecommendation',
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
        themes: [],
    });
   
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



    useEffect(() => {
        dispatch(fetchPostCategories());
        dispatch(fetchAuthors());
    }, [dispatch]);

    console.log(authors)

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

    const [tags, setTags] = useState<string[]>([]);
    const [themes, setThemes] = useState<string[]>([]);

    const onSelectChange = (selectedOption: SingleValue<AuthorOption>, actionMeta: ActionMeta<AuthorOption>) => {
        // Seçilen seçenek varsa
        if (selectedOption) {
            setNewNovelRec((prev: any) => ({
                ...prev,
                bookauthor_name: selectedOption.value, // Seçilen yazarın adı
                bookauthor_id: selectedOption.author_id, // Yazarın ID'si
            }));
        }
    };

    const formattedAuthors = authors?.map((author) => ({
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

        setNewNovelRec((prev) => ({
            ...prev,
            [name]: newValue,
        }));
    };

 

    const selectOnChange = (e: any) => {
        setNewNovelRec((prev) => ({
            ...prev,
            novel_bookCategory: e.map((item: any) => item.label),
        }));
    };

    const formSubmit = async (e: React.MouseEvent<HTMLButtonElement>, status: string) => {
        e.preventDefault();

        const post_id = Math.floor(100000 + Math.random() * 900000).toString();
        const novelRecRef = doc(db, 'novelRecommendation', post_id);
        const author = thisUser?.uid;
        setUploading(true);
        let urledTitle = '';
        const now = new Date();

        const regex: RegExp = /[^a-zA-Z0-9çğıİöşüÇĞIÖŞÜ-\s]/g;

        const createUrlTitle = (title: string) => {
            const post_id = Math.floor(100000 + Math.random() * 900000).toString(); // Post id oluşturuluyor
            const lowerCasedTitle = title.trim().toLowerCase().split(' ').join('-'); // Başlığı küçük harfe dönüştürüp, boşlukları tireye çevir
            const englishedTitle = lowerCasedTitle.replace(/ı/g, 'i').replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ö/g, 'o').replace(/ç/g, 'c'); // Türkçe karakterleri İngilizce'ye dönüştür

            const urledTitle = englishedTitle.replace(regex, ''); // Regex ile geçersiz karakterleri kaldır
            return { urledTitle, post_id }; // Her iki değeri döndürüyoruz
        };

        const finalUrlTitle = createUrlTitle(newNovelRec.novel_name);
        try {
            // b = await uploadImage(urledTitle);
            await setDoc(novelRecRef, {
                ...newNovelRec,
                url: finalUrlTitle, // URL'yi formdan alıp Firestore'a ekle
                createdAt: now,
                updatedAt: now,
                themes: themes,
                tags: tags,
                novel_recId: post_id,
                status: status,
                author_id: author
            });

            // Alt koleksiyon (reviewBody) ekleme
            const recBodyRef = collection(novelRecRef, 'recBody');
            await setDoc(doc(recBodyRef), {
                body: content,
            });

            Swal.fire({
                title: 'Saved successfully',
                text: 'Your novel rec has been saved!',
                icon: 'success',
                padding: '2em',
            });
            setNewNovelRec({
                novel_recId: 0,
                novel_name: '',
                novel_headImage: '',
                novel_recTitle: '',
                novel_summaryInfo: '',
                category_id: 176816,
                subCategory_id: 176802,
                subCategory_name: 'novelRecommendation',
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
                themes: [],
            });
            setThemes([]);
            setTags([]);
            setContent('');
            setUploading(false);
            // Başarılı işlem sonrası yapılacaklar
            console.log('Novel rec has been successfully submitted!');
            setUploading(false);
        } catch (e) {
            console.log(e);
            Swal.fire({
                title: 'Error',
                text: 'There was an error while saving your rec.',
                icon: 'error',
                padding: '2em',
            });
        }
    };

    return (
        <div className="panel ">
            <label className="text-lg text-center mx-auto block w-1/2">Roman Önerisi</label>
            <form className="form flex flex-col w-full mt-4  items-start gap-4  ">
                <div className="flex flex-row w-full justify-between">
                    <div className="flex flex-col justify-between gap-2 w-1/3">
                        <label>Öneri Başlığı</label>
                        <input name="novel_recTitle" type="text" placeholder="..." className="form-input" required onChange={onChange} value={newNovelRec.novel_recTitle} />
                        <label>Öneri Kısa Bilgi</label>
                        <input name="novel_summaryInfo" type="text" placeholder="..." className="form-input" required onChange={onChange} value={newNovelRec.novel_summaryInfo} />
                        {/* <label>Roman Adı</label>
                        <input name="novel_name" type="text" placeholder="..." className="form-input" required onChange={onChange} value={newNovelRec.novel_name} /> */}
                        {/* <label htmlFor="ctnSelect1">Roman Yazarı</label>
                        <Select isSearchable placeholder="Yazar seçiniz" onChange={onSelectChange} options={formattedAuthors} /> */}
                        <label htmlFor="ctnSelect2">Roman Temaları</label>
                        <TagsInput value={themes} onChange={setThemes} name="themes" placeHolder="Tema giriniz" />
                    </div>

                    <div className="flex flex-col gap-2   w-2/6">
                        <label htmlFor="ctnSelect1">Roman Kategorisi</label>
                        <Select closeMenuOnSelect={false} className="text-white-dark " isMulti options={options} placeholder="Kategori Seçiniz..." onChange={selectOnChange} />
                        <div className="flex flex-col  flex-wrap mt-4">
                            <span>Seçilen Kategoriler</span>
                            {Array.isArray(newNovelRec.novel_bookCategory) && newNovelRec.novel_bookCategory.length > 0
                                ? newNovelRec.novel_bookCategory.map((item: any) => <span key={item}>{item}</span>)
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

export default AddNovelRecommendation;
