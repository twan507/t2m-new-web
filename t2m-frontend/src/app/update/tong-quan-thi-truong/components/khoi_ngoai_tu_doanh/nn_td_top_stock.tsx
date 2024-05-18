import Treemap from "../../../../../components/chart/treemap";
import { useEffect, useState } from "react";


const NdTdTopStockChart = (props: any) => {

    let top_data = {
        name: "root",
        children:
            props?.switch_kntd === 'NN' ?
                props?.data?.filter((item: any) => item.id === props?.id).map((item: any) => ({ name: item.nn_buy_stock, value: item.nn_buy_value })) :
                props?.data?.filter((item: any) => item.id === props?.id).map((item: any) => ({ name: item.td_buy_stock, value: item.td_buy_value }))
    };

    let bottom_data = {
        name: "root",
        children:
            props?.switch_kntd === 'NN' ?
                props?.data?.filter((item: any) => item.id === props?.id).map((item: any) => ({ name: item.nn_sell_stock, value: item.nn_sell_value })) :
                props?.data?.filter((item: any) => item.id === props?.id).map((item: any) => ({ name: item.td_sell_stock, value: item.td_sell_value }))
    };

    const [checkAuth, setCheckAuth] = useState(true);
    useEffect(() => {
        setCheckAuth(false)
    }, []);
    if (!checkAuth) {
        return (
            <>
                <div style={{ marginTop: '10px', height: '115px', width: '100%' }}>
                    <Treemap data={top_data} ww={props.ww} pixel={props.pixel} type='nntd' />
                </div>
                <div style={{ marginTop: '-3px', height: '115px', width: '100%' }}>
                    <Treemap data={bottom_data} ww={props.ww} pixel={props.pixel} type='nntd' />
                </div>
            </>
        )
    }
}

export default NdTdTopStockChart
