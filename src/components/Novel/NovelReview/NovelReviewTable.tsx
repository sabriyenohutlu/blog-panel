import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
const rowData = [
    {
        "novel_id": 1,
        "novel_name": "Sample Novel",
        "novel_headImage": "https://example.com/sample-image.jpg",
        "novel_reviewTitle": "Sample Review Title",
        "novel_summaryInfo": "This is a summary of the sample novel.",
        "body": "This is the body of the sample novel review.",
        "category_id": 176816,
        "subCategory_id": 176801,
        "subCategory_name": "novelReview",
        "author_id": "author123",
        "status": "completed",
        "tags": ["fiction", "adventure"],
        "url": "https://example.com/sample-novel",
        "bookauthor_id": "author456",
        "bookauthor_name": "Sample Author",
        "comments": [],
        "novel_recordedDate": "2025-02-13T00:00:00Z",
        "likes": 10,
        "dislikes": 2,
        "view_count": 100,
        "createdAt": "2025-02-13T00:00:00Z",
        "updatedAt": "2025-02-13T00:00:00Z",
        "rating": 4.5,
        "novel_bookCategory": "Fiction",
        "period": "Modern"
    }
];

const NovelReviewTable = () => {
    const [page, setPage] = useState(1);
    const PAGE_SIZES = [10, 20, 30, 50, 100];
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const initialRecords = rowData.slice(0, pageSize);
    const [recordsData, setRecordsData] = useState(initialRecords);

    useEffect(() => {
        setPage(1);
    }, [pageSize]);

    useEffect(() => {
        const from = (page - 1) * pageSize;
        const to = from + pageSize;
        setRecordsData(rowData.slice(from, to));
    }, [page, pageSize]);
    return (
        <div className="panel mt-6 flex flex-col gap-4">
            <Link className='block' to="/icerik-yönetimi/roman/roman-incelemesi-ekle"><button className='btn btn-sm btn-primary'>Yeni İnceleme Yazısı Ekle</button></Link>
            <div className="table-responsive mb-5">
                <table>
                    <thead>
                        <tr>
                            <th>İnceleme Başlığı</th>
                            <th>Romanın Adı</th>
                            <th>Editör</th>
                            <th>Yayınlanma Tarihi</th>
                            <th>Durum</th>
                            <th className="text-center">İşlemler</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recordsData.map((data: any) => {
                            return (
                                <tr key={data.novel_id}>
                                    <td>
                                        <div className="whitespace-nowrap">{data.novel_reviewTitle}</div>
                                    </td>
                                    <td>{data.novel_name}</td>
                                    <td>{data.author_id}</td>
                                    <td>{data.createdAt}</td>
                                    <td>
                                        <div
                                            className={`whitespace-nowrap ${
                                                data.status === 'completed'
                                                    ? 'text-success'
                                                    : data.status === 'Pending'
                                                    ? 'text-secondary'
                                                    : data.status === 'In Progress'
                                                    ? 'text-info'
                                                    : data.status === 'Canceled'
                                                    ? 'text-danger'
                                                    : 'text-success'
                                            }`}
                                        >
                                            {data.status}
                                        </div>
                                    </td>
                                    <td className="text-center">
                                        <div className='flex flex-row justify-start gap-1'>
                                            <button className="btn btn-sm btn-primary">Düzenle</button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default NovelReviewTable;
