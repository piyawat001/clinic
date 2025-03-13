// src/components/common/Articles.jsx
import React from 'react';

const ArticleCard = ({ image, title, summary, category, externalLink }) => {
  return (
    <div className="bg-gray-50 rounded-lg overflow-hidden shadow-md mb-4">
      <div className="relative">
        <img src={image} alt={title} className="w-full h-48 object-cover" />
        <span className="absolute top-2 left-2 bg-orange-500/80 text-white px-2 py-1 rounded text-xs">สาระ</span>
        <span className="absolute top-2 right-2 bg-orange-600 text-white px-2 py-1 rounded text-xs">{category}</span>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-medium mb-2">{title}</h3>
        <p className="text-gray-600 text-sm">{summary}</p>
      </div>
      <div className="flex justify-between items-center px-4 py-3 border-t border-gray-100">
        <span className="text-gray-500 text-xs">ที่มา : กรมอนามัย</span>
        <a 
          href={externalLink} 
          className="text-white bg-blue-500 hover:bg-blue-600 px-4 py-1.5 rounded text-sm transition-colors"
          target="_blank" 
          rel="noopener noreferrer"
        >
          อ่านเพิ่มเติม
        </a>
      </div>
    </div>
  );
};

const Articles = () => {
  const articlesList = [
    {
      id: 1,
      image: "/drinking-water.png", // ให้ใส่รูปจริงในโฟลเดอร์ assets
      title: "กรมอนามัย แนะประชาชนดูแลสุขภาพ",
      summary: "กรมอนามัย แนะประชาชนดูแลสุขภาพ ลดเสี่ยงเกิดโรคจากความร้อน เตือนระวัง 3 อาการพบมากในกลุ่มอ่อน ปวดท้อง-ท้องผูก-เป็นตะคริว",
      category: "ข่าวสุขภาพ",
      externalLink: "https://www.thaihealth.or.th/%E0%B8%81%E0%B8%A3%E0%B8%A1%E0%B8%AD%E0%B8%99%E0%B8%B2%E0%B8%A1%E0%B8%B1%E0%B8%A2-%E0%B9%81%E0%B8%99%E0%B8%B0%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B8%8A%E0%B8%B2%E0%B8%8A%E0%B8%99%E0%B8%94%E0%B8%B9%E0%B9%81/"
    },
    {
      id: 2,
      image: "/climate-change.png",
      title: "แนะช่วงอากาศเปลี่ยนแปลง เลี่ยงอยู่ที่โล่งแจ้ง",
      summary: "แนะช่วงอากาศเปลี่ยนแปลง เลี่ยงอยู่ที่โล่งแจ้ง หมั่นดูแลสุขภาพให้แข็งแรง",
      category: "ข่าวสุขภาพ",
      externalLink: "https://www.thaihealth.or.th/%E0%B9%81%E0%B8%99%E0%B8%B0%E0%B8%8A%E0%B9%88%E0%B8%A7%E0%B8%87%E0%B8%AD%E0%B8%B2%E0%B8%81%E0%B8%B2%E0%B8%A8%E0%B9%80%E0%B8%9B%E0%B8%A5%E0%B8%B5%E0%B9%88%E0%B8%A2%E0%B8%99%E0%B9%81%E0%B8%9B%E0%B8%A5/"
    },
    {
      id: 3,
      image: "/ahiwata.png",
      title: "WHO ประกาศอหิวาตกโรคเป็นภาวะฉุกเฉินใหญ่ ไทยยันควบคุมได้ ผู้ป่วย 4 ราย หายดี ไม่มีป่วยเพิ่ม",
      summary: "ประกาศอหิวาตกโรคเป็นภาวะฉุกเฉินใหญ่",
      category: "ข่าวสุขภาพ",
      externalLink: "https://www.thaihealth.or.th/who-%e0%b8%9b%e0%b8%a3%e0%b8%b0%e0%b8%81%e0%b8%b2%e0%b8%a8%e0%b8%ad%e0%b8%ab%e0%b8%b4%e0%b8%a7%e0%b8%b2%e0%b8%95%e0%b8%81%e0%b9%82%e0%b8%a3%e0%b8%84%e0%b9%80%e0%b8%9b%e0%b9%87%e0%b8%99%e0%b8%a0/"
    }
  ];

  return (
    <div className="max-w-lg mx-auto">
      {articlesList.map(article => (
        <ArticleCard 
          key={article.id}
          image={article.image}
          title={article.title}
          summary={article.summary}
          category={article.category}
          externalLink={article.externalLink}
        />
      ))}
    </div>
  );
};

export default Articles;    