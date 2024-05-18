import { sendRequest } from "@/utlis/api";
import Treemap from "../../../../../components/chart/treemap";
import { useEffect, useState } from "react";


const MarketTopStockChart = (props: any) => {

    let top_data = {
        name: "root",
        children: props?.data?.filter((item: any) => item.t0_score > 0).map((item: any) => ({ name: item.stock, value: item.t0_score, change: item.price_change }))
    };

    let bottom_data = {
        name: "root",
        children: props?.data?.filter((item: any) => item.t0_score < 0).map((item: any) => ({ name: item.stock, value: item.t0_score, change: item.price_change }))
    };

    const [checkAuth, setCheckAuth] = useState(true);
    useEffect(() => {
        setCheckAuth(false)
    }, []);
    if (!checkAuth) {
        return (
            <>
                <div style={{ marginTop: '40px', height: '115px', width: '100%' }}>
                    <Treemap data={top_data} ww={props.ww} pixel={props.pixel} type='market' />
                </div>
                <div style={{ marginTop: '-3px', height: '115px', width: '100%' }}>
                    <Treemap data={bottom_data} ww={props.ww} pixel={props.pixel} type='market' />
                </div>
            </>
        )
    }
}

export default MarketTopStockChart
