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
                        <div style={{ marginTop: '10px', height: '115px', width: '100%' }}>
                            <Treemap data={top_data} ww={props.ww} pixel={props.pixel} type='nntd' />
                        </div>
                        <div style={{ marginTop: '-3px', height: '115px', width: '100%' }}>
                            <Treemap data={bottom_data} ww={props.ww} pixel={props.pixel} type='nntd' />
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
                        Giá trị nước ngoài mua/bán ròng
                    </div>
                )}
            </>
        )
    }
}

export default NdTdTopStockChart
