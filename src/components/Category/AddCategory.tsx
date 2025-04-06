import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import dailyWordCategory from '../../utils/dailyWordCategory.json';
import { useDispatch, useSelector } from 'react-redux';
import Select, { StylesConfig } from 'react-select';
import { AppDispatch } from 'store';
import { fetchCategories } from '../../store/categorySlice';
const AddCategory = () => {
    const categories = useSelector((state: any) => state.categories.categories);
    const error = useSelector((state: any) => state.categories.error);
    const dispatch = useDispatch<AppDispatch>();
    const [selectedOptions, setSelectedOptions] = useState<any[]>([]);

    const [newCategory, setNewCategory] = useState({
        createdAt: '',
        updatedAt: '',
        status: 'pending',
        postCategory_id: 0,
        postCategory_name: '',
        whatsCategory: [],
    });
    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);
    const [loading, setLoading] = useState(false);
    const onChange = (e: any) => {
        const { name, value } = e.target;
        setNewCategory((prev: any) => ({
            ...prev,
            [name]: value,
        }));
    };

    const selectOnChange = (e: any) => {
        setSelectedOptions(e);
        setNewCategory((prev) => ({
            ...prev,
            whatsCategory: e.map((item: any) => item.label),
        }));
    };

    const options = categories.map((item: any) => ({
        value: item.category_name,
        label: item.category_title,
    }));
    const formSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const category = String(newCategory.whatsCategory || '').trim();
        const categoryName = String(newCategory.postCategory_name || '').trim();
        if (!category || !categoryName) {
            Swal.fire({
                title: 'Uyarı!',
                text: 'Lütfen tüm alanları doldurun.',
                icon: 'warning',
                padding: '2em',
            });
            return;
        }
        const post_id = Math.floor(100000 + Math.random() * 900000).toString();
        const postCategoryRef = doc(db, 'postCategory', post_id);
        setLoading(true);
        const now = new Date();

        try {
            await setDoc(postCategoryRef, {
                ...newCategory,
                createdAt: now,
                updatedAt: now,
                status: status,
                postCategory_id: post_id,
            });
            Swal.fire({
                title: 'Ekleme Başarılı',
                text: 'Kategori Eklendi ',
                icon: 'success',
                padding: '2em',
            });
            setSelectedOptions([]);
            setNewCategory({
                postCategory_id: 0,
                status: 'pending',
                createdAt: '',
                updatedAt: '',
                whatsCategory: [],
                postCategory_name: '',
            });
            setLoading(false);
            console.log('kategori has been successfully submitted!');
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
            <label className="text-lg text-center mx-auto block w-1/2">Kategori Ekle</label>
            <form className="form flex flex-col w-full mt-4  items-start gap-4  ">
                <div className="flex flex-row w-full justify-between gap-2">
                    <div className="flex flex-col gap-2 w-1/3">
                        <label>Kategori Adı </label>
                        <input name="postCategory_name" type="text" placeholder="Kategori adı Giriniz..." className="form-input" required onChange={onChange} value={newCategory.postCategory_name} />
                    </div>
                    <div className="flex flex-col gap-2   w-1/3">
                        <label htmlFor="ctnSelect1">Ana Kategori</label>
                        <Select
                            required
                            closeMenuOnSelect={false}
                            className="text-white-dark "
                            onChange={selectOnChange}
                            value={selectedOptions}
                            isMulti
                            options={options}
                            placeholder="Kategori Seçiniz..."
                        />
                    </div>
                </div>
                <div>
                    <div className="flex flex-row gap-2">
                        <button type="submit" className="btn btn-success mt-6 " onClick={(e) => formSubmit(e)}>
                            Kaydet
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default AddCategory;
