import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import Select, { StylesConfig } from 'react-select';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from 'store';
import { fetchPostCategories } from '../../store/postCategorySlice';
type NewWordType = {
    dailyWord_id: number;
    dailyWord_title: string;
    category_id: number;
    subCategory_id: number;
    subCategory_name: string;
    author_id: number;
    status: string;
    tags: string[];
    dailyWord_authorId: string;
    dailyWord_authorName: string;
    dailyWord_recordedDate: any;
    view_count: number;
    createdAt: any;
    updatedAt: any;
    dailyWord_category: string[]; // Array of category IDs
};
const AddDailyWord: React.FC<any> = () => {
    const [uploading, setUploading] = useState(false);
    const [newWord, setNewWord] = useState<NewWordType>({
        dailyWord_id: 0,
        dailyWord_title: '',
        category_id: 0,
        subCategory_id: 0,
        subCategory_name: '',
        author_id: 0,
        status: 'pending',
        tags: [],
        dailyWord_authorId: '',
        dailyWord_authorName: '',
        dailyWord_recordedDate: '',
        view_count: 0,
        createdAt: '',
        updatedAt: '',
        dailyWord_category: [],
    });
    const dispatch = useDispatch<AppDispatch>();
    const thisUser = useSelector((state: any) => state.users.user);
    const postCategories = useSelector((state: any) => state.postCategories.postCategories);
    useEffect(() => {
        dispatch(fetchPostCategories());
    }, [dispatch]);

    let groupNames = postCategories.reduce((result, item) => {
        result[item.whatsCategory] = []
        return result;
      }, {});
    
    
      Object.keys(groupNames).forEach(whatsCategory => {
        let findCategories = postCategories.filter(i => i.whatsCategory == whatsCategory);
        groupNames[whatsCategory] =  Object.values(findCategories);
      });

        const options = groupNames["Günlük Söz"]
       .map(({ postCategory_name }: { postCategory_name: string }) => ({
           value: postCategory_name,
          label: postCategory_name,
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

        setNewWord((prev) => ({
            ...prev,
            [name]: newValue,
        }));
    };
    const selectOnChange = (e: any) => {
        setNewWord((prev) => ({
            ...prev,
            dailyWord_category: e.map((item: any) => item.label),
        }));
    };

    const formSubmit = async (e: React.MouseEvent<HTMLButtonElement>, status: string) => {
        e.preventDefault();

        const post_id = Math.floor(100000 + Math.random() * 900000).toString();
        const dailwYordRef = doc(db, 'dailyWord', post_id);
        setUploading(true);
        const now = new Date();
        const author = thisUser?.uid;

        try {
            // b = await uploadImage(urledTitle);
            await setDoc(dailwYordRef, {
                ...newWord,
                createdAt: now,
                updatedAt: now,
                dailyWord_recordedDate: now,
                dailyWord_id: post_id,
                status: status,
                author_id: author
            });

            // Alt koleksiyon (reviewBody) ekleme

            Swal.fire({
                title: 'Gönderme Başarılı',
                text: 'Günlük Söz Onaya Gönderildi! ',
                icon: 'success',
                padding: '2em',
            });
            setNewWord({
                dailyWord_id: 0,
                dailyWord_title: '',
                category_id: 0,
                subCategory_id: 0,
                subCategory_name: '',
                author_id: 0,
                status: 'pending',
                tags: [],
                dailyWord_authorId: '',
                dailyWord_authorName: '',
                dailyWord_recordedDate: '',
                view_count: 0,
                createdAt: '',
                updatedAt: '',
                dailyWord_category: [],
            });
            setUploading(false);
            // Başarılı işlem sonrası yapılacaklar
            console.log('word has been successfully submitted!');
            setUploading(false);
        } catch (e) {
            console.log(e);
            Swal.fire({
                title: 'Error',
                text: 'There was an error while saving your word.',
                icon: 'error',
                padding: '2em',
            });
        }
    };
    return (
        <div className="panel ">
            <label className="text-lg text-center mx-auto block w-1/2">Günlük Söz Ekle</label>
            <form className="form flex flex-col w-full mt-4  items-start gap-4  ">
                <div className="flex flex-row w-full justify-between gap-2">
                    <div className="flex flex-col gap-2 w-1/3">
                        <label>Günlük Söz Alanı </label>
                        <input name="dailyWord_title" type="text" placeholder="Günlük Söz Giriniz..." className="form-input" required onChange={onChange} value={newWord.dailyWord_title} />

                        <label>Söz Yazarı</label>
                        <input name="dailyWord_authorName" type="text" placeholder="Söz Yazarı..." className="form-input" required onChange={onChange} value={newWord.dailyWord_authorName} />
                    </div>
                    <div className="flex flex-col gap-2   w-1/3">
                        <label htmlFor="ctnSelect1">Günlük Söz Kategorisi</label>
                        <Select closeMenuOnSelect={false} className="text-white-dark " isMulti options={options} placeholder="Kategori Seçiniz..." onChange={selectOnChange} />
                    </div>
                </div>

                <div>
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

export default AddDailyWord;
