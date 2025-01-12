import JoditEditor from 'jodit-react';
import 'jodit';
import { useMemo, useRef, useState } from 'react';
import ImageCropper from '../../ImageCropper/ImageCropper';
import novelCategoryData from "../../../utils/novelCategoryData.json";
import { WithContext as ReactTags } from 'react-tag-input';
import { storage,ref,uploadBytes,getDownloadURL } from "../../../firebase/firebase";
type Props = {
    placeholder?: string;
}
type novelCategoryType = {
    id: number;
    name: string;
    description: string;
}

interface Tag {
    id: string;
    text: string;
    className?: string; // className'ı opsiyonel olarak ekliyoruz
}
const AddNovelReview: React.FC<Props> = ({ placeholder }) => {
    const editor = useRef<any>(null);
    const [content, setContent] = useState('');
    const [preview, setPreview] = useState<string | null>(null);
    const [newNovelReview, setNewNovelReview] = useState({
        novel_id: new Date().getTime() + Math.random().toString(24),
        novel_name: "",
        novel_headImage: "",
        novel_reviewTitle: "",
        body: "",
        category_id: "",
        subCategory_id: "",
        subCategory_name: "",
        author_id: "",
        status: "",
        tags: [],
        url: "",
        bookauthor_id: "",
        bookauthor_name: "",
        comments: [],
        likes: [],
        dislikes: [],
        view_count: 0,
        createdAt: "",
        updatedAt: "",
        rating: 0,
        novel_bookCategory: ""

    });


    const onChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
        const { value, name } = e.target;
        setNewNovelReview((pre) => ({ ...pre, [name]: value }));
    }

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

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
          novel_headImage: fileURL
        }));
  
        // Görselin önizlemesini göster
        setPreview(URL.createObjectURL(file));
      } catch (error) {
        console.error("Error uploading file: ", error);
      }
    };

    const [tags, setTags] = useState<Tag[]>([]);

    // Etiket ekleme fonksiyonu
    const handleAddTag = (newTag: string) => {
        setTags((prevTags) => [
            ...prevTags,
            { id: newTag, text: newTag, className: 'custom-class' }, // className ekliyoruz
        ]);
    };

    // Etiket silme fonksiyonu
    const handleDeleteTag = (i: number) => {
        setTags(tags.filter((tag, index) => index !== i));
    };

    // Etiketlerin görüntüleneceği liste
    const tagsList = tags.map((tag) => ({
        id: tag.id,
        text: tag.text,
        className: tag.className, // className'ı da ekliyoruz
    }));

    const formSubmit = (e: React.FormEvent<HTMLFormElement>) => {
     e.preventDefault();
    }
    
    console.log(newNovelReview);

    return (
        <div className="panel ">
            <label className="text-lg text-center mx-auto block w-1/2">Roman İncelemesi</label>
            <form className='form flex flex-row w-full  items-start gap-4 justify-between' onSubmit={formSubmit}>
                <div className='flex flex-col justify-between w-3/1'>
                    <label>İnceleme Başlığı</label>
                    <input name='novel_reviewTitle' type="text" placeholder="..." className="form-input mb-4" required onChange={onChange} value={newNovelReview.novel_reviewTitle}/>
                    <label htmlFor="ctnSelect2">Kitap Yazarı</label>
                    <select id="ctnSelect1" className="form-multiselect w-96 text-white-dark" name='bookauthor_name' onChange={onChange} required value={newNovelReview.bookauthor_name}>
                        <option>Tag seçiniz</option>
                        <option>One</option>
                        <option>Two</option>
                        <option>Three</option>
                    </select>
                    <div className="my-6">
                        <label htmlFor="ctnFile">Roman Görseli</label>
                        <input
                            id="ctnFile"
                            type="file"
                            className="form-input file:py-2 file:px-4 w-60 file:border-0 file:font-semibold p-0 file:bg-primary/90 ltr:file:mr-5 rtl:file-ml-5 file:text-white file:hover:bg-primary"
                            required
                            accept="image/*"
                            name='novel_headImage'
                            onChange={handleFileChange}
                            value={newNovelReview.novel_headImage}
                        />
                        {preview && <img id="previewImg" src={preview} alt="Image Preview" className="mt-4 w-32 h-32 object-cover" />}
                    </div>
                    <JoditEditor
                        ref={editor}
                        value={content}
                        config={config}
                        onBlur={(newContent) => setContent(newContent)} // preferred to use only this option to update the content for performance reasons
                        onChange={(newContent) => { }}
                    />
                    <button type="submit" className="btn btn-success mt-6 w-20">
                        Kaydet
                    </button>
                </div>

                <div className="flex flex-col  justify-between  gap-6 w-2/6">
                    <div className='w-full'>
                        <label htmlFor="ctnSelect1">Roman Kategorisi</label>
                        <select  name="novel_bookCategory" id="ctnSelect1" multiple className="form-multiselect text-white-dark " onChange={onChange} required>
                            <option>Kategori seçiniz...</option>
                            {novelCategoryData.categories.map((item: novelCategoryType) => (
                                <option value={newNovelReview.novel_bookCategory} key={item.id}>{item.name}</option>
                            ))}
                        </select>
                        <div>Seçilen Kategoriler</div>
                    </div>
                    <label className="block text-lg font-medium text-gray-700">Taglar</label>
                    <ReactTags
                        tags={tagsList}
                        suggestions={[]}
                        handleDelete={handleDeleteTag}
                        handleAddition={(tag) => handleAddTag(tag.text)}
                        inputFieldPosition="bottom"
                        autocomplete
                        placeholder="tag ekleyin"
                    />
                    <div className="mt-4">
                        <ul>
                            {tags.map((tag, index) => (
                                <li key={index}>{tag.text}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default AddNovelReview;
