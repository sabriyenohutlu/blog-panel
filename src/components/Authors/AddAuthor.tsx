import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useDispatch, useSelector } from 'react-redux';
import Select, { StylesConfig } from 'react-select';
import { AppDispatch } from 'store';
import { fetchCategories } from '../../store/categorySlice';

const AddAuthor = () => {
    const categories = useSelector((state: any) => state.categories.categories);
    const error = useSelector((state: any) => state.categories.error);
    const dispatch = useDispatch<AppDispatch>();
    const [selectedOptions, setSelectedOptions] = useState<any[]>([]);

    const [newAuthor, setNewAuthor] = useState({
      author_id: "",
      author_name: "",
      created_date: "",
      mainCategory_name: "",
      mainCategory_title: "",
      updated_date: ""
    });

    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    const [loading, setLoading] = useState(false);

    const onChange = (e: any) => {
        const { name, value } = e.target;
        setNewAuthor((prev: any) => ({
            ...prev,
            [name]: value,
        }));
    };

    const options = categories.map((item: any) => ({
        value: item.category_name,
        label: item.category_title,
    }));
    const selectOnChange = (e: any) => {
      setSelectedOptions(e);
      setNewAuthor((prev) => ({
          ...prev,
          mainCategory_name: e.map((item: any) => item.value),
          mainCategory_title: e.map((item: any) => item.label)

      }));
  };
    const formSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const category = String(newAuthor.mainCategory_title || '').trim();
        const categoryName = String(newAuthor.mainCategory_name || '').trim();
        if (!category || !categoryName) {
            Swal.fire({
                title: 'Uyarı!',
                text: 'Lütfen tüm alanları doldurun.',
                icon: 'warning',
                padding: '2em',
            });
            return;
        }
        const id = Math.floor(100000 + Math.random() * 900000).toString();
        const authorRef = doc(db, 'author', id);
        setLoading(true);
        const now = new Date();

        try {
            await setDoc(authorRef, {
                ...newAuthor,
                created_date: now,
                updated_date: now,
                author_id:id
            });
            Swal.fire({
                title: 'Ekleme Başarılı',
                text: 'Yazar Eklendi ',
                icon: 'success',
                padding: '2em',
            });
            setSelectedOptions([]);
            setNewAuthor({
              author_id: "",
              author_name: "",
              created_date: "",
              mainCategory_name: "",
              mainCategory_title: "",
              updated_date: ""
            });
            setLoading(false);
            console.log('author has been successfully submitted!');
        } catch (e) {
            console.log(e);
            Swal.fire({
                title: 'Error',
                text: 'There was an error while saving your author.',
                icon: 'error',
                padding: '2em',
            });
        }
    };

    console.log('newAuthor', newAuthor);

    return (
        <div className="panel ">
            <label className="text-lg text-center mx-auto block w-1/2">Yazar Ekle</label>
            <form className="form flex flex-col w-full mt-4  items-start gap-4  ">
                <div className="flex flex-row w-full justify-between gap-2">
                    <div className="flex flex-col gap-2 w-1/3">
                        <label>Yazar Adı </label>
                        <input name="author_name" type="text" placeholder="Yazar adı Giriniz..." className="form-input" required onChange={onChange} value={newAuthor.author_name} />
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

export default AddAuthor;
