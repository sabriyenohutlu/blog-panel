import authorsData from '../../utils/authorsData.json';
const AuthorsTable = () => {
    const authorsList = authorsData.authors.map((item: any, index: number) => (
        <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
            <td className="px-6 py-4"> {item.author_id}</td>
            <td className="px-6 py-4">{item.author_name}</td>
            <td className="px-6 py-4"><button className='btn btn-sm btn-primary'>Düzenle</button></td>
        </tr>
    ));
    return (
        <div className="panel">
            <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                Yazar Id
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Yazar Adı
                            </th>
                            <th scope="col" className="px-6 py-3">
                                İşlemler
                            </th>
                        </tr>
                    </thead>
                    <tbody>{authorsList}</tbody>
                </table>
            </div>
        </div>
    );
};

export default AuthorsTable;
