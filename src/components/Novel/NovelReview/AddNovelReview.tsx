import JoditEditor from 'jodit-react';
import 'jodit';
import { useMemo, useRef, useState } from 'react';
interface Props {
    placeholder?: string;
}
const AddNovelReview: React.FC<Props> = ({ placeholder }) => {
    const editor = useRef<any>(null);
    const [content, setContent] = useState('');
    const [preview, setPreview] = useState<string | null>(null);

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
                height: 'auto',
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

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (file) {
            const reader = new FileReader();

            reader.onload = (e) => {
                setPreview(e.target?.result as string);
            };

            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="panel">
            <label className="text-lg text-center mx-auto block w-1/2">Roman İncelemesi</label>
            <form>
                <label>İnceleme Başlığı</label>
                <input type="text" placeholder="..." className="form-input" required />

                <div className="my-6">
                    <label htmlFor="ctnFile">Roman Görseli</label>
                    <input
                        id="ctnFile"
                        type="file"
                        className="form-input file:py-2 file:px-4 file:border-0 file:font-semibold p-0 file:bg-primary/90 ltr:file:mr-5 rtl:file-ml-5 file:text-white file:hover:bg-primary"
                        required
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                    {preview && <img id="previewImg" src={preview} alt="Image Preview" className="mt-4 w-32 h-32 object-cover" />}
                </div>
                <div className="flex my-6 justify-around">
                    <div>
                        <label htmlFor="ctnSelect1">Roman Kategorisi</label>
                        <select id="ctnSelect2" multiple className="form-multiselect text-white-dark" required>
                            <option>Kategori seçiniz...</option>
                            <option>Klasik</option>
                            <option>Gizem</option>
                            <option>Bilim Kurgu</option>
                            <option>Fantastik</option>
                            <option>Romantik </option>
                            <option>Dramatik</option>
                            <option>Tarihi</option>
                            <option>Kurgusal Tarih</option>
                            <option>Macera</option>
                            <option>Psikolojik </option>
                            <option>Distopya </option>
                            <option>Gerilim </option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="ctnSelect1">Tag</label>
                        <select id="ctnSelect1" className="form-select text-white-dark" required>
                            <option>Tag seçiniz</option>
                            <option>One</option>
                            <option>Two</option>
                            <option>Three</option>
                        </select>
                    </div>
                </div>
                <JoditEditor
                    ref={editor}
                    value={content}
                    config={config}
                    onBlur={(newContent) => setContent(newContent)} // preferred to use only this option to update the content for performance reasons
                    onChange={(newContent) => {}}
                />
                <button type="submit" className="btn btn-primary mt-6">
                    Kaydet
                </button>
            </form>
        </div>
    );
};

export default AddNovelReview;
