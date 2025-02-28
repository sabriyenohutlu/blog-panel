import React from 'react';
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
type NewBiographyType = {
    biography_id: number;
    biograph_headImage: string;
    biography_title: string;
    biography_summaryInfo: string;
    category_id: number;
    subCategory_id: number;
    subCategory_name: string;
    author_id: string;
    status: string;
    tags: string[]; //gönderirken tags ekle yolla
    biography_recordedDate: any;
    comments: string[];
    likes: number;
    dislikes: number;
    url: string;
    view_count: number;
    createdAt: any;
    updatedAt: any;
    bioOfWho: string;
    rating: number;
    themes: string[];
    period: string;
    excerpt: string;
    location: string;
    famousWorks: string[];
    biography_category: string;
    year_birth: string;
    year_death: string;
};
type Props = {
    placeholder?: string;
};
const AddBiography: React.FC<Props> = ({ placeholder }) => {
    const editor = useRef<any>(null);
    const [content, setContent] = useState('');
    const [selectedImage, setSelectedImage] = useState<number | null>(0);
    const [preview, setPreview] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [newBiography, setNewBiography] = useState({
        biography_id: 0,
        biograph_headImage: '',
        biography_title: '',
        biography_summaryInfo: '',
        category_id: 429117,
        subCategory_id: 429101,
        subCategory_name: '',
        bioOfWho: '',
        author_id: '',
        status: '',
        tags: [], //gönderirken tags ekle yolla
        biography_recordedDate: new Date(),
        comments: [],
        likes: 0,
        dislikes: 0,
        url: '',
        body: '',
        view_count: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        rating: 0,
        themes: [],
        period: '',
        excerpt: '',
        location: '',
        famousWorks: [],
        biography_category: '',
        year_birth: '',
        year_death: '',
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
    const [tags, setTags] = useState<string[]>([]);
    const [themes, setThemes] = useState<string[]>([]);
    const onSelectChange = (selectedOption: SingleValue<AuthorOption>, actionMeta: ActionMeta<AuthorOption>) => {
        // Seçilen seçenek varsa
        if (selectedOption) {
            setNewBiography((prev: any) => ({
                ...prev,
                bookauthor_name: selectedOption.value, // Seçilen yazarın adı
                bookauthor_id: selectedOption.author_id, // Yazarın ID'si
            }));
        }
    };

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

        setNewBiography((prev) => ({
            ...prev,
            [name]: newValue,
        }));
    };

    const formSubmit = async (e: React.MouseEvent<HTMLButtonElement>, status: string) => {
        e.preventDefault();

        const post_id = Math.floor(100000 + Math.random() * 900000).toString();
        const biographyRef = doc(db, 'biography', post_id);
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

        const finalUrlTitle = createUrlTitle(newBiography.biography_title);
        try {
            // b = await uploadImage(urledTitle);
            await setDoc(biographyRef, {
                ...newBiography,
                url: finalUrlTitle, // URL'yi formdan alıp Firestore'a ekle
                createdAt: now,
                updatedAt: now,
                themes: themes,
                tags: tags,
                biography_id: post_id,
                status: status,
            });

            // Alt koleksiyon (reviewBody) ekleme
            const bioBodyRef = collection(biographyRef, 'bioBody');
            await setDoc(doc(bioBodyRef), {
                body: content,
            });

            Swal.fire({
                title: 'Saved successfully',
                text: 'Your novel rec has been saved!',
                icon: 'success',
                padding: '2em',
            });
            setNewBiography({
                biography_id: 0,
                biograph_headImage: '',
                biography_title: '',
                biography_summaryInfo: '',
                category_id: 429117,
                subCategory_id: 429101,
                subCategory_name: '',
                author_id: '',
                bioOfWho: '',
                status: '',
                tags: [], //gönderirken tags ekle yolla
                biography_recordedDate: new Date(),
                comments: [],
                likes: 0,
                dislikes: 0,
                url: '',
                body: '',
                view_count: 0,
                createdAt: new Date(),
                updatedAt: new Date(),
                rating: 0,
                themes: [],
                period: '',
                excerpt: '',
                location: '',
                famousWorks: [],
                biography_category: '',
                year_birth: '',
                year_death: '',
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

    console.log(newBiography);

    return (
        <div className="panel ">
            <label className="text-lg text-center mx-auto block w-1/2">Biyografi</label>
            <form className="form flex flex-col w-full mt-4  items-start gap-4  ">
                <div className="flex flex-row w-full justify-between">
                    <div className="flex flex-col justify-between gap-2 w-3/6">
                        <label>Biyografi Başlığı</label>
                        <input name="biography_title" type="text" placeholder="..." className="form-input" required onChange={onChange} value={newBiography.biography_title} />
                        <label>Özet Bilgi</label>
                        <input name="biography_summaryInfo" type="text" placeholder="..." className="form-input " required onChange={onChange} value={newBiography.biography_summaryInfo} />
                        <label>Yazar Adı</label>
                        <input name="bioOfWho" type="text" placeholder="..." className="form-input" required onChange={onChange} value={newBiography.bioOfWho} />
                        <label>Yazarın Ünlü İşleri</label>
                        <input name="famousWorks" type="text" placeholder="" className="form-input" required onChange={onChange} value={newBiography.famousWorks} />
                        <label>Yazarın Doğum Yılı</label>
                        <input type="number" id="year" name='year_birth' value={newBiography.year_birth} onChange={onChange} min="1900" max={new Date().getFullYear()} placeholder="" className="form-input w-24 border p-2 rounded" />
                        <label>Yazarın Ölüm Yılı</label>
                        <input type="number" id="year" name='year_death' value={newBiography.year_death} onChange={onChange} min="1900" max={new Date().getFullYear()} placeholder="" className="form-input w-24 border p-2 rounded" />
                        {/* <label htmlFor="ctnSelect2">Roman Temaları</label>
                        <TagsInput value={themes} onChange={setThemes} name="themes" placeHolder="Tema giriniz" /> */}
                    </div>

                    <div className="flex flex-col gap-2   w-2/6">
                        <label htmlFor="ctnSelect1">Biyografi Kategorisi</label>
                        <select name="biography_category" id="ctnSelect1" multiple className="form-multiselect text-white-dark h-40" onChange={onChange} required>
                            <option>Kategori seçiniz...</option>
                            {biographyCategoryData.categories.map((item: any) => (
                                <option value={item.name} key={item.id}>
                                    {item.name}
                                </option>
                            ))}
                        </select>
                        <div className="flex flex-col  flex-wrap mt-4">
                            <div className="flex flex-row justify-between">
                                <label>Seçilen Kategoriler</label>
                                <button className="btn btn-info btn-sm">Kategorileri Kaldır</button>
                            </div>

                            {Array.isArray(newBiography.biography_category) && newBiography.biography_category.length > 0
                                ? newBiography.biography_category.map((item: any) => <span key={item}>{item}</span>)
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

export default AddBiography;
