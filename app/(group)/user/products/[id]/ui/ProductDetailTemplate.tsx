"use client";
import React, { useEffect } from 'react';

import { jewelryService } from '@/services';
import { EmptyCustom } from '@/shared/EmptyCustom';
import { useQuery } from '@tanstack/react-query';

import { productDetailStore } from '../store';
import ProductDescription from './ProductDescription';
import ProductGallery from './ProductGallery';
import ProductInfo from './ProductInfo';
import ProductProject from './ProductProject';

type Props = { id: string };

const ProductDetailTempate: React.FC<Props> = ({ id }) => {
	const setJewelry = productDetailStore((state) => state.setJewelry);
	const reset = productDetailStore((state) => state.reset);

	const getJewelry = useQuery({
		queryKey: ["jewelry", id],
		queryFn: () => jewelryService.getOne(id),
		enabled: !!id,
	});
	useEffect(() => {
		if (getJewelry.data) setJewelry(getJewelry.data);
	}, [getJewelry.data]);
	useEffect(() => {
		return () => {
			reset();
		};
	}, []);
	if (!getJewelry.data || getJewelry.data.isDeleted || getJewelry.isError) {
		return <EmptyCustom />;
	}
	return (
		<div className="flex flex-col gap-5 mx-4 md:mx-20">
			<div className="grid grid-cols-1 md:grid-cols-3  bg-white  rounded-2xl">
				<div className="col-span-1">
					<ProductGallery />
				</div>
				<div className="col-span-2 ">
					<ProductInfo />
				</div>
			</div>
			<ProductDescription />
			<ProductProject />
		</div>
	);
};

export default ProductDetailTempate;
