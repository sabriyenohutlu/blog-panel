import React from 'react';
import JoditEditor from 'jodit-react';
import 'jodit';
import { useMemo, useRef, useState } from 'react';
import novelCategoryData from '../../utils/novelCategoryData.json';
import authorsData from '../../utils/authorsData.json';
import Swal from 'sweetalert2';
import Select, { SingleValue, ActionMeta } from 'react-select';
import periodData from '../../utils/periodData.json';
import { TagsInput } from 'react-tag-input-component';
import { db, getDownloadURL, ref, storage, uploadBytes } from '../../firebase';
import { collection, doc, setDoc } from 'firebase/firestore';
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
type NewStoryType = {
    story_id: number;
    story_name: string;
    story_headImage: string;
    story_title: string;
    story_summaryInfo: string;
    body: string;
    category_id: number;
    subCategory_id: number;
    subCategory_name: string;
    author_id: number;
    status: string;
    tags: string[];
    url: string;
    storyauthor_id: string;
    storyauthor_name: string;
    story_recordedDate: any;
    comments: string[];
    likes: number;
    dislikes: number;
    view_count: number;
    createdAt: any;
    updatedAt: any;
    rating: number;
    story_category: string[]; // Array of category IDs
    period: string;
    themes: string[];
};
const AddStory: React.FC<Props> = ({ placeholder }) => {
    const editor = useRef<any>(null);
    const [content, setContent] = useState('');
    const [uploading, setUploading] = useState(false);
    const [newStory, setNewStory] = useState({
        story_id: 0,
        story_name: '',
        story_headImage: '',
        story_title: '',
        story_summaryInfo: '',
        body: '',
        category_id: 647586,
        subCategory_id: 647581,
        subCategory_name: '',
        author_id: 0,
        status: 'pending',
        tags: [],
        url: '',
        storyauthor_id: '',
        storyauthor_name: '',
        story_recordedDate: new Date(),
        comments: [],
        likes: 0,
        dislikes: 0,
        view_count: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        rating: 0,
        story_category: [], // Array of category IDs
        period: '',
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

    const [tags, setTags] = useState<string[]>([]);
    const [themes, setThemes] = useState<string[]>([]);

    const onSelectChange = (selectedOption: SingleValue<AuthorOption>, actionMeta: ActionMeta<AuthorOption>) => {
        // Seçilen seçenek varsa
        if (selectedOption) {
            setNewStory((prev: any) => ({
                ...prev,
                bookauthor_name: selectedOption.value, // Seçilen yazarın adı
                bookauthor_id: selectedOption.author_id, // Yazarın ID'si
            }));
        }
    };
    const formattedAuthors = authorsData.authors.map((author: any) => ({
        value: author.bookauthor_name, // label ve value olarak kullanacağımız değer
        label: author.bookauthor_name, // label değeri
        author_id: author.bookauthor_id, // Yazarın ID'si
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

        setNewStory((prev) => ({
            ...prev,
            [name]: newValue,
        }));
    };

    const formSubmit = async (e: React.MouseEvent<HTMLButtonElement>, status: string) => {
        e.preventDefault();

        const post_id = Math.floor(100000 + Math.random() * 900000).toString();
        const storyRef = doc(db, 'story', post_id);
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

        const finalUrlTitle = createUrlTitle(newStory.story_name);
        try {
            // b = await uploadImage(urledTitle);
            await setDoc(storyRef, {
                ...newStory,
                url: finalUrlTitle, // URL'yi formdan alıp Firestore'a ekle
                createdAt: now,
                updatedAt: now,
                tags: tags,
                story_id: post_id,
                status: status,
                themes: themes,
            });

            // Alt koleksiyon (reviewBody) ekleme
            const storyBodyRef = collection(storyRef, 'storyBody');
            await setDoc(doc(storyBodyRef), {
                body: content,
            });

            Swal.fire({
                title: 'Saved successfully',
                text: 'Your story review has been saved!',
                icon: 'success',
                padding: '2em',
            });
            setNewStory({
                story_id: 0,
                story_name: '',
                story_headImage: '',
                story_title: '',
                story_summaryInfo: '',
                category_id: 647586,
                subCategory_id: 647581,
                subCategory_name: '',
                author_id: 0,
                body: '',
                status: 'pending',
                tags: [], //gönderirken tags ekle yolla
                storyauthor_id: '',
                storyauthor_name: '',
                story_recordedDate: new Date(),
                comments: [],
                likes: 0,
                dislikes: 0,
                url: '',
                view_count: 0,
                createdAt: new Date(),
                updatedAt: new Date(),
                rating: 0,
                story_category: [],
                period: '',
                themes: [],
            });
            setTags([]);
            setContent('');
            setUploading(false);
            // Başarılı işlem sonrası yapılacaklar
            console.log('Story has been successfully submitted!');
            setUploading(false);
        } catch (e) {
            console.log(e);
            Swal.fire({
                title: 'Error',
                text: 'There was an error while saving your story.',
                icon: 'error',
                padding: '2em',
            });
        }
    };

    return (
        <div className="panel ">
            <label className="text-lg text-center mx-auto block w-1/2">Hikaye Ekle</label>
            <form className="form flex flex-col w-full mt-4  items-start gap-4  ">
                <div className="flex flex-row w-full justify-between">
                    <div className="flex flex-col justify-between gap-2 w-3/1">
                        <label>Hikaye Başlığı</label>
                        <input name="story_title" type="text" placeholder="..." className="form-input" required onChange={onChange} value={newStory.story_title} />
                        <label>Özet Bilgi</label>
                        <input name="story_summaryInfo" type="text" placeholder="..." className="form-input" required onChange={onChange} value={newStory.story_summaryInfo} />
                        <label>Hikaye Adı</label>
                        <input name="story_name" type="text" placeholder="..." className="form-input" required onChange={onChange} value={newStory.story_name} />
                        <label htmlFor="ctnSelect1">Kitap Yazarı</label>
                        <Select isSearchable placeholder="Yazar seçiniz" onChange={onSelectChange} options={formattedAuthors} />
                        <label htmlFor="ctnSelect2">Hikaye Temaları</label>
                        <TagsInput value={themes} onChange={setThemes} name="themes" placeHolder="Tema giriniz" />
                        <label htmlFor="ctnSelect2">Hikaye Dönemi</label>
                        <select onChange={onChange} id="ctnSelect1" className="form-multiselect  w-96 text-white-dark" name="period" required value={newStory.period}>
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
                        <label htmlFor="ctnSelect1">Hikaye Kategorisi</label>
                        <select name="story_category" id="ctnSelect1" multiple className="form-multiselect text-white-dark h-40" onChange={onChange} required>
                            <option>Kategori seçiniz...</option>
                            {novelCategoryData.categories.map((item: novelCategoryType) => (
                                <option value={item.name} key={item.id}>
                                    {item.name}
                                </option>
                            ))}
                        </select>
                        <div className="flex flex-col  flex-wrap mt-4">
                            <span>Seçilen Kategoriler</span>
                            {Array.isArray(newStory.story_category) && newStory.story_category.length > 0 ? newStory.story_category.map((item: any) => <span key={item}>{item}</span>) : ''}
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

export default AddStory;
