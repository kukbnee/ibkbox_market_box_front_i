import Button from 'components/atomic/Button'

const Pagination = (props) => {

  const { totalPages, page, handlePagination } = props

  const handlePagePrev = () => {
    if(page < 2){
      return
    }

    handlePagination(page - 1)
  }

  const handlePageNext = () => {
    if(page === totalPages){
      return
    }

    handlePagination(page + 1)
  }

  const handlePageUnique = (pageNum) => {
    handlePagination(pageNum)
  }


  let slice = 10
  let tempEnd = Math.ceil(page / slice) * slice
  let start = tempEnd - (slice - 1)
  let end = totalPages > tempEnd ? tempEnd : totalPages
  const pageList = Array.from({ length: 10 }, (_, index) => (end >= start + index ? start + index : null))
  return (
    <div className="pagination">
      <Button className="prev" disabled={page && page > 1 ? false : true} onClick={handlePagePrev}>
        <span className="hide">이전</span>
      </Button>
      {pageList?.map(
        (pageItem) =>
          pageItem && (
            <Button className={`number ${page === pageItem && `active`}`} key={pageItem} onClick={() => handlePageUnique(pageItem)}>
              {pageItem}
            </Button>
          )
      )}
      <Button className="next" disabled={page && totalPages && page === totalPages ? true : false} onClick={handlePageNext}>
        <span className="hide">다음</span>
      </Button>
    </div>
  )
}

export default Pagination
