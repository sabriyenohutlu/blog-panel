import React, { useEffect } from 'react';
import JoditEditor from 'jodit-react';
import 'jodit';
import { useMemo, useRef, useState } from 'react';
import novelCategoryData from '../../utils/novelCategoryData.json';
import authorsData from '../../utils/authorsData.json';
import { collection, doc, setDoc, Timestamp } from 'firebase/firestore';
import { db, getDownloadURL, ref, storage, uploadBytes } from '../../firebase';
import Select, { SingleValue, ActionMeta } from 'react-select';
import periodData from '../../utils/periodData.json';
import Swal from 'sweetalert2';
import { TagsInput } from 'react-tag-input-component';
import biographyCategoryData from '../../utils/biographyCategoryData.json';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from 'store';
import { fetchPostCategories } from '../../store/postCategorySlice';
type NewPoetryType = {
    poetry_id: number;
    poetry_name: string;
    poetry_headImage: string;
    poetry_title: string;
    poetry_summaryInfo: string;
    category_id: number; //307123
    subCategory_id: number; //307101
    subCategory_name: string;
    author_id: string;
    body: string;
    status: string;
    tags: string[]; //gönderirken tags ekle yolla
    poetryauthor_id: string;
    poetryauthor_name: string;
    poetry_recordedDate: any;
    comments: string[];
    likes: number;
    dislikes: number;
    url: string;
    view_count: number;
    createdAt: any;
    updatedAt: any;
    poetryOfWho: string;
    rating: number;
    poetry_category: string[];
    themes: string[];
};
type Props = {
    placeholder?: string;
};
interface AuthorOption {
    value: string;
    label: string;
    author_id: number;
}
interface Tag {
    id: string;
    text: string;
    className: string; // className'ı opsiyonel olarak ekliyoruz
}
const AddPoetry: React.FC<Props> = ({ placeholder }) => {
    const editor = useRef<any>(null);
    const [content, setContent] = useState('');
    const [selectedImage, setSelectedImage] = useState<number | null>(0);
    const [preview, setPreview] = useState<string | null>(null);
    const dispatch = useDispatch<AppDispatch>();
    const postCategories = useSelector((state: any) => state.postCategories.postCategories);
    const [uploading, setUploading] = useState(false);
    const [newPoetry, setNewPoetry] = useState({
        poetry_id: 0,
        poetry_name: '',
        poetry_headImage: '',
        poetry_title: '',
        poetry_summaryInfo: '',
        category_id: 307123, //307123
        subCategory_id: 307101, //307101
        subCategory_name: '',
        author_id: '',
        poetryOfWho: '',
        body: '',
        status: '',
        tags: [], //gönderirken tags ekle yolla
        poetryauthor_id: '',
        poetryauthor_name: '',
        poetry_recordedDate: new Date(),
        comments: [],
        likes: 0,
        dislikes: 0,
        url: '',
        view_count: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        rating: 0,
        poetry_category: [],
        themes: [],
    });

    const thisUser = useSelector((state: any) => state.users.user);

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
    }, [dispatch]);
    const [tags, setTags] = useState<string[]>([]);
    const [themes, setThemes] = useState<string[]>([]);

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

        setNewPoetry((prev) => ({
            ...prev,
            [name]: newValue,
        }));
    };

    let groupNames = postCategories.reduce((result, item) => {
        result[item.whatsCategory] = []
        return result;
      }, {});
    
    
      Object.keys(groupNames).forEach(whatsCategory => {
        let findCategories = postCategories.filter(i => i.whatsCategory == whatsCategory);
        groupNames[whatsCategory] =  Object.values(findCategories);
      });

        const options = groupNames["Şiir"]
       ?.map(({ postCategory_name }) => ({
           value: postCategory_name,
          label: postCategory_name,
        }));
    const selectOnChange = (e: any) => {
        setNewPoetry((prev) => ({
            ...prev,
            story_category: e.map((item: any) => item.label),
        }));
    };

    const formSubmit = async (e: React.MouseEvent<HTMLButtonElement>, status: string) => {
        e.preventDefault();

        const post_id = Math.floor(100000 + Math.random() * 900000).toString();
        const poetryRef = doc(db, 'poetry', post_id);
        setUploading(true);
        let urledTitle = '';
        const author = thisUser?.uid;
        const now = new Date();

        const regex: RegExp = /[^a-zA-Z0-9çğıİöşüÇĞIÖŞÜ-\s]/g;

        const createUrlTitle = (title: string) => {
            const post_id = Math.floor(100000 + Math.random() * 900000).toString(); // Post id oluşturuluyor
            const lowerCasedTitle = title.trim().toLowerCase().split(' ').join('-'); // Başlığı küçük harfe dönüştürüp, boşlukları tireye çevir
            const englishedTitle = lowerCasedTitle.replace(/ı/g, 'i').replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ö/g, 'o').replace(/ç/g, 'c'); // Türkçe karakterleri İngilizce'ye dönüştür

            const urledTitle = englishedTitle.replace(regex, ''); // Regex ile geçersiz karakterleri kaldır
            return { urledTitle, post_id }; // Her iki değeri döndürüyoruz
        };

        const finalUrlTitle = createUrlTitle(newPoetry.poetry_title);
        try {
            // b = await uploadImage(urledTitle);
            await setDoc(poetryRef, {
                ...newPoetry,
                url: finalUrlTitle, // URL'yi formdan alıp Firestore'a ekle
                createdAt: now,
                updatedAt: now,
                themes: themes,
                tags: tags,
                poetry_id: post_id,
                status: status,
                author_id: author
            });

            // Alt koleksiyon (reviewBody) ekleme
            const poetryBodyRef = collection(poetryRef, 'poetryBody');
            await setDoc(doc(poetryBodyRef,post_id), {
                body: content,
            });

            Swal.fire({
                title: 'Saved successfully',
                text: 'Your poetry been saved!',
                icon: 'success',
                padding: '2em',
            });
            setNewPoetry({
                poetry_id: 0,
                poetry_name: '',
                poetry_headImage: '',
                body: '',
                poetry_title: '',
                poetry_summaryInfo: '',
                category_id: 307123, //307123
                subCategory_id: 307101, //307101
                subCategory_name: '',
                author_id: '',
                status: '',
                tags: [], //gönderirken tags ekle yolla
                poetryauthor_id: '',
                poetryauthor_name: '',
                poetry_recordedDate: new Date(),
                comments: [],
                poetryOfWho: '',
                likes: 0,
                dislikes: 0,
                url: '',
                view_count: 0,
                createdAt: new Date(),
                updatedAt: new Date(),
                rating: 0,
                poetry_category: [],
                themes: [],
            });
            setThemes([]);
            setTags([]);
            setContent('');
            setUploading(false);
            // Başarılı işlem sonrası yapılacaklar
            console.log('Poetry has been successfully submitted!');
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

    console.log(newPoetry);

    return (
        <div className="panel ">
            <label className="text-lg text-center mx-auto block w-1/2">Şiir</label>
            <form className="form flex flex-col w-full mt-4  items-start gap-4  ">
                <div className="flex flex-row w-full justify-between">
                    <div className="flex flex-col justify-between gap-2 w-2/6">
                        <label>Şiir Başlığı</label>
                        <input name="poetry_title" type="text" placeholder="..." className="form-input" required onChange={onChange} value={newPoetry.poetry_title} />
                        {/* <label>Özet Bilgi</label>
                        <input name="poetry_summaryInfo" type="text" placeholder="..." className="form-input " required onChange={onChange} value={newPoetry.poetry_summaryInfo} /> */}
                        <label>Şair Adı</label>
                        <input name="poetryOfWho" type="text" placeholder="..." className="form-input" required onChange={onChange} value={newPoetry.poetryOfWho} />

                        <label htmlFor="ctnSelect2">Şiir Temaları</label>
                        <TagsInput value={themes} onChange={setThemes} name="themes" placeHolder="Tema giriniz" />
                        {/* <label htmlFor="ctnSelect2">Roman Temaları</label>
                <TagsInput value={themes} onChange={setThemes} name="themes" placeHolder="Tema giriniz" /> */}
                    </div>

                    <div className="flex flex-col gap-2   w-2/6">
                        <label htmlFor="ctnSelect1">Şiir Kategorisi</label>
                        <Select closeMenuOnSelect={false} className="text-white-dark " isMulti options={options} placeholder="Kategori Seçiniz..." onChange={selectOnChange} />
                        <div className="flex flex-col  flex-wrap mt-4">
                            <div className="flex flex-row justify-between">
                                <label>Seçilen Kategoriler</label>
                               
                            </div>

                            {Array.isArray(newPoetry.poetry_category) && newPoetry.poetry_category.length > 0 ? newPoetry.poetry_category.map((item: any) => <span key={item}>{item}</span>) : ''}
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

export default AddPoetry;
