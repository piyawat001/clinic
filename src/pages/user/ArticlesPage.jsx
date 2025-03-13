// src/pages/user/ArticlesPage.jsx
import React from 'react';
import Articles from '../../components/common/Articles';

const ArticlesPage = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold mb-6 text-center">บทความและข่าวสารทั่วไป</h1>
      <Articles />
    </div>
  );
};

export default ArticlesPage;