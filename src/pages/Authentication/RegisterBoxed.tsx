import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import IconUser from '../../components/Icon/IconUser';
import IconMail from '../../components/Icon/IconMail';
import IconLockDots from '../../components/Icon/IconLockDots';
import IconGoogle from '../../components/Icon/IconGoogle';
import { auth, signInWithGoogle, logOut, db } from '../../firebase';
import { createUserWithEmailAndPassword, onAuthStateChanged, User, signInWithEmailAndPassword, signOut, UserCredential, getAuth, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

const RegisterBoxed = () => {
    const [user, setUser] = useState<any>({
        name: '',
        email: '',
        password: '',
        authority: 'editor',
        userId: Math.floor(100000 + Math.random() * 900000).toString(),
        createdAt: new Date(),
    });

    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);

    const onChange = (e: any) => {
        const { name, value } = e.target;
        setUser((prev: any) => ({
            ...prev,
            [name]: value,
        }));
    };

    const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null); // Önceki hatayı temizle
        console.log('Form gönderildi, işlem başlatılıyor...');

        let userCredential: UserCredential | null = null;

        // 1️⃣ E-posta formatı doğrulama
        if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(user.email)) {
            setError('Geçersiz e-posta formatı!');
            console.log('E-posta formatı geçersiz!');
            return;
        }
        console.log('E-posta formatı geçerli.');

        try {
            // 2️⃣ Kullanıcıyı Firebase Authentication ile oluştur
            userCredential = await createUserWithEmailAndPassword(auth, user.email, user.password);
            console.log('Kullanıcı başarıyla oluşturuldu:', userCredential.user);
        } catch (error) {
            setError((error as Error).message);
            console.error('Kayıt sırasında hata oluştu:', (error as Error).message);
            return; // Hata olursa işlemi durdur
        }

        try {
            // 3️⃣ Kullanıcı profilini güncelle
            if (userCredential?.user) {
                await updateProfile(userCredential.user, { displayName: user.name });
                console.log('Kullanıcı profili güncellendi:', user.name);
            }
        } catch (error) {
            setError((error as Error).message);
            console.error('Profil güncelleme hatası:', (error as Error).message);
        }

        try {
            // 4️⃣ Firestore'a kullanıcı bilgilerini ekleme
            if (userCredential?.user) {
                await setDoc(doc(db, 'user', userCredential.user.uid), {
                    email: userCredential.user.email,
                    name: user.name, // DisplayName güncellendiği için direkt user.name kullanabiliriz
                    userId: userCredential.user.uid,
                    authority: user.authority,
                    createdAt: user.createdAt,
                });
                console.log("Kullanıcı Firestore'a başarıyla kaydedildi!");
            }
        } catch (error) {
            setError((error as Error).message);
            console.error("Firestore'a ekleme hatası:", (error as Error).message);
            return; // Hata olursa işlemi durdur
        }

        // 5️⃣ Kullanıcı başarılı şekilde kayıt olduysa yönlendirme
        console.log('Kayıt işlemi tamamlandı, yönlendirme yapılıyor...');
        navigate('/');
    };

    console.log(user);

    return (
        <div>
            <div className="absolute inset-0">
                <img src="/assets/images/auth/bg-gradient.png" alt="image" className="h-full w-full object-cover" />
            </div>

            <div className="relative flex min-h-screen items-center justify-center bg-[url(/assets/images/auth/map.png)] bg-cover bg-center bg-no-repeat px-6 py-10 dark:bg-[#060818] sm:px-16">
                <img src="/assets/images/auth/coming-soon-object1.png" alt="image" className="absolute left-0 top-1/2 h-full max-h-[893px] -translate-y-1/2" />
                <img src="/assets/images/auth/coming-soon-object2.png" alt="image" className="absolute left-24 top-0 h-40 md:left-[30%]" />
                <img src="/assets/images/auth/coming-soon-object3.png" alt="image" className="absolute right-0 top-0 h-[300px]" />
                <img src="/assets/images/auth/polygon-object.svg" alt="image" className="absolute bottom-0 end-[28%]" />
                <div className="relative w-full max-w-[870px] rounded-md bg-[linear-gradient(45deg,#fff9f9_0%,rgba(255,255,255,0)_25%,rgba(255,255,255,0)_75%,_#fff9f9_100%)] p-2 dark:bg-[linear-gradient(52.22deg,#0E1726_0%,rgba(14,23,38,0)_18.66%,rgba(14,23,38,0)_51.04%,rgba(14,23,38,0)_80.07%,#0E1726_100%)]">
                    <div className="relative flex flex-col justify-center rounded-md bg-white/60 backdrop-blur-lg dark:bg-black/50 px-6 lg:min-h-[758px] py-20">
                        <div className="mx-auto w-full max-w-[440px]">
                            <div className="mb-10">
                                <h1 className="text-3xl font-extrabold uppercase !leading-snug text-primary md:text-4xl">Kayıt Ol</h1>
                                <p className="text-base font-bold leading-normal text-white-dark">Kayıt için mail ve şifre giriniz...</p>
                            </div>
                            <form className="space-y-5 dark:text-white" onSubmit={submitForm}>
                                <div>
                                    <label htmlFor="Name">Name</label>
                                    <div className="relative text-white-dark">
                                        <input id="name" type="text" onChange={onChange} required placeholder="Enter Name" name="name" className="form-input ps-10 placeholder:text-white-dark" />
                                        <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                            <IconUser fill={true} />
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="Email">Email</label>
                                    <div className="relative text-white-dark">
                                        <input id="email" onChange={onChange} type="email" required placeholder="Enter Email" name="email" className="form-input ps-10 placeholder:text-white-dark" />
                                        <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                            <IconMail fill={true} />
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="Password">Şifre</label>
                                    <div className="relative text-white-dark">
                                        <input
                                            id="password"
                                            onChange={onChange}
                                            type="password"
                                            required
                                            placeholder="Enter Password"
                                            name="password"
                                            className="form-input ps-10 placeholder:text-white-dark"
                                        />
                                        <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                            <IconLockDots fill={true} />
                                        </span>
                                    </div>
                                </div>
                                <button type="submit" className="btn btn-gradient !mt-6 w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]">
                                    Kayıt Ol
                                </button>
                            </form>
                            <div className="relative my-7 text-center md:mb-9">
                                <span className="absolute inset-x-0 top-1/2 h-px w-full -translate-y-1/2 bg-white-light dark:bg-white-dark"></span>
                                <span className="relative bg-white px-2 font-bold uppercase text-white-dark dark:bg-dark dark:text-white-light">ya da</span>
                            </div>
                            <div className="mb-10 md:mb-[60px]">
                                <ul className="flex justify-center gap-3.5 text-white">
                                    <li>
                                        <Link
                                            to="#"
                                            className="inline-flex h-8 w-8 items-center justify-center rounded-full p-0 transition hover:scale-110"
                                            style={{ background: 'linear-gradient(135deg, rgba(239, 18, 98, 1) 0%, rgba(67, 97, 238, 1) 100%)' }}
                                        >
                                            <IconGoogle />
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                            <div className="text-center dark:text-white">
                                Bir hesabın var mı ?&nbsp;
                                <Link to="/auth/boxed-signin" className="uppercase text-primary underline transition hover:text-black dark:hover:text-white">
                                    Giriş Yap
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterBoxed;
