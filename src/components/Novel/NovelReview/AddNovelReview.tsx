import JoditEditor from 'jodit-react';
import 'jodit';
import { useMemo, useRef, useState } from 'react';
import ImageCropper from '../../ImageCropper/ImageCropper';
import novelCategoryData from '../../../utils/novelCategoryData.json';
import { TagsInput } from 'react-tag-input-component';
import authorsData from '../../../utils/authorsData.json';
import { doc, Timestamp } from 'firebase/firestore';
import { db, getDownloadURL, ref, storage, uploadBytes } from '../../../firebase';
import Select, { SingleValue } from 'react-select';
import periodData from '../../../utils/periodData.json';

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
    const [preview, setPreview] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [newNovelReview, setNewNovelReview] = useState({
        novel_id: 0,
        novel_name: '',
        novel_headImage: '',
        novel_reviewTitle: '',
        novel_summaryInfo: '',
        body: '',
        category_id: 176816,
        subCategory_id: 176801,
        subCategory_name: 'novelReview',
        author_id: '',
        status: 'pending',
        tags: [],//gönderirken tags ekle yolla
        url: '',
        bookauthor_id: '',
        bookauthor_name: '',
        novel_recordedDate: Timestamp.now(),
        comments: [],
        likes: 0,
        dislikes: 0,
        view_count: 0,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        rating: 0,
        novel_bookCategory: [],
        period: '',
    });

  

   

    const onAuthorChange = (selectedOption: SingleValue<{ value: string; label: string; author_id: number }>) => {
        if (selectedOption) {
            setNewNovelReview((prev: any) => ({
                ...prev,
                bookauthor_name: selectedOption.value,
                bookauthor_id: selectedOption.author_id, // ID'yi kaydet
            }));
        }
    };

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

    const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
   
         if (name === 'novel_bookCategory') {
            const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
            setNewNovelReview((prev:any)=>({
                ...prev,
                [name]: selectedOptions
            }))
        } 
        else {
            // Diğer inputlar için normal şekilde güncelleme yapılır
            setNewNovelReview((prev:any) => ({
                ...prev,
                [name]: value,
                tags: tags
            }));
        }
    };

    const formSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (newNovelReview.novel_headImage) {
            const post_id = Math.floor(100000 + Math.random() * 900000).toString();
            const novelReviewRef = doc(db, 'novelReview', post_id);
            setUploading(true);
            const now = Timestamp.now();
            let a, b, c;

            var lowerCasedTitle = newNovelReview.novel_name.trim().toLowerCase().split(' ').join('-');
            var urledTitle = '';
            const regex = /[^a-zA-Z0-9çğıİöşüÇĞIÖŞÜ-\s]/g;

            const titleArray = () => {
                for (let i = 1; i <= lowerCasedTitle.length; i++) {
                    var englished = lowerCasedTitle.substring(0, i).replace(/ı/g, 'i').replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ö/g, 'o').replace(/ç/g, 'c');
                    urledTitle = englished.replace(regex, '');
                }
            };
            titleArray();
            try {
                // b = await uploadImage(urledTitle);
                setUploading(false);
            } catch (e) {
                console.log(e);
                window.alert(e);
            }
        }
    };

    console.log(newNovelReview);

    return (
        <div className="panel ">
            <label className="text-lg text-center mx-auto block w-1/2">Roman İncelemesi</label>
            <form className="form flex flex-row w-full  items-start gap-4 justify-between" onSubmit={formSubmit}>
                <div className="flex flex-col justify-between gap-2 w-3/1">
                    <label>İnceleme Başlığı</label>
                    <input name="novel_reviewTitle" type="text" placeholder="..." className="form-input" required onChange={onChange} value={newNovelReview.novel_reviewTitle} />
                    <label>Özet Bilgi</label>
                    <input name="novel_summaryInfo" type="text" placeholder="..." className="form-input" required onChange={onChange} value={newNovelReview.novel_summaryInfo} />
                    <label htmlFor="ctnSelect1">Kitap Yazarı</label>
                    <Select isSearchable placeholder="Yazar seçiniz" onChange={onAuthorChange} options={authorsData} />
                    <label htmlFor="ctnSelect2">Roman Dönemi</label>
                    <select onChange={onChange} id="ctnSelect1" className="form-multiselect  w-96 text-white-dark" name="period" required value={newNovelReview.period}>
                        <option>Dönem seçiniz</option>
                        {periodData.periods.map((item: any, key: number) => (
                            <>
                                <option title={item.description} key={item.id}>
                                    {item.name} {item.startYear} {item.endYear} {}
                                </option>
                            </>
                        ))}
                    </select>
                    <div className="my-6">
                        <label htmlFor="ctnFile">Roman Görseli</label>
                        <input
                            id="ctnFile"
                            type="file"
                            className="form-input file:py-2 file:px-4 w-60 file:border-0 file:font-semibold p-0 file:bg-primary/90 ltr:file:mr-5 rtl:file-ml-5 file:text-white file:hover:bg-primary"
                            required
                            accept="image/*"
                            name="novel_headImage"
                            // onChange={handleFileChange}
                            value={newNovelReview.novel_headImage}
                        />
                        {preview && <img id="previewImg" src={preview} alt="Image Preview" className="mt-4 w-32 h-32 object-cover" />}
                    </div>

                    <JoditEditor
                        ref={editor}
                        value={content}
                        config={config}
                        onBlur={(newContent) => setContent(newContent)} // preferred to use only this option to update the content for performance reasons
                        onChange={(newContent) => {}}
                    />
                    <button type="submit" className="btn btn-success mt-6 w-20">
                        Kaydet
                    </button>
                </div>

                <div className="flex flex-col gap-8  justify-between  w-2/6">
                    <div className="w-full ">
                        <label htmlFor="ctnSelect1">Roman Kategorisi</label>
                        <select name="novel_bookCategory" id="ctnSelect1" multiple className="form-multiselect text-white-dark h-40" onChange={onChange} required>
                            <option>Kategori seçiniz...</option>
                            {novelCategoryData.categories.map((item: novelCategoryType) => (
                                <option value={item.name} key={item.id}>
                                    {item.name}
                                </option>
                            ))}
                        </select>
                        <div className="flex flex-col flex-wrap mt-4">
                            <span>Seçilen Kategoriler</span>
                            {Array.isArray(newNovelReview.novel_bookCategory) && newNovelReview.novel_bookCategory.length > 0
                                ? newNovelReview.novel_bookCategory.map((item: any) => <span key={item}>{item}</span>)
                                : ''}
                        </div>
                    </div>
                    <div className="w-full">
                        <label>Taglar</label>
                        <TagsInput value={tags} onChange={setTags} name="fruits" placeHolder="Tag giriniz" />
                    </div>
                </div>
            </form>
        </div>
    );
};

export default AddNovelReview;
