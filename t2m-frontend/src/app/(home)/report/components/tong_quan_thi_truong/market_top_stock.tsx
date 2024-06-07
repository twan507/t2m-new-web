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

    function isArrayValid(array: any[]): boolean {
        return array?.some(item => item.name !== null && item.value !== null);
    }

    const [checkAuth, setCheckAuth] = useState(true);
    useEffect(() => {
        setCheckAuth(false)
    }, []);
    if (!checkAuth) {
        return (
            <>
                {(isArrayValid(top_data.children) && isArrayValid(bottom_data.children)) && (
                    <>
                        <div style={{ marginTop: '15px', height: '163px', width: '100%' }}>
                            <Treemap data={top_data} ww={props.ww} pixel={props.pixel} type='market' />
                        </div>
                        <div style={{ marginTop: '-3px', height: '163px', width: '100%' }}>
                            <Treemap data={bottom_data} ww={props.ww} pixel={props.pixel} type='market' />
                        </div>
                    </>
                )}
                {(!isArrayValid(top_data.children) && !isArrayValid(bottom_data.children)) && (
                    <div style={{
                        marginTop: '10px', height: '230px', width: '100%',
                        backgroundColor: '#161616', borderRadius: '5px',
                        display: 'flex', justifyContent: 'center', alignItems: 'center',
                        color: '#dfdfdf'
                    }}>
                        Cổ phiếu nổi bật
                    </div>
                )}
            </>
        )
    }
}

export default MarketTopStockChart