const Index = () => {
    return (
        <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
            <div className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                <span className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">Toplam Kullanıcı</span>
                <p className="font-normal text-gray-700 dark:text-gray-400">0</p>
            </div>
            <div className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                <span className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">Toplam İçerik</span>
                <p className="font-normal text-gray-700 dark:text-gray-400">0</p>
            </div>
            <div className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                <span className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">Toplam Görüntülenme</span>
                <p className="font-normal text-gray-700 dark:text-gray-400">0</p>
            </div>
            <div className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                <span className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">Toplam Beğeni</span>
                <p className="font-normal text-gray-700 dark:text-gray-400">0</p>
            </div>
        </div>
    );
};

export default Index;
