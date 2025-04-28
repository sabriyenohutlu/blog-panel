import React from 'react';
import JoditEditor from 'jodit-react';
import 'jodit';
import { useEffect, useMemo, useRef, useState } from 'react';
import Swal from 'sweetalert2';
import { AppDispatch } from 'store';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPostCategories } from '../../store/postCategorySlice';
import { collection, doc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { TagsInput } from 'react-tag-input-component';
import Select, { SingleValue, ActionMeta } from 'react-select';
import { getOptionsByCategory, groupBy } from '../../utils/groupByFunction';

type NewBlogType = {
    blog_id: number;
    blog_title: string;
    blog_headImage: string;
    blog_summaryInfo: string;
    body: string;
    category_id: number;
    category_name: string;
    subCategory_id: number;
    subCategory_name: string;
    author_id: string;
    status: string;
    tags: string[];
    blog_category: string[];
    url: string;
    blog_recordedDate: any;
    comments: string[];
    likes: number;
    author_name: string;
    dislikes: number;
    pinned: boolean;
    subCategory_title: string;
    view_count: number;
    category_title: string;
    createdAt: any;
    updatedAt: any;
    rating: number;
};
type Props = {
    placeholder?: string;
};

const AddBlog: React.FC<Props> = ({ placeholder }) => {
    const editor = useRef<any>(null);
    const [content, setContent] = useState('');
    const dispatch = useDispatch<AppDispatch>();
    const [uploading, setUploading] = useState(false);
    const thisUser = useSelector((state: any) => state.users.user);
    const postCategories = useSelector((state: any) => state.postCategories.postCategories);
    const [selectedOptions, setSelectedOptions] = useState<any[]>([]);

    const [newBlog, setNewBlog] = useState({
        blog_id: 0,
        blog_title: '',
        blog_headImage: '',
        blog_summaryInfo: '',
        blog_category: [],
        body: '',
        category_id: 218526,
        subCategory_id: 218501,
        category_name: 'blog',
        author_name: '',
        subCategory_name: '',
        author_id: '',
        status: '',
        pinned: false,
        tags: [],
        url: '',
        blog_recordedDate: new Date(),
        comments: [],
        likes: 0,
        dislikes: 0,
        category_title: 'blog',
        view_count: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        rating: 0,
    });

    useEffect(() => {
        dispatch(fetchPostCategories());
    }, [dispatch]);

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

    const groupNames = useMemo(() => groupBy(postCategories, 'whatsCategory'), [postCategories]);
    const blogOptions: any = useMemo(() => getOptionsByCategory(groupNames, 'Blog'), [groupNames]);

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

        setNewBlog((prev) => ({
            ...prev,
            [name]: newValue,
        }));
    };

    const selectOnChange = (e: any) => {
        setSelectedOptions(e);
        setNewBlog((prev) => ({
            ...prev,
            blog_category: e.map((item: any) => item.label),
        }));
    };

    const formSubmit = async (e: React.MouseEvent<HTMLButtonElement>, status: string) => {
        e.preventDefault();

        const post_id = Math.floor(100000 + Math.random() * 900000).toString();
        const blogRef = doc(db, 'blog', post_id);
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

        const finalUrlTitle = createUrlTitle(newBlog.blog_title);
        try {
            // b = await uploadImage(urledTitle);
            await setDoc(blogRef, {
                ...newBlog,
                url: finalUrlTitle, // URL'yi formdan alıp Firestore'a ekle
                createdAt: now,
                updatedAt: now,
                tags: tags,
                blog_id: post_id,
                status: status,
                author_id: author,
                author_name: thisUser?.displayName,
            });

            // Alt koleksiyon (reviewBody) ekleme
            const blogBodyRef = collection(blogRef, 'blogBody');
            await setDoc(doc(blogBodyRef, post_id), {
                body: content,
            });

            Swal.fire({
                title: 'Blog Kaydedildi',
                text: 'Blog Başarıyla Kaydedildi!',
                icon: 'success',
                padding: '2em',
            });
            setNewBlog({
                blog_id: 0,
                blog_title: '',
                blog_headImage: '',
                blog_summaryInfo: '',
                body: '',
                blog_category: [],
                category_id: 218526,
                author_name: '',
                subCategory_id: 218501,
                category_name: 'blog',
                subCategory_name: '',
                author_id: '',
                status: '',
                pinned: false,
                tags: [],
                url: '',
                blog_recordedDate: new Date(),
                comments: [],
                likes: 0,
                dislikes: 0,
                category_title: 'blog',
                view_count: 0,
                createdAt: new Date(),
                updatedAt: new Date(),
                rating: 0,
            });
            setTags([]);
            setContent('');
            setUploading(false);
            // Başarılı işlem sonrası yapılacaklar
            console.log('Blog has been successfully submitted!');
            setUploading(false);
        } catch (e) {
            console.log(e);
            Swal.fire({
                title: 'Error',
                text: 'There was an error while saving your blog.',
                icon: 'error',
                padding: '2em',
            });
        }
    };

    return (
        <div className="panel">
            <label className="text-lg text-center mx-auto block w-1/2">Blog Ekle</label>
            <form className="form flex flex-col w-full mt-4 items-start gap-4">
                <div className="flex flex-row w-full justify-between">
                    <div className="flex flex-col justify-between gap-2 w-1/2">
                        <label>Blog Başlığı</label>
                        <input name="blog_title" type="text" placeholder="Blog Başlığı Giriniz" className="form-input" required onChange={onChange} value={newBlog.blog_title} />
                        <label>Özet Bilgi</label>
                        <input name="blog_summaryInfo" type="text" placeholder="Özet bilgi" className="form-input" onChange={onChange} value={newBlog.blog_summaryInfo} />
                    </div>
                    <div className="flex flex-col gap-2   w-2/6">
                        <label htmlFor="ctnSelect1">Blog Kategorisi</label>
                        <Select value={selectedOptions} closeMenuOnSelect={false} className="text-white-dark " isMulti onChange={selectOnChange} options={blogOptions} placeholder="Kategori Seçiniz..." />
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

export default AddBlog;
