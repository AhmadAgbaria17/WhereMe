import React from 'react';
import "./pagination.css"

const Pagination = ({pages , currentPage , setCurrentPage}) => {
  const generatedPages= [];

  for(let i=1 ; i<=pages;i++){
    generatedPages.push(i);
  }


  return (
    <div className='pagination'>
      <button 
      onClick={()=>{setCurrentPage(currentPage => currentPage-1)}}
      disabled={currentPage===1 ? true : false}
      className="page previous">
        Previous
        </button>
      {generatedPages.map(page => (
        <div 
        onClick={()=>setCurrentPage(page)} 
        key={page} 
        className={currentPage===page ? "page active": "page"}>
            {page}
        </div>
      ))}
      <button 
      onClick={()=>{setCurrentPage(currentPage => currentPage+1)}}
      disabled={currentPage===pages ? true : false}
      className="page next">
        Next
      </button>
      
    </div>
  );
}

export default Pagination;
