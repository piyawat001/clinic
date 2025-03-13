// src/pages/user/ArticleDetail.jsx
import React from 'react';
import { useParams, Link } from 'react-router-dom';

const ArticleDetail = () => {
  const { id } = useParams();
  
  // ข้อมูลตัวอย่าง (ในโปรเจคจริงควรดึงข้อมูลจาก API)
  const articleData = {
    1: {
      title: 'กรมอนามัย แนะประชาชนดูแลสุขภาพ ลดเสี่ยงเกิดโรคจากความร้อน',
      content: `<p class="mb-4">กรมอนามัย แนะประชาชนดูแลสุขภาพ ลดเสี่ยงเกิดโรคจากความร้อน เตือนระวัง 3 อาการพบมากในกลุ่มอ่อน ปวดท้อง-ท้องผูก-เป็นตะคริว</p>
      <p class="mb-4">รายละเอียดเพิ่มเติมเกี่ยวกับบทความ...</p>`,
      image: '/assets/drinking-water.jpg',
      date: '15 มีนาคม 2025',
      source: 'กรมอนามัย กระทรวงสาธารณสุข'
    },
    2: {
      title: 'แนะช่วงอากาศเปลี่ยนแปลง เลี่ยงอยู่ที่โล่งแจ้ง',
      content: `<p class="mb-4">แนะช่วงอากาศเปลี่ยนแปลง เลี่ยงอยู่ที่โล่งแจ้ง หมั่นดูแลสุขภาพให้แข็งแรง</p>
      <p class="mb-4">รายละเอียดเพิ่มเติมเกี่ยวกับบทความ...</p>`,
      image: '/assets/climate-change.jpg',
      date: '10 มีนาคม 2025',
      source: 'กรมอนามัย'
    },
    3: {
      title: 'เผยวัยทำงาน มีภาวะร้อน แนะดูแลสุขภาพ ลดโรค ลดเสี่ยง',
      content: `<p class="mb-4">เผยวัยทำงาน มีภาวะร้อน แนะดูแลสุขภาพ ลดโรค ลดเสี่ยง</p>
      <p class="mb-4">รายละเอียดเพิ่มเติมเกี่ยวกับบทความ...</p>`,
      image: '/assets/work-stress.jpg',
      date: '5 มีนาคม 2025',
      source: 'กรมอนามัย'
    }
  };

  const article = articleData[id];

  if (!article) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-gray-500 text-lg">ไม่พบบทความที่ต้องการ</p>
        <Link to="/user/articles" className="mt-4 text-blue-500">กลับไปยังหน้าบทความ</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">{article.title}</h1>
      <div className="flex justify-between text-sm text-gray-500 mb-6">
        <span>วันที่: {article.date}</span>
        <span>ที่มา: {article.source}</span>
      </div>
      <div className="mb-6">
        <img src={article.image} alt={article.title} className="w-full h-64 object-cover rounded-lg" />
      </div>
      <div dangerouslySetInnerHTML={{ __html: article.content }} className="prose prose-sm max-w-none" />
      <div className="mt-8">
        <Link to="/user/articles" className="text-blue-500">« กลับไปยังหน้าบทความ</Link>
      </div>
    </div>
  );
};

export default ArticleDetail;