import { useState, useEffect, useCallback } from 'react'
import CardItem from 'components/product/CardItem'
import API from 'modules/constants/API'
import Axios from 'modules/utils/Axios'
import { createKey } from "modules/utils/MathUtils"
import Button from 'components/atomic/Button'

const CelebResult = (props) => {

	const [result, setResult] = useState([])
	const [isLoading, setIsLoading] = useState(false)
	const [params, setParams] = useState({
		page: 1,
		record: 20,
		totalPage: 1,
	})

	const handleMoreList = useCallback(() => {
		params.page < params.totalPage && setParams({ ...params, page: params.page + 1 })
	}, [params])

	const getSearchResult = useCallback(async () => {
		setIsLoading(true)
		await Axios({
			url: API.MAIN.CELEB_LIST,
			method: 'get',
			params: params
		}).then(async (response) => {
			if (response?.data?.code === '200') {
				let newList = result
        await newList.push( ...response.data.data.list )
        setResult(newList)
				setParams({
					...params,
					totalPage: response.data.data.totalPage,
				})
			}
			setIsLoading(false)
		})
	}, [params, result])

	useEffect(() => {
		getSearchResult()
	}, [params.page])

	return (
		<>
			<div className="product popular_celeb">
				<div className="container default_size">
					<div className="product_container">
						<div className="page_header">
							<div className="title_wrap">
								<span className="page_title">셀럽쵸이스</span>
							</div>
						</div>

						{result?.length > 0 ? (
							<ul className="product_list">
								{result?.map((data, index) => (
									<li className="product_item" key={createKey()}>
										<CardItem
											data={data}
											handleView={() => history.push('/product/detail')}
										/>
									</li>
								))}
							</ul>
						) : (
							<div className="no_result_wrap">
								<div className="no_result">{isLoading ? '상품을 불러오고 있습니다.' : '등록된 상품이 없습니다.'}</div>
							</div>
						)}

						{/* 리스트 더보기 */}
						{params.page < params.totalPage && (
							<div className="btn_wrap more">
								<Button className="btn full_blue" onClick={handleMoreList}>더보기</Button>
							</div>
						)}
					</div>
				</div>
			</div>
		</>
	)
}

export default CelebResult